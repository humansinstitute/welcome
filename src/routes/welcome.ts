import { getUserWelcomeInfo, dismissWelcome, getAllUserAppInviteCodes } from "../db.ts";

// GET /api/welcome - Get user's welcome message and dismissed status
export async function handleGetWelcome(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const info = getUserWelcomeInfo(npub);
    if (!info) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      welcomeMessage: info.welcome_message,
      dismissed: info.welcome_dismissed === 1
    });
  } catch (err) {
    console.error("Get welcome error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/welcome/dismiss - Dismiss the welcome message
export async function handleDismissWelcome(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = dismissWelcome(npub);
    if (!user) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Dismiss welcome error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/user/invite-codes - Get user's linked app invite codes
export async function handleGetUserInviteCodes(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const inviteCodes = getAllUserAppInviteCodes(npub);

    return Response.json({
      success: true,
      inviteCodes: inviteCodes.map(ic => ({
        appId: ic.app_id,
        appName: ic.app_name,
        code: ic.external_code
      }))
    });
  } catch (err) {
    console.error("Get user invite codes error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
