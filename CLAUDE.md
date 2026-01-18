# Welcome - Nostr Onboarding App

A simple Nostr onboarding app for Others Stuff members.

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Database**: SQLite (via bun:sqlite)
- **Nostr**: Applesauce libraries (applesauce-core, applesauce-relay)
- **Reactivity**: RxJS for real-time updates
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
