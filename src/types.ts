// Onboarding status for new users
export type OnboardingStatus = "new" | "profile_created" | "relays_connected" | "completed";

// User record in the database
export type User = {
  id: number;
  email: string;
  npub: string;
  ncryptsec: string;
  password_hash: string;
  salt: string;
  invite_code: string;
  onboarding_status: OnboardingStatus;
  display_name: string | null;
  welcome_dismissed: number; // SQLite boolean (0 or 1)
  created_at: string;
  updated_at: string;
};

// App/Team that a user can access
export type App = {
  id: number;
  name: string;
  description: string | null;
  icon_url: string | null;
  url: string;
  teleport_pubkey: string | null; // App's public key for key teleport (npub or hex)
  visible: number; // SQLite boolean (0 or 1) - whether app is shown to users
  created_at: string;
};

// Temporary key storage for key teleport
export type TeleportKey = {
  id: number;
  hash_id: string;
  encrypted_nsec: string;  // NIP-44 encrypted nsec (was ncryptsec)
  npub: string;            // User's public key for decryption
  expires_at: number;      // Unix timestamp
  created_at: string;
};

// User's membership in an app
export type UserApp = {
  id: number;
  user_id: number;
  app_id: number;
  role: string;
  joined_at: string;
};

// Invite code for signup
export type InviteCode = {
  id: number;
  code: string;
  description: string | null;
  max_uses: number | null;
  uses: number;
  active: number; // SQLite boolean (0 or 1)
  welcome_message: string | null; // Markdown welcome message for users
  created_at: string;
};

// Group for organizing users and controlling app access
export type Group = {
  id: number;
  name: string;
  description: string | null;
  active: number; // SQLite boolean (0 or 1)
  created_at: string;
};

// User's membership in a group
export type UserGroup = {
  id: number;
  user_id: number;
  group_id: number;
  source: "admin" | "invite_code";
  source_code: string | null; // invite code if source='invite_code'
  assigned_at: string;
};

// Invite code's group associations
export type InviteCodeGroup = {
  id: number;
  invite_code_id: number;
  group_id: number;
  created_at: string;
};

// App's group restrictions
export type AppGroup = {
  id: number;
  app_id: number;
  group_id: number;
  created_at: string;
};

// Extended type for API responses - group with user info
export type UserGroupInfo = {
  group_id: number;
  group_name: string;
  source: "admin" | "invite_code";
  assigned_at: string;
};

// External app invite code linked to a Welcome invite code
// When a user signs up with a Welcome invite, this links them to an app-specific invite code
export type InviteCodeAppCode = {
  id: number;
  invite_code_id: number;
  app_id: number;
  external_code: string; // The app's invite code (e.g., MG's "XXXX-XXXX-XXXX")
  created_at: string;
};
