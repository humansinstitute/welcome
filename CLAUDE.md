# Welcome - Nostr Onboarding App

A simple Nostr onboarding app for Others Stuff members.

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Backend Database**: SQLite (via bun:sqlite)
- **Frontend State**: Dexie.js (IndexedDB)
- **Frontend Reactivity**: Alpine.js
- **Nostr**: Applesauce libraries (applesauce-core, applesauce-relay)
- **Crypto**: nostr-tools for Nostr protocol operations

## Project Structure

```
src/
  server.ts      - Bun HTTP server entry point
  db.ts          - SQLite database helpers and schema
  config.ts      - Environment and app configuration
  types.ts       - TypeScript type definitions
  services/      - Business logic (auth, onboarding, etc.)
  routes/        - HTTP route handlers
public/          - Static assets
```

## Development Commands

```bash
bun install      # Install dependencies
bun dev          # Start with hot reload
bun start        # Production server
bun run reset-db # Clear database
bun run typecheck # Type check without emitting
```

## Key Conventions

- Use Applesauce libraries for all Nostr operations (event creation, relay connections, subscriptions)
- Use RxJS Observables for reactive data flows and real-time updates
- Use nostr-tools for cryptographic operations (key generation, signing, verification)
- SQLite database file: `welcome.sqlite` (auto-created, gitignored)
- All user data is keyed by npub (Nostr public key)

## Reference Architecture

See `reference/tracker/` for architecture patterns (routes, services, db patterns). This directory is gitignored and not part of the deployed app.

## Environment Variables

Create a `.env` file (gitignored):

```
PORT=3000
MODE=dev
DB_PATH=welcome.sqlite
NOSTR_RELAYS=wss://relay.primal.net,wss://nos.lol
```

## Security Notes

- Never commit `.env`, `*.nsec`, private keys, or secrets
- All secrets should be loaded from environment variables
- The `reference/` directory is gitignored entirely

## Frontend Architecture: Dexie + Alpine

### Core Principles
- **Dexie.js** — All client state lives in IndexedDB via Dexie
- **Alpine.js** — Reactive UI binds directly to Dexie queries
- **Backend DB** — SQLite as source of truth

### State Management
- Browser state is Dexie-first; never store app state in memory-only variables
- UI reactivity comes from Alpine watching Dexie liveQueries
- All user-facing data reads come from Dexie, not direct API responses

### Secrets & Keys
- Store keys/passwords/tokens **encrypted** in IndexedDB
- Encrypt with a key derived from user passphrase (e.g., PBKDF2 + AES-GCM)
- Never store plaintext secrets; decrypt only when needed in memory

### Sync Strategy

**Real-time (WebSocket or SSE)**
- Maintain persistent connection for server→client pushes
- On receiving update: upsert into Dexie, Alpine reactivity handles UI
- Client→server writes go via WebSocket message or REST POST

**Page Load / Refresh**
- `GET /sync?since={lastSyncTimestamp}` — pull changes since last sync
- `POST /sync` — push local unsynced changes (track with `syncedAt` or dirty flag)
- Resolve conflicts with last-write-wins or server-authoritative merge

**Offline Handling**
- Queue mutations in Dexie with `pending: true` flag
- On reconnect: flush pending queue to server, then pull latest

### Dexie Schema Conventions
```javascript
db.version(1).stores({
  items: '++id, visitorId, [syncedAt+id], *tags',
  secrets: 'id',           // encrypted blobs
  syncMeta: 'key'          // lastSyncTimestamp, etc.
});
```

### Alpine Integration Pattern
```javascript
// Expose Dexie liveQuery to Alpine
Alpine.store('items', {
  list: [],
  async init() {
    liveQuery(() => db.items.toArray())
      .subscribe(items => this.list = items);
  }
});
```

```html
<div x-data x-init="$store.items.init()">
  <template x-for="item in $store.items.list" :key="item.id">
    <div x-text="item.name"></div>
  </template>
</div>
```

### Rules
- No raw `fetch` results displayed directly — always write to Dexie first
- All sensitive data encrypted at rest in IndexedDB
- Sync timestamps on every record for incremental sync
- WebSocket/SSE for live updates; REST fallback on reconnect/refresh
