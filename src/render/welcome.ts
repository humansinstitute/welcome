import { APP_NAME, NOSTR_RELAYS } from "../config.ts";

export function renderWelcomePage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Welcome to Other Stuff</title>
  <link rel="icon" type="image/png" href="/logo.png">
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
      --orange-light: #fb923c;
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
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      touch-action: manipulation;
      transition: background-image 0.3s ease;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem 2rem;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-warm);
    }

    .logo {
      text-align: center;
      margin-bottom: 1rem;
    }

    .logo img {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
    }

    h1 {
      font-family: var(--font-serif);
      font-size: 1.75rem;
      font-weight: 400;
      color: var(--text);
      margin-bottom: 0.5rem;
      letter-spacing: -0.01em;
      text-align: center;
    }

    .subtitle {
      font-size: 1rem;
      color: var(--text-warm);
      margin-bottom: 1.75rem;
      line-height: 1.5;
      text-align: center;
    }

    .invite-section {
      margin-bottom: 1.5rem;
    }

    .invite-section label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .invite-input {
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

    .invite-input:focus {
      border-color: var(--accent);
    }

    .invite-input::placeholder {
      color: var(--muted);
    }

    .invite-input.error {
      border-color: var(--error);
    }

    .info-box {
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .info-box h3 {
      font-family: var(--font-serif);
      font-size: 0.95rem;
      font-weight: 400;
      color: var(--accent);
      margin-bottom: 0.5rem;
    }

    .info-box p {
      font-size: 0.9rem;
      color: var(--text-warm);
      line-height: 1.6;
    }

    .buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.875rem 1.25rem;
      font-size: 0.95rem;
      font-family: var(--font-body);
      font-weight: 500;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      text-decoration: none;
    }

    .btn-primary {
      background: var(--text);
      color: var(--surface);
      border: 1px solid var(--text);
    }

    .btn-primary:hover {
      background: var(--accent);
      border-color: var(--accent);
    }

    .btn-secondary {
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover,
    .btn-secondary:focus {
      background: var(--purple);
      color: white;
      border-color: var(--purple);
    }

    .btn-login {
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-login:hover,
    .btn-login:focus {
      background: var(--orange);
      color: white;
      border-color: var(--orange);
    }

    .advanced-section {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-soft);
    }

    .advanced-section summary {
      cursor: pointer;
      color: var(--muted);
      font-size: 0.9rem;
      font-weight: 500;
      list-style: none;
    }

    .advanced-section summary::-webkit-details-marker {
      display: none;
    }

    .advanced-section summary::before {
      content: '+ ';
    }

    .advanced-section[open] summary::before {
      content: '- ';
    }

    .advanced-section p {
      font-size: 0.875rem;
      color: var(--muted);
      margin: 0.75rem 0;
      line-height: 1.5;
    }

    .advanced-section .btn {
      width: 100%;
    }

    .advanced-options {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .auth-form .btn {
      width: 100%;
    }

    .auth-form input {
      padding: 0.7rem 0.875rem;
      font-size: 1rem;
      font-family: var(--font-body);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }

    .auth-form input:focus {
      border-color: var(--accent);
    }

    .auth-form input::placeholder {
      color: var(--muted);
    }

    .auth-error {
      margin-top: 0.75rem;
      color: var(--error);
      font-size: 0.875rem;
    }

    [hidden] {
      display: none !important;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61, 56, 51, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      z-index: 100;
    }

    .modal {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 400px;
      width: 100%;
      box-shadow: var(--shadow-warm);
      position: relative;
    }

    .modal h2 {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      font-weight: 400;
      margin: 0 0 0.5rem;
    }

    .modal-description {
      font-size: 0.9rem;
      color: var(--text-warm);
      line-height: 1.5;
      margin: 0 0 1.5rem;
    }

    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--muted);
      cursor: pointer;
      padding: 0.25rem;
      line-height: 1;
    }

    .modal-close:hover {
      color: var(--text);
    }

    .signup-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .signup-form label {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
    }

    .signup-form input {
      padding: 0.75rem 0.875rem;
      font-size: 1rem;
      font-family: var(--font-body);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }

    .signup-form input:focus {
      border-color: var(--accent);
    }

    .signup-form .btn {
      margin-top: 0.5rem;
    }

    .form-error {
      color: var(--error);
      font-size: 0.875rem;
      margin: 0;
    }

    .modal-note {
      font-size: 0.8rem;
      color: var(--muted);
      text-align: center;
      margin: 1rem 0 0;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo"><img src="/logo.png" alt="Other Stuff"></div>
    <h1>Welcome to Other Stuff</h1>
    <p class="subtitle">It's great to have you here. <br />This site is your entry point to Marginal Gains, our workshops, Wingman and all things Other Stuff. Let's get you set up.</p>

    <div class="invite-section">
      <label for="invite-code">Your Invite Code</label>
      <input
        type="text"
        id="invite-code"
        class="invite-input"
        placeholder="Enter your invite code"
        autocomplete="off"
        spellcheck="false"
      >
    </div>

    <div class="info-box">
      <h3>Your account, your control</h3>
      <p>
        Other Stuff uses Nostr an open protocol to build applications that respect your agency. You hold a private key, which is like a master password that works across many apps.
      </p>
      <p style="margin-top: 0.75rem;">
        We'll help you create one and keep it safe, but you can use it anywhere else you want. 
      </p>
    </div>

    <div class="buttons">
      <button class="btn btn-primary" id="btn-signup">
        Sign me up
      </button>
      <button class="btn btn-login" id="btn-login">
        Log me back in
      </button>
    </div>

    <details class="advanced-section">
      <summary>I already have a Nostr account</summary>
      <p>Connect with your browser extension or remote signer.</p>
      <div class="advanced-options">
        <button class="btn btn-secondary" id="btn-extension">
          Browser Extension
        </button>
        <form class="auth-form" id="bunker-form">
          <input
            type="text"
            name="bunker"
            placeholder="nostrconnect://… or name@example.com"
            autocomplete="off"
          >
          <button class="btn btn-secondary" type="submit">Connect bunker</button>
        </form>
        <form class="auth-form" id="secret-form">
          <input
            type="password"
            name="secret"
            placeholder="nsec1…"
            autocomplete="off"
          >
          <input
            type="password"
            name="encryptPassword"
            placeholder="Password to encrypt key"
            autocomplete="new-password"
          >
          <button class="btn btn-secondary" type="submit">Sign in with secret</button>
        </form>
      </div>
      <p class="auth-error" id="auth-error" hidden></p>
    </details>
  </div>

  <!-- Signup Modal -->
  <div class="modal-overlay" id="signup-modal" hidden>
    <div class="modal">
      <button class="modal-close" type="button" id="modal-close">&times;</button>
      <h2>Create Your Account</h2>
      <p class="modal-description">
        We'll generate your Nostr key and encrypt it with your password.
        You can recover your account anytime with your email and password.
      </p>
      <form class="signup-form" id="signup-form">
        <label>
          Email
          <input type="email" name="email" placeholder="you@example.com" required autocomplete="email">
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Choose a strong password" required minlength="8" autocomplete="new-password">
        </label>
        <label>
          Confirm Password
          <input type="password" name="confirmPassword" placeholder="Confirm your password" required minlength="8" autocomplete="new-password">
        </label>
        <p class="form-error" id="signup-error" hidden></p>
        <button class="btn btn-primary" type="submit" id="signup-submit">
          Create my account
        </button>
      </form>
      <p class="modal-note">
        Your private key never leaves your browser unencrypted.
      </p>
    </div>
  </div>

  <!-- Login Modal -->
  <div class="modal-overlay" id="login-modal" hidden>
    <div class="modal">
      <button class="modal-close" type="button" id="login-modal-close">&times;</button>
      <h2>Welcome Back</h2>
      <p class="modal-description">
        Enter your email and password to decrypt your key and log in.
      </p>
      <form class="signup-form" id="login-form">
        <label>
          Email or npub
          <input type="text" name="identifier" placeholder="you@example.com or npub1..." required autocomplete="email">
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Your password" required autocomplete="current-password">
        </label>
        <p class="form-error" id="login-error" hidden></p>
        <button class="btn btn-primary" type="submit" id="login-submit">
          Log in
        </button>
      </form>
    </div>
  </div>

  <script type="module">
    import { generateSecretKey, getPublicKey, nip19 } from 'https://esm.sh/nostr-tools@2.7.2';
    import { encrypt as nip49Encrypt, decrypt as nip49Decrypt } from 'https://esm.sh/nostr-tools@2.7.2/nip49';
    import { Relay } from 'https://esm.sh/nostr-tools@2.7.2/relay';
    import Dexie from 'https://esm.sh/dexie@4.0.4';

    // Initialize Dexie database for encrypted secrets and cached assets
    const db = new Dexie('OtherStuffDB');
    db.version(3).stores({
      profiles: 'npub, name, about, picture, nip05, updatedAt',
      secrets: 'npub',
      assets: 'url'  // Cached images/assets as blobs
    });

    // ============================================
    // Background image caching
    // ============================================

    async function loadCachedBackground() {
      const BG_URL = '/bg.jpg';
      try {
        // Check cache first
        const cached = await db.assets.get(BG_URL);
        if (cached && cached.blob) {
          const objectUrl = URL.createObjectURL(cached.blob);
          document.body.style.backgroundImage = 'url(' + objectUrl + ')';
          return;
        }

        // Fetch and cache
        const response = await fetch(BG_URL);
        if (response.ok) {
          const blob = await response.blob();
          await db.assets.put({ url: BG_URL, blob, cachedAt: Date.now() });
          const objectUrl = URL.createObjectURL(blob);
          document.body.style.backgroundImage = 'url(' + objectUrl + ')';
        }
      } catch (err) {
        // Fallback to direct URL if caching fails
        document.body.style.backgroundImage = 'url(/bg.jpg)';
      }
    }

    // Load background immediately
    loadCachedBackground();

    // ============================================
    // Web Crypto helpers for encrypted key storage
    // ============================================

    async function deriveKeyFromPassword(password, salt) {
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    }

    async function exportKey(key) {
      const exported = await crypto.subtle.exportKey('raw', key);
      return new Uint8Array(exported);
    }

    async function encryptSecret(plaintext, key) {
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoder.encode(plaintext)
      );
      return {
        ciphertext: new Uint8Array(encrypted),
        iv: iv
      };
    }

    async function storeEncryptedNsec(npub, nsec, password) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await deriveKeyFromPassword(password, salt);
      const { ciphertext, iv } = await encryptSecret(nsec, key);
      const exportedKey = await exportKey(key);

      await db.secrets.put({
        npub,
        ciphertext: Array.from(ciphertext),
        iv: Array.from(iv),
        salt: Array.from(salt)
      });

      // Store derived key in sessionStorage for this session only
      sessionStorage.setItem('derivedKey', JSON.stringify(Array.from(exportedKey)));
      return true;
    }

    // ============================================

    const RELAYS = ${JSON.stringify(NOSTR_RELAYS)};

    const inviteInput = document.getElementById('invite-code');
    const btnSignup = document.getElementById('btn-signup');
    const btnLogin = document.getElementById('btn-login');
    const btnExtension = document.getElementById('btn-extension');
    const bunkerForm = document.getElementById('bunker-form');
    const secretForm = document.getElementById('secret-form');
    const authError = document.getElementById('auth-error');

    // Check for logout parameter to clear stale sessions
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('logout')) {
      sessionStorage.clear();
      // Remove the logout param from URL
      window.history.replaceState({}, '', '/');
    }

    // Prefill invite code from URL parameter (e.g., ?ic=sr200126)
    const prefillCode = urlParams.get('ic');
    if (prefillCode) {
      inviteInput.value = prefillCode;
    }

    // Signup modal elements
    const signupModal = document.getElementById('signup-modal');
    const modalClose = document.getElementById('modal-close');
    const signupForm = document.getElementById('signup-form');
    const signupError = document.getElementById('signup-error');
    const signupSubmit = document.getElementById('signup-submit');

    // Login modal elements
    const loginModal = document.getElementById('login-modal');
    const loginModalClose = document.getElementById('login-modal-close');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginSubmit = document.getElementById('login-submit');

    let currentInviteCode = null;

    // Fetch profile from relays and cache avatar/name in sessionStorage
    async function fetchAndCacheProfile(npub) {
      try {
        const { type, data: pubkey } = nip19.decode(npub);
        if (type !== 'npub') return;

        for (const url of RELAYS) {
          try {
            const relay = await Relay.connect(url);

            const profile = await new Promise((resolve, reject) => {
              let found = null;
              const timeout = setTimeout(() => {
                relay.close();
                resolve(found);
              }, 3000);

              relay.subscribe([
                { kinds: [0], authors: [pubkey], limit: 1 }
              ], {
                onevent(event) {
                  try {
                    found = JSON.parse(event.content);
                  } catch (e) {}
                },
                oneose() {
                  clearTimeout(timeout);
                  relay.close();
                  resolve(found);
                }
              });
            });

            if (profile) {
              // Cache the profile data
              if (profile.picture) {
                sessionStorage.setItem('avatarUrl', profile.picture);
              }
              if (profile.name) {
                sessionStorage.setItem('displayName', profile.name);
              }
              return; // Found profile, done
            }
          } catch (err) {
            console.warn('Failed to fetch profile from', url);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch profile:', err);
      }
    }

    function validateCode() {
      const code = inviteInput.value.trim();
      if (!code) {
        inviteInput.classList.add('error');
        inviteInput.focus();
        setTimeout(() => inviteInput.classList.remove('error'), 2000);
        return null;
      }
      return code;
    }

    function showError(msg) {
      authError.textContent = msg;
      authError.hidden = false;
      setTimeout(() => authError.hidden = true, 5000);
    }

    function showSignupError(msg) {
      signupError.textContent = msg;
      signupError.hidden = false;
    }

    function openSignupModal() {
      signupModal.hidden = false;
      signupForm.reset();
      signupError.hidden = true;
      signupForm.elements.email.focus();
    }

    function closeSignupModal() {
      signupModal.hidden = true;
      currentInviteCode = null;
    }

    function openLoginModal() {
      loginModal.hidden = false;
      loginForm.reset();
      loginError.hidden = true;
      loginForm.elements.identifier.focus();
    }

    function closeLoginModal() {
      loginModal.hidden = true;
    }

    function showLoginError(msg) {
      loginError.textContent = msg;
      loginError.hidden = false;
    }

    // Open signup modal
    btnSignup.addEventListener('click', () => {
      const code = validateCode();
      if (!code) return;
      currentInviteCode = code;
      openSignupModal();
    });

    // Open login modal
    btnLogin.addEventListener('click', () => {
      openLoginModal();
    });

    // Close modals
    modalClose.addEventListener('click', closeSignupModal);
    signupModal.addEventListener('click', (e) => {
      if (e.target === signupModal) closeSignupModal();
    });

    loginModalClose.addEventListener('click', closeLoginModal);
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeLoginModal();
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      signupError.hidden = true;

      const email = signupForm.elements.email.value.trim();
      const password = signupForm.elements.password.value;
      const confirmPassword = signupForm.elements.confirmPassword.value;

      // Validate
      if (!email) {
        showSignupError('Please enter your email.');
        return;
      }
      if (password.length < 8) {
        showSignupError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        showSignupError('Passwords do not match.');
        return;
      }

      signupSubmit.disabled = true;
      signupSubmit.textContent = 'Creating account...';

      try {
        // Generate keypair
        const secretKey = generateSecretKey();
        const pubkey = getPublicKey(secretKey);
        const npub = nip19.npubEncode(pubkey);
        const nsec = nip19.nsecEncode(secretKey);

        // Encrypt nsec with password using NIP-49
        // Using logN=16 for good security (2^16 = 65536 iterations)
        const ncryptsec = nip49Encrypt(secretKey, password, 16, 0x00);

        // Send to server
        const res = await fetch('/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            npub,
            ncryptsec,
            password,
            inviteCode: currentInviteCode
          })
        });

        const data = await res.json();

        if (!data.success) {
          showSignupError(data.error || 'Signup failed.');
          signupSubmit.disabled = false;
          signupSubmit.textContent = 'Create my account';
          return;
        }

        // Store npub in sessionStorage, encrypt nsec in Dexie
        sessionStorage.setItem('npub', npub);
        await storeEncryptedNsec(npub, nsec, password);

        // Redirect to onboarding
        window.location.href = '/onboarding';

      } catch (err) {
        console.error('Signup error:', err);
        showSignupError('Something went wrong. Please try again.');
        signupSubmit.disabled = false;
        signupSubmit.textContent = 'Create my account';
      }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.hidden = true;

      const identifier = loginForm.elements.identifier.value.trim();
      const password = loginForm.elements.password.value;

      if (!identifier) {
        showLoginError('Please enter your email or npub.');
        return;
      }
      if (!password) {
        showLoginError('Please enter your password.');
        return;
      }

      loginSubmit.disabled = true;
      loginSubmit.textContent = 'Logging in...';

      try {
        // Call recover endpoint
        const res = await fetch('/auth/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });

        const data = await res.json();

        if (!data.success) {
          showLoginError(data.error || 'Login failed.');
          loginSubmit.disabled = false;
          loginSubmit.textContent = 'Log in';
          return;
        }

        // Decrypt the ncryptsec to get the secret key
        const secretKey = nip49Decrypt(data.ncryptsec, password);
        const nsec = nip19.nsecEncode(secretKey);

        // Clear any stale session data first
        sessionStorage.clear();

        // Store npub in session, encrypt nsec in Dexie (existing users are already onboarded)
        sessionStorage.setItem('npub', data.npub);
        sessionStorage.setItem('onboarded', 'true');
        await storeEncryptedNsec(data.npub, nsec, password);

        // Fetch and cache profile avatar before redirect
        loginSubmit.textContent = 'Loading profile...';
        await fetchAndCacheProfile(data.npub);

        // Redirect to apps
        window.location.href = '/apps';

      } catch (err) {
        console.error('Login error:', err);
        showLoginError('Incorrect password or account not found.');
        loginSubmit.disabled = false;
        loginSubmit.textContent = 'Log in';
      }
    });

    // Extension login - validates with backend, handles invite codes for new users
    btnExtension.addEventListener('click', async () => {
      if (!window.nostr) {
        showError('No Nostr extension found. Install nos2x, Alby, or similar.');
        return;
      }

      try {
        const pubkey = await window.nostr.getPublicKey();
        const npub = nip19.npubEncode(pubkey);
        const inviteCode = inviteInput.value.trim() || null;

        // Call backend to validate/register
        const res = await fetch('/auth/extension-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ npub, inviteCode })
        });
        const data = await res.json();

        if (!data.success) {
          showError(data.error || 'Login failed');
          return;
        }

        // Clear any stale session data first
        sessionStorage.clear();

        // Store in session and redirect (extension users already onboarded)
        sessionStorage.setItem('npub', npub);
        sessionStorage.setItem('loginMethod', 'extension');
        sessionStorage.setItem('onboarded', 'true');
        if (data.isAdmin) {
          sessionStorage.setItem('isAdmin', 'true');
        }

        // Fetch and cache profile avatar
        await fetchAndCacheProfile(npub);

        window.location.href = '/apps';
      } catch (err) {
        showError('Extension denied access or failed.');
      }
    });

    // Bunker connection (no invite code needed - existing Nostr user)
    bunkerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const bunker = bunkerForm.elements.bunker.value.trim();
      if (!bunker) {
        showError('Enter a bunker URL or NIP-05 address.');
        return;
      }

      console.log('Bunker connect:', bunker);
      // TODO: Handle bunker connection flow
      showError('Bunker connection coming soon.');
    });

    // Secret/nsec login (no invite code needed - existing Nostr user)
    secretForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const secret = secretForm.elements.secret.value.trim();
      const encryptPassword = secretForm.elements.encryptPassword.value;

      if (!secret || !secret.startsWith('nsec1')) {
        showError('Enter a valid nsec key.');
        return;
      }

      if (!encryptPassword) {
        showError('Enter a password to encrypt your key.');
        return;
      }

      try {
        const { type, data: secretKey } = nip19.decode(secret);
        if (type !== 'nsec') {
          showError('Invalid nsec format.');
          return;
        }

        const pubkey = getPublicKey(secretKey);
        const npub = nip19.npubEncode(pubkey);

        // Clear any stale session data first
        sessionStorage.clear();

        // Store npub in session, encrypt nsec in Dexie
        sessionStorage.setItem('npub', npub);
        sessionStorage.setItem('onboarded', 'true');
        await storeEncryptedNsec(npub, secret, encryptPassword);

        // Fetch and cache profile avatar
        await fetchAndCacheProfile(npub);

        window.location.href = '/apps';
      } catch (err) {
        showError('Invalid nsec key.');
      }
    });
  </script>
</body>
</html>`;
}
