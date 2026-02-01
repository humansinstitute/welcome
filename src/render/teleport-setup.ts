import { APP_NAME, NOSTR_RELAYS } from "../config.ts";

export function renderTeleportSetupPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Add Your App - ${APP_NAME}</title>
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
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: var(--text);
      min-height: 100vh;
      margin: 0;
      padding: 0;
      touch-action: manipulation;
      transition: background-image 0.3s ease;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: var(--surface);
      min-height: 100vh;
      padding: 1.5rem 2rem;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-soft);
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      font-weight: 400;
    }

    .back-link {
      color: var(--purple);
      text-decoration: none;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .back-link:hover {
      color: var(--purple-light);
    }

    /* Wizard Steps */
    .wizard-progress {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .wizard-step {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 500;
      background: var(--surface-warm);
      border: 2px solid var(--border);
      color: var(--muted);
      transition: all 0.2s;
    }

    .wizard-step.active {
      background: var(--purple);
      border-color: var(--purple);
      color: white;
    }

    .wizard-step.completed {
      background: var(--success);
      border-color: var(--success);
      color: white;
    }

    .wizard-connector {
      width: 2rem;
      height: 2px;
      background: var(--border);
      align-self: center;
    }

    .wizard-connector.completed {
      background: var(--success);
    }

    /* Cards */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-soft);
    }

    .card h2 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .card p {
      color: var(--text-warm);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .card p:last-child {
      margin-bottom: 0;
    }

    /* Instructions */
    .instructions {
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .instructions ol {
      margin: 0;
      padding-left: 1.25rem;
      color: var(--text-warm);
    }

    .instructions li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }

    .instructions li:last-child {
      margin-bottom: 0;
    }

    /* Pubkey display */
    .pubkey-display {
      background: var(--surface-warm);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-bottom: 1rem;
      word-break: break-all;
      font-family: monospace;
      font-size: 0.85rem;
      color: var(--text);
    }

    /* Form elements */
    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text);
    }

    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      font-size: 16px;
      font-family: monospace;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      resize: vertical;
      min-height: 120px;
    }

    .form-group textarea:focus {
      outline: none;
      border-color: var(--purple);
    }

    .form-group textarea::placeholder {
      color: var(--muted);
    }

    /* Buttons */
    .btn {
      padding: 0.75rem 1.25rem;
      font-size: 0.95rem;
      font-family: var(--font-body);
      font-weight: 500;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--purple);
      color: white;
      width: 100%;
    }

    .btn-primary:hover {
      background: var(--purple-light);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      border-color: var(--accent);
    }

    .btn-copy {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    /* Action buttons row */
    .actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .actions .btn {
      flex: 1;
    }

    /* App preview card */
    .app-preview {
      background: var(--surface-warm);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .app-preview-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .app-preview-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: var(--purple);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .app-preview-info {
      flex: 1;
      min-width: 0;
    }

    .app-preview-name {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }

    .app-preview-url {
      font-size: 0.85rem;
      color: var(--muted);
      word-break: break-all;
    }

    .app-preview-description {
      color: var(--text-warm);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    .app-preview-pubkey {
      font-size: 0.75rem;
      color: var(--muted);
      font-family: monospace;
      word-break: break-all;
      padding: 0.5rem;
      background: var(--surface);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-soft);
    }

    /* Status messages */
    .status {
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .status.success {
      background: #f0fdf4;
      color: var(--success);
      border: 1px solid #bbf7d0;
    }

    .status.error {
      background: #fef2f2;
      color: var(--error);
      border: 1px solid #fecaca;
    }

    .status[hidden] {
      display: none;
    }

    /* Step sections */
    .step-section {
      display: none;
    }

    .step-section.active {
      display: block;
    }

    [hidden] {
      display: none !important;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="page-header">
      <h1>Add Your App</h1>
      <a href="/apps" class="back-link">&larr; Back to Apps</a>
    </header>

    <!-- Wizard Progress -->
    <div class="wizard-progress">
      <div class="wizard-step active" id="step-indicator-1">1</div>
      <div class="wizard-connector" id="connector-1"></div>
      <div class="wizard-step" id="step-indicator-2">2</div>
    </div>

    <!-- Step 1: Paste Blob -->
    <div class="step-section active" id="step-1">
      <div class="card">
        <h2>Step 1: Paste the Registration Blob</h2>
        <p>Get the registration blob from your app and paste it below. We'll verify the signature and extract the app details.</p>

        <div class="instructions">
          <ol>
            <li>Go to your app and find the Key Teleport setup option</li>
            <li>Click to generate and copy the registration blob</li>
            <li>Paste the blob below</li>
          </ol>
        </div>

        <div class="form-group">
          <label for="blob-input">Registration Blob</label>
          <textarea
            id="blob-input"
            placeholder="Paste the base64 encoded blob from your app here..."
          ></textarea>
        </div>

        <div class="status" id="step1-status" hidden></div>

        <div class="actions">
          <button class="btn btn-primary" id="step1-verify">Verify Blob</button>
        </div>
      </div>
    </div>

    <!-- Step 2: Confirm -->
    <div class="step-section" id="step-2">
      <div class="card">
        <h2>Step 2: Confirm App Details</h2>
        <p>We've verified the registration. Please confirm these details are correct:</p>

        <div class="app-preview">
          <div class="app-preview-header">
            <div class="app-preview-icon" id="preview-icon">A</div>
            <div class="app-preview-info">
              <div class="app-preview-name" id="preview-name">App Name</div>
              <div class="app-preview-url" id="preview-url">https://example.com</div>
            </div>
          </div>
          <div class="app-preview-description" id="preview-description"></div>
          <div class="app-preview-pubkey" id="preview-pubkey">npub1...</div>
        </div>

        <div class="status" id="step2-status" hidden></div>

        <div class="actions">
          <button class="btn btn-secondary" id="step2-back">&larr; Back</button>
          <button class="btn btn-primary" id="step2-confirm">Add App</button>
        </div>
      </div>
    </div>

    <!-- Success State -->
    <div class="step-section" id="step-success">
      <div class="card">
        <h2>App Added Successfully!</h2>
        <p>Your app has been added to your Key Teleport destinations. You can now teleport your identity to this app from the Apps page.</p>

        <div class="actions">
          <a href="/apps" class="btn btn-primary">Go to Apps &rarr;</a>
        </div>
      </div>
    </div>
  </div>

  <script type="module">
    import Dexie from 'https://esm.sh/dexie@4.0.4';

    // Initialize Dexie database
    const db = new Dexie('OtherStuffDB');
    db.version(3).stores({
      profiles: 'npub, name, about, picture, nip05, updatedAt',
      secrets: 'npub',
      assets: 'url'
    });

    // Background image caching
    async function loadCachedBackground() {
      const BG_URL = '/bg.jpg';
      try {
        const cached = await db.assets.get(BG_URL);
        if (cached && cached.blob) {
          const objectUrl = URL.createObjectURL(cached.blob);
          document.body.style.backgroundImage = 'url(' + objectUrl + ')';
          return;
        }
        const response = await fetch(BG_URL);
        if (response.ok) {
          const blob = await response.blob();
          await db.assets.put({ url: BG_URL, blob, cachedAt: Date.now() });
          const objectUrl = URL.createObjectURL(blob);
          document.body.style.backgroundImage = 'url(' + objectUrl + ')';
        }
      } catch (err) {
        document.body.style.backgroundImage = 'url(/bg.jpg)';
      }
    }
    loadCachedBackground();

    // Get session data
    const npub = sessionStorage.getItem('npub');
    const onboarded = sessionStorage.getItem('onboarded');

    // Validate session
    if (!npub || !npub.startsWith('npub1')) {
      sessionStorage.clear();
      window.location.href = '/?logout';
    } else if (!onboarded) {
      window.location.href = '/onboarding';
    }

    // Elements - Step 1: Paste blob
    const blobInput = document.getElementById('blob-input');
    const step1Verify = document.getElementById('step1-verify');
    const step1Status = document.getElementById('step1-status');

    // Elements - Step 2: Confirm
    const previewIcon = document.getElementById('preview-icon');
    const previewName = document.getElementById('preview-name');
    const previewUrl = document.getElementById('preview-url');
    const previewDescription = document.getElementById('preview-description');
    const previewPubkey = document.getElementById('preview-pubkey');
    const step2Back = document.getElementById('step2-back');
    const step2Confirm = document.getElementById('step2-confirm');
    const step2Status = document.getElementById('step2-status');

    // Step sections
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const stepSuccess = document.getElementById('step-success');

    // Progress indicators
    const stepIndicator1 = document.getElementById('step-indicator-1');
    const stepIndicator2 = document.getElementById('step-indicator-2');
    const connector1 = document.getElementById('connector-1');

    // Verified app data
    let verifiedApp = null;

    // Helper to show step
    function showStep(stepNum) {
      step1.classList.remove('active');
      step2.classList.remove('active');
      stepSuccess.classList.remove('active');

      stepIndicator1.classList.remove('active', 'completed');
      stepIndicator2.classList.remove('active', 'completed');
      connector1.classList.remove('completed');

      if (stepNum === 1) {
        step1.classList.add('active');
        stepIndicator1.classList.add('active');
      } else if (stepNum === 2) {
        step2.classList.add('active');
        stepIndicator1.classList.add('completed');
        stepIndicator2.classList.add('active');
        connector1.classList.add('completed');
      } else if (stepNum === 'success') {
        stepSuccess.classList.add('active');
        stepIndicator1.classList.add('completed');
        stepIndicator2.classList.add('completed');
        connector1.classList.add('completed');
      }
    }

    // Helper to show status
    function showStatus(el, message, type) {
      el.textContent = message;
      el.className = 'status ' + type;
      el.hidden = false;
    }

    function hideStatus(el) {
      el.hidden = true;
    }

    // Step 1 verify blob
    step1Verify.addEventListener('click', async () => {
      const blob = blobInput.value.trim();
      if (!blob) {
        showStatus(step1Status, 'Please paste the registration blob', 'error');
        return;
      }

      hideStatus(step1Status);
      step1Verify.disabled = true;
      step1Verify.textContent = 'Verifying...';

      try {
        const res = await fetch('/api/teleport/verify-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blob })
        });

        const data = await res.json();

        if (!data.success) {
          showStatus(step1Status, data.error || 'Verification failed', 'error');
          return;
        }

        // Store verified data
        verifiedApp = {
          appPubkey: data.appPubkey,
          appNpub: data.appNpub,
          url: data.url,
          name: data.name,
          description: data.description || '',
          metadata: data.metadata || {}
        };

        // Update preview
        previewName.textContent = verifiedApp.name;
        previewUrl.textContent = verifiedApp.url;
        previewIcon.textContent = verifiedApp.name.charAt(0).toUpperCase();
        previewPubkey.textContent = verifiedApp.appNpub;

        if (verifiedApp.description) {
          previewDescription.textContent = verifiedApp.description;
          previewDescription.hidden = false;
        } else {
          previewDescription.hidden = true;
        }

        showStep(2);
      } catch (err) {
        console.error('Verify error:', err);
        showStatus(step1Status, 'Failed to verify blob', 'error');
      } finally {
        step1Verify.disabled = false;
        step1Verify.textContent = 'Verify Blob';
      }
    });

    // Step 2 back
    step2Back.addEventListener('click', () => {
      hideStatus(step2Status);
      showStep(1);
    });

    // Step 2 confirm
    step2Confirm.addEventListener('click', async () => {
      if (!verifiedApp) {
        showStatus(step2Status, 'No verified app data', 'error');
        return;
      }

      hideStatus(step2Status);
      step2Confirm.disabled = true;
      step2Confirm.textContent = 'Adding...';

      try {
        const res = await fetch('/api/teleport/add-app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
          body: JSON.stringify({
            appPubkey: verifiedApp.appPubkey,
            url: verifiedApp.url,
            name: verifiedApp.name,
            description: verifiedApp.description,
            metadata: verifiedApp.metadata
          })
        });

        const data = await res.json();

        if (!data.success) {
          showStatus(step2Status, data.error || 'Failed to add app', 'error');
          return;
        }

        showStep('success');
      } catch (err) {
        console.error('Add app error:', err);
        showStatus(step2Status, 'Failed to add app', 'error');
      } finally {
        step2Confirm.disabled = false;
        step2Confirm.textContent = 'Add App';
      }
    });
  </script>
</body>
</html>`;
}
