import { verifyEvent, nip19 } from "nostr-tools";
import { getUserGroupsByNpub, getAppByTeleportPubkey, getUserAppInviteCode, getUserWelcomeMessage } from "../db.ts";

/**
 * NIP-98 Authentication Validation
 *
 * External apps authenticate by sending a signed Nostr event (kind 27235)
 * in the Authorization header as "Nostr <base64-encoded-event>"
 *
 * The event must include:
 * - kind: 27235
 * - u tag: the full URL being requested
 * - method tag: the HTTP method (GET, POST, etc)
 * - created_at: within 60 seconds of current time
 */

interface Nip98ValidationResult {
  valid: boolean;
  pubkey?: string;
  error?: string;
}

function validateNip98Auth(
  authHeader: string,
  expectedUrl: string,
  expectedMethod: string
): Nip98ValidationResult {
  try {
    // Extract base64 from "Nostr <base64>"
    if (!authHeader.startsWith("Nostr ")) {
      return { valid: false, error: "Invalid authorization scheme. Expected 'Nostr <base64>'" };
    }

    const base64 = authHeader.slice(6);
    let eventJson: string;

    try {
      eventJson = atob(base64);
    } catch {
      return { valid: false, error: "Invalid base64 encoding" };
    }

    let event;
    try {
      event = JSON.parse(eventJson);
    } catch {
      return { valid: false, error: "Invalid JSON in authorization" };
    }

    // Validate kind
    if (event.kind !== 27235) {
      return { valid: false, error: "Invalid event kind. Expected 27235 (NIP-98)" };
    }

    // Validate timestamp (within 60 seconds)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - event.created_at) > 60) {
      return { valid: false, error: "Event timestamp too old or too far in future" };
    }

    // Validate URL tag (normalize protocol for reverse proxy compatibility)
    const urlTag = event.tags?.find((t: string[]) => t[0] === "u");
    if (!urlTag) {
      return { valid: false, error: "Missing URL tag in authorization" };
    }

    // Normalize URLs by removing protocol for comparison (handles http vs https behind proxy)
    const normalizeUrl = (url: string) => url.replace(/^https?:\/\//, "");
    const signedUrl = normalizeUrl(urlTag[1]);
    const requestUrl = normalizeUrl(expectedUrl);

    if (signedUrl !== requestUrl) {
      console.log("[NIP-98] URL mismatch - signed:", urlTag[1], "expected:", expectedUrl);
      return { valid: false, error: "URL mismatch in authorization" };
    }

    // Validate method tag
    const methodTag = event.tags?.find((t: string[]) => t[0] === "method");
    if (!methodTag || methodTag[1].toUpperCase() !== expectedMethod.toUpperCase()) {
      return { valid: false, error: "Method mismatch in authorization" };
    }

    // Verify signature
    if (!verifyEvent(event)) {
      return { valid: false, error: "Invalid event signature" };
    }

    return { valid: true, pubkey: event.pubkey };
  } catch (err) {
    console.error("NIP-98 validation error:", err);
    return { valid: false, error: "Failed to validate authorization" };
  }
}

/**
 * GET /api/user/groups?npub=npub1...
 *
 * External apps can query a user's groups with NIP-98 authentication.
 * Only apps with a registered teleport_pubkey can access this endpoint.
 *
 * Request:
 *   GET /api/user/groups?npub=npub1abc...
 *   Authorization: Nostr <base64-encoded-signed-event>
 *
 * Response:
 *   { success: true, npub: "...", groups: [{ id, name, assigned_at }] }
 */
export async function handleGetUserGroups(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const npub = url.searchParams.get("npub");

    if (!npub) {
      return Response.json(
        { success: false, error: "npub parameter is required" },
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

    // Validate NIP-98 auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return Response.json(
        { success: false, error: "Authorization header required. Use NIP-98 authentication." },
        { status: 401 }
      );
    }

    const fullUrl = url.href;
    const validation = validateNip98Auth(authHeader, fullUrl, "GET");

    if (!validation.valid) {
      return Response.json(
        { success: false, error: validation.error },
        { status: 401 }
      );
    }

    // Check if signing pubkey belongs to a registered app
    // Try both hex format and npub format
    let app = getAppByTeleportPubkey(validation.pubkey!);

    // Also try npub format in case app stored it that way
    if (!app) {
      try {
        const npubFormat = nip19.npubEncode(validation.pubkey!);
        app = getAppByTeleportPubkey(npubFormat);
      } catch {
        // Ignore conversion errors
      }
    }

    if (!app) {
      return Response.json(
        { success: false, error: "Unauthorized: App not registered or missing teleport_pubkey" },
        { status: 403 }
      );
    }

    // Get user's groups
    const groups = getUserGroupsByNpub(npub);

    return Response.json({
      success: true,
      npub,
      groups: groups.map(g => ({
        id: g.group_id,
        name: g.group_name,
        assigned_at: g.assigned_at
      }))
    });
  } catch (err) {
    console.error("Get user groups error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/app-invite?npub=npub1...
 *
 * External apps can query the linked invite code for a user.
 * The app is identified by its NIP-98 signing key (teleport_pubkey).
 * Returns the external invite code that was linked to the user's Welcome invite code.
 *
 * Request:
 *   GET /api/user/app-invite?npub=npub1abc...
 *   Authorization: Nostr <base64-encoded-signed-event>
 *
 * Response:
 *   { success: true, npub: "...", invite_code: "XXXX-XXXX-XXXX", app_id: 1 }
 *   or { success: true, npub: "...", invite_code: null } if no code linked
 */
export async function handleGetUserAppInvite(req: Request): Promise<Response> {
  console.log("[External API] handleGetUserAppInvite called");
  try {
    const url = new URL(req.url);
    const npub = url.searchParams.get("npub");
    console.log("[External API] npub:", npub?.slice(0, 20) + "...");

    if (!npub) {
      return Response.json(
        { success: false, error: "npub parameter is required" },
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

    // Validate NIP-98 auth
    const authHeader = req.headers.get("Authorization");
    console.log("[External API] Auth header present:", !!authHeader);
    if (!authHeader) {
      console.log("[External API] No auth header, returning 401");
      return Response.json(
        { success: false, error: "Authorization header required. Use NIP-98 authentication." },
        { status: 401 }
      );
    }

    const fullUrl = url.href;
    console.log("[External API] Validating NIP-98 for URL:", fullUrl);
    const validation = validateNip98Auth(authHeader, fullUrl, "GET");

    if (!validation.valid) {
      console.log("[External API] NIP-98 validation failed:", validation.error);
      return Response.json(
        { success: false, error: validation.error },
        { status: 401 }
      );
    }
    console.log("[External API] NIP-98 valid, pubkey:", validation.pubkey?.slice(0, 16) + "...");

    // Check if signing pubkey belongs to a registered app
    let app = getAppByTeleportPubkey(validation.pubkey!);
    console.log("[External API] App lookup by hex pubkey:", app ? app.name : "not found");

    // Also try npub format in case app stored it that way
    if (!app) {
      try {
        const npubFormat = nip19.npubEncode(validation.pubkey!);
        console.log("[External API] Trying npub format:", npubFormat.slice(0, 20) + "...");
        app = getAppByTeleportPubkey(npubFormat);
        console.log("[External API] App lookup by npub:", app ? app.name : "not found");
      } catch {
        // Ignore conversion errors
      }
    }

    if (!app) {
      console.log("[External API] No app found for pubkey, returning 403");
      return Response.json(
        { success: false, error: "Unauthorized: App not registered or missing teleport_pubkey" },
        { status: 403 }
      );
    }

    // Get the linked invite code for this user and app
    console.log("[External API] Looking up invite code for user and app:", app.id);
    const inviteCode = getUserAppInviteCode(npub, app.id);
    console.log("[External API] Found invite code:", inviteCode ? "yes" : "no");

    // Also get the user's welcome message as a fallback for parsing invite codes
    const welcomeMessage = getUserWelcomeMessage(npub);
    console.log("[External API] Welcome message present:", !!welcomeMessage);

    return Response.json({
      success: true,
      npub,
      invite_code: inviteCode,
      welcome_message: welcomeMessage,
      app_id: app.id
    });
  } catch (err) {
    console.error("Get user app invite error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
