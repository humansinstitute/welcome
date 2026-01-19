import { join } from "path";
import { PORT, IS_DEV, APP_NAME, PUBLIC_DIR } from "./config.ts";
import { renderWelcomePage } from "./render/welcome.ts";
import { renderAppsPage } from "./render/apps.ts";
import { renderOnboardingPage } from "./render/onboarding.ts";
import { renderAdminPage } from "./render/admin.ts";
import { handleSignup, handleRecover } from "./routes/auth.ts";
import {
  handleGetInviteCodes,
  handleCreateInviteCode,
  handleUpdateInviteCode,
  handleDeleteInviteCode,
  handleToggleInviteCode,
  handleGetApps,
  handleCreateApp,
  handleUpdateApp,
  handleDeleteApp,
  handleToggleApp,
  // Group routes
  handleGetGroups,
  handleCreateGroup,
  handleUpdateGroup,
  handleDeleteGroup,
  handleToggleGroup,
  handleGetGroupUsers,
  handleAddUserToGroup,
  handleRemoveUserFromGroup,
  // Invite code groups
  handleGetInviteCodeGroups,
  handleSetInviteCodeGroups,
  // App groups
  handleGetAppGroups,
  handleSetAppGroups,
  // Invite code app codes
  handleGetInviteCodeAppCodes,
  handleSetInviteCodeAppCode,
  handleDeleteInviteCodeAppCode,
} from "./routes/admin.ts";
import {
  handleStoreTeleportKey,
  handleGetTeleportKey,
  handleGetPublicApps,
} from "./routes/teleport.ts";
import {
  handleGetWelcome,
  handleDismissWelcome,
  handleGetUserInviteCodes,
} from "./routes/welcome.ts";
import { handleGetUserGroups, handleGetUserAppInvite } from "./routes/external.ts";

console.log(`Starting ${APP_NAME}...`);
console.log(`Mode: ${IS_DEV ? "development" : "production"}`);

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Health check
    if (path === "/health") {
      return new Response("OK", { status: 200 });
    }

    // Home/Welcome route
    if (path === "/" && method === "GET") {
      return new Response(renderWelcomePage(), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Apps page
    if (path === "/apps" && method === "GET") {
      return new Response(renderAppsPage(), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Onboarding wizard
    if (path === "/onboarding" && method === "GET") {
      return new Response(renderOnboardingPage(), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Admin page
    if (path === "/admin" && method === "GET") {
      return new Response(renderAdminPage(), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Auth routes
    if (path === "/auth/signup" && method === "POST") {
      return handleSignup(req);
    }

    if (path === "/auth/recover" && method === "POST") {
      return handleRecover(req);
    }

    // Admin routes
    if (path === "/admin/codes" && method === "GET") {
      return handleGetInviteCodes(req);
    }

    if (path === "/admin/codes" && method === "POST") {
      return handleCreateInviteCode(req);
    }

    if (path.startsWith("/admin/codes/") && !path.endsWith("/toggle") && !path.endsWith("/groups") && method === "PUT") {
      const code = decodeURIComponent(path.split("/admin/codes/")[1]);
      return handleUpdateInviteCode(req, code);
    }

    if (path.startsWith("/admin/codes/") && !path.endsWith("/toggle") && !path.endsWith("/groups") && method === "DELETE") {
      const code = decodeURIComponent(path.split("/admin/codes/")[1]);
      return handleDeleteInviteCode(req, code);
    }

    if (path.startsWith("/admin/codes/") && path.endsWith("/toggle") && method === "POST") {
      const code = decodeURIComponent(path.replace("/admin/codes/", "").replace("/toggle", ""));
      return handleToggleInviteCode(req, code);
    }

    // Admin app routes
    if (path === "/admin/apps" && method === "GET") {
      return handleGetApps(req);
    }

    if (path === "/admin/apps" && method === "POST") {
      return handleCreateApp(req);
    }

    if (path.startsWith("/admin/apps/") && path.endsWith("/toggle") && method === "POST") {
      const id = parseInt(path.replace("/admin/apps/", "").replace("/toggle", ""), 10);
      if (!isNaN(id)) {
        return handleToggleApp(req, id);
      }
    }

    if (path.startsWith("/admin/apps/") && !path.endsWith("/groups") && !path.endsWith("/toggle") && method === "PUT") {
      const id = parseInt(path.split("/admin/apps/")[1], 10);
      if (!isNaN(id)) {
        return handleUpdateApp(req, id);
      }
    }

    if (path.startsWith("/admin/apps/") && method === "DELETE") {
      const id = parseInt(path.split("/admin/apps/")[1], 10);
      if (!isNaN(id)) {
        return handleDeleteApp(req, id);
      }
    }

    // Admin group routes
    if (path === "/admin/groups" && method === "GET") {
      return handleGetGroups(req);
    }

    if (path === "/admin/groups" && method === "POST") {
      return handleCreateGroup(req);
    }

    if (path.startsWith("/admin/groups/") && path.endsWith("/toggle") && method === "POST") {
      const id = parseInt(path.replace("/admin/groups/", "").replace("/toggle", ""), 10);
      if (!isNaN(id)) {
        return handleToggleGroup(req, id);
      }
    }

    if (path.startsWith("/admin/groups/") && path.endsWith("/users") && method === "GET") {
      const id = parseInt(path.replace("/admin/groups/", "").replace("/users", ""), 10);
      if (!isNaN(id)) {
        return handleGetGroupUsers(req, id);
      }
    }

    if (path.startsWith("/admin/groups/") && path.endsWith("/users") && method === "POST") {
      const id = parseInt(path.replace("/admin/groups/", "").replace("/users", ""), 10);
      if (!isNaN(id)) {
        return handleAddUserToGroup(req, id);
      }
    }

    // Delete user from group: /admin/groups/:groupId/users/:userId
    const userGroupMatch = path.match(/^\/admin\/groups\/(\d+)\/users\/(\d+)$/);
    if (userGroupMatch && method === "DELETE") {
      const groupId = parseInt(userGroupMatch[1], 10);
      const userId = parseInt(userGroupMatch[2], 10);
      if (!isNaN(groupId) && !isNaN(userId)) {
        return handleRemoveUserFromGroup(req, groupId, userId);
      }
    }

    if (path.startsWith("/admin/groups/") && method === "PUT" && !path.includes("/users")) {
      const id = parseInt(path.split("/admin/groups/")[1], 10);
      if (!isNaN(id)) {
        return handleUpdateGroup(req, id);
      }
    }

    if (path.startsWith("/admin/groups/") && method === "DELETE" && !path.includes("/users")) {
      const id = parseInt(path.split("/admin/groups/")[1], 10);
      if (!isNaN(id)) {
        return handleDeleteGroup(req, id);
      }
    }

    // Invite code groups routes
    if (path.startsWith("/admin/codes/") && path.endsWith("/groups") && method === "GET") {
      const code = decodeURIComponent(path.replace("/admin/codes/", "").replace("/groups", ""));
      return handleGetInviteCodeGroups(req, code);
    }

    if (path.startsWith("/admin/codes/") && path.endsWith("/groups") && method === "PUT") {
      const code = decodeURIComponent(path.replace("/admin/codes/", "").replace("/groups", ""));
      return handleSetInviteCodeGroups(req, code);
    }

    // Invite code app codes routes (external app invite codes)
    if (path.startsWith("/admin/codes/") && path.endsWith("/app-codes") && method === "GET") {
      const code = decodeURIComponent(path.replace("/admin/codes/", "").replace("/app-codes", ""));
      return handleGetInviteCodeAppCodes(req, code);
    }

    if (path.startsWith("/admin/codes/") && path.endsWith("/app-codes") && method === "POST") {
      const code = decodeURIComponent(path.replace("/admin/codes/", "").replace("/app-codes", ""));
      return handleSetInviteCodeAppCode(req, code);
    }

    // Delete app code: /admin/codes/:code/app-codes/:appId
    const appCodeMatch = path.match(/^\/admin\/codes\/([^/]+)\/app-codes\/(\d+)$/);
    if (appCodeMatch && method === "DELETE") {
      const code = decodeURIComponent(appCodeMatch[1]);
      const appId = parseInt(appCodeMatch[2], 10);
      if (!isNaN(appId)) {
        return handleDeleteInviteCodeAppCode(req, code, appId);
      }
    }

    // App groups routes
    if (path.startsWith("/admin/apps/") && path.endsWith("/groups") && method === "GET") {
      const id = parseInt(path.replace("/admin/apps/", "").replace("/groups", ""), 10);
      if (!isNaN(id)) {
        return handleGetAppGroups(req, id);
      }
    }

    if (path.startsWith("/admin/apps/") && path.endsWith("/groups") && method === "PUT") {
      const id = parseInt(path.replace("/admin/apps/", "").replace("/groups", ""), 10);
      if (!isNaN(id)) {
        return handleSetAppGroups(req, id);
      }
    }

    // API routes
    if (path === "/api/apps" && method === "GET") {
      return handleGetPublicApps(req);
    }

    if (path === "/api/welcome" && method === "GET") {
      return handleGetWelcome(req);
    }

    if (path === "/api/welcome/dismiss" && method === "POST") {
      return handleDismissWelcome(req);
    }

    if (path === "/api/user/invite-codes" && method === "GET") {
      return handleGetUserInviteCodes(req);
    }

    // External API - for other apps to query user groups
    if (path === "/api/user/groups" && method === "GET") {
      return handleGetUserGroups(req);
    }

    // External API - for other apps to get linked invite codes
    if (path === "/api/user/app-invite" && method === "GET") {
      return handleGetUserAppInvite(req);
    }

    // Teleport key routes
    if (path === "/api/teleport" && method === "POST") {
      return handleStoreTeleportKey(req);
    }

    if (path === "/api/keys" && method === "GET") {
      // Support query param: /api/keys?id=hashId (for Marginal Gains compatibility)
      const hashId = url.searchParams.get("id");
      if (hashId) {
        return handleGetTeleportKey(hashId);
      }
      return Response.json({ success: false, error: "Missing id parameter" }, { status: 400 });
    }

    if (path.startsWith("/api/keys/") && method === "GET") {
      // Also support path param: /api/keys/:hashId
      const hashId = path.split("/api/keys/")[1];
      if (hashId) {
        return handleGetTeleportKey(hashId);
      }
    }

    // Handle image upload
    if (path === "/upload" && method === "POST") {
      try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
          return Response.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          return Response.json({ success: false, error: "Only images allowed" }, { status: 400 });
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          return Response.json({ success: false, error: "File too large (max 2MB)" }, { status: 400 });
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filepath = join(PUBLIC_DIR, "uploads", filename);

        // Save file
        await Bun.write(filepath, file);

        // Return the URL
        const url = `/uploads/${filename}`;
        return Response.json({ success: true, url });
      } catch (err) {
        console.error("Upload error:", err);
        return Response.json({ success: false, error: "Upload failed" }, { status: 500 });
      }
    }

    // Serve static files from public/
    const staticExts = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico", ".webp", ".css", ".js"];
    const hasStaticExt = staticExts.some(ext => path.toLowerCase().endsWith(ext));

    if (path.startsWith("/uploads/") || hasStaticExt) {
      const filepath = join(PUBLIC_DIR, path);
      const file = Bun.file(filepath);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
