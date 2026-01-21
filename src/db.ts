import { Database } from "bun:sqlite";

import { DB_PATH, DEFAULT_INVITE_CODES, TELEPORT_EXPIRY_SECONDS } from "./config.ts";
import type { User, App, UserApp, OnboardingStatus, InviteCode, TeleportKey, Group, UserGroup, InviteCodeGroup, AppGroup, UserGroupInfo, InviteCodeAppCode } from "./types.ts";

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

// Migration: Add welcome_dismissed column to users if it doesn't exist
try {
  db.run("ALTER TABLE users ADD COLUMN welcome_dismissed INTEGER NOT NULL DEFAULT 0");
} catch {
  // Column already exists, ignore
}

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

// Migration: Add visible column if it doesn't exist (default to visible)
try {
  db.run("ALTER TABLE apps ADD COLUMN visible INTEGER NOT NULL DEFAULT 1");
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
    welcome_message TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add welcome_message column to invite_codes if it doesn't exist
try {
  db.run("ALTER TABLE invite_codes ADD COLUMN welcome_message TEXT DEFAULT NULL");
} catch {
  // Column already exists, ignore
}

// Migration: Drop old teleport_keys table if it has old schema (ncryptsec instead of encrypted_nsec)
// This is safe because teleport_keys only stores temporary data that expires in minutes
try {
  const tableInfo = db.query("PRAGMA table_info(teleport_keys)").all() as { name: string }[];
  const hasOldSchema = tableInfo.some(col => col.name === "ncryptsec");
  const hasNewSchema = tableInfo.some(col => col.name === "encrypted_nsec");

  if (hasOldSchema && !hasNewSchema) {
    console.log("[DB] Migrating teleport_keys table to new schema...");
    db.run("DROP TABLE teleport_keys");
  }
} catch {
  // Table doesn't exist yet, ignore
}

db.run(`
  CREATE TABLE IF NOT EXISTS teleport_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash_id TEXT NOT NULL UNIQUE,
    encrypted_nsec TEXT NOT NULL,
    npub TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Groups table
db.run(`
  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// User-Groups junction table
db.run(`
  CREATE TABLE IF NOT EXISTS user_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    source TEXT NOT NULL DEFAULT 'admin',
    source_code TEXT DEFAULT NULL,
    assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE(user_id, group_id)
  )
`);

// Invite Code-Groups junction table
db.run(`
  CREATE TABLE IF NOT EXISTS invite_code_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invite_code_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invite_code_id) REFERENCES invite_codes(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE(invite_code_id, group_id)
  )
`);

// App-Groups junction table
db.run(`
  CREATE TABLE IF NOT EXISTS app_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE(app_id, group_id)
  )
`);

// Invite Code-App Codes junction table (external app invite codes linked to Welcome invites)
db.run(`
  CREATE TABLE IF NOT EXISTS invite_code_app_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invite_code_id INTEGER NOT NULL,
    app_id INTEGER NOT NULL,
    external_code TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invite_code_id) REFERENCES invite_codes(id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    UNIQUE(invite_code_id, app_id)
  )
`);

// Create indexes for efficient lookups
db.run("CREATE INDEX IF NOT EXISTS idx_user_groups_user ON user_groups(user_id)");
db.run("CREATE INDEX IF NOT EXISTS idx_user_groups_group ON user_groups(group_id)");
db.run("CREATE INDEX IF NOT EXISTS idx_app_groups_app ON app_groups(app_id)");
db.run("CREATE INDEX IF NOT EXISTS idx_app_groups_group ON app_groups(group_id)");
db.run("CREATE INDEX IF NOT EXISTS idx_invite_code_groups_code ON invite_code_groups(invite_code_id)");
db.run("CREATE INDEX IF NOT EXISTS idx_invite_code_app_codes_code ON invite_code_app_codes(invite_code_id)");
db.run("CREATE INDEX IF NOT EXISTS idx_invite_code_app_codes_app ON invite_code_app_codes(app_id)");

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

// Create user for extension login (no email/password, just npub + invite code)
// Uses placeholder values for required fields since extension users authenticate via their extension
export function createExtensionUser(npub: string, inviteCode: string): User | null {
  if (!npub || !inviteCode) return null;
  // Use npub-based placeholder email to satisfy unique constraint
  const placeholderEmail = `${npub}@extension.local`;
  try {
    const user = createUserStmt.get(
      placeholderEmail,
      npub,
      "", // no ncryptsec for extension users
      "", // no password hash
      "", // no salt
      inviteCode
    ) as User | undefined;
    return user ?? null;
  } catch {
    return null; // User already exists or other error
  }
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
const getVisibleAppsStmt = db.query<App, []>(
  "SELECT * FROM apps WHERE visible = 1 ORDER BY created_at DESC"
);
const getAppByIdStmt = db.query<App, [number]>(
  "SELECT * FROM apps WHERE id = ?"
);
const toggleAppVisibilityStmt = db.query<App, [number, number]>(
  "UPDATE apps SET visible = ? WHERE id = ? RETURNING *"
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

export function getVisibleApps(): App[] {
  return getVisibleAppsStmt.all();
}

export function toggleAppVisibility(id: number, visible: boolean): App | null {
  if (!id) return null;
  const app = toggleAppVisibilityStmt.get(visible ? 1 : 0, id) as App | undefined;
  return app ?? null;
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
const createInviteCodeStmt = db.query<InviteCode, [string, string | null, number | null, string | null]>(
  `INSERT INTO invite_codes (code, description, max_uses, welcome_message) VALUES (?, ?, ?, ?) RETURNING *`
);
const updateInviteCodeStmt = db.query<InviteCode, [string | null, number | null, string | null, string]>(
  `UPDATE invite_codes SET description = ?, max_uses = ?, welcome_message = ? WHERE code = ? RETURNING *`
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
  maxUses: number | null = null,
  welcomeMessage: string | null = null
): InviteCode | null {
  if (!code) return null;
  try {
    const inviteCode = createInviteCodeStmt.get(code, description, maxUses, welcomeMessage) as InviteCode | undefined;
    return inviteCode ?? null;
  } catch {
    return null; // Code already exists
  }
}

export function updateInviteCode(
  code: string,
  description: string | null = null,
  maxUses: number | null = null,
  welcomeMessage: string | null = null
): InviteCode | null {
  if (!code) return null;
  try {
    const inviteCode = updateInviteCodeStmt.get(description, maxUses, welcomeMessage, code) as InviteCode | undefined;
    return inviteCode ?? null;
  } catch {
    return null;
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

// Welcome message functions
const getUserWelcomeInfoStmt = db.query<{ welcome_message: string | null; welcome_dismissed: number }, [string]>(
  `SELECT ic.welcome_message, u.welcome_dismissed
   FROM users u
   LEFT JOIN invite_codes ic ON u.invite_code = ic.code
   WHERE u.npub = ?`
);
const dismissWelcomeStmt = db.query<User, [string]>(
  `UPDATE users SET welcome_dismissed = 1, updated_at = CURRENT_TIMESTAMP WHERE npub = ? RETURNING *`
);

export function getUserWelcomeInfo(npub: string): { welcome_message: string | null; welcome_dismissed: number } | null {
  if (!npub) return null;
  const info = getUserWelcomeInfoStmt.get(npub);
  return info ?? null;
}

export function dismissWelcome(npub: string): User | null {
  if (!npub) return null;
  const user = dismissWelcomeStmt.get(npub) as User | undefined;
  return user ?? null;
}

// Teleport key functions
const storeTeleportKeyStmt = db.query<TeleportKey, [string, string, string, number]>(
  `INSERT INTO teleport_keys (hash_id, encrypted_nsec, npub, expires_at) VALUES (?, ?, ?, ?) RETURNING *`
);
const getTeleportKeyStmt = db.query<TeleportKey, [string]>(
  `SELECT * FROM teleport_keys WHERE hash_id = ?`
);
const deleteTeleportKeyStmt = db.prepare("DELETE FROM teleport_keys WHERE hash_id = ?");
const cleanupExpiredKeysStmt = db.prepare("DELETE FROM teleport_keys WHERE expires_at < ?");

export function storeTeleportKey(
  hashId: string,
  encryptedNsec: string,
  npub: string,
  expiresAt: number
): TeleportKey | null {
  if (!hashId || !encryptedNsec || !npub || !expiresAt) return null;
  try {
    const key = storeTeleportKeyStmt.get(hashId, encryptedNsec, npub, expiresAt) as TeleportKey | undefined;
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

// ============================================
// Group Functions
// ============================================

// Prepared statements - Groups
const getAllGroupsStmt = db.query<Group, []>(
  "SELECT * FROM groups ORDER BY created_at DESC"
);
const getActiveGroupsStmt = db.query<Group, []>(
  "SELECT * FROM groups WHERE active = 1 ORDER BY name ASC"
);
const getGroupByIdStmt = db.query<Group, [number]>(
  "SELECT * FROM groups WHERE id = ?"
);
const getGroupByNameStmt = db.query<Group, [string]>(
  "SELECT * FROM groups WHERE name = ?"
);
const createGroupStmt = db.query<Group, [string, string | null]>(
  `INSERT INTO groups (name, description) VALUES (?, ?) RETURNING *`
);
const updateGroupStmt = db.query<Group, [string, string | null, number]>(
  `UPDATE groups SET name = ?, description = ? WHERE id = ? RETURNING *`
);
const deleteGroupStmt = db.prepare("DELETE FROM groups WHERE id = ?");
const toggleGroupStmt = db.query<Group, [number, number]>(
  `UPDATE groups SET active = ? WHERE id = ? RETURNING *`
);

export function getAllGroups(): Group[] {
  return getAllGroupsStmt.all();
}

export function getActiveGroups(): Group[] {
  return getActiveGroupsStmt.all();
}

export function getGroupById(id: number): Group | null {
  if (!id) return null;
  const group = getGroupByIdStmt.get(id) as Group | undefined;
  return group ?? null;
}

export function getGroupByName(name: string): Group | null {
  if (!name) return null;
  const group = getGroupByNameStmt.get(name) as Group | undefined;
  return group ?? null;
}

export function createGroup(name: string, description: string | null = null): Group | null {
  if (!name) return null;
  try {
    const group = createGroupStmt.get(name.trim(), description?.trim() || null) as Group | undefined;
    return group ?? null;
  } catch {
    return null; // Name already exists
  }
}

export function updateGroup(id: number, name: string, description: string | null = null): Group | null {
  if (!id || !name) return null;
  try {
    const group = updateGroupStmt.get(name.trim(), description?.trim() || null, id) as Group | undefined;
    return group ?? null;
  } catch {
    return null;
  }
}

export function deleteGroup(id: number): boolean {
  if (!id) return false;
  // Junction tables will cascade delete due to foreign key constraints
  const result = deleteGroupStmt.run(id);
  return result.changes > 0;
}

export function toggleGroup(id: number, active: boolean): Group | null {
  if (!id) return null;
  const group = toggleGroupStmt.get(active ? 1 : 0, id) as Group | undefined;
  return group ?? null;
}

// ============================================
// User-Group Functions
// ============================================

const getUserGroupsStmt = db.query<UserGroupInfo, [number]>(
  `SELECT ug.group_id, g.name as group_name, ug.source, ug.assigned_at
   FROM user_groups ug
   JOIN groups g ON ug.group_id = g.id
   WHERE ug.user_id = ?
   ORDER BY ug.assigned_at DESC`
);

const getUserGroupsByNpubStmt = db.query<UserGroupInfo, [string]>(
  `SELECT ug.group_id, g.name as group_name, ug.source, ug.assigned_at
   FROM user_groups ug
   JOIN groups g ON ug.group_id = g.id
   JOIN users u ON ug.user_id = u.id
   WHERE u.npub = ?
   ORDER BY ug.assigned_at DESC`
);

const addUserToGroupStmt = db.prepare(
  `INSERT OR IGNORE INTO user_groups (user_id, group_id, source, source_code) VALUES (?, ?, ?, ?)`
);

const removeUserFromGroupStmt = db.prepare(
  `DELETE FROM user_groups WHERE user_id = ? AND group_id = ?`
);

const getUsersInGroupStmt = db.query<User, [number]>(
  `SELECT u.* FROM users u
   JOIN user_groups ug ON u.id = ug.user_id
   WHERE ug.group_id = ?
   ORDER BY u.created_at DESC`
);

export function getUserGroups(userId: number): UserGroupInfo[] {
  if (!userId) return [];
  return getUserGroupsStmt.all(userId);
}

export function getUserGroupsByNpub(npub: string): UserGroupInfo[] {
  if (!npub) return [];
  return getUserGroupsByNpubStmt.all(npub);
}

export function addUserToGroup(
  userId: number,
  groupId: number,
  source: "admin" | "invite_code" = "admin",
  sourceCode: string | null = null
): boolean {
  if (!userId || !groupId) return false;
  try {
    const result = addUserToGroupStmt.run(userId, groupId, source, sourceCode);
    return result.changes > 0;
  } catch {
    return false;
  }
}

export function removeUserFromGroup(userId: number, groupId: number): boolean {
  if (!userId || !groupId) return false;
  const result = removeUserFromGroupStmt.run(userId, groupId);
  return result.changes > 0;
}

export function getUsersInGroup(groupId: number): User[] {
  if (!groupId) return [];
  return getUsersInGroupStmt.all(groupId);
}

// ============================================
// Invite Code-Group Functions
// ============================================

const getInviteCodeGroupsStmt = db.query<Group, [number]>(
  `SELECT g.* FROM groups g
   JOIN invite_code_groups icg ON g.id = icg.group_id
   WHERE icg.invite_code_id = ?
   ORDER BY g.name ASC`
);

const getGroupsForInviteCodeByCodeStmt = db.query<Group, [string]>(
  `SELECT g.* FROM groups g
   JOIN invite_code_groups icg ON g.id = icg.group_id
   JOIN invite_codes ic ON icg.invite_code_id = ic.id
   WHERE ic.code = ?
   ORDER BY g.name ASC`
);

const addGroupToInviteCodeStmt = db.prepare(
  `INSERT OR IGNORE INTO invite_code_groups (invite_code_id, group_id) VALUES (?, ?)`
);

const removeGroupFromInviteCodeStmt = db.prepare(
  `DELETE FROM invite_code_groups WHERE invite_code_id = ? AND group_id = ?`
);

const clearInviteCodeGroupsStmt = db.prepare(
  `DELETE FROM invite_code_groups WHERE invite_code_id = ?`
);

export function getInviteCodeGroups(inviteCodeId: number): Group[] {
  if (!inviteCodeId) return [];
  return getInviteCodeGroupsStmt.all(inviteCodeId);
}

export function getGroupsForInviteCode(code: string): Group[] {
  if (!code) return [];
  return getGroupsForInviteCodeByCodeStmt.all(code);
}

export function setInviteCodeGroups(inviteCodeId: number, groupIds: number[]): boolean {
  if (!inviteCodeId) return false;
  try {
    clearInviteCodeGroupsStmt.run(inviteCodeId);
    for (const groupId of groupIds) {
      addGroupToInviteCodeStmt.run(inviteCodeId, groupId);
    }
    return true;
  } catch {
    return false;
  }
}

export function addGroupToInviteCode(inviteCodeId: number, groupId: number): boolean {
  if (!inviteCodeId || !groupId) return false;
  try {
    const result = addGroupToInviteCodeStmt.run(inviteCodeId, groupId);
    return result.changes > 0;
  } catch {
    return false;
  }
}

export function removeGroupFromInviteCode(inviteCodeId: number, groupId: number): boolean {
  if (!inviteCodeId || !groupId) return false;
  const result = removeGroupFromInviteCodeStmt.run(inviteCodeId, groupId);
  return result.changes > 0;
}

// ============================================
// App-Group Functions
// ============================================

const getAppGroupsStmt = db.query<Group, [number]>(
  `SELECT g.* FROM groups g
   JOIN app_groups ag ON g.id = ag.group_id
   WHERE ag.app_id = ?
   ORDER BY g.name ASC`
);

const addGroupToAppStmt = db.prepare(
  `INSERT OR IGNORE INTO app_groups (app_id, group_id) VALUES (?, ?)`
);

const removeGroupFromAppStmt = db.prepare(
  `DELETE FROM app_groups WHERE app_id = ? AND group_id = ?`
);

const clearAppGroupsStmt = db.prepare(
  `DELETE FROM app_groups WHERE app_id = ?`
);

const getAppsInGroupStmt = db.query<App, [number]>(
  `SELECT a.* FROM apps a
   JOIN app_groups ag ON a.id = ag.app_id
   WHERE ag.group_id = ?
   ORDER BY a.name ASC`
);

export function getAppGroups(appId: number): Group[] {
  if (!appId) return [];
  return getAppGroupsStmt.all(appId);
}

export function setAppGroups(appId: number, groupIds: number[]): boolean {
  if (!appId) return false;
  try {
    clearAppGroupsStmt.run(appId);
    for (const groupId of groupIds) {
      addGroupToAppStmt.run(appId, groupId);
    }
    return true;
  } catch {
    return false;
  }
}

export function addGroupToApp(appId: number, groupId: number): boolean {
  if (!appId || !groupId) return false;
  try {
    const result = addGroupToAppStmt.run(appId, groupId);
    return result.changes > 0;
  } catch {
    return false;
  }
}

export function removeGroupFromApp(appId: number, groupId: number): boolean {
  if (!appId || !groupId) return false;
  const result = removeGroupFromAppStmt.run(appId, groupId);
  return result.changes > 0;
}

export function getAppsInGroup(groupId: number): App[] {
  if (!groupId) return [];
  return getAppsInGroupStmt.all(groupId);
}

// ============================================
// Group-Aware App Visibility
// ============================================

// Get apps visible to a user based on their group memberships
// Apps with no group restrictions (no entries in app_groups) are visible to all
// Apps with group restrictions are only visible if user is in at least one of those groups
const getVisibleAppsForNpubStmt = db.query<App, [string]>(
  `SELECT DISTINCT a.* FROM apps a
   WHERE a.visible = 1
   AND (
     -- No group restrictions (app has no entries in app_groups)
     NOT EXISTS (SELECT 1 FROM app_groups ag WHERE ag.app_id = a.id)
     OR
     -- User is in at least one of the app's groups
     EXISTS (
       SELECT 1 FROM app_groups ag
       JOIN user_groups ug ON ag.group_id = ug.group_id
       JOIN users u ON ug.user_id = u.id
       WHERE ag.app_id = a.id AND u.npub = ?
     )
   )
   ORDER BY a.created_at DESC`
);

export function getVisibleAppsForNpub(npub: string): App[] {
  if (!npub) return [];
  return getVisibleAppsForNpubStmt.all(npub);
}

// ============================================
// App by Teleport Pubkey (for external API auth)
// ============================================

const getAppByTeleportPubkeyStmt = db.query<App, [string]>(
  `SELECT * FROM apps WHERE teleport_pubkey = ?`
);

export function getAppByTeleportPubkey(pubkey: string): App | null {
  if (!pubkey) return null;
  const app = getAppByTeleportPubkeyStmt.get(pubkey) as App | undefined;
  return app ?? null;
}

// ============================================
// Invite Code App Codes Functions
// (External app invite codes linked to Welcome invites)
// ============================================

// Get all app codes for an invite code (for admin UI)
const getInviteCodeAppCodesStmt = db.query<InviteCodeAppCode & { app_name: string; app_url: string }, [number]>(
  `SELECT icac.*, a.name as app_name, a.url as app_url
   FROM invite_code_app_codes icac
   JOIN apps a ON icac.app_id = a.id
   WHERE icac.invite_code_id = ?
   ORDER BY a.name ASC`
);

// Get app code for a specific invite code and app
const getInviteCodeAppCodeStmt = db.query<InviteCodeAppCode, [number, number]>(
  `SELECT * FROM invite_code_app_codes WHERE invite_code_id = ? AND app_id = ?`
);

// Get app code for a user's invite code and a specific app (for external API)
const getUserAppInviteCodeStmt = db.query<{ external_code: string }, [string, number]>(
  `SELECT icac.external_code
   FROM invite_code_app_codes icac
   JOIN invite_codes ic ON icac.invite_code_id = ic.id
   JOIN users u ON u.invite_code = ic.code
   WHERE u.npub = ? AND icac.app_id = ?`
);

// Set or update an app code for an invite code
const upsertInviteCodeAppCodeStmt = db.query<InviteCodeAppCode, [number, number, string]>(
  `INSERT INTO invite_code_app_codes (invite_code_id, app_id, external_code)
   VALUES (?, ?, ?)
   ON CONFLICT(invite_code_id, app_id) DO UPDATE SET external_code = excluded.external_code
   RETURNING *`
);

// Delete an app code from an invite code
const deleteInviteCodeAppCodeStmt = db.prepare(
  `DELETE FROM invite_code_app_codes WHERE invite_code_id = ? AND app_id = ?`
);

// Clear all app codes for an invite code
const clearInviteCodeAppCodesStmt = db.prepare(
  `DELETE FROM invite_code_app_codes WHERE invite_code_id = ?`
);

// Get all apps that have teleport_pubkey set (for admin UI dropdown)
const getAppsWithTeleportStmt = db.query<App, []>(
  `SELECT * FROM apps WHERE teleport_pubkey IS NOT NULL AND teleport_pubkey != '' ORDER BY name ASC`
);

export function getInviteCodeAppCodes(inviteCodeId: number): (InviteCodeAppCode & { app_name: string; app_url: string })[] {
  if (!inviteCodeId) return [];
  return getInviteCodeAppCodesStmt.all(inviteCodeId);
}

export function getInviteCodeAppCode(inviteCodeId: number, appId: number): InviteCodeAppCode | null {
  if (!inviteCodeId || !appId) return null;
  const code = getInviteCodeAppCodeStmt.get(inviteCodeId, appId) as InviteCodeAppCode | undefined;
  return code ?? null;
}

export function getUserAppInviteCode(npub: string, appId: number): string | null {
  if (!npub || !appId) return null;
  const result = getUserAppInviteCodeStmt.get(npub, appId) as { external_code: string } | undefined;
  return result?.external_code ?? null;
}

// Get user's welcome message (from their signup invite code)
const getUserWelcomeMessageStmt = db.query<{ welcome_message: string | null }, [string]>(
  `SELECT ic.welcome_message
   FROM invite_codes ic
   JOIN users u ON u.invite_code = ic.code
   WHERE u.npub = ?`
);

// Get all invite codes for a user (from their signup invite code)
const getAllUserAppInviteCodesStmt = db.query<{ app_id: number; app_name: string; external_code: string }, [string]>(
  `SELECT icac.app_id, a.name as app_name, icac.external_code
   FROM invite_code_app_codes icac
   JOIN invite_codes ic ON icac.invite_code_id = ic.id
   JOIN users u ON u.invite_code = ic.code
   JOIN apps a ON icac.app_id = a.id
   WHERE u.npub = ?
   ORDER BY a.name ASC`
);

export function getUserWelcomeMessage(npub: string): string | null {
  if (!npub) return null;
  const result = getUserWelcomeMessageStmt.get(npub) as { welcome_message: string | null } | undefined;
  return result?.welcome_message ?? null;
}

export function getAllUserAppInviteCodes(npub: string): { app_id: number; app_name: string; external_code: string }[] {
  if (!npub) return [];
  return getAllUserAppInviteCodesStmt.all(npub);
}

export function setInviteCodeAppCode(
  inviteCodeId: number,
  appId: number,
  externalCode: string
): InviteCodeAppCode | null {
  if (!inviteCodeId || !appId || !externalCode) return null;
  try {
    const code = upsertInviteCodeAppCodeStmt.get(inviteCodeId, appId, externalCode.trim()) as InviteCodeAppCode | undefined;
    return code ?? null;
  } catch {
    return null;
  }
}

export function deleteInviteCodeAppCode(inviteCodeId: number, appId: number): boolean {
  if (!inviteCodeId || !appId) return false;
  const result = deleteInviteCodeAppCodeStmt.run(inviteCodeId, appId);
  return result.changes > 0;
}

export function clearInviteCodeAppCodes(inviteCodeId: number): boolean {
  if (!inviteCodeId) return false;
  clearInviteCodeAppCodesStmt.run(inviteCodeId);
  return true;
}

export function getAppsWithTeleport(): App[] {
  return getAppsWithTeleportStmt.all();
}
