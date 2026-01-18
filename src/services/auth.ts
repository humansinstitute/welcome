import { createUser, getUserByEmail, getUserByNpub } from "../db.ts";
import type { User } from "../types.ts";

// Generate a random salt
export function generateSalt(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("hex");
}

// Hash password with salt using SHA-256 (simple but effective)
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hashBuffer).toString("hex");
}

// Verify password against stored hash
export async function verifyPassword(
  password: string,
  salt: string,
  storedHash: string
): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return hash === storedHash;
}

// Signup a new user
export async function signup(
  email: string,
  npub: string,
  ncryptsec: string,
  password: string,
  inviteCode: string
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  // Check if email already exists
  const existingEmail = getUserByEmail(email);
  if (existingEmail) {
    return { success: false, error: "Email already registered" };
  }

  // Check if npub already exists
  const existingNpub = getUserByNpub(npub);
  if (existingNpub) {
    return { success: false, error: "This key is already registered" };
  }

  // Generate salt and hash password
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  // Create user
  const user = createUser(email, npub, ncryptsec, passwordHash, salt, inviteCode);
  if (!user) {
    return { success: false, error: "Failed to create account" };
  }

  return { success: true, user };
}

// Recover account - verify password and return ncryptsec
export async function recover(
  identifier: string, // email or npub
  password: string
): Promise<{ success: true; ncryptsec: string; npub: string } | { success: false; error: string }> {
  // Try to find user by email or npub
  let user = getUserByEmail(identifier);
  if (!user && identifier.startsWith("npub1")) {
    user = getUserByNpub(identifier);
  }

  if (!user) {
    return { success: false, error: "Account not found" };
  }

  // Verify password
  const valid = await verifyPassword(password, user.salt, user.password_hash);
  if (!valid) {
    return { success: false, error: "Incorrect password" };
  }

  return { success: true, ncryptsec: user.ncryptsec, npub: user.npub };
}
