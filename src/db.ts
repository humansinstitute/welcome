import { Database } from "bun:sqlite";

import { DB_PATH, DEFAULT_INVITE_CODES, TELEPORT_EXPIRY_SECONDS } from "./config.ts";
import type { User, App, UserApp, OnboardingStatus, InviteCode, TeleportKey } from "./types.ts";

const db = new Database(DB_PATH);

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    npub TEXT NOT NULL UNIQUE,
    ncryptsec TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    invite_code TEXT NOT NULL,
    onboarding_status TEXT NOT NULL DEFAULT 'new',
    display_name TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    icon_url TEXT DEFAULT NULL,
    url TEXT NOT NULL,
    teleport_pubkey TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add teleport_pubkey column if it doesn't exist
try {
  db.run("ALTER TABLE apps ADD COLUMN teleport_pubkey TEXT DEFAULT NULL");
} catch {
  // Column already exists, ignore
}

db.run(`
  CREATE TABLE IF NOT EXISTS user_apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    app_id INTEGER NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (app_id) REFERENCES apps(id),
    UNIQUE(user_id, app_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS invite_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    max_uses INTEGER DEFAULT NULL,
    uses INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS teleport_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash_id TEXT NOT NULL UNIQUE,
    ncryptsec TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed default invite codes if table is empty
const codeCount = db.query<{ count: number }, []>("SELECT COUNT(*) as count FROM invite_codes").get();
if (codeCount && codeCount.count === 0) {
  const insertCode = db.prepare("INSERT OR IGNORE INTO invite_codes (code) VALUES (?)");
  for (const code of DEFAULT_INVITE_CODES) {
    insertCode.run(code);
  }
}

// Prepared statements - Users
const getUserByNpubStmt = db.query<User, [string]>("SELECT * FROM users WHERE npub = ?");
const getUserByEmailStmt = db.query<User, [string]>("SELECT * FROM users WHERE email = ?");
const createUserStmt = db.query<User, [string, string, string, string, string, string]>(
  `INSERT INTO users (email, npub, ncryptsec, password_hash, salt, invite_code)
   VALUES (?, ?, ?, ?, ?, ?) RETURNING *`
);
const updateOnboardingStatusStmt = db.query<User, [string, string]>(
  `UPDATE users SET onboarding_status = ?, updated_at = CURRENT_TIMESTAMP
   WHERE npub = ? RETURNING *`
);

// Prepared statements - Apps
const getAppsByUserIdStmt = db.query<App & { role: string }, [number]>(
  `SELECT apps.*, user_apps.role FROM apps
   JOIN user_apps ON apps.id = user_apps.app_id
   WHERE user_apps.user_id = ?
   ORDER BY user_apps.joined_at DESC`
);

// User functions
export function getUserByNpub(npub: string): User | null {
  if (!npub) return null;
  const user = getUserByNpubStmt.get(npub) as User | undefined;
  return user ?? null;
}

export function getUserByEmail(email: string): User | null {
  if (!email) return null;
  const user = getUserByEmailStmt.get(email.toLowerCase()) as User | undefined;
  return user ?? null;
}

export function createUser(
  email: string,
  npub: string,
  ncryptsec: string,
  passwordHash: string,
  salt: string,
  inviteCode: string
): User | null {
  if (!email || !npub || !ncryptsec || !passwordHash || !salt || !inviteCode) return null;
  const user = createUserStmt.get(
    email.toLowerCase(),
    npub,
    ncryptsec,
    passwordHash,
    salt,
    inviteCode
  ) as User | undefined;
  return user ?? null;
}

export function updateOnboardingStatus(
  npub: string,
  status: OnboardingStatus
): User | null {
  if (!npub) return null;
  const user = updateOnboardingStatusStmt.get(status, npub) as User | undefined;
  return user ?? null;
}

// App functions
export function getAppsByUserId(userId: number): (App & { role: string })[] {
  if (!userId) return [];
  return getAppsByUserIdStmt.all(userId);
}

// Admin app functions
const getAllAppsStmt = db.query<App, []>(
  "SELECT * FROM apps ORDER BY created_at DESC"
);
const getAppByIdStmt = db.query<App, [number]>(
  "SELECT * FROM apps WHERE id = ?"
);
const createAppStmt = db.query<App, [string, string | null, string | null, string, string | null]>(
  `INSERT INTO apps (name, description, icon_url, url, teleport_pubkey) VALUES (?, ?, ?, ?, ?) RETURNING *`
);
const updateAppStmt = db.query<App, [string, string | null, string | null, string, string | null, number]>(
  `UPDATE apps SET name = ?, description = ?, icon_url = ?, url = ?, teleport_pubkey = ? WHERE id = ? RETURNING *`
);
const deleteAppStmt = db.prepare("DELETE FROM apps WHERE id = ?");

export function getAllApps(): App[] {
  return getAllAppsStmt.all();
}

export function getAppById(id: number): App | null {
  if (!id) return null;
  const app = getAppByIdStmt.get(id) as App | undefined;
  return app ?? null;
}

export function createApp(
  name: string,
  description: string | null,
  iconUrl: string | null,
  url: string,
  teleportPubkey: string | null = null
): App | null {
  if (!name || !url) return null;
  try {
    const app = createAppStmt.get(name, description, iconUrl, url, teleportPubkey) as App | undefined;
    return app ?? null;
  } catch {
    return null;
  }
}

export function updateApp(
  id: number,
  name: string,
  description: string | null,
  iconUrl: string | null,
  url: string,
  teleportPubkey: string | null = null
): App | null {
  if (!id || !name || !url) return null;
  try {
    const app = updateAppStmt.get(name, description, iconUrl, url, teleportPubkey, id) as App | undefined;
    return app ?? null;
  } catch {
    return null;
  }
}

export function deleteApp(id: number): boolean {
  if (!id) return false;
  // Also delete user_apps associations
  db.run("DELETE FROM user_apps WHERE app_id = ?", [id]);
  const result = deleteAppStmt.run(id);
  return result.changes > 0;
}

export function resetDatabase() {
  db.run("DELETE FROM user_apps");
  db.run("DELETE FROM apps");
  db.run("DELETE FROM users");
  db.run("DELETE FROM invite_codes");
  db.run("DELETE FROM sqlite_sequence WHERE name IN ('users', 'apps', 'user_apps', 'invite_codes')");
}

// Invite code functions
const getAllInviteCodesStmt = db.query<InviteCode, []>(
  "SELECT * FROM invite_codes ORDER BY created_at DESC"
);
const getInviteCodeStmt = db.query<InviteCode, [string]>(
  "SELECT * FROM invite_codes WHERE code = ?"
);
const createInviteCodeStmt = db.query<InviteCode, [string, string | null, number | null]>(
  `INSERT INTO invite_codes (code, description, max_uses) VALUES (?, ?, ?) RETURNING *`
);
const incrementInviteCodeUsesStmt = db.query<InviteCode, [string]>(
  `UPDATE invite_codes SET uses = uses + 1 WHERE code = ? RETURNING *`
);
const deleteInviteCodeStmt = db.prepare("DELETE FROM invite_codes WHERE code = ?");
const toggleInviteCodeStmt = db.query<InviteCode, [number, string]>(
  `UPDATE invite_codes SET active = ? WHERE code = ? RETURNING *`
);

export function getAllInviteCodes(): InviteCode[] {
  return getAllInviteCodesStmt.all();
}

export function getInviteCode(code: string): InviteCode | null {
  if (!code) return null;
  const inviteCode = getInviteCodeStmt.get(code) as InviteCode | undefined;
  return inviteCode ?? null;
}

export function isValidInviteCode(code: string): boolean {
  const inviteCode = getInviteCode(code);
  if (!inviteCode) return false;
  if (!inviteCode.active) return false;
  if (inviteCode.max_uses !== null && inviteCode.uses >= inviteCode.max_uses) return false;
  return true;
}

export function createInviteCode(
  code: string,
  description: string | null = null,
  maxUses: number | null = null
): InviteCode | null {
  if (!code) return null;
  try {
    const inviteCode = createInviteCodeStmt.get(code, description, maxUses) as InviteCode | undefined;
    return inviteCode ?? null;
  } catch {
    return null; // Code already exists
  }
}

export function useInviteCode(code: string): InviteCode | null {
  if (!code) return null;
  const inviteCode = incrementInviteCodeUsesStmt.get(code) as InviteCode | undefined;
  return inviteCode ?? null;
}

export function deleteInviteCode(code: string): boolean {
  if (!code) return false;
  const result = deleteInviteCodeStmt.run(code);
  return result.changes > 0;
}

export function toggleInviteCode(code: string, active: boolean): InviteCode | null {
  if (!code) return null;
  const inviteCode = toggleInviteCodeStmt.get(active ? 1 : 0, code) as InviteCode | undefined;
  return inviteCode ?? null;
}

// Teleport key functions
const storeTeleportKeyStmt = db.query<TeleportKey, [string, string, number]>(
  `INSERT INTO teleport_keys (hash_id, ncryptsec, expires_at) VALUES (?, ?, ?) RETURNING *`
);
const getTeleportKeyStmt = db.query<TeleportKey, [string]>(
  `SELECT * FROM teleport_keys WHERE hash_id = ?`
);
const deleteTeleportKeyStmt = db.prepare("DELETE FROM teleport_keys WHERE hash_id = ?");
const cleanupExpiredKeysStmt = db.prepare("DELETE FROM teleport_keys WHERE expires_at < ?");

export function storeTeleportKey(
  hashId: string,
  ncryptsec: string,
  expiresAt: number
): TeleportKey | null {
  if (!hashId || !ncryptsec || !expiresAt) return null;
  try {
    const key = storeTeleportKeyStmt.get(hashId, ncryptsec, expiresAt) as TeleportKey | undefined;
    return key ?? null;
  } catch {
    return null;
  }
}

export function getTeleportKey(hashId: string): TeleportKey | null {
  if (!hashId) return null;
  const key = getTeleportKeyStmt.get(hashId) as TeleportKey | undefined;
  if (!key) return null;
  // Check if expired
  if (key.expires_at < Math.floor(Date.now() / 1000)) {
    deleteTeleportKeyStmt.run(hashId);
    return null;
  }
  return key;
}

export function deleteTeleportKey(hashId: string): boolean {
  if (!hashId) return false;
  const result = deleteTeleportKeyStmt.run(hashId);
  return result.changes > 0;
}

export function cleanupExpiredTeleportKeys(): number {
  const now = Math.floor(Date.now() / 1000);
  const result = cleanupExpiredKeysStmt.run(now);
  return result.changes;
}
