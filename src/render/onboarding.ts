import { APP_NAME, NOSTR_RELAYS } from "../config.ts";

export function renderOnboardingPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Set Up Your Profile - ${APP_NAME}</title>
  <style>
    :root {
      --bg: #f8f5f0;
      --surface: #fffcf7;
      --surface-warm: #faf7f2;
      --border: #e8e2d9;
      --border-soft: #efe9e0;
      --muted: #7a7267;
      --text: #3d3833;
      --text-warm: #5c554d;
      --accent: #8b7355;
      --accent-light: #a69076;
      --purple: #7c3aed;
      --purple-light: #8b5cf6;
      --orange: #f97316;
      --success: #6b8f71;
      --error: #b91c1c;
      --shadow-soft: 0 4px 16px rgba(74, 69, 64, 0.08);
      --shadow-warm: 0 8px 24px rgba(74, 69, 64, 0.12);
      --radius-sm: 6px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --font-serif: Georgia, "Times New Roman", serif;
      --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 2rem 1.5rem;
      touch-action: manipulation;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .wizard {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    @media (max-width: 700px) {
      .wizard {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    /* Left side - explanation */
    .wizard-info {
      padding-right: 1rem;
    }

    .wizard-title {
      font-family: var(--font-serif);
      font-size: 2rem;
      font-weight: 400;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      border-left: 4px solid var(--purple);
      padding-left: 1rem;
    }

    .wizard-title span {
      display: block;
    }

    .wizard-title .highlight {
      color: var(--purple);
    }

    .wizard-text {
      color: var(--text-warm);
      line-height: 1.7;
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
    }

    .wizard-text strong {
      color: var(--text);
      font-weight: 500;
    }

    /* Right side - form */
    .wizard-form {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-warm);
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .avatar-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--surface-warm);
      border: 2px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      font-size: 2rem;
      color: var(--muted);
    }

    .avatar-controls {
      flex: 1;
    }

    .avatar-label {
      font-size: 0.875rem;
      color: var(--muted);
      margin-bottom: 0.5rem;
    }

    .avatar-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .avatar-url-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .avatar-url-input {
      flex: 1;
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      font-family: var(--font-body);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      outline: none;
    }

    .avatar-url-input:focus {
      border-color: var(--accent);
    }

    .avatar-url-input::placeholder {
      color: var(--muted);
    }

    .avatar-or {
      font-size: 0.75rem;
      color: var(--muted);
      text-align: center;
    }

    .avatar-upload-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      font-family: var(--font-body);
      background: var(--surface-warm);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      color: var(--text);
      transition: all 0.2s;
      white-space: nowrap;
    }

    .avatar-upload-btn:hover {
      border-color: var(--purple);
      color: var(--purple);
    }

    .avatar-upload-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .avatar-file-input {
      display: none;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .form-label-text {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
    }

    .form-label-hint {
      font-size: 0.75rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      font-family: var(--font-body);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      border-color: var(--accent);
    }

    .form-input::placeholder {
      color: var(--muted);
    }

    .form-note {
      font-size: 0.8rem;
      color: var(--muted);
      margin-top: 0.5rem;
    }

    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      font-size: 0.95rem;
      font-family: var(--font-body);
      font-weight: 500;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--purple);
      color: white;
      flex: 1;
      justify-content: center;
    }

    .btn-primary:hover {
      background: var(--purple-light);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-skip {
      background: transparent;
      color: var(--muted);
      border: 1px solid var(--border);
    }

    .btn-skip:hover {
      border-color: var(--accent);
      color: var(--text);
    }

    .status-message {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
    }

    .status-message.error {
      background: #fef2f2;
      color: var(--error);
      border: 1px solid #fecaca;
    }

    .status-message.success {
      background: #f0fdf4;
      color: var(--success);
      border: 1px solid #bbf7d0;
    }

    [hidden] {
      display: none !important;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="wizard">
      <div class="wizard-info">
        <h1 class="wizard-title">
          <span class="highlight">Present</span>
          <span>Yourself</span>
        </h1>

        <p class="wizard-text">
          Other Stuff uses the Open Nostr network for an ID you control.
        </p>

        <p class="wizard-text">
          A profile usually includes a name and picture, but <strong>it's all optional</strong>. Feel free to stay anonymous or use a nickname — you can always change it later.
        </p>

        <p class="wizard-text">
          <strong>Remember:</strong> online privacy matters. Don't share sensitive personal data.
        </p>
      </div>

      <div class="wizard-form">
        <div class="avatar-section">
          <div class="avatar-preview" id="avatar-preview">
            <span class="avatar-placeholder" id="avatar-placeholder">👤</span>
            <img id="avatar-img" src="" alt="Profile picture" hidden>
          </div>
          <div class="avatar-controls">
            <div class="avatar-label">Your image</div>
            <div class="avatar-input-wrapper">
              <div class="avatar-url-row">
                <input
                  type="url"
                  class="avatar-url-input"
                  id="picture-input"
                  placeholder="Paste image URL"
                >
              </div>
              <div class="avatar-or">or</div>
              <button type="button" class="avatar-upload-btn" id="upload-btn">
                Upload a photo
              </button>
              <input type="file" class="avatar-file-input" id="file-input" accept="image/*">
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-label">
            <span class="form-label-text">Display name</span>
            <span class="form-label-hint">Optional</span>
          </div>
          <input
            type="text"
            class="form-input"
            id="name-input"
            placeholder="Your (nick)name"
            autocomplete="off"
          >
          <p class="form-note">
            The names don't have to be unique — be whoever you want to be.
          </p>
        </div>

        <div id="status-message" class="status-message" hidden></div>

        <div class="form-actions">
          <button class="btn btn-skip" id="btn-skip">
            Skip for now
          </button>
          <button class="btn btn-primary" id="btn-continue">
            Continue →
          </button>
        </div>
      </div>
    </div>
  </div>

  <script type="module">
    import { finalizeEvent, getPublicKey, nip19 } from 'https://esm.sh/nostr-tools@2.7.2';
    import { Relay } from 'https://esm.sh/nostr-tools@2.7.2/relay';
    import Dexie from 'https://esm.sh/dexie@4.0.4';

    // Initialize Dexie database
    const db = new Dexie('OtherStuffDB');
    db.version(3).stores({
      profiles: 'npub, name, about, picture, nip05, updatedAt',
      secrets: 'npub',
      assets: 'url'  // Cached images/assets as blobs
    });

    // Import key from stored format
    async function importKey(keyData) {
      return crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    }

    // Decrypt nsec with AES-GCM
    async function decryptSecret(ciphertext, key, iv) {
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
      );
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    }

    // Load and decrypt nsec from Dexie
    async function loadDecryptedNsec(npub) {
      const stored = await db.secrets.get(npub);
      if (!stored) return null;

      const keyData = sessionStorage.getItem('derivedKey');
      if (!keyData) return null;

      try {
        const key = await importKey(new Uint8Array(JSON.parse(keyData)));
        return await decryptSecret(
          new Uint8Array(stored.ciphertext),
          key,
          new Uint8Array(stored.iv)
        );
      } catch (err) {
        console.warn('Failed to decrypt nsec:', err);
        return null;
      }
    }

    const RELAYS = ${JSON.stringify(NOSTR_RELAYS)};

    const pictureInput = document.getElementById('picture-input');
    const nameInput = document.getElementById('name-input');
    const avatarImg = document.getElementById('avatar-img');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const btnSkip = document.getElementById('btn-skip');
    const btnContinue = document.getElementById('btn-continue');
    const statusMessage = document.getElementById('status-message');

    // Check if logged in
    const npub = sessionStorage.getItem('npub');
    let nsec = sessionStorage.getItem('nsec');  // May be null if using encrypted storage

    if (!npub) {
      window.location.href = '/';
    }

    // Load nsec from encrypted Dexie storage if needed
    (async () => {
      if (!nsec && npub) {
        const decrypted = await loadDecryptedNsec(npub);
        if (decrypted) {
          nsec = decrypted;
        }
      }
    })();

    function showAvatar(url) {
      avatarImg.src = url;
      avatarImg.hidden = false;
      avatarPlaceholder.hidden = true;

      avatarImg.onerror = () => {
        avatarImg.hidden = true;
        avatarPlaceholder.hidden = false;
      };
    }

    function hideAvatar() {
      avatarImg.hidden = true;
      avatarPlaceholder.hidden = false;
    }

    // Preview avatar when URL changes
    pictureInput.addEventListener('input', () => {
      const url = pictureInput.value.trim();
      if (url) {
        showAvatar(url);
      } else {
        hideAvatar();
      }
    });

    // Handle file upload button click
    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;

      // Validate size
      if (file.size > 2 * 1024 * 1024) {
        showStatus('Image too large (max 2MB)', 'error');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (!data.success) {
          showStatus(data.error || 'Upload failed', 'error');
          uploadBtn.disabled = false;
          uploadBtn.textContent = 'Upload a photo';
          return;
        }

        // Set the URL in the input and show preview
        const fullUrl = window.location.origin + data.url;
        pictureInput.value = fullUrl;
        showAvatar(fullUrl);

        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload a photo';

      } catch (err) {
        console.error('Upload error:', err);
        showStatus('Upload failed', 'error');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload a photo';
      }
    });

    function showStatus(message, type = 'error') {
      statusMessage.textContent = message;
      statusMessage.className = 'status-message ' + type;
      statusMessage.hidden = false;
    }

    async function publishProfile(name, picture) {
      if (!nsec) {
        // No secret key (extension login), skip publishing
        return true;
      }

      try {
        const { type, data: secretKey } = nip19.decode(nsec);
        if (type !== 'nsec') throw new Error('Invalid nsec');

        const pubkey = getPublicKey(secretKey);

        // Create kind 0 (metadata) event
        const content = JSON.stringify({
          name: name || '',
          picture: picture || '',
          about: '',
        });

        const event = finalizeEvent({
          kind: 0,
          created_at: Math.floor(Date.now() / 1000),
          tags: [],
          content,
        }, secretKey);

        // Publish to relays
        let published = 0;
        for (const url of RELAYS) {
          try {
            const relay = await Relay.connect(url);
            await relay.publish(event);
            relay.close();
            published++;
          } catch (err) {
            console.warn('Failed to publish to', url, err);
          }
        }

        return published > 0;
      } catch (err) {
        console.error('Failed to publish profile:', err);
        return false;
      }
    }

    btnContinue.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      const picture = pictureInput.value.trim();

      btnContinue.disabled = true;
      btnContinue.textContent = 'Publishing...';

      if (name || picture) {
        const success = await publishProfile(name, picture);
        if (!success) {
          showStatus('Could not publish to relays. You can update your profile later.', 'error');
          // Still continue after a moment
          setTimeout(() => {
            window.location.href = '/apps';
          }, 2000);
          return;
        }

        // Cache the profile data for display in header
        if (picture) {
          sessionStorage.setItem('avatarUrl', picture);
        }
        if (name) {
          sessionStorage.setItem('displayName', name);
        }
      }

      // Mark onboarding complete and go to apps
      sessionStorage.setItem('onboarded', 'true');
      window.location.href = '/apps';
    });

    btnSkip.addEventListener('click', () => {
      sessionStorage.setItem('onboarded', 'true');
      window.location.href = '/apps';
    });
  </script>
</body>
</html>`;
}
