import { signup, recover } from "../services/auth.ts";
import { ADMIN_NPUB } from "../config.ts";
import {
  isValidInviteCode,
  useInviteCode,
  getGroupsForInviteCode,
  addUserToGroup,
  getUserByNpub,
  createExtensionUser,
} from "../db.ts";

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
