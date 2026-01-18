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
