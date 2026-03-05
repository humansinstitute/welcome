// NIP-46 Browser Signer for Welcome App
import { finalizeEvent, getPublicKey } from 'https://esm.sh/nostr-tools@2.7.2';
import { Relay } from 'https://esm.sh/nostr-tools@2.7.2/relay';
import * as nip44 from 'https://esm.sh/nostr-tools@2.7.2/nip44';
import * as nip04 from 'https://esm.sh/nostr-tools@2.7.2/nip04';

export class BrowserSigner {
  constructor(secretKey, relayUrls) {
    this.secretKey = secretKey;
    this.pubkey = getPublicKey(secretKey);
    this.relayUrls = relayUrls;
    this.relays = new Map();
    this.clients = new Map();
    this.pendingApprovals = [];
    this.authorizedSecrets = new Map();
    this.policy = 'ask';
    this.active = false;
    this.onUpdate = null;
    this._visHandler = null;
    this._seen = new Set();
  }

  async start() {
    if (this.active) return 0;
    let count = 0;
    for (const url of this.relayUrls) {
      if (await this._connectRelay(url)) count++;
    }
    this.active = true;
    this._visHandler = () => {
      if (document.visibilityState === 'visible' && this.active) this._reconnect();
    };
    document.addEventListener('visibilitychange', this._visHandler);
    this.onUpdate?.();
    return count;
  }

  async stop() {
    this.active = false;
    if (this._visHandler) {
      document.removeEventListener('visibilitychange', this._visHandler);
      this._visHandler = null;
    }
    for (const [, r] of this.relays) {
      try { r.close(); } catch {}
    }
    this.relays.clear();
    for (const a of this.pendingApprovals) a.resolve(false);
    this.pendingApprovals = [];
    this.onUpdate?.();
  }

  async _connectRelay(url) {
    try {
      const old = this.relays.get(url);
      if (old) { try { old.close(); } catch {} }
      const relay = await Relay.connect(url);
      this.relays.set(url, relay);
      relay.subscribe(
        [{ kinds: [24133], '#p': [this.pubkey], since: Math.floor(Date.now() / 1000) - 30 }],
        { onevent: (ev) => this._handleEvent(ev) }
      );
      return true;
    } catch (err) {
      console.warn('[Signer] Relay failed:', url, err.message);
      return false;
    }
  }

  async _reconnect() {
    for (const url of this.relayUrls) {
      const r = this.relays.get(url);
      if (!r || !r.connected) await this._connectRelay(url);
    }
    this.onUpdate?.();
  }

  get connectedCount() {
    let n = 0;
    for (const [, r] of this.relays) if (r.connected) n++;
    return n;
  }

  addSession(sessionId, secret) {
    this.authorizedSecrets.set(secret, sessionId);
  }

  removeSession(secret) {
    this.authorizedSecrets.delete(secret);
  }

  getBunkerUri(secret) {
    const parts = this.relayUrls.map(r => 'relay=' + encodeURIComponent(r));
    if (secret) parts.push('secret=' + encodeURIComponent(secret));
    return 'bunker://' + this.pubkey + '?' + parts.join('&');
  }

  async _handleEvent(event) {
    if (event.pubkey === this.pubkey) return;
    if (this._seen.has(event.id)) return;
    this._seen.add(event.id);
    if (this._seen.size > 500) {
      const first = this._seen.values().next().value;
      this._seen.delete(first);
    }
    const age = Math.floor(Date.now() / 1000) - event.created_at;
    if (age > 120) return;

    let decrypted;
    try {
      const ck = nip44.v2.utils.getConversationKey(this.secretKey, event.pubkey);
      decrypted = nip44.v2.decrypt(event.content, ck);
    } catch { return; }

    let request;
    try { request = JSON.parse(decrypted); } catch { return; }
    if (!request.id || !request.method) return;

    try {
      const result = await this._dispatch(event.pubkey, request);
      await this._respond(event.pubkey, request.id, result, null);
    } catch (err) {
      await this._respond(event.pubkey, request.id, null, err.message || 'Error');
    }
  }

  async _dispatch(clientPub, request) {
    const { method, params = [] } = request;

    switch (method) {
      case 'connect': {
        const [targetPub, secret] = params;
        if (targetPub && targetPub !== this.pubkey) throw new Error('Invalid target');
        if (secret && this.authorizedSecrets.has(secret)) {
          this.clients.set(clientPub, {
            authorized: true, lastSeen: Date.now(),
            sessionId: this.authorizedSecrets.get(secret)
          });
          this.onUpdate?.();
          return 'ack';
        }
        const ok = await this._askApproval('connect', clientPub, 'App wants to connect');
        if (!ok) throw new Error('Rejected');
        this.clients.set(clientPub, { authorized: true, lastSeen: Date.now() });
        this.onUpdate?.();
        return 'ack';
      }

      case 'get_public_key':
        return this.pubkey;

      case 'sign_event': {
        this._requireAuth(clientPub);
        const draft = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
        const kind = draft.kind ?? -1;
        const preview = draft.content ? draft.content.slice(0, 60) : '';
        const desc = 'kind ' + kind + (preview ? ': "' + preview + (draft.content.length > 60 ? '...' : '') + '"' : '');

        let ok = false;
        if (this.policy === 'auto-login' && kind === 22242) {
          ok = true;
        } else {
          ok = await this._askApproval('sign', clientPub, desc, draft);
        }
        if (!ok) throw new Error('Rejected');

        const signed = finalizeEvent({
          kind: draft.kind,
          created_at: draft.created_at || Math.floor(Date.now() / 1000),
          tags: draft.tags || [],
          content: draft.content || ''
        }, this.secretKey);

        const c = this.clients.get(clientPub);
        if (c) c.lastSeen = Date.now();
        this.onUpdate?.();
        return JSON.stringify(signed);
      }

      case 'nip04_encrypt': {
        this._requireAuth(clientPub);
        return await nip04.encrypt(this.secretKey, params[0], params[1]);
      }
      case 'nip04_decrypt': {
        this._requireAuth(clientPub);
        return await nip04.decrypt(this.secretKey, params[0], params[1]);
      }
      case 'nip44_encrypt': {
        this._requireAuth(clientPub);
        const ck = nip44.v2.utils.getConversationKey(this.secretKey, params[0]);
        return nip44.v2.encrypt(params[1], ck);
      }
      case 'nip44_decrypt': {
        this._requireAuth(clientPub);
        const ck = nip44.v2.utils.getConversationKey(this.secretKey, params[0]);
        return nip44.v2.decrypt(params[1], ck);
      }
      case 'ping':
        return 'pong';
      default:
        throw new Error('Unsupported: ' + method);
    }
  }

  _requireAuth(pub) {
    if (!this.clients.get(pub)?.authorized) throw new Error('Not authorized');
  }

  _askApproval(type, clientPub, description, draft) {
    return new Promise((resolve) => {
      this.pendingApprovals.push({
        id: crypto.randomUUID(), type, client: clientPub,
        description, draft, resolve, createdAt: Date.now()
      });
      this.onUpdate?.();
    });
  }

  resolveApproval(id, approved) {
    const idx = this.pendingApprovals.findIndex(a => a.id === id);
    if (idx === -1) return;
    const [approval] = this.pendingApprovals.splice(idx, 1);
    approval.resolve(approved);
    this.onUpdate?.();
  }

  async _respond(clientPub, reqId, result, error) {
    const body = error != null
      ? { id: reqId, error }
      : { id: reqId, result };
    const ck = nip44.v2.utils.getConversationKey(this.secretKey, clientPub);
    const encrypted = nip44.v2.encrypt(JSON.stringify(body), ck);
    const event = finalizeEvent({
      kind: 24133,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', clientPub]],
      content: encrypted
    }, this.secretKey);

    const promises = [];
    for (const [, relay] of this.relays) {
      if (relay.connected) {
        promises.push(relay.publish(event).catch(() => {}));
      }
    }
    await Promise.allSettled(promises);
  }
}
