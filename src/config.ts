import { join } from "path";

export const PORT = Number(Bun.env.PORT ?? 3000);
export const MODE = Bun.env.MODE ?? "prod";
export const IS_DEV = MODE === "dev";
export const DB_PATH = Bun.env.DB_PATH ?? "welcome.sqlite";
export const APP_NAME = "Welcome";

export const PUBLIC_DIR = join(import.meta.dir, "../public");

export const DEFAULT_RELAYS = [
  "wss://relay.primal.net",
  "wss://nos.lol",
  "wss://relay.damus.io",
];

export const NOSTR_RELAYS: string[] = Bun.env.NOSTR_RELAYS
  ? Bun.env.NOSTR_RELAYS.split(",").map((s) => s.trim()).filter(Boolean)
  : DEFAULT_RELAYS;

// Admin npub for managing invite codes
export const ADMIN_NPUB = Bun.env.ADMIN_NPUB ?? "";

// Welcome's private key for signing key teleport events (nsec or 64-char hex)
export const WELCOME_PRIVKEY = Bun.env.WELCOME_PRIVKEY ?? "";

// Key teleport expiry time in seconds (21 minutes)
export const TELEPORT_EXPIRY_SECONDS = 21 * 60;

// Default invite codes (used if database is empty)
export const DEFAULT_INVITE_CODES = [
  "mg-hero-001",
  "sr-200126",
];
