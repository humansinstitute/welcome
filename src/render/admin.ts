import { APP_NAME, NOSTR_RELAYS, ADMIN_NPUB } from "../config.ts";

export function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Admin - ${APP_NAME}</title>
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
      max-width: 640px;
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
      color: var(--purple);
    }

    .back-link {
      font-size: 0.9rem;
      color: var(--muted);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--purple);
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
      font-size: 1.125rem;
      font-weight: 400;
      margin-bottom: 1rem;
      color: var(--purple);
    }

    [hidden] {
      display: none !important;
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
    }

    .btn-primary {
      background: var(--purple);
      color: white;
    }

    .btn-primary:hover {
      background: var(--purple-light);
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    /* Admin Lists */
    .admin-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .admin-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .admin-item.inactive {
      opacity: 0.6;
    }

    .admin-item-info {
      flex: 1;
      min-width: 0;
    }

    .admin-item-title {
      font-weight: 500;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .admin-item-meta {
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 0.25rem;
    }

    .admin-item-desc {
      font-size: 0.85rem;
      color: var(--text-warm);
      margin-top: 0.25rem;
    }

    .admin-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .admin-actions button {
      padding: 0.35rem 0.6rem;
      font-size: 0.75rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      transition: all 0.2s;
    }

    .admin-actions button:hover {
      border-color: var(--purple);
      color: var(--purple);
    }

    .admin-actions button.delete:hover {
      border-color: var(--error);
      color: var(--error);
    }

    .admin-actions button.copy-link {
      background: var(--purple);
      color: white;
      border: none;
    }

    .admin-actions button.copy-link:hover {
      background: var(--purple-light);
    }

    .admin-empty {
      text-align: center;
      padding: 1rem;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .admin-help-text {
      font-size: 0.85rem;
      color: var(--muted);
      margin: 0 0 1rem 0;
    }

    /* Badge styles */
    .badge {
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-success {
      background: #dcfce7;
      color: #166534;
    }

    .badge-info {
      background: #dbeafe;
      color: #1e40af;
    }

    /* App icon */
    .app-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: var(--border-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
      overflow: hidden;
    }

    .app-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Forms */
    .add-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .add-form input,
    .add-form textarea {
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
    }

    .add-form input:focus,
    .add-form textarea:focus {
      outline: none;
      border-color: var(--accent);
    }

    .add-form textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: flex;
      gap: 0.5rem;
    }

    .form-row input {
      flex: 1;
    }

    .form-row input.small {
      flex: 0 0 80px;
    }

    /* Icon section */
    .icon-section {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .icon-preview {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: var(--border-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .icon-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .icon-inputs {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .icon-row {
      display: flex;
      gap: 0.5rem;
    }

    .icon-row input {
      flex: 1;
    }

    .upload-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      white-space: nowrap;
    }

    .upload-btn:hover {
      border-color: var(--purple);
      color: var(--purple);
    }

    .section-divider {
      margin: 1.5rem 0;
      border: none;
      border-top: 1px solid var(--border-soft);
    }

    /* Group Members */
    .group-members {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: var(--surface);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .group-members-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .group-members-header span {
      font-size: 0.8rem;
      color: var(--muted);
    }

    .group-members-list {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .member-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.625rem;
      background: var(--surface-warm);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
    }

    .member-npub {
      font-family: monospace;
      word-break: break-all;
      flex: 1;
      margin-right: 0.5rem;
    }

    .member-source {
      font-size: 0.7rem;
      color: var(--muted);
      margin-left: 0.5rem;
    }

    .member-remove {
      padding: 0.25rem 0.5rem;
      font-size: 0.7rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      transition: all 0.2s;
    }

    .member-remove:hover {
      border-color: var(--error);
      color: var(--error);
    }

    .add-member-form {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .add-member-form input {
      flex: 1;
      padding: 0.4rem 0.5rem;
      font-size: 0.8rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
    }

    .add-member-form input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .add-member-form button {
      padding: 0.4rem 0.75rem;
      font-size: 0.8rem;
      background: var(--purple);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .add-member-form button:hover {
      background: var(--purple-light);
    }

    .members-empty {
      font-size: 0.8rem;
      color: var(--muted);
      text-align: center;
      padding: 0.5rem;
    }

    .expand-btn {
      font-size: 0.8rem;
      color: var(--purple);
      background: var(--surface);
      border: 1px solid var(--purple);
      border-radius: var(--radius-sm);
      cursor: pointer;
      padding: 0.35rem 0.75rem;
      margin-top: 0.5rem;
      display: inline-block;
    }

    .expand-btn:hover {
      background: var(--purple);
      color: white;
    }

    /* Groups checkbox list */
    .groups-checkbox-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.5rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      min-height: 2rem;
    }

    .groups-checkbox-list label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      padding: 0.25rem 0.5rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      user-select: none;
    }

    .groups-checkbox-list label:hover {
      border-color: var(--purple);
    }

    .groups-checkbox-list label.selected {
      background: var(--purple);
      color: white;
      border-color: var(--purple);
    }

    .groups-checkbox-list input[type="checkbox"] {
      display: none;
    }

    .loading-groups {
      font-size: 0.85rem;
      color: var(--muted);
    }

    /* App codes list */
    .app-codes-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .app-code-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
    }

    .app-code-item .app-name {
      font-weight: 500;
      font-size: 0.85rem;
      min-width: 100px;
      flex-shrink: 0;
    }

    .app-code-item input {
      flex: 1;
      padding: 0.4rem 0.5rem;
      font-size: 0.8rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: monospace;
    }

    .app-code-item input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .app-code-item .app-code-actions {
      display: flex;
      gap: 0.25rem;
    }

    .app-code-item button {
      padding: 0.35rem 0.5rem;
      font-size: 0.7rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      transition: all 0.2s;
    }

    .app-code-item button:hover {
      border-color: var(--purple);
      color: var(--purple);
    }

    .app-code-item button.delete:hover {
      border-color: var(--error);
      color: var(--error);
    }

    .app-code-item button.save {
      background: var(--purple);
      color: white;
      border: none;
    }

    .app-code-item button.save:hover {
      background: var(--purple-light);
    }

    .no-apps-message {
      font-size: 0.85rem;
      color: var(--muted);
      text-align: center;
      padding: 0.5rem;
    }

    .field-hint {
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 0.25rem;
      display: block;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61, 56, 51, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .modal-overlay[hidden] {
      display: none;
    }

    .modal {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 480px;
      width: 90%;
      position: relative;
      box-shadow: var(--shadow-warm);
      border: 1px solid var(--border);
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-close {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--muted);
      padding: 0.25rem;
      line-height: 1;
    }

    .modal-close:hover {
      color: var(--text);
    }

    .modal h2 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .modal-form label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--text);
    }

    .modal-form input,
    .modal-form textarea {
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
    }

    .modal-form input:focus,
    .modal-form textarea:focus {
      outline: none;
      border-color: var(--accent);
    }

    .modal-form textarea {
      resize: vertical;
      min-height: 100px;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .modal-actions button {
      flex: 1;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all 0.2s;
    }

    .modal-actions button[type="button"] {
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .modal-actions button[type="button"]:hover {
      border-color: var(--accent);
    }

    .modal-actions button[type="submit"] {
      background: var(--purple);
      color: white;
      border: none;
    }

    .modal-actions button[type="submit"]:hover {
      background: var(--purple-light);
    }

    .modal-actions button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Unauthorized message */
    .unauthorized {
      text-align: center;
      padding: 3rem 1rem;
    }

    .unauthorized h2 {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .unauthorized p {
      color: var(--muted);
      margin-bottom: 1.5rem;
    }

    .unauthorized a {
      color: var(--purple);
      text-decoration: none;
    }

    .unauthorized a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="page-header">
      <h1>Admin</h1>
      <a href="/apps" class="back-link">&larr; Back to Apps</a>
    </header>

    <!-- Unauthorized message (shown to non-admins) -->
    <div class="unauthorized" id="unauthorized" hidden>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
      <a href="/apps">Return to Apps</a>
    </div>

    <!-- Admin content (hidden until verified as admin) -->
    <div id="admin-content" hidden>
      <!-- Manage Apps -->
      <div class="card">
        <h2>Manage Apps</h2>
        <div class="admin-list" id="apps-list">
          <div class="admin-empty">Loading...</div>
        </div>
        <form class="add-form" id="add-app-form">
          <input type="text" name="name" placeholder="App name" required>
          <input type="text" name="description" placeholder="Short description">
          <input type="url" name="url" placeholder="https://app.example.com" required>
          <input type="text" name="teleportPubkey" placeholder="Teleport pubkey (npub or hex) - optional">
          <div class="icon-section">
            <div class="icon-preview" id="app-icon-preview">
              <span>&#128241;</span>
            </div>
            <div class="icon-inputs">
              <div class="icon-row">
                <input type="url" name="iconUrl" id="app-icon-url" placeholder="Icon URL">
                <button type="button" class="upload-btn" id="app-upload-btn">Upload</button>
                <input type="file" id="app-icon-file" accept="image/*" hidden>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-small">Add App</button>
        </form>
      </div>

      <!-- Invite Codes -->
      <div class="card">
        <h2>Invite Codes</h2>
        <div class="admin-list" id="codes-list">
          <div class="admin-empty">Loading...</div>
        </div>
        <form class="add-form" id="add-code-form">
          <div class="form-row">
            <input type="text" name="code" placeholder="New invite code" required>
            <input type="number" name="maxUses" class="small" placeholder="Max" min="1">
          </div>
          <input type="text" name="description" placeholder="Description (optional)">
          <textarea name="welcomeMessage" placeholder="Welcome message (markdown, optional)"></textarea>
          <button type="submit" class="btn btn-primary btn-small">Add Code</button>
        </form>
      </div>

      <!-- Groups -->
      <div class="card">
        <h2>Groups</h2>
        <p class="admin-help-text">Groups control which apps users can see. Users are added to groups via invite codes or manually below.</p>
        <div class="admin-list" id="groups-list">
          <div class="admin-empty">Loading...</div>
        </div>
        <form class="add-form" id="add-group-form">
          <input type="text" name="name" placeholder="Group name (e.g., speedrun)" required>
          <input type="text" name="description" placeholder="Description (optional)">
          <button type="submit" class="btn btn-primary btn-small">Add Group</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Edit App Modal -->
  <div class="modal-overlay" id="edit-app-modal" hidden>
    <div class="modal">
      <button class="modal-close" type="button" id="edit-app-close" aria-label="Close">&times;</button>
      <h2>Edit App</h2>
      <form class="modal-form" id="edit-app-form">
        <input type="hidden" name="id" id="edit-app-id">
        <label>
          Name
          <input type="text" name="name" id="edit-app-name" required>
        </label>
        <label>
          Description
          <input type="text" name="description" id="edit-app-description">
        </label>
        <label>
          URL
          <input type="url" name="url" id="edit-app-url" required>
        </label>
        <label>
          Icon URL
          <input type="url" name="iconUrl" id="edit-app-icon-url">
        </label>
        <label>
          Teleport Pubkey (npub or hex)
          <input type="text" name="teleportPubkey" id="edit-app-teleport-pubkey" placeholder="npub1... or hex">
        </label>
        <label>
          Restrict to Groups
          <small class="field-hint">Leave all unchecked to make app visible to everyone</small>
          <div class="groups-checkbox-list" id="edit-app-groups"></div>
        </label>
        <div class="modal-actions">
          <button type="button" id="edit-app-cancel">Cancel</button>
          <button type="submit" id="edit-app-save">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Edit Invite Code Modal -->
  <div class="modal-overlay" id="edit-code-modal" hidden>
    <div class="modal">
      <button class="modal-close" type="button" id="edit-code-close" aria-label="Close">&times;</button>
      <h2>Edit Invite Code</h2>
      <form class="modal-form" id="edit-code-form">
        <input type="hidden" name="code" id="edit-code-code">
        <label>
          Code
          <input type="text" id="edit-code-display" disabled>
        </label>
        <label>
          Description
          <input type="text" name="description" id="edit-code-description">
        </label>
        <label>
          Max Uses
          <input type="number" name="maxUses" id="edit-code-max-uses" min="1">
        </label>
        <label>
          Welcome Message (Markdown)
          <textarea name="welcomeMessage" id="edit-code-welcome-message" placeholder="# Welcome!&#10;&#10;Your custom welcome message..."></textarea>
        </label>
        <label>
          Groups
          <div class="groups-checkbox-list" id="edit-code-groups">
            <span class="loading-groups">Loading groups...</span>
          </div>
          <small class="field-hint">Users with this invite code will be added to selected groups</small>
        </label>
        <label>
          External App Invite Codes
          <div class="app-codes-list" id="edit-code-app-codes">
            <span class="loading-groups">Loading apps...</span>
          </div>
          <small class="field-hint">Link this invite code to app-specific codes (e.g., MG team invite codes)</small>
        </label>
        <div class="modal-actions">
          <button type="button" id="edit-code-cancel">Cancel</button>
          <button type="submit" id="edit-code-save">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <script type="module">
    import Dexie from 'https://esm.sh/dexie@4.0.4';

    // Initialize Dexie for asset caching
    const db = new Dexie('OtherStuffDB');
    db.version(3).stores({
      profiles: 'npub, name, about, picture, nip05, updatedAt',
      secrets: 'npub',
      assets: 'url'
    });

    // Load cached background
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

    const ADMIN_NPUB = ${JSON.stringify(ADMIN_NPUB)};

    // Get session data
    const npub = sessionStorage.getItem('npub');
    const onboarded = sessionStorage.getItem('onboarded');

    // Check if valid session
    if (!npub || !npub.startsWith('npub1')) {
      sessionStorage.clear();
      window.location.href = '/?logout';
    } else if (!onboarded) {
      window.location.href = '/onboarding';
    }

    // Check admin status
    const isAdmin = npub && ADMIN_NPUB && npub === ADMIN_NPUB;

    const unauthorizedEl = document.getElementById('unauthorized');
    const adminContent = document.getElementById('admin-content');

    if (!isAdmin) {
      unauthorizedEl.hidden = false;
      adminContent.hidden = true;
    } else {
      unauthorizedEl.hidden = true;
      adminContent.hidden = false;
      initAdmin();
    }

    // Cache for admin data
    let allGroups = [];
    let adminAppsData = {};
    let adminCodesData = {};
    let expandedGroups = {};

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function initAdmin() {
      loadApps();
      loadCodes();
      loadGroups();

      // Add App form
      document.getElementById('add-app-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.elements.name.value.trim();
        const description = form.elements.description.value.trim();
        const url = form.elements.url.value.trim();
        const iconUrl = form.elements.iconUrl.value.trim();
        const teleportPubkey = form.elements.teleportPubkey.value.trim();

        if (await createApp(name, description || null, iconUrl || null, url, teleportPubkey || null)) {
          form.reset();
          document.getElementById('app-icon-preview').innerHTML = '<span>&#128241;</span>';
        }
      });

      // Add Code form
      document.getElementById('add-code-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const code = form.elements.code.value.trim();
        const description = form.elements.description.value.trim();
        const maxUses = form.elements.maxUses.value;
        const welcomeMessage = form.elements.welcomeMessage.value.trim();

        if (await createCode(code, description || null, maxUses || null, welcomeMessage || null)) {
          form.reset();
        }
      });

      // Add Group form
      document.getElementById('add-group-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.elements.name.value.trim();
        const description = form.elements.description.value.trim();

        if (name && await createGroup(name, description || null)) {
          form.reset();
        }
      });

      // App icon preview and upload
      const appIconUrl = document.getElementById('app-icon-url');
      const appIconPreview = document.getElementById('app-icon-preview');
      const appUploadBtn = document.getElementById('app-upload-btn');
      const appIconFile = document.getElementById('app-icon-file');

      appIconUrl.addEventListener('input', () => {
        const url = appIconUrl.value.trim();
        if (url) {
          appIconPreview.innerHTML = '<img src="' + url + '" alt="" onerror="this.parentElement.innerHTML=\\'<span>&#128241;</span>\\'">';
        } else {
          appIconPreview.innerHTML = '<span>&#128241;</span>';
        }
      });

      appUploadBtn.addEventListener('click', () => appIconFile.click());

      appIconFile.addEventListener('change', async () => {
        const file = appIconFile.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
          alert('Image too large (max 2MB)');
          return;
        }

        appUploadBtn.disabled = true;
        appUploadBtn.textContent = 'Uploading...';

        try {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();

          if (data.success) {
            const fullUrl = window.location.origin + data.url;
            appIconUrl.value = fullUrl;
            appIconPreview.innerHTML = '<img src="' + fullUrl + '" alt="">';
          } else {
            alert(data.error || 'Upload failed');
          }
        } catch (err) {
          console.error('Upload error:', err);
          alert('Upload failed');
        } finally {
          appUploadBtn.disabled = false;
          appUploadBtn.textContent = 'Upload';
          appIconFile.value = '';
        }
      });

      // Edit App Modal
      const editAppModal = document.getElementById('edit-app-modal');
      const editAppForm = document.getElementById('edit-app-form');
      const editAppClose = document.getElementById('edit-app-close');
      const editAppCancel = document.getElementById('edit-app-cancel');
      const editAppSave = document.getElementById('edit-app-save');

      editAppClose.addEventListener('click', () => editAppModal.hidden = true);
      editAppCancel.addEventListener('click', () => editAppModal.hidden = true);
      editAppModal.addEventListener('click', (e) => {
        if (e.target === editAppModal) editAppModal.hidden = true;
      });

      editAppForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-app-id').value, 10);
        const name = document.getElementById('edit-app-name').value.trim();
        const description = document.getElementById('edit-app-description').value.trim();
        const url = document.getElementById('edit-app-url').value.trim();
        const iconUrl = document.getElementById('edit-app-icon-url').value.trim();
        const teleportPubkey = document.getElementById('edit-app-teleport-pubkey').value.trim();

        editAppSave.disabled = true;
        editAppSave.textContent = 'Saving...';

        const appUpdated = await updateApp(id, name, description || null, iconUrl || null, url, teleportPubkey || null);
        const groupsSaved = await saveAppGroups(id);

        if (appUpdated && groupsSaved) {
          editAppModal.hidden = true;
        }

        editAppSave.disabled = false;
        editAppSave.textContent = 'Save Changes';
      });

      // Edit Code Modal
      const editCodeModal = document.getElementById('edit-code-modal');
      const editCodeForm = document.getElementById('edit-code-form');
      const editCodeClose = document.getElementById('edit-code-close');
      const editCodeCancel = document.getElementById('edit-code-cancel');
      const editCodeSave = document.getElementById('edit-code-save');

      editCodeClose.addEventListener('click', () => editCodeModal.hidden = true);
      editCodeCancel.addEventListener('click', () => editCodeModal.hidden = true);
      editCodeModal.addEventListener('click', (e) => {
        if (e.target === editCodeModal) editCodeModal.hidden = true;
      });

      editCodeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('edit-code-code').value;
        const description = document.getElementById('edit-code-description').value.trim();
        const maxUses = document.getElementById('edit-code-max-uses').value;
        const welcomeMessage = document.getElementById('edit-code-welcome-message').value.trim();

        editCodeSave.disabled = true;
        editCodeSave.textContent = 'Saving...';

        const codeUpdated = await updateCode(code, description || null, maxUses || null, welcomeMessage || null);
        const groupsSaved = await saveCodeGroups(code);

        if (codeUpdated && groupsSaved) {
          editCodeModal.hidden = true;
        }

        editCodeSave.disabled = false;
        editCodeSave.textContent = 'Save Changes';
      });
    }

    // ===== APPS =====

    async function loadApps() {
      const listEl = document.getElementById('apps-list');
      try {
        const res = await fetch('/admin/apps', { headers: { 'X-Npub': npub } });
        const data = await res.json();

        if (!data.success) {
          listEl.innerHTML = '<div class="admin-empty">Failed to load apps</div>';
          return;
        }

        if (data.apps.length === 0) {
          listEl.innerHTML = '<div class="admin-empty">No apps configured yet</div>';
          return;
        }

        adminAppsData = {};
        data.apps.forEach(app => adminAppsData[app.id] = app);

        listEl.innerHTML = data.apps.map(app => {
          const iconHtml = app.icon_url
            ? '<img src="' + app.icon_url + '" alt="" onerror="this.parentElement.innerHTML=String.fromCharCode(128241)">'
            : '<span>&#128241;</span>';
          const teleportBadge = app.teleport_pubkey ? '<span class="badge badge-success">Teleport</span>' : '';
          const isVisible = app.visible === 1;
          const hiddenBadge = isVisible ? '' : '<span class="badge badge-warning">Hidden</span>';

          return '<div class="admin-item' + (isVisible ? '' : ' inactive') + '" data-app-id="' + app.id + '">' +
            '<div class="app-icon">' + iconHtml + '</div>' +
            '<div class="admin-item-info">' +
              '<div class="admin-item-title">' + escapeHtml(app.name) + ' ' + teleportBadge + hiddenBadge + '</div>' +
              '<div class="admin-item-meta">' + escapeHtml(app.url) + '</div>' +
              (app.description ? '<div class="admin-item-desc">' + escapeHtml(app.description) + '</div>' : '') +
            '</div>' +
            '<div class="admin-actions">' +
              '<button type="button" data-toggle-app="' + app.id + '" data-visible="' + (isVisible ? '1' : '0') + '">' + (isVisible ? 'Hide' : 'Show') + '</button>' +
              '<button type="button" data-edit-app="' + app.id + '">Edit</button>' +
              '<button type="button" class="delete" data-delete-app="' + app.id + '">Delete</button>' +
            '</div>' +
          '</div>';
        }).join('');

        // Event listeners
        listEl.querySelectorAll('[data-toggle-app]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.toggleApp, 10);
            const currentVisible = btn.dataset.visible === '1';
            await toggleApp(id, !currentVisible);
          });
        });

        listEl.querySelectorAll('[data-edit-app]').forEach(btn => {
          btn.addEventListener('click', () => {
            const appId = parseInt(btn.dataset.editApp, 10);
            const appData = adminAppsData[appId];
            if (appData) showEditAppModal(appData);
          });
        });

        listEl.querySelectorAll('[data-delete-app]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.deleteApp, 10);
            const app = adminAppsData[id];
            if (confirm('Delete app "' + (app ? app.name : id) + '"?')) {
              await deleteApp(id);
            }
          });
        });

      } catch (err) {
        console.error('Failed to load apps:', err);
        listEl.innerHTML = '<div class="admin-empty">Failed to load apps</div>';
      }
    }

    async function createApp(name, description, iconUrl, url, teleportPubkey) {
      try {
        const res = await fetch('/admin/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ name, description, iconUrl, url, teleportPubkey })
        });
        const data = await res.json();
        if (data.success) {
          loadApps();
          return true;
        } else {
          alert(data.error || 'Failed to create app');
          return false;
        }
      } catch (err) {
        console.error('Failed to create app:', err);
        alert('Failed to create app');
        return false;
      }
    }

    async function updateApp(id, name, description, iconUrl, url, teleportPubkey) {
      try {
        const res = await fetch('/admin/apps/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ name, description, iconUrl, url, teleportPubkey })
        });
        const data = await res.json();
        if (data.success) {
          loadApps();
          return true;
        } else {
          alert(data.error || 'Failed to update app');
          return false;
        }
      } catch (err) {
        console.error('Failed to update app:', err);
        alert('Failed to update app');
        return false;
      }
    }

    async function toggleApp(id, visible) {
      try {
        const res = await fetch('/admin/apps/' + id + '/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ visible })
        });
        const data = await res.json();
        if (data.success) {
          loadApps();
        } else {
          alert(data.error || 'Failed to toggle app');
        }
      } catch (err) {
        console.error('Failed to toggle app:', err);
        alert('Failed to toggle app');
      }
    }

    async function deleteApp(id) {
      try {
        const res = await fetch('/admin/apps/' + id, {
          method: 'DELETE',
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();
        if (data.success) {
          loadApps();
        } else {
          alert(data.error || 'Failed to delete app');
        }
      } catch (err) {
        console.error('Failed to delete app:', err);
        alert('Failed to delete app');
      }
    }

    function showEditAppModal(app) {
      document.getElementById('edit-app-id').value = app.id;
      document.getElementById('edit-app-name').value = app.name || '';
      document.getElementById('edit-app-description').value = app.description || '';
      document.getElementById('edit-app-url').value = app.url || '';
      document.getElementById('edit-app-icon-url').value = app.icon_url || '';
      document.getElementById('edit-app-teleport-pubkey').value = app.teleport_pubkey || '';
      document.getElementById('edit-app-save').disabled = false;
      document.getElementById('edit-app-save').textContent = 'Save Changes';
      document.getElementById('edit-app-groups').innerHTML = '<span class="loading-groups">Loading groups...</span>';
      document.getElementById('edit-app-modal').hidden = false;
      loadAppGroups(app.id);
    }

    async function loadAppGroups(appId) {
      try {
        const res = await fetch('/admin/apps/' + appId + '/groups', { headers: { 'X-Npub': npub } });
        const data = await res.json();
        if (data.success) {
          renderAppGroupsCheckboxes(data.groups.map(g => g.id));
        } else {
          renderAppGroupsCheckboxes([]);
        }
      } catch (err) {
        console.error('Failed to load app groups:', err);
        renderAppGroupsCheckboxes([]);
      }
    }

    function renderAppGroupsCheckboxes(selectedGroupIds) {
      const container = document.getElementById('edit-app-groups');
      if (!allGroups || allGroups.length === 0) {
        container.innerHTML = '<span class="loading-groups">No groups created yet</span>';
        return;
      }

      const selectedIdsAsNumbers = selectedGroupIds.map(id => Number(id));
      container.innerHTML = allGroups
        .filter(g => Number(g.active) === 1)
        .map(g => {
          const isSelected = selectedIdsAsNumbers.includes(Number(g.id));
          return '<label class="' + (isSelected ? 'selected' : '') + '"><input type="checkbox" value="' + g.id + '"' + (isSelected ? ' checked' : '') + '>' + escapeHtml(g.name) + '</label>';
        }).join('');

      container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          cb.parentElement.classList.toggle('selected', cb.checked);
        });
      });
    }

    async function saveAppGroups(appId) {
      const checkboxes = document.getElementById('edit-app-groups').querySelectorAll('input[type="checkbox"]:checked');
      const groupIds = Array.from(checkboxes).map(cb => parseInt(cb.value, 10));

      try {
        const res = await fetch('/admin/apps/' + appId + '/groups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ groupIds })
        });
        const data = await res.json();
        return data.success;
      } catch (err) {
        console.error('Failed to save app groups:', err);
        return false;
      }
    }

    // ===== INVITE CODES =====

    async function loadCodes() {
      const listEl = document.getElementById('codes-list');
      try {
        const res = await fetch('/admin/codes', { headers: { 'X-Npub': npub } });
        const data = await res.json();

        if (!data.success) {
          listEl.innerHTML = '<div class="admin-empty">Failed to load codes</div>';
          return;
        }

        if (data.codes.length === 0) {
          listEl.innerHTML = '<div class="admin-empty">No invite codes yet</div>';
          return;
        }

        adminCodesData = {};
        data.codes.forEach(code => adminCodesData[code.code] = code);

        listEl.innerHTML = data.codes.map(code => {
          const usageText = code.max_uses ? code.uses + '/' + code.max_uses + ' uses' : code.uses + ' uses';
          const statusText = code.active ? '' : ' (disabled)';
          const inactiveClass = code.active ? '' : ' inactive';
          const welcomeBadge = code.welcome_message ? '<span class="badge badge-info">Welcome</span>' : '';

          return '<div class="admin-item' + inactiveClass + '" data-code="' + code.code + '">' +
            '<div class="admin-item-info">' +
              '<div class="admin-item-title"><span style="font-family:monospace">' + escapeHtml(code.code) + '</span>' + statusText + ' ' + welcomeBadge + '</div>' +
              '<div class="admin-item-meta">' + usageText + (code.description ? ' - ' + escapeHtml(code.description) : '') + '</div>' +
            '</div>' +
            '<div class="admin-actions">' +
              '<button type="button" class="copy-link" data-copy-link="' + code.code + '">Copy Link</button>' +
              '<button type="button" data-edit-code="' + code.code + '">Edit</button>' +
              '<button type="button" data-toggle-code="' + code.code + '" data-active="' + code.active + '">' + (code.active ? 'Disable' : 'Enable') + '</button>' +
              '<button type="button" class="delete" data-delete-code="' + code.code + '">Delete</button>' +
            '</div>' +
          '</div>';
        }).join('');

        // Event listeners
        listEl.querySelectorAll('[data-copy-link]').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = btn.dataset.copyLink;
            const link = window.location.origin + '/?ic=' + encodeURIComponent(code);
            navigator.clipboard.writeText(link);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy Link', 2000);
          });
        });

        listEl.querySelectorAll('[data-edit-code]').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = btn.dataset.editCode;
            const codeData = adminCodesData[code];
            if (codeData) showEditCodeModal(codeData);
          });
        });

        listEl.querySelectorAll('[data-toggle-code]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const code = btn.dataset.toggleCode;
            const currentActive = btn.dataset.active === '1';
            await toggleCode(code, !currentActive);
          });
        });

        listEl.querySelectorAll('[data-delete-code]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const code = btn.dataset.deleteCode;
            if (confirm('Delete invite code "' + code + '"?')) {
              await deleteCode(code);
            }
          });
        });

      } catch (err) {
        console.error('Failed to load codes:', err);
        listEl.innerHTML = '<div class="admin-empty">Failed to load codes</div>';
      }
    }

    async function createCode(code, description, maxUses, welcomeMessage) {
      try {
        const res = await fetch('/admin/codes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ code, description, maxUses, welcomeMessage })
        });
        const data = await res.json();
        if (data.success) {
          loadCodes();
          return true;
        } else {
          alert(data.error || 'Failed to create code');
          return false;
        }
      } catch (err) {
        console.error('Failed to create code:', err);
        alert('Failed to create code');
        return false;
      }
    }

    async function updateCode(code, description, maxUses, welcomeMessage) {
      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(code), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ description, maxUses, welcomeMessage })
        });
        const data = await res.json();
        if (data.success) {
          loadCodes();
          return true;
        } else {
          alert(data.error || 'Failed to update code');
          return false;
        }
      } catch (err) {
        console.error('Failed to update code:', err);
        alert('Failed to update code');
        return false;
      }
    }

    async function toggleCode(code, active) {
      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(code) + '/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ active })
        });
        const data = await res.json();
        if (data.success) {
          loadCodes();
        } else {
          alert(data.error || 'Failed to toggle code');
        }
      } catch (err) {
        console.error('Failed to toggle code:', err);
        alert('Failed to toggle code');
      }
    }

    async function deleteCode(code) {
      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(code), {
          method: 'DELETE',
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();
        if (data.success) {
          loadCodes();
        } else {
          alert(data.error || 'Failed to delete code');
        }
      } catch (err) {
        console.error('Failed to delete code:', err);
        alert('Failed to delete code');
      }
    }

    function showEditCodeModal(codeData) {
      document.getElementById('edit-code-code').value = codeData.code;
      document.getElementById('edit-code-display').value = codeData.code;
      document.getElementById('edit-code-description').value = codeData.description || '';
      document.getElementById('edit-code-max-uses').value = codeData.max_uses || '';
      document.getElementById('edit-code-welcome-message').value = codeData.welcome_message || '';
      document.getElementById('edit-code-save').disabled = false;
      document.getElementById('edit-code-save').textContent = 'Save Changes';
      document.getElementById('edit-code-groups').innerHTML = '<span class="loading-groups">Loading groups...</span>';
      document.getElementById('edit-code-app-codes').innerHTML = '<span class="loading-groups">Loading apps...</span>';
      document.getElementById('edit-code-modal').hidden = false;
      loadCodeGroups(codeData.code);
      loadCodeAppCodes(codeData.code);
    }

    async function loadCodeGroups(code) {
      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(code) + '/groups', { headers: { 'X-Npub': npub } });
        const data = await res.json();
        if (data.success) {
          renderCodeGroupsCheckboxes(data.groups.map(g => g.id));
        } else {
          renderCodeGroupsCheckboxes([]);
        }
      } catch (err) {
        console.error('Failed to load code groups:', err);
        renderCodeGroupsCheckboxes([]);
      }
    }

    function renderCodeGroupsCheckboxes(selectedGroupIds) {
      const container = document.getElementById('edit-code-groups');
      if (!allGroups || allGroups.length === 0) {
        container.innerHTML = '<span class="loading-groups">No groups available. Create groups first.</span>';
        return;
      }

      const selectedIdsAsNumbers = selectedGroupIds.map(id => Number(id));
      container.innerHTML = allGroups
        .filter(g => Number(g.active) === 1)
        .map(g => {
          const isSelected = selectedIdsAsNumbers.includes(Number(g.id));
          return '<label class="' + (isSelected ? 'selected' : '') + '"><input type="checkbox" value="' + g.id + '"' + (isSelected ? ' checked' : '') + '>' + escapeHtml(g.name) + '</label>';
        }).join('');

      container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          cb.parentElement.classList.toggle('selected', cb.checked);
        });
      });
    }

    async function saveCodeGroups(code) {
      const checkboxes = document.getElementById('edit-code-groups').querySelectorAll('input[type="checkbox"]:checked');
      const groupIds = Array.from(checkboxes).map(cb => parseInt(cb.value, 10));

      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(code) + '/groups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ groupIds })
        });
        const data = await res.json();
        return data.success;
      } catch (err) {
        console.error('Failed to save code groups:', err);
        return false;
      }
    }

    // ===== CODE APP CODES (External App Invite Codes) =====

    async function loadCodeAppCodes(code) {
      const container = document.getElementById('edit-code-app-codes');
      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(code) + '/app-codes', { headers: { 'X-Npub': npub } });
        const data = await res.json();

        if (!data.success) {
          container.innerHTML = '<span class="no-apps-message">Failed to load apps</span>';
          return;
        }

        const teleportApps = data.apps || [];
        const existingCodes = data.appCodes || [];

        if (teleportApps.length === 0) {
          container.innerHTML = '<span class="no-apps-message">No apps with teleport keys configured</span>';
          return;
        }

        // Build a map of existing codes by app_id
        const codesByAppId = {};
        existingCodes.forEach(ac => {
          codesByAppId[ac.app_id] = ac.external_code;
        });

        container.innerHTML = teleportApps.map(app => {
          const existingCode = codesByAppId[app.id] || '';
          return '<div class="app-code-item" data-app-id="' + app.id + '">' +
            '<span class="app-name" title="' + escapeHtml(app.url) + '">' + escapeHtml(app.name) + '</span>' +
            '<input type="text" placeholder="App invite code (e.g., XXXX-XXXX-XXXX)" value="' + escapeHtml(existingCode) + '" data-original="' + escapeHtml(existingCode) + '">' +
            '<div class="app-code-actions">' +
              '<button type="button" class="save" data-save-app-code="' + app.id + '">Save</button>' +
              (existingCode ? '<button type="button" class="delete" data-delete-app-code="' + app.id + '">Clear</button>' : '') +
            '</div>' +
          '</div>';
        }).join('');

        // Add event listeners
        container.querySelectorAll('[data-save-app-code]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const appId = parseInt(btn.dataset.saveAppCode, 10);
            const item = btn.closest('.app-code-item');
            const input = item.querySelector('input');
            const externalCode = input.value.trim();

            btn.disabled = true;
            btn.textContent = '...';

            const success = await saveAppCode(code, appId, externalCode);
            if (success) {
              input.dataset.original = externalCode;
              // Refresh to update the Clear button visibility
              loadCodeAppCodes(code);
            }

            btn.disabled = false;
            btn.textContent = 'Save';
          });
        });

        container.querySelectorAll('[data-delete-app-code]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const appId = parseInt(btn.dataset.deleteAppCode, 10);

            btn.disabled = true;
            btn.textContent = '...';

            const success = await deleteAppCode(code, appId);
            if (success) {
              loadCodeAppCodes(code);
            }

            btn.disabled = false;
            btn.textContent = 'Clear';
          });
        });

      } catch (err) {
        console.error('Failed to load app codes:', err);
        container.innerHTML = '<span class="no-apps-message">Failed to load apps</span>';
      }
    }

    async function saveAppCode(inviteCode, appId, externalCode) {
      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(inviteCode) + '/app-codes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ appId, externalCode })
        });
        const data = await res.json();
        if (!data.success) {
          alert(data.error || 'Failed to save app code');
        }
        return data.success;
      } catch (err) {
        console.error('Failed to save app code:', err);
        alert('Failed to save app code');
        return false;
      }
    }

    async function deleteAppCode(inviteCode, appId) {
      try {
        const res = await fetch('/admin/codes/' + encodeURIComponent(inviteCode) + '/app-codes/' + appId, {
          method: 'DELETE',
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();
        if (!data.success) {
          alert(data.error || 'Failed to delete app code');
        }
        return data.success;
      } catch (err) {
        console.error('Failed to delete app code:', err);
        alert('Failed to delete app code');
        return false;
      }
    }

    // ===== GROUPS =====

    async function loadGroups() {
      const listEl = document.getElementById('groups-list');
      try {
        const res = await fetch('/admin/groups', { headers: { 'X-Npub': npub } });
        const data = await res.json();

        if (!data.success) {
          listEl.innerHTML = '<div class="admin-empty">Failed to load groups</div>';
          return;
        }

        allGroups = data.groups;

        if (data.groups.length === 0) {
          listEl.innerHTML = '<div class="admin-empty">No groups yet. Create groups to control app access.</div>';
          return;
        }

        listEl.innerHTML = data.groups.map(group => {
          const isActive = group.active === 1;
          const inactiveClass = isActive ? '' : ' inactive';
          const statusBadge = isActive ? '' : '<span class="badge badge-warning">Inactive</span>';
          const isExpanded = expandedGroups[group.id];

          return '<div class="admin-item' + inactiveClass + '" data-group-id="' + group.id + '">' +
            '<div class="admin-item-info">' +
              '<div class="admin-item-title">' + escapeHtml(group.name) + ' ' + statusBadge + '</div>' +
              (group.description ? '<div class="admin-item-desc">' + escapeHtml(group.description) + '</div>' : '') +
              '<button class="expand-btn" data-expand-group="' + group.id + '">' + (isExpanded ? 'Hide members' : 'Show members') + '</button>' +
              '<div class="group-members" id="group-members-' + group.id + '"' + (isExpanded ? '' : ' hidden') + '>' +
                '<div class="group-members-list" id="group-members-list-' + group.id + '"><div class="members-empty">Loading...</div></div>' +
                '<form class="add-member-form" data-add-member-group="' + group.id + '">' +
                  '<input type="text" placeholder="npub1..." required>' +
                  '<button type="submit">Add</button>' +
                '</form>' +
              '</div>' +
            '</div>' +
            '<div class="admin-actions">' +
              '<button type="button" data-toggle-group="' + group.id + '" data-active="' + (isActive ? '1' : '0') + '">' + (isActive ? 'Deactivate' : 'Activate') + '</button>' +
              '<button type="button" class="delete" data-delete-group="' + group.id + '">Delete</button>' +
            '</div>' +
          '</div>';
        }).join('');

        // Event listeners
        listEl.querySelectorAll('[data-expand-group]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const groupId = parseInt(btn.dataset.expandGroup, 10);
            const membersEl = document.getElementById('group-members-' + groupId);
            const isHidden = membersEl.hidden;
            membersEl.hidden = !isHidden;
            btn.textContent = isHidden ? 'Hide members' : 'Show members';
            expandedGroups[groupId] = isHidden;
            if (isHidden) {
              loadGroupMembers(groupId);
            }
          });
        });

        listEl.querySelectorAll('[data-toggle-group]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.toggleGroup, 10);
            const currentActive = btn.dataset.active === '1';
            await toggleGroup(id, !currentActive);
          });
        });

        listEl.querySelectorAll('[data-delete-group]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.deleteGroup, 10);
            const group = allGroups.find(g => g.id === id);
            if (confirm('Delete group "' + (group ? group.name : id) + '"? Users will be removed from this group.')) {
              await deleteGroup(id);
            }
          });
        });

        listEl.querySelectorAll('[data-add-member-group]').forEach(form => {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const groupId = parseInt(form.dataset.addMemberGroup, 10);
            const input = form.querySelector('input');
            const userNpub = input.value.trim();
            if (userNpub && userNpub.startsWith('npub1')) {
              const success = await addUserToGroup(groupId, userNpub);
              if (success) {
                input.value = '';
                loadGroupMembers(groupId);
              }
            } else {
              alert('Please enter a valid npub (starts with npub1)');
            }
          });
        });

        // Load members for any expanded groups
        Object.keys(expandedGroups).forEach(groupId => {
          if (expandedGroups[groupId]) {
            loadGroupMembers(parseInt(groupId, 10));
          }
        });

      } catch (err) {
        console.error('Failed to load groups:', err);
        listEl.innerHTML = '<div class="admin-empty">Failed to load groups</div>';
      }
    }

    async function loadGroupMembers(groupId) {
      const listEl = document.getElementById('group-members-list-' + groupId);
      try {
        const res = await fetch('/admin/groups/' + groupId + '/users', { headers: { 'X-Npub': npub } });
        const data = await res.json();

        if (!data.success) {
          listEl.innerHTML = '<div class="members-empty">Failed to load members</div>';
          return;
        }

        if (data.users.length === 0) {
          listEl.innerHTML = '<div class="members-empty">No members in this group</div>';
          return;
        }

        listEl.innerHTML = data.users.map(user => {
          const shortNpub = user.npub.slice(0, 12) + '...' + user.npub.slice(-8);
          const source = user.source === 'admin' ? '(admin)' : user.source === 'invite_code' ? '(invite)' : '';

          return '<div class="member-item" data-user-id="' + user.id + '">' +
            '<span class="member-npub" title="' + user.npub + '">' + shortNpub + '</span>' +
            '<span class="member-source">' + source + '</span>' +
            '<button class="member-remove" data-remove-user="' + user.id + '" data-group-id="' + groupId + '">Remove</button>' +
          '</div>';
        }).join('');

        listEl.querySelectorAll('[data-remove-user]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const userId = parseInt(btn.dataset.removeUser, 10);
            const gId = parseInt(btn.dataset.groupId, 10);
            if (confirm('Remove this user from the group?')) {
              await removeUserFromGroup(gId, userId);
              loadGroupMembers(gId);
            }
          });
        });

      } catch (err) {
        console.error('Failed to load group members:', err);
        listEl.innerHTML = '<div class="members-empty">Failed to load members</div>';
      }
    }

    async function createGroup(name, description) {
      try {
        const res = await fetch('/admin/groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ name, description })
        });
        const data = await res.json();
        if (data.success) {
          loadGroups();
          return true;
        } else {
          alert(data.error || 'Failed to create group');
          return false;
        }
      } catch (err) {
        console.error('Failed to create group:', err);
        alert('Failed to create group');
        return false;
      }
    }

    async function toggleGroup(id, active) {
      try {
        const res = await fetch('/admin/groups/' + id + '/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ active })
        });
        const data = await res.json();
        if (data.success) {
          loadGroups();
        } else {
          alert(data.error || 'Failed to toggle group');
        }
      } catch (err) {
        console.error('Failed to toggle group:', err);
        alert('Failed to toggle group');
      }
    }

    async function deleteGroup(id) {
      try {
        const res = await fetch('/admin/groups/' + id, {
          method: 'DELETE',
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();
        if (data.success) {
          delete expandedGroups[id];
          loadGroups();
        } else {
          alert(data.error || 'Failed to delete group');
        }
      } catch (err) {
        console.error('Failed to delete group:', err);
        alert('Failed to delete group');
      }
    }

    async function addUserToGroup(groupId, userNpub) {
      try {
        const res = await fetch('/admin/groups/' + groupId + '/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Npub': npub },
          body: JSON.stringify({ userNpub })
        });
        const data = await res.json();
        if (data.success) {
          return true;
        } else {
          alert(data.error || 'Failed to add user to group');
          return false;
        }
      } catch (err) {
        console.error('Failed to add user to group:', err);
        alert('Failed to add user to group');
        return false;
      }
    }

    async function removeUserFromGroup(groupId, userId) {
      try {
        const res = await fetch('/admin/groups/' + groupId + '/users/' + userId, {
          method: 'DELETE',
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();
        if (!data.success) {
          alert(data.error || 'Failed to remove user from group');
        }
      } catch (err) {
        console.error('Failed to remove user from group:', err);
        alert('Failed to remove user from group');
      }
    }
  </script>
</body>
</html>`;
}
