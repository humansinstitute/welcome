import { nip19, nip44, verifyEvent, getPublicKey } from "nostr-tools";
import { WELCOME_PRIVKEY } from "../config.ts";
import {
  getUserTeleportApps,
  getUserTeleportAppByPubkey,
  createUserTeleportApp,
  deleteUserTeleportApp,
} from "../db.ts";

// Custom kind for KeyTeleport app registration (free kind range)
export const KEYTELEPORT_APP_REGISTRATION_KIND = 30078;

// Helper to convert hex string to Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Helper to get Welcome's secret key from config
function getWelcomeSecretKey(): Uint8Array | null {
  if (!WELCOME_PRIVKEY) return null;

  try {
    if (WELCOME_PRIVKEY.startsWith("nsec1")) {
      const decoded = nip19.decode(WELCOME_PRIVKEY);
      if (decoded.type === "nsec") {
        return decoded.data as Uint8Array;
      }
    } else if (WELCOME_PRIVKEY.length === 64) {
      return hexToBytes(WELCOME_PRIVKEY);
    }
  } catch (err) {
    console.error("Failed to decode WELCOME_PRIVKEY:", err);
  }
  return null;
}

// Helper to get Welcome's public key as npub
export function getWelcomeNpub(): string | null {
  const secretKey = getWelcomeSecretKey();
  if (!secretKey) return null;

  try {
    const pubkeyHex = getPublicKey(secretKey);
    return nip19.npubEncode(pubkeyHex);
  } catch (err) {
    console.error("Failed to get Welcome npub:", err);
    return null;
  }
}

// Type for the decoded app registration content
interface AppRegistrationContent {
  url: string;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// Type for verification result
interface VerifyResult {
  success: boolean;
  error?: string;
  appPubkey?: string;
  appNpub?: string;
  url?: string;
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// POST /api/teleport/verify-app - Verify and decode an app registration blob
export async function handleVerifyAppBlob(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { blob } = body;

    if (!blob || typeof blob !== "string") {
      return Response.json(
        { success: false, error: "blob is required" },
        { status: 400 }
      );
    }

    // Decode base64 blob
    let eventJson: string;
    try {
      eventJson = atob(blob);
    } catch {
      return Response.json(
        { success: false, error: "Invalid blob format (not valid base64)" },
        { status: 400 }
      );
    }

    // Parse as Nostr event
    let event: {
      kind: number;
      pubkey: string;
      created_at: number;
      tags: string[][];
      content: string;
      sig: string;
      id?: string;
    };
    try {
      event = JSON.parse(eventJson);
    } catch {
      return Response.json(
        { success: false, error: "Invalid blob format (not valid JSON)" },
        { status: 400 }
      );
    }

    // Validate event structure
    if (!event.pubkey || !event.content || !event.sig) {
      return Response.json(
        { success: false, error: "Invalid event structure (missing required fields)" },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValid = verifyEvent(event as Parameters<typeof verifyEvent>[0]);
    if (!isValid) {
      return Response.json(
        { success: false, error: "Invalid signature - app identity could not be verified" },
        { status: 400 }
      );
    }

    // Parse content directly (plaintext - no encryption needed for public app info)
    // The signature already proves this came from the app's keypair
    let content: AppRegistrationContent;
    try {
      content = JSON.parse(event.content);
    } catch {
      return Response.json(
        { success: false, error: "Invalid content (not valid JSON)" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!content.url || typeof content.url !== "string") {
      return Response.json(
        { success: false, error: "Missing or invalid 'url' in app registration" },
        { status: 400 }
      );
    }

    if (!content.name || typeof content.name !== "string") {
      return Response.json(
        { success: false, error: "Missing or invalid 'name' in app registration" },
        { status: 400 }
      );
    }

    // Convert pubkey to npub for display
    const appNpub = nip19.npubEncode(event.pubkey);

    const result: VerifyResult = {
      success: true,
      appPubkey: event.pubkey,
      appNpub,
      url: content.url,
      name: content.name,
      description: content.description || undefined,
      metadata: content.metadata || {},
    };

    return Response.json(result);
  } catch (err) {
    console.error("Verify app blob error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/teleport/add-app - Add a verified app to user's teleport destinations
export async function handleAddUserTeleportApp(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { appPubkey, url, name, description, metadata } = body;

    if (!appPubkey || typeof appPubkey !== "string") {
      return Response.json(
        { success: false, error: "appPubkey is required" },
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string") {
      return Response.json(
        { success: false, error: "url is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return Response.json(
        { success: false, error: "name is required" },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = getUserTeleportAppByPubkey(npub, appPubkey);
    if (existing) {
      return Response.json(
        { success: false, error: "App already added" },
        { status: 409 }
      );
    }

    // Create the app
    const metadataStr = metadata ? JSON.stringify(metadata) : "{}";
    const app = createUserTeleportApp(
      npub,
      appPubkey,
      url,
      name,
      description || null,
      metadataStr
    );

    if (!app) {
      return Response.json(
        { success: false, error: "Failed to add app" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, app });
  } catch (err) {
    console.error("Add user teleport app error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/user/teleport-apps - Get user's teleport apps
export async function handleGetUserTeleportApps(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const apps = getUserTeleportApps(npub);
    return Response.json({ success: true, apps });
  } catch (err) {
    console.error("Get user teleport apps error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/teleport-apps/:id - Delete a user's teleport app
export async function handleDeleteUserTeleportApp(
  req: Request,
  id: number
): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const deleted = deleteUserTeleportApp(id, npub);
    if (!deleted) {
      return Response.json(
        { success: false, error: "App not found or not owned by user" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete user teleport app error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/teleport/welcome-pubkey - Get Welcome's public key for app registration
export async function handleGetWelcomePubkey(): Promise<Response> {
  const welcomeNpub = getWelcomeNpub();
  if (!welcomeNpub) {
    return Response.json(
      { success: false, error: "Key teleport not configured" },
      { status: 503 }
    );
  }

  return Response.json({
    success: true,
    npub: welcomeNpub,
  });
}
