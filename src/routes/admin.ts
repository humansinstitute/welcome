import { ADMIN_NPUB } from "../config.ts";
import {
  getAllInviteCodes,
  createInviteCode,
  updateInviteCode,
  deleteInviteCode,
  toggleInviteCode,
  getAllApps,
  createApp,
  updateApp,
  deleteApp,
  toggleAppVisibility,
  // Group functions
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  toggleGroup,
  getUsersInGroup,
  addUserToGroup,
  removeUserFromGroup,
  getUserByNpub,
  // Invite code group functions
  getInviteCode,
  getInviteCodeGroups,
  setInviteCodeGroups,
  // App group functions
  getAppById,
  getAppGroups,
  setAppGroups,
  // Invite code app codes functions
  getInviteCodeAppCodes,
  setInviteCodeAppCode,
  deleteInviteCodeAppCode,
  getAppsWithTeleport,
} from "../db.ts";

function isAdmin(npub: string | null): boolean {
  if (!npub || !ADMIN_NPUB) return false;
  return npub === ADMIN_NPUB;
}

export async function handleGetInviteCodes(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const codes = getAllInviteCodes();
    return Response.json({ success: true, codes });
  } catch (err) {
    console.error("Get invite codes error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleCreateInviteCode(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { code, description, maxUses, welcomeMessage } = body;

    if (!code || typeof code !== "string" || code.length < 3) {
      return Response.json(
        { success: false, error: "Code must be at least 3 characters" },
        { status: 400 }
      );
    }

    const inviteCode = createInviteCode(
      code.trim(),
      description?.trim() || null,
      maxUses ? Number(maxUses) : null,
      welcomeMessage?.trim() || null
    );

    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Code already exists" },
        { status: 400 }
      );
    }

    return Response.json({ success: true, code: inviteCode });
  } catch (err) {
    console.error("Create invite code error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleUpdateInviteCode(req: Request, code: string): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { description, maxUses, welcomeMessage } = body;

    const inviteCode = updateInviteCode(
      code,
      description?.trim() || null,
      maxUses ? Number(maxUses) : null,
      welcomeMessage?.trim() || null
    );

    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Code not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, code: inviteCode });
  } catch (err) {
    console.error("Update invite code error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleDeleteInviteCode(req: Request, code: string): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const deleted = deleteInviteCode(code);

    if (!deleted) {
      return Response.json(
        { success: false, error: "Code not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete invite code error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleToggleInviteCode(req: Request, code: string): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { active } = body;

    if (typeof active !== "boolean") {
      return Response.json(
        { success: false, error: "Missing active field" },
        { status: 400 }
      );
    }

    const inviteCode = toggleInviteCode(code, active);

    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Code not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, code: inviteCode });
  } catch (err) {
    console.error("Toggle invite code error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// App management routes

export async function handleGetApps(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const apps = getAllApps();
    return Response.json({ success: true, apps });
  } catch (err) {
    console.error("Get apps error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleCreateApp(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, iconUrl, url, teleportPubkey } = body;

    if (!name || typeof name !== "string" || name.trim().length < 1) {
      return Response.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return Response.json(
        { success: false, error: "Valid URL is required" },
        { status: 400 }
      );
    }

    const app = createApp(
      name.trim(),
      description?.trim() || null,
      iconUrl?.trim() || null,
      url.trim(),
      teleportPubkey?.trim() || null
    );

    if (!app) {
      return Response.json(
        { success: false, error: "Failed to create app" },
        { status: 400 }
      );
    }

    return Response.json({ success: true, app });
  } catch (err) {
    console.error("Create app error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleUpdateApp(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, iconUrl, url, teleportPubkey } = body;

    if (!name || typeof name !== "string" || name.trim().length < 1) {
      return Response.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return Response.json(
        { success: false, error: "Valid URL is required" },
        { status: 400 }
      );
    }

    const app = updateApp(
      id,
      name.trim(),
      description?.trim() || null,
      iconUrl?.trim() || null,
      url.trim(),
      teleportPubkey?.trim() || null
    );

    if (!app) {
      return Response.json(
        { success: false, error: "App not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, app });
  } catch (err) {
    console.error("Update app error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleDeleteApp(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const deleted = deleteApp(id);

    if (!deleted) {
      return Response.json(
        { success: false, error: "App not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete app error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleToggleApp(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { visible } = body;

    if (typeof visible !== "boolean") {
      return Response.json(
        { success: false, error: "Missing visible field" },
        { status: 400 }
      );
    }

    const app = toggleAppVisibility(id, visible);

    if (!app) {
      return Response.json(
        { success: false, error: "App not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, app });
  } catch (err) {
    console.error("Toggle app error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================
// Group management routes
// ============================================

export async function handleGetGroups(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const groups = getAllGroups();
    return Response.json({ success: true, groups });
  } catch (err) {
    console.error("Get groups error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleCreateGroup(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length < 1) {
      return Response.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const group = createGroup(name.trim(), description?.trim() || null);

    if (!group) {
      return Response.json(
        { success: false, error: "Group name already exists" },
        { status: 400 }
      );
    }

    return Response.json({ success: true, group });
  } catch (err) {
    console.error("Create group error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleUpdateGroup(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length < 1) {
      return Response.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const group = updateGroup(id, name.trim(), description?.trim() || null);

    if (!group) {
      return Response.json(
        { success: false, error: "Group not found or name already exists" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, group });
  } catch (err) {
    console.error("Update group error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleDeleteGroup(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const deleted = deleteGroup(id);

    if (!deleted) {
      return Response.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete group error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleToggleGroup(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { active } = body;

    if (typeof active !== "boolean") {
      return Response.json(
        { success: false, error: "Missing active field" },
        { status: 400 }
      );
    }

    const group = toggleGroup(id, active);

    if (!group) {
      return Response.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, group });
  } catch (err) {
    console.error("Toggle group error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get users in a group
export async function handleGetGroupUsers(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const group = getGroupById(id);
    if (!group) {
      return Response.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    const users = getUsersInGroup(id);
    return Response.json({ success: true, users });
  } catch (err) {
    console.error("Get group users error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add user to group (by npub)
export async function handleAddUserToGroup(req: Request, groupId: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userNpub } = body;

    if (!userNpub || typeof userNpub !== "string" || !userNpub.startsWith("npub1")) {
      return Response.json(
        { success: false, error: "Valid npub is required" },
        { status: 400 }
      );
    }

    const group = getGroupById(groupId);
    if (!group) {
      return Response.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    const user = getUserByNpub(userNpub);
    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const added = addUserToGroup(user.id, groupId, "admin");

    if (!added) {
      return Response.json(
        { success: false, error: "User already in group or failed to add" },
        { status: 400 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Add user to group error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove user from group
export async function handleRemoveUserFromGroup(req: Request, groupId: number, userId: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const removed = removeUserFromGroup(userId, groupId);

    if (!removed) {
      return Response.json(
        { success: false, error: "User not in group or not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Remove user from group error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================
// Invite code groups management
// ============================================

export async function handleGetInviteCodeGroups(req: Request, code: string): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const inviteCode = getInviteCode(code);
    console.log("handleGetInviteCodeGroups - code:", code, "inviteCode:", inviteCode);
    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Invite code not found" },
        { status: 404 }
      );
    }

    const groups = getInviteCodeGroups(inviteCode.id);
    console.log("handleGetInviteCodeGroups - inviteCode.id:", inviteCode.id, "groups:", groups);
    return Response.json({ success: true, groups });
  } catch (err) {
    console.error("Get invite code groups error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleSetInviteCodeGroups(req: Request, code: string): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { groupIds } = body;
    console.log("handleSetInviteCodeGroups - code:", code, "groupIds:", groupIds);

    if (!Array.isArray(groupIds)) {
      return Response.json(
        { success: false, error: "groupIds must be an array" },
        { status: 400 }
      );
    }

    const inviteCode = getInviteCode(code);
    console.log("handleSetInviteCodeGroups - inviteCode:", inviteCode);
    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Invite code not found" },
        { status: 404 }
      );
    }

    const success = setInviteCodeGroups(inviteCode.id, groupIds);
    console.log("handleSetInviteCodeGroups - setInviteCodeGroups result:", success);

    if (!success) {
      return Response.json(
        { success: false, error: "Failed to update groups" },
        { status: 500 }
      );
    }

    const groups = getInviteCodeGroups(inviteCode.id);
    return Response.json({ success: true, groups });
  } catch (err) {
    console.error("Set invite code groups error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================
// App groups management
// ============================================

export async function handleGetAppGroups(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const app = getAppById(id);
    if (!app) {
      return Response.json(
        { success: false, error: "App not found" },
        { status: 404 }
      );
    }

    const groups = getAppGroups(id);
    return Response.json({ success: true, groups });
  } catch (err) {
    console.error("Get app groups error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleSetAppGroups(req: Request, id: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { groupIds } = body;

    if (!Array.isArray(groupIds)) {
      return Response.json(
        { success: false, error: "groupIds must be an array" },
        { status: 400 }
      );
    }

    const app = getAppById(id);
    if (!app) {
      return Response.json(
        { success: false, error: "App not found" },
        { status: 404 }
      );
    }

    const success = setAppGroups(id, groupIds);

    if (!success) {
      return Response.json(
        { success: false, error: "Failed to update groups" },
        { status: 500 }
      );
    }

    const groups = getAppGroups(id);
    return Response.json({ success: true, groups });
  } catch (err) {
    console.error("Set app groups error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================
// Invite code app codes management
// (External app invite codes linked to Welcome invites)
// ============================================

// Get all app codes for an invite code
export async function handleGetInviteCodeAppCodes(req: Request, code: string): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const inviteCode = getInviteCode(code);
    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Invite code not found" },
        { status: 404 }
      );
    }

    const appCodes = getInviteCodeAppCodes(inviteCode.id);
    const appsWithTeleport = getAppsWithTeleport();

    return Response.json({
      success: true,
      appCodes,
      apps: appsWithTeleport
    });
  } catch (err) {
    console.error("Get invite code app codes error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Set an app code for an invite code
export async function handleSetInviteCodeAppCode(req: Request, code: string): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { appId, externalCode } = body;

    if (!appId || typeof appId !== "number") {
      return Response.json(
        { success: false, error: "appId is required" },
        { status: 400 }
      );
    }

    if (!externalCode || typeof externalCode !== "string" || externalCode.trim().length < 1) {
      return Response.json(
        { success: false, error: "externalCode is required" },
        { status: 400 }
      );
    }

    const inviteCode = getInviteCode(code);
    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Invite code not found" },
        { status: 404 }
      );
    }

    const result = setInviteCodeAppCode(inviteCode.id, appId, externalCode.trim());

    if (!result) {
      return Response.json(
        { success: false, error: "Failed to set app code" },
        { status: 500 }
      );
    }

    const appCodes = getInviteCodeAppCodes(inviteCode.id);
    return Response.json({ success: true, appCodes });
  } catch (err) {
    console.error("Set invite code app code error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete an app code from an invite code
export async function handleDeleteInviteCodeAppCode(req: Request, code: string, appId: number): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");

    if (!isAdmin(npub)) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const inviteCode = getInviteCode(code);
    if (!inviteCode) {
      return Response.json(
        { success: false, error: "Invite code not found" },
        { status: 404 }
      );
    }

    const deleted = deleteInviteCodeAppCode(inviteCode.id, appId);

    if (!deleted) {
      return Response.json(
        { success: false, error: "App code not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete invite code app code error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
