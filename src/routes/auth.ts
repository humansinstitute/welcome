import { nip19, nip44, getPublicKey } from "nostr-tools";
import { signup, recover } from "../services/auth.ts";
import { ADMIN_NPUB, WELCOME_PRIVKEY } from "../config.ts";
import {
  isValidInviteCode,
  useInviteCode,
  getGroupsForInviteCode,
  addUserToGroup,
  getUserByNpub,
  createExtensionUser,
  setTeleportVaultKey,
  getTeleportVaultKey,
  deleteTeleportVaultKey,
} from "../db.ts";

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function getWelcomeSecretKey(): Uint8Array | null {
  if (!WELCOME_PRIVKEY) return null;
  try {
    if (WELCOME_PRIVKEY.startsWith("nsec1")) {
      const decoded = nip19.decode(WELCOME_PRIVKEY);
      if (decoded.type === "nsec") return decoded.data as Uint8Array;
      return null;
    }
    if (WELCOME_PRIVKEY.length === 64) {
      return hexToBytes(WELCOME_PRIVKEY);
    }
  } catch (err) {
    console.error("Failed to decode WELCOME_PRIVKEY:", err);
  }
  return null;
}

function decodeNpubToHex(npub: string): string | null {
  try {
    const decoded = nip19.decode(npub);
    if (decoded.type !== "npub") return null;
    return decoded.data as string;
  } catch {
    return null;
  }
}

export async function handleSignup(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { email, npub, ncryptsec, password, inviteCode } = body;

    // Validate required fields
    if (!email || !npub || !ncryptsec || !password || !inviteCode) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate invite code from database
    if (!isValidInviteCode(inviteCode)) {
      return Response.json(
        { success: false, error: "Invalid invite code" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes("@")) {
      return Response.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate npub format
    if (!npub.startsWith("npub1")) {
      return Response.json(
        { success: false, error: "Invalid npub format" },
        { status: 400 }
      );
    }

    // Validate ncryptsec format
    if (!ncryptsec.startsWith("ncryptsec1")) {
      return Response.json(
        { success: false, error: "Invalid encrypted key format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return Response.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const result = await signup(email, npub, ncryptsec, password, inviteCode);

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Increment invite code usage
    useInviteCode(inviteCode);

    // Add user to groups linked to this invite code
    const linkedGroups = getGroupsForInviteCode(inviteCode);
    for (const group of linkedGroups) {
      addUserToGroup(result.user.id, group.id, "invite_code", inviteCode);
    }

    return Response.json({
      success: true,
      npub: result.user.npub,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleRecover(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    // Validate required fields
    if (!identifier || !password) {
      return Response.json(
        { success: false, error: "Missing email/npub or password" },
        { status: 400 }
      );
    }

    const result = await recover(identifier, password);

    if (!result.success) {
      return Response.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      ncryptsec: result.ncryptsec,
      npub: result.npub,
    });
  } catch (err) {
    console.error("Recover error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Extension login - handles admin bypass, existing users, and new users with invite codes
export async function handleExtensionLogin(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { npub, inviteCode } = body;

    // Validate npub
    if (!npub || !npub.startsWith("npub1")) {
      return Response.json(
        { success: false, error: "Invalid npub format" },
        { status: 400 }
      );
    }

    // 1. Check if admin - bypass everything
    if (ADMIN_NPUB && npub === ADMIN_NPUB) {
      return Response.json({
        success: true,
        isAdmin: true,
        isNew: false,
      });
    }

    // 2. Check if user already exists
    const existingUser = getUserByNpub(npub);
    if (existingUser) {
      return Response.json({
        success: true,
        isAdmin: false,
        isNew: false,
      });
    }

    // 3. New user - require valid invite code
    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Invite code required for new users" },
        { status: 400 }
      );
    }

    if (!isValidInviteCode(inviteCode)) {
      return Response.json(
        { success: false, error: "Invalid invite code" },
        { status: 400 }
      );
    }

    // Create extension user
    const newUser = createExtensionUser(npub, inviteCode);
    if (!newUser) {
      return Response.json(
        { success: false, error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Increment invite code usage
    useInviteCode(inviteCode);

    // Add user to groups linked to this invite code
    const linkedGroups = getGroupsForInviteCode(inviteCode);
    for (const group of linkedGroups) {
      addUserToGroup(newUser.id, group.id, "invite_code", inviteCode);
    }

    return Response.json({
      success: true,
      isAdmin: false,
      isNew: true,
    });
  } catch (err) {
    console.error("Extension login error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /auth/teleport-key - Check if user has a stored teleport key
export async function handleGetTeleportKeyStatus(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub || !npub.startsWith("npub1")) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const encrypted = getTeleportVaultKey(npub);
    return Response.json({
      success: true,
      hasTeleportKey: !!encrypted,
      mode: "nip44",
    });
  } catch (err) {
    console.error("Teleport key status error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /auth/teleport-key - Store user's NIP-44 encrypted teleport key
export async function handleStoreTeleportKeyMaterial(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub || !npub.startsWith("npub1")) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { encryptedNsecNip44 } = body;

    if (!encryptedNsecNip44 || typeof encryptedNsecNip44 !== "string") {
      return Response.json(
        { success: false, error: "encryptedNsecNip44 is required" },
        { status: 400 }
      );
    }

    const welcomeSecretKey = getWelcomeSecretKey();
    if (!welcomeSecretKey) {
      return Response.json(
        { success: false, error: "Key teleport not configured (missing WELCOME_PRIVKEY)" },
        { status: 503 }
      );
    }

    const userPubkeyHex = decodeNpubToHex(npub);
    if (!userPubkeyHex) {
      return Response.json(
        { success: false, error: "Invalid npub format" },
        { status: 400 }
      );
    }

    // Validate ciphertext by decrypting and confirming key ownership.
    const conversationKey = nip44.v2.utils.getConversationKey(welcomeSecretKey, userPubkeyHex);
    let decryptedNsec: string;
    try {
      decryptedNsec = nip44.v2.decrypt(encryptedNsecNip44, conversationKey);
    } catch {
      return Response.json(
        { success: false, error: "Invalid NIP-44 encrypted key payload" },
        { status: 400 }
      );
    }

    try {
      const decoded = nip19.decode(decryptedNsec);
      if (decoded.type !== "nsec") {
        return Response.json(
          { success: false, error: "Decrypted key is not a valid nsec" },
          { status: 400 }
        );
      }

      const derivedNpub = nip19.npubEncode(getPublicKey(decoded.data as Uint8Array));
      if (derivedNpub !== npub) {
        return Response.json(
          { success: false, error: "Key does not match signed-in account" },
          { status: 400 }
        );
      }
    } catch {
      return Response.json(
        { success: false, error: "Invalid key format after decrypt" },
        { status: 400 }
      );
    }

    const saved = setTeleportVaultKey(npub, encryptedNsecNip44);
    if (!saved) {
      return Response.json(
        { success: false, error: "Failed to store teleport key" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, hasTeleportKey: true });
  } catch (err) {
    console.error("Store teleport key error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /auth/teleport-key - Remove stored teleport key
export async function handleDeleteTeleportKeyMaterial(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub || !npub.startsWith("npub1")) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    deleteTeleportVaultKey(npub);

    return Response.json({ success: true, hasTeleportKey: false });
  } catch (err) {
    console.error("Delete teleport key error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
