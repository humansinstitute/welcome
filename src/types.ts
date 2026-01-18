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
  created_at: string;
};

// Temporary key storage for key teleport
export type TeleportKey = {
  id: number;
  hash_id: string;
  ncryptsec: string;
  expires_at: number; // Unix timestamp
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
  created_at: string;
};
