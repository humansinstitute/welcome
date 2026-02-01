import { nip19, nip44, finalizeEvent, getPublicKey } from "nostr-tools";
import { getTeleportKey, deleteTeleportKey, storeTeleportKey, getVisibleAppsForNpub, getAppById } from "../db.ts";
import { TELEPORT_EXPIRY_SECONDS, WELCOME_PRIVKEY } from "../config.ts";

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

// Helper to decode app's teleport pubkey (npub or hex)
function decodeTeleportPubkey(pubkey: string): string | null {
  if (!pubkey) return null;

  try {
    if (pubkey.startsWith("npub1")) {
      const decoded = nip19.decode(pubkey);
      if (decoded.type === "npub") {
        return decoded.data as string;
      }
    } else if (pubkey.length === 64) {
      return pubkey;
    }
  } catch (err) {
    console.error("Failed to decode teleport pubkey:", err);
  }
  return null;
}

// GET /api/apps - Get visible apps for authenticated users
export async function handleGetPublicApps(req: Request): Promise<Response> {
  try {
    const npub = req.headers.get("X-Npub");
    if (!npub) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Return apps visible to this user based on their group memberships
    const apps = getVisibleAppsForNpub(npub);
    return Response.json({ success: true, apps });
  } catch (err) {
    console.error("Get apps error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/teleport - Store a teleport key and create NIP-44 encrypted blob
export async function handleStoreTeleportKey(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { hashId, encryptedNsec, npub, appId, appPubkey, baseUrl } = body;

    if (!hashId || typeof hashId !== "string") {
      return Response.json(
        { success: false, error: "hashId is required" },
        { status: 400 }
      );
    }

    if (!encryptedNsec || typeof encryptedNsec !== "string") {
      return Response.json(
        { success: false, error: "encryptedNsec is required" },
        { status: 400 }
      );
    }

    if (!npub || typeof npub !== "string") {
      return Response.json(
        { success: false, error: "npub is required" },
        { status: 400 }
      );
    }

    // Determine app pubkey - either from appId lookup or directly from appPubkey
    let appPubkeyHex: string | null = null;

    if (appPubkey && typeof appPubkey === "string") {
      // Direct pubkey provided (for user teleport apps)
      appPubkeyHex = decodeTeleportPubkey(appPubkey);
      if (!appPubkeyHex) {
        return Response.json(
          { success: false, error: "Invalid appPubkey format" },
          { status: 400 }
        );
      }
    } else if (appId && typeof appId === "number") {
      // Lookup from apps table (for admin-managed apps)
      const app = getAppById(appId);
      if (!app || !app.teleport_pubkey) {
        return Response.json(
          { success: false, error: "App not found or teleport not configured" },
          { status: 400 }
        );
      }
      appPubkeyHex = decodeTeleportPubkey(app.teleport_pubkey);
      if (!appPubkeyHex) {
        return Response.json(
          { success: false, error: "Invalid app teleport pubkey" },
          { status: 400 }
        );
      }
    } else {
      return Response.json(
        { success: false, error: "Either appId or appPubkey is required" },
        { status: 400 }
      );
    }

    // Get Welcome's secret key for signing
    const welcomeSecretKey = getWelcomeSecretKey();
    if (!welcomeSecretKey) {
      return Response.json(
        { success: false, error: "Key teleport not configured (missing WELCOME_PRIVKEY)" },
        { status: 503 }
      );
    }

    const expiresAt = Math.floor(Date.now() / 1000) + TELEPORT_EXPIRY_SECONDS;

    // Store the key
    const teleportKey = storeTeleportKey(hashId, encryptedNsec, npub, expiresAt);
    if (!teleportKey) {
      return Response.json(
        { success: false, error: "Failed to store teleport key" },
        { status: 500 }
      );
    }

    // Create the payload for the receiving app (self-contained - no callback needed)
    // encryptedNsec is already encrypted by browser with user's key + throwaway pubkey
    const payload = {
      encryptedNsec,  // Inner-encrypted nsec (browser did: NIP-44(nsec, userKey + throwawayPubkey))
      npub,           // User's public key - needed for inner decryption
      v: 1            // Protocol version
    };

    // Create and sign a Nostr event with the payload
    const unsignedEvent = {
      kind: 21059, // Arbitrary kind for key teleport
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: "" // Will be set after encryption
    };

    // Encrypt the payload using NIP-44 with the app's pubkey
    const conversationKey = nip44.v2.utils.getConversationKey(welcomeSecretKey, appPubkeyHex);
    const encryptedPayload = nip44.v2.encrypt(JSON.stringify(payload), conversationKey);

    unsignedEvent.content = encryptedPayload;

    // Sign the event
    const signedEvent = finalizeEvent(unsignedEvent, welcomeSecretKey);

    // Base64 encode the signed event as the blob
    const blob = btoa(JSON.stringify(signedEvent));

    return Response.json({
      success: true,
      blob,
      expiresAt,
      expiresIn: TELEPORT_EXPIRY_SECONDS
    });
  } catch (err) {
    console.error("Store teleport key error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/keys/:hashId - Retrieve and delete a teleport key (called by receiving app)
export async function handleGetTeleportKey(hashId: string): Promise<Response> {
  try {
    if (!hashId) {
      return Response.json(
        { success: false, error: "hashId is required" },
        { status: 400 }
      );
    }

    const teleportKey = getTeleportKey(hashId);

    if (!teleportKey) {
      return Response.json(
        { success: false, error: "Key not found or expired" },
        { status: 404 }
      );
    }

    // One-time use: delete after retrieval
    deleteTeleportKey(hashId);

    return Response.json({
      success: true,
      encryptedNsec: teleportKey.encrypted_nsec,
      npub: teleportKey.npub
    });
  } catch (err) {
    console.error("Get teleport key error:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
