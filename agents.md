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
- Use RxJS patterns for reactive updates (subscriptions, event streams)

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
