# Intercessio + Welcome: Remote Signing Integration

## Vision

When a user has Welcome open in their browser, the tab becomes a **NIP-46 remote signer**. Other Nostr apps can request signatures through standard Nostr Connect, and the user approves from the Welcome dashboard. This eliminates the need to share nsec with every app -- Welcome holds the key, other apps just ask it to sign.

This also opens two powerful flows:
1. **1-Click Nostr Connect** -- Apps present a `nostrconnect://` URI; Welcome picks it up and starts signing immediately
2. **Bunker Teleport** -- Instead of teleporting nsec (giving away the key), teleport a `bunker://` URI (giving signing access only)

---

## Current State

### Welcome

- User keys are generated client-side, encrypted with PBKDF2+AES-GCM, and stored in IndexedDB (Dexie)
- The derived AES key lives in `sessionStorage` -- available while the tab is open
- The nsec can be decrypted on demand when the session is active
- Server holds `ncryptsec` (NIP-49 encrypted) as backup, never the raw nsec
- KeyTeleport v2 transfers the nsec itself to receiving apps (double-encrypted, fragment URL)
- No NIP-46 implementation exists; bunker connect shows "coming soon"

### Intercessio

- Full NIP-46 bunker implementation using `applesauce-signers` (NostrConnectProvider)
- Keys stored in macOS Keychain, metadata in `~/.intercessio/keys.json`
- Signing server runs as a daemon on a Unix socket (`~/.intercessio/intercessio.sock`)
- Policy engine with pluggable signing templates (SIGN / REFER / REJECT)
- Pending approval queue with ntfy push notifications
- Web UI on port 4173 with REST proxy to IPC
- Session persistence in SQLite -- survives server restarts
- Reusable bunker codes (approval-required) and one-time bunker codes (secret-embedded)

---

## Architecture

### Three Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Browser Signer (Welcome tab open)             │
│  ───────────────────────────────────────────             │
│  NIP-46 provider runs in the browser.                   │
│  Key decrypted from Dexie, signs via nostr-tools.       │
│  Relay subscriptions from the browser.                  │
│  Approval UI inline on /apps dashboard.                 │
│  Works immediately -- no server setup needed.           │
└───────────────────────┬─────────────────────────────────┘
                        │ (optional escalation)
┌───────────────────────▼─────────────────────────────────┐
│  Layer 2: Intercessio Bridge (persistent signing)       │
│  ───────────────────────────────────────────             │
│  User "promotes" a session to Intercessio for           │
│  background signing when the tab is closed.             │
│  Welcome UI manages Intercessio sessions via REST API.  │
│  Key teleported to macOS Keychain via Intercessio IPC.  │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  Layer 3: Bunker Teleport (key-less app onboarding)     │
│  ───────────────────────────────────────────             │
│  Instead of teleporting nsec, teleport a bunker:// URI. │
│  Receiving app gets signing access, never the key.      │
│  Builds on existing KeyTeleport infrastructure.         │
└─────────────────────────────────────────────────────────┘
```

---

## Layer 1: Browser-Based NIP-46 Provider

This is the core feature. When a user is logged into Welcome with their key decrypted, the browser tab acts as a NIP-46 signing bunker.

### How It Works

1. User logs into Welcome -- nsec is decrypted and available in the browser session
2. Welcome generates a **provider keypair** (or reuses the user's keypair) and subscribes to NIP-46 request events on configured relays
3. The `/apps` dashboard shows a **bunker URI** the user can copy or display as QR
4. When a remote app sends a signing request via relay, Welcome shows an approval card
5. User approves/rejects; Welcome signs (or refuses) and publishes the response

### Key Design Decisions

**Use the user's own keypair as the provider identity.** NIP-46 providers have their own pubkey that clients address requests to. Using the user's pubkey means the bunker URI is simply `bunker://<user-npub>?relay=wss://...` -- clean and intuitive. The user IS the signer.

**Relay subscriptions from the browser.** The browser connects to relays via WebSocket (using `nostr-tools/relay` or `applesauce-relay`, both already in the dependency tree). This means:
- No server-side relay connections needed
- The key never leaves the browser
- Signing stops when the tab closes (by design -- Layer 2 covers persistence)

**Signing policy in the browser.** Port Intercessio's signing template concept to the client side. Start with two policies:
- **Ask every time** (default) -- show approval card for each request
- **Auto-sign logins** -- auto-approve kind 22242, ask for everything else

### Implementation

#### New Browser Module: `nostr-connect-provider.js`

A client-side NIP-46 provider. This can either:
- (a) Use `applesauce-signers`' `NostrConnectProvider` loaded from CDN (already used by intercessio)
- (b) Build a minimal implementation using `nostr-tools` (already loaded) to avoid a heavy new dependency

Option (b) is recommended for the browser context. The NIP-46 protocol is straightforward:

```
Provider subscribes to:  kind 24133 events tagged ["p", providerPubkey]
Provider responds with:  kind 24133 events tagged ["p", clientPubkey]

Request/response content is NIP-44 encrypted JSON-RPC:
  { id, method, params }  →  { id, result }  or  { id, error }

Methods: connect, sign_event, get_public_key, nip04_encrypt/decrypt, nip44_encrypt/decrypt
```

The implementation needs:
- Subscribe to kind 24133 with `#p` filter for the provider pubkey
- Decrypt incoming requests with NIP-44 (conversation key: provider secret + sender pubkey)
- Dispatch to handler based on method name
- Encrypt and publish response

#### UI: Signing Dashboard on `/apps`

Add a "Remote Signer" section to the apps page:

```
┌─────────────────────────────────────────┐
│  🔐 Remote Signer                       │
│                                         │
│  Status: ● Active (2 relays connected)  │
│                                         │
│  Bunker URI:  [bunker://npub1...]  📋   │
│  QR Code:     [Show QR]                 │
│                                         │
│  Connected Apps:                        │
│  ├── Habla.news  (last: 2 min ago)     │
│  └── Nostrudel   (last: 5 min ago)     │
│                                         │
│  Policy: [Ask every time ▼]             │
│                                         │
│  ┌── Pending Approval ──────────────┐   │
│  │ Habla.news wants to sign:        │   │
│  │ kind=1 "Hello world..."          │   │
│  │ [Approve]  [Reject]              │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### Lifecycle

- **Start**: When the user navigates to `/apps` and has a decrypted key, the provider starts automatically
- **Pause**: If the tab is backgrounded, relay connections may drop. Reconnect on tab focus (`visibilitychange` event)
- **Stop**: Tab close / navigation away / explicit disconnect
- **Persist bunker URI**: Store the bunker URI in Dexie so the user doesn't need to re-share it. The URI is stable as long as the user's key and relay list don't change

### What the User Sees

1. Log into Welcome as normal
2. On `/apps`, the "Remote Signer" panel shows their bunker URI
3. Copy it (or scan QR) into any NIP-46 compatible app (Amethyst, Nostrudel, Habla, etc.)
4. When that app needs a signature, an approval card appears on the Welcome dashboard
5. Tap Approve -- done

---

## Layer 2: Intercessio Bridge

For users who want signing to continue when the Welcome tab is closed, we bridge to Intercessio.

### Prerequisites

- Intercessio signing server running locally (`~/.intercessio/intercessio.sock` exists)
- Intercessio Web UI running (default port 4173) OR direct IPC access

### How It Works

Welcome's server (running on the same machine) communicates with Intercessio to:
1. **Import the user's key** into Intercessio's Keychain
2. **Start a bunker session** with the same relays and identity
3. **Display Intercessio session status** on the Welcome dashboard

### Two Integration Paths

#### Path A: Via Intercessio Web UI REST API (simpler)

Welcome's server proxies requests to Intercessio's HTTP API:

```
Welcome Server ──HTTP──► Intercessio Web UI (localhost:4173)
                           │
                           └──IPC──► Intercessio Signing Server
```

Endpoints used:
- `POST /api/keys/import` -- Import user's nsec
- `POST /api/bunker` -- Create bunker session
- `GET /api/sessions` -- List active sessions
- `GET /api/activity` -- Signing activity
- `GET /api/approvals` -- Pending approvals
- `POST /api/approvals/decision` -- Approve/reject

**Considerations:**
- Intercessio Web UI has no authentication -- safe for localhost only
- Welcome server needs the intercessio web UI port configured (`INTERCESSIO_URL=http://localhost:4173`)
- The nsec travels over localhost HTTP briefly during import -- acceptable for same-machine

#### Path B: Via Unix Socket IPC (direct, no Web UI needed)

Welcome's Bun server connects directly to the Unix socket:

```
Welcome Server ──Unix Socket──► Intercessio Signing Server
```

This is more elegant but requires implementing the IPC client in Welcome's server. The protocol is simple (newline-delimited JSON), and the types are well-defined in intercessio's `ipc.ts`.

**Recommendation: Start with Path A** (HTTP proxy) for speed, migrate to Path B later for robustness.

### UI: "Promote to Background" Button

On the Welcome dashboard, next to the browser signer status:

```
Remote Signer: ● Active (browser)
[Promote to Background ↗]

── After clicking: ──

Remote Signer: ● Active (Intercessio)
Signing continues when this tab is closed.
[View in Intercessio ↗]  [Stop Background Signing]
```

### Key Import Flow

When promoting to Intercessio:

1. Welcome server receives the user's nsec (encrypted, sent from browser)
2. Server decrypts and calls Intercessio's import endpoint
3. Intercessio stores the key in macOS Keychain
4. Welcome starts a bunker session via Intercessio with the same relays
5. Browser signer hands off -- stops subscribing to relays, shows "managed by Intercessio"

**Security note:** The nsec passes through Welcome's server briefly during handoff. This is acceptable because:
- Welcome's server already stores the ncryptsec (NIP-49 encrypted backup)
- The transfer is localhost-only
- The key is immediately stored in macOS Keychain (secure enclave)
- The nsec is not persisted in Welcome's memory or DB

---

## Layer 3: Bunker Teleport

This is an evolution of KeyTeleport v2. Instead of teleporting the nsec itself, teleport a `bunker://` URI. The receiving app gets signing access but never holds the key.

### Why This Matters

| | KeyTeleport (nsec) | Bunker Teleport (URI) |
|---|---|---|
| Receiving app gets | The actual private key | Signing access via NIP-46 |
| Key exposure | Key exists in two places | Key stays in Welcome/Intercessio |
| Revocation | Impossible (key is out) | Stop the session = access revoked |
| Granularity | Full access forever | Policy-controlled, time-limited |

### How It Works

1. User clicks "Connect" on a registered app (same UI as current Teleport)
2. Welcome generates a **one-time bunker URI** with embedded secret
3. The bunker URI is delivered to the receiving app via the existing Teleport infrastructure:
   - Fragment URL: `https://app.com/#bunkerconnect=<bunker://...>`
   - Or via clipboard
4. Receiving app parses the bunker URI and connects as a NIP-46 client
5. Signing requests flow through Welcome's browser signer (Layer 1) or Intercessio (Layer 2)

### Changes to Existing Teleport Flow

The current teleport flow sends the nsec. Bunker Teleport adds a second option:

```
Teleport to [App Name]
  ○ Send key (current behavior)
  ● Connect as signer (recommended)
      App gets signing access without your key.
      You can revoke access anytime.
```

### Receiving App Changes

Apps need to handle the `#bunkerconnect=` fragment in addition to (or instead of) `#keyteleport=`:

```typescript
function checkForBunkerConnect(): string | null {
  const hash = window.location.hash;
  if (!hash.includes("bunkerconnect=")) return null;
  const params = new URLSearchParams(hash.slice(1));
  const uri = params.get("bunkerconnect");
  history.replaceState(null, "", window.location.pathname);
  return uri ? decodeURIComponent(uri) : null;
}

// If bunker URI received, connect as NIP-46 client
const bunkerUri = checkForBunkerConnect();
if (bunkerUri) {
  // Use NostrConnectSigner from applesauce-signers (or equivalent)
  const signer = new NostrConnectSigner({ bunkerUri });
  await signer.connect();
  // App now has a signer that proxies to Welcome
}
```

### No Unlock Code Needed

Unlike nsec teleport which requires a clipboard unlock code, bunker teleport is simpler:
- The bunker URI contains an embedded one-time secret
- The receiving app connects directly -- no second factor needed
- Security comes from the fragment URL (server never sees it) + one-time secret (replay protection)

---

## Implementation Phases

### Phase 1: Browser Signer (Layer 1)

**Goal:** Welcome tab = NIP-46 signer. This is the foundation everything else builds on.

**Work:**
1. Implement browser-side NIP-46 provider using nostr-tools
   - Kind 24133 subscription on relays
   - NIP-44 request decryption / response encryption
   - Method handlers: `connect`, `sign_event`, `get_public_key`, `nip04_*`, `nip44_*`
2. Add Signer UI section to `/apps` page
   - Bunker URI display + copy + QR
   - Connected clients list
   - Approval cards for pending requests
   - Policy selector (ask-every-time vs auto-sign-logins)
3. Lifecycle management
   - Auto-start on page load when key is available
   - Reconnect on `visibilitychange`
   - Clean disconnect on page unload
4. Store signer state in Dexie
   - Known clients (pubkey, name, last seen)
   - Policy preference
   - Bunker URI (stable across sessions)

**Depends on:** Nothing new -- uses existing nostr-tools and relay infrastructure.

### Phase 2: Bunker Teleport (Layer 3)

**Goal:** Apps get signing access instead of the raw key.

**Work:**
1. Add "Connect as signer" option to the teleport UI
2. Generate one-time bunker URI with embedded secret
3. Deliver via fragment URL: `https://app.com/#bunkerconnect=<uri>`
4. Document the `#bunkerconnect=` protocol for receiving apps
5. Track active bunker teleport sessions (which apps have access)
6. Add revocation UI (stop a specific app's session)

**Depends on:** Phase 1 (browser signer must be running to service requests).

### Phase 3: Intercessio Bridge (Layer 2)

**Goal:** Signing persists when the Welcome tab is closed.

**Work:**
1. Add config: `INTERCESSIO_URL` environment variable
2. Welcome server: detect if Intercessio is available (ping)
3. Key import flow: encrypted transfer to Intercessio's Keychain
4. Session management: start/stop/monitor Intercessio bunker sessions
5. UI: "Promote to Background" / "View in Intercessio" controls
6. Handoff protocol: browser signer yields to Intercessio, resumes if Intercessio goes down

**Depends on:** Phase 1 + Intercessio running locally. Can be developed in parallel with Phase 2.

---

## Security Considerations

### Key Never Leaves the Browser (Layer 1)

- The nsec is decrypted from Dexie using the session-derived AES key
- Signing happens in browser memory via nostr-tools
- NIP-46 protocol means only signed events travel over relays, never the key
- When the tab closes, the key is gone from memory

### Relay Privacy

- NIP-46 messages are NIP-44 encrypted between client and provider
- Relay operators see encrypted blobs, not signing content
- The provider pubkey (user's npub) is visible on relays -- this is inherent to NIP-46

### Approval as Defense-in-Depth

- Even with a valid bunker URI, each sign request goes through the policy engine
- "Ask every time" policy means compromised bunker URIs can't sign without user interaction
- Auto-sign policies are opt-in for convenience-sensitive users

### Bunker Teleport vs nsec Teleport

- Bunker teleport is strictly safer: the key never leaves Welcome
- nsec teleport remains available for apps that don't support NIP-46
- The UI should default to bunker teleport and explain the tradeoff

### Intercessio Handoff

- The nsec passes through localhost during Intercessio import
- macOS Keychain provides hardware-backed secure storage
- Intercessio's policy engine adds another approval layer

---

## Open Questions

1. **Provider identity:** Should the NIP-46 provider use the user's own pubkey or a separate provider keypair? Using the user's pubkey is simpler (bunker URI = `bunker://<npub>`) but means the user's pubkey is the address for signing requests on relays. A separate keypair adds indirection but complicates the UX.

2. **Multi-tab:** What happens if the user has Welcome open in two tabs? Need to either coordinate via Dexie (leader election) or accept that both tabs may try to respond (idempotent signing is safe but wasteful).

3. **Mobile:** The browser signer works on mobile browsers too, but background execution is unreliable. Should we explore service workers or accept that mobile = tab-must-be-open?

4. **Relay selection:** Should the bunker use the same relays as the user's Nostr profile, or dedicated signing relays? Dedicated relays reduce noise but require extra configuration.

5. **Intercessio auth:** Intercessio's Web UI currently has no authentication. If Welcome proxies to it, should we add token-based auth, or rely on localhost-only binding?

---

## Appendix: NIP-46 Protocol Summary

```
Client (remote app)                    Provider (Welcome)
─────────────────                      ──────────────────
1. Parse bunker:// URI
2. Generate ephemeral keypair
3. Publish kind 24133                  4. Receive kind 24133
   to provider pubkey                     from client pubkey
   content: NIP-44({                   5. Decrypt, evaluate
     id, method: "connect",            6. If approved, respond:
     params: [pubkey, secret]             kind 24133 to client
   })                                     content: NIP-44({
                                            id, result: "ack"
7. Connection established                 })

8. Need signature?                     9. Receive sign request
   Publish kind 24133                  10. Show approval UI
   content: NIP-44({                   11. If approved, sign event
     id, method: "sign_event",         12. Respond with signed event:
     params: [eventJSON]                   kind 24133 to client
   })                                      content: NIP-44({
                                             id, result: signedJSON
13. Receive signed event                   })
14. Use it
```

### Supported Methods

| Method | Params | Response |
|--------|--------|----------|
| `connect` | [pubkey, secret?, permissions?] | "ack" |
| `sign_event` | [unsigned event JSON] | signed event JSON |
| `get_public_key` | [] | hex pubkey |
| `nip04_encrypt` | [thirdPartyPubkey, plaintext] | ciphertext |
| `nip04_decrypt` | [thirdPartyPubkey, ciphertext] | plaintext |
| `nip44_encrypt` | [thirdPartyPubkey, plaintext] | ciphertext |
| `nip44_decrypt` | [thirdPartyPubkey, ciphertext] | plaintext |
