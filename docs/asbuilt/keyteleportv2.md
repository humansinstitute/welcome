# KeyTeleport v2 - As Built

## Overview

KeyTeleport enables secure, private transfer of Nostr identities between apps. A user can "teleport" their nsec from Welcome to any registered app without exposing the key to servers or network observers.

### Key Features

- **Self-contained blobs** - Everything needed is in the URL fragment
- **No server callbacks** - Receiving apps decrypt locally
- **Fragment URLs** - Blob in `#fragment` so servers never see it
- **Double encryption** - Throwaway key + target app key
- **No recipient tag** - Target app pubkey not exposed (quantum resistance)
- **Plaintext registration** - App registration uses signed plaintext (no encryption ceremony)

---

## Architecture

```
┌─────────────────┐                              ┌─────────────────┐
│   Welcome App   │                              │  Receiving App  │
│   (Sender)      │                              │  (Client)       │
├─────────────────┤                              ├─────────────────┤
│                 │   1. Register (one-time)     │                 │
│                 │ ◄──────────────────────────  │ Generate blob   │
│ Store app info  │    Signed plaintext blob     │ (one-click)     │
│                 │                              │                 │
│                 │   2. Teleport (per-use)      │                 │
│ User clicks     │ ─────────────────────────►   │                 │
│ "Teleport"      │   URL#keyteleport=BLOB       │ Decrypt blob    │
│                 │   + clipboard: unlock code   │ Prompt unlock   │
│                 │                              │ Import key      │
└─────────────────┘                              └─────────────────┘
```

---

## Part 1: App Registration

### How It Works

1. User goes to receiving app's "Setup Key Teleport" page
2. App generates a signed registration blob (one click)
3. User pastes blob into Welcome at `/teleport/setup`
4. Welcome verifies signature and stores app info

### Registration Blob Format

The blob is a **base64-encoded signed Nostr event** with **plaintext content**:

```typescript
// Registration event structure
{
  kind: 30078,
  pubkey: "<app's hex pubkey>",      // App's identity
  created_at: <timestamp>,
  tags: [
    ["type", "keyteleport-app-registration"]
  ],
  content: "<JSON string>",           // Plaintext (not encrypted)
  sig: "<signature>"
}

// Content (plaintext JSON)
{
  url: "https://yourapp.com",         // Or custom URI: "yourapp://auth"
  name: "Your App Name",
  description: "Optional description",
  metadata: {}                        // Reserved for future use
}
```

### Generating a Registration Blob (Client App)

```typescript
import { finalizeEvent, generateSecretKey, getPublicKey, nip19 } from "nostr-tools";

// Your app needs a persistent keypair for receiving teleports
// Generate ONCE and store securely (env var, keychain, etc.)
const APP_SECRET_KEY: Uint8Array = /* load from secure storage */;

function generateRegistrationBlob(): string {
  const content = {
    url: "https://yourapp.com",  // Your app's URL or custom URI scheme
    name: "Your App Name",
    description: "What your app does",
  };

  const event = finalizeEvent({
    kind: 30078,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["type", "keyteleport-app-registration"]],
    content: JSON.stringify(content),
  }, APP_SECRET_KEY);

  return btoa(JSON.stringify(event));
}

// Usage: One-click copy to clipboard
document.getElementById("copy-btn").onclick = async () => {
  const blob = generateRegistrationBlob();
  await navigator.clipboard.writeText(blob);
};
```

### Welcome's Verification Endpoint

```
POST /api/teleport/verify-app
Content-Type: application/json

{ "blob": "<base64 encoded event>" }
```

Response:
```json
{
  "success": true,
  "appPubkey": "abc123...",
  "appNpub": "npub1...",
  "url": "https://yourapp.com",
  "name": "Your App Name",
  "description": "..."
}
```

Welcome verifies:
1. Valid base64 → JSON → Nostr event structure
2. Valid signature (proves app identity)
3. Required fields present (url, name)

---

## Part 2: Key Teleport Flow

### How It Works

1. User clicks "Teleport to [App]" in Welcome
2. Browser generates throwaway keypair
3. Browser encrypts nsec: `NIP-44(nsec, userKey + throwawayPubkey)`
4. Server wraps in signed event, encrypts to app: `NIP-44(payload, serverKey + appPubkey)`
5. Throwaway nsec copied to clipboard (the "unlock code")
6. Browser opens: `https://app.com/#keyteleport=<BLOB>`
7. Receiving app decrypts outer layer with its key
8. User pastes unlock code
9. App decrypts inner layer → gets user's nsec

### Teleport Blob Structure

```
Signed Nostr Event (by Welcome)
├── kind: 21059
├── pubkey: <Welcome's pubkey>
├── tags: []                          ← Empty! No recipient tag
├── content: NIP-44 encrypted to app's pubkey
│   └── Payload JSON:
│       ├── encryptedNsec: NIP-44(nsec, userKey + throwawayPubkey)
│       ├── npub: "npub1..."          ← User's public key
│       └── v: 1                      ← Protocol version
└── sig: <signature>
```

### Why No Recipient Tag?

Standard Nostr events include `["p", recipientPubkey]`. We deliberately omit this:

1. **Quantum resistance** - Shor's algorithm could derive private keys from exposed pubkeys. No pubkey in blob = no target.
2. **Decryption validates recipient** - NIP-44 uses authenticated encryption. Success = blob was for you. Failure = wrong app.
3. **No routing needed** - Blobs travel via clipboard/QR, not relays.
4. **Privacy** - Intercepted blobs don't reveal the target app.

### URL Format

**Web apps (fragment URL):**
```
https://yourapp.com/#keyteleport=<BASE64_BLOB>
```

**Native apps (custom URI):**
```
yourapp://auth#keyteleport=<BASE64_BLOB>
```

The fragment (`#`) is never sent to servers - only client-side JavaScript can read it.

---

## Part 3: Receiving Teleported Keys (Client Implementation)

### Step 1: Detect Teleport in URL

```typescript
function checkForTeleport(): string | null {
  const hash = window.location.hash;
  if (!hash.includes("keyteleport=")) return null;

  const params = new URLSearchParams(hash.slice(1));
  const blob = params.get("keyteleport");

  // Clear URL immediately (don't leave blob in history)
  history.replaceState(null, "", window.location.pathname);

  return blob ? decodeURIComponent(blob) : null;
}
```

### Step 2: Decode and Verify Blob

```typescript
import { nip19, nip44, verifyEvent } from "nostr-tools";

interface TeleportPayload {
  encryptedNsec: string;
  npub: string;
  v: number;
}

function decodeTeleportBlob(
  blob: string,
  appSecretKey: Uint8Array
): { payload: TeleportPayload; senderPubkey: string } {
  // 1. Base64 decode
  const event = JSON.parse(atob(blob));

  // 2. Verify signature (proves Welcome created it)
  if (!verifyEvent(event)) {
    throw new Error("Invalid signature");
  }

  // 3. Decrypt content
  //    No "p" tag - decryption success = blob was for us
  const conversationKey = nip44.v2.utils.getConversationKey(
    appSecretKey,
    event.pubkey  // Welcome's pubkey
  );

  let decrypted: string;
  try {
    decrypted = nip44.v2.decrypt(event.content, conversationKey);
  } catch {
    throw new Error("Decryption failed - blob not for this app");
  }

  const payload: TeleportPayload = JSON.parse(decrypted);

  if (payload.v !== 1) {
    throw new Error(`Unsupported version: ${payload.v}`);
  }

  return { payload, senderPubkey: event.pubkey };
}
```

### Step 3: Decrypt User's Key with Unlock Code

```typescript
function decryptUserKey(
  encryptedNsec: string,
  userNpub: string,
  unlockCode: string  // User pastes this (throwaway nsec)
): string {
  // 1. Decode unlock code
  const { type, data: throwawaySecretKey } = nip19.decode(unlockCode);
  if (type !== "nsec") {
    throw new Error("Invalid unlock code");
  }

  // 2. Decode user's npub
  const { data: userPubkeyHex } = nip19.decode(userNpub);

  // 3. Derive conversation key: throwaway + user's pubkey
  const conversationKey = nip44.v2.utils.getConversationKey(
    throwawaySecretKey as Uint8Array,
    userPubkeyHex as string
  );

  // 4. Decrypt
  const nsec = nip44.v2.decrypt(encryptedNsec, conversationKey);

  // 5. Validate
  const { type: resultType } = nip19.decode(nsec);
  if (resultType !== "nsec") {
    throw new Error("Decryption failed");
  }

  return nsec;
}
```

### Step 4: Complete Handler

```typescript
async function handleKeyTeleport(appSecretKey: Uint8Array): Promise<void> {
  const blob = checkForTeleport();
  if (!blob) return;

  try {
    // Decode blob
    const { payload } = decodeTeleportBlob(blob, appSecretKey);

    // Show UI: "Importing identity: npub1..."
    const confirmed = await showConfirmDialog(payload.npub);
    if (!confirmed) return;

    // Get unlock code from user
    const unlockCode = await promptForUnlockCode();
    if (!unlockCode) return;

    // Decrypt the key
    const nsec = decryptUserKey(
      payload.encryptedNsec,
      payload.npub,
      unlockCode
    );

    // Store securely (encrypted in IndexedDB, Keychain, etc.)
    await storeKeySecurely(nsec, payload.npub);

    // Success!
    showSuccess("Identity imported successfully");
  } catch (err) {
    showError(err.message);
  }
}
```

---

## Part 4: Welcome's Server Endpoints

### Create Teleport Blob

```
POST /api/teleport
Content-Type: application/json

{
  "hashId": "<unique ID>",
  "encryptedNsec": "<NIP-44 encrypted by browser>",
  "npub": "npub1...",
  "appPubkey": "<hex pubkey of target app>",  // For user-registered apps
  "appId": 123,                                // OR for admin-managed apps
  "baseUrl": "https://welcome.example.com"
}
```

Response:
```json
{
  "success": true,
  "blob": "<base64 encoded signed event>",
  "expiresAt": 1234567890,
  "expiresIn": 900
}
```

### Verify Registration Blob

```
POST /api/teleport/verify-app
Content-Type: application/json

{ "blob": "<base64 registration blob>" }
```

### Add User Teleport App

```
POST /api/teleport/add-app
Content-Type: application/json
X-Npub: npub1...

{
  "appPubkey": "<hex>",
  "url": "https://app.com",
  "name": "App Name",
  "description": "..."
}
```

### List User's Apps

```
GET /api/user/teleport-apps
X-Npub: npub1...
```

### Delete User's App

```
DELETE /api/user/teleport-apps/:id
X-Npub: npub1...
```

---

## Security Model

### What's Protected

| Data | Protection |
|------|------------|
| User's nsec | Double encrypted (throwaway + app key) |
| Teleport blob | Fragment URL (never hits server logs) |
| Target app identity | Not in blob (quantum resistance) |
| Unlock code | Only on user's clipboard |

### Attack Scenarios

| Attacker | Can Access | Cannot Access |
|----------|------------|---------------|
| Network observer | Domain name only | Blob (in fragment) |
| Server logs | Nothing | Blob (fragment not logged) |
| Intercepts blob | Encrypted payload | Content (needs app key) |
| Has app key | Outer payload | nsec (needs unlock code) |
| Quantum computer | Could derive Welcome's key | App key (not in blob) |

### To Decrypt User's nsec, Attacker Needs BOTH:

1. Target app's private key (to decrypt outer layer)
2. Throwaway private key (only on user's clipboard)

---

## Dependencies

```json
{
  "dependencies": {
    "nostr-tools": "^2.7.2"
  }
}
```

Or via CDN:
```javascript
import { nip19, nip44, verifyEvent, finalizeEvent, generateSecretKey, getPublicKey }
  from "https://esm.sh/nostr-tools@2.7.2";
import * as nip44 from "https://esm.sh/nostr-tools@2.7.2/nip44";
```

---

## Quick Reference

### For App Developers (Receiving Apps)

1. **Generate a keypair** for your app (once, store securely)
2. **Add registration UI** - one button that generates blob + copies to clipboard
3. **Handle `#keyteleport=` fragments** on page load
4. **Verify signature**, decrypt with your app key
5. **Prompt for unlock code**, decrypt inner layer
6. **Store the nsec** securely

### For Users

1. **Register apps** - Copy blob from app, paste into Welcome
2. **Teleport** - Click app in Welcome, paste unlock code in target app
3. **Done** - Identity transferred securely

---

## Changelog

### v2 (Current)

- Removed recipient pubkey from blobs (quantum resistance)
- Simplified registration to plaintext (no encryption needed)
- Self-contained blobs (no server callback required)
- Fragment URLs for all teleport links

### v1 (Deprecated)

- Included recipient pubkey in `["p", ...]` tag
- Required encryption for registration blobs
- Used server callbacks for key retrieval
