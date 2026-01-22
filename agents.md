# Agent Guidelines

- Prefer quick, focused answers. Research as needed but avoid long unbounded tasks.
- If working on multiple steps, ask questions to stay on track.
- Install deps with `bun install`, then run `bun dev` for hot reloads. Use `bun start` for production-like server.
- Primary files: `src/server.ts` (Bun server entry), `src/db.ts` (SQLite helpers). Static assets in `public/`.
- The SQLite file `welcome.sqlite` is created automatically; reset with `bun run reset-db` if needed.

## Nostr Libraries

- **applesauce-core**: Event handling, content parsing, timeline management
- **applesauce-relay**: Relay pool management, subscriptions via RxJS
- **nostr-tools**: Key generation, signing, NIP implementations

## Frontend Architecture: Dexie + Alpine

### Core Stack
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

## Code Quality

- Always check for type errors before finishing: `bun run typecheck`
- Keep commits incremental with descriptive messages (no self-crediting)
- Never hardcode secrets or private keys
- Use environment variables for all configuration

## File Organization

- Routes go in `src/routes/`
- Business logic in `src/services/`
- Database queries in `src/db.ts`
- Types in `src/types.ts`
- Configuration in `src/config.ts`

## Reference Code

The `reference/tracker/` directory contains the Ambulando codebase for architecture patterns. Consult it for:
- Route structure patterns
- Service layer organization
- Database query patterns
- Config management

This directory is gitignored and should not be modified.
