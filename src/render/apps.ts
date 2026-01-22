import { APP_NAME, NOSTR_RELAYS, ADMIN_NPUB } from "../config.ts";

export function renderAppsPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Your Apps - ${APP_NAME}</title>
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
      color: var(--text);
      min-height: 100vh;
      padding: 1.5rem;
      touch-action: manipulation;
    }

    .container {
      max-width: 560px;
      margin: 0 auto;
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

    .avatar-chip {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid var(--border);
      background: var(--surface-warm);
      color: var(--accent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .avatar-chip:hover {
      border-color: var(--purple);
      box-shadow: var(--shadow-soft);
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
    }

    /* Apps list */
    .apps-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .app-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
    }

    .app-item:hover {
      border-color: var(--purple);
      box-shadow: var(--shadow-soft);
    }

    .app-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      background: var(--border-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .app-info {
      flex: 1;
      min-width: 0;
    }

    .app-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .app-role {
      font-size: 0.875rem;
      color: var(--muted);
    }

    .app-arrow {
      color: var(--muted);
      font-size: 1.25rem;
    }

    .apps-empty {
      text-align: center;
      padding: 2rem 1rem;
      color: var(--muted);
    }

    .apps-empty p {
      margin-bottom: 0.5rem;
    }


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

    /* User menu */
    .user-menu {
      position: relative;
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: var(--surface);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 0.375rem;
      box-shadow: var(--shadow-warm);
      min-width: 160px;
      z-index: 20;
    }

    .user-dropdown button {
      width: 100%;
      background: transparent;
      border: none;
      padding: 0.6rem 0.875rem;
      text-align: left;
      cursor: pointer;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      color: var(--text);
      transition: background 0.15s;
    }

    .user-dropdown button:hover {
      background: var(--surface-warm);
    }

    .user-npub {
      padding: 0.5rem 0.875rem;
      font-size: 0.75rem;
      color: var(--muted);
      word-break: break-all;
      border-bottom: 1px solid var(--border-soft);
      margin-bottom: 0.375rem;
    }

    [hidden] {
      display: none !important;
    }

    /* Profile Modal */
    .profile-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61, 56, 51, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .profile-modal-overlay[hidden] {
      display: none;
    }

    .profile-modal {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      position: relative;
      box-shadow: var(--shadow-warm);
      border: 1px solid var(--border);
    }

    .profile-modal-close {
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

    .profile-modal-close:hover {
      color: var(--text);
    }

    .profile-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .profile-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--surface-warm);
      border: 2px solid var(--border);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--muted);
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-info {
      flex: 1;
      min-width: 0;
    }

    .profile-name {
      margin: 0;
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      word-break: break-word;
    }

    .profile-nip05 {
      margin: 0.25rem 0 0;
      color: var(--muted);
      font-size: 0.875rem;
      word-break: break-all;
    }

    .profile-about {
      margin: 0 0 1rem;
      color: var(--text-warm);
      white-space: pre-wrap;
      line-height: 1.5;
      font-size: 0.95rem;
    }

    .profile-npub {
      margin: 0 0 1rem;
      font-size: 0.75rem;
      color: var(--muted);
      word-break: break-all;
      background: var(--surface-warm);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-soft);
    }

    /* Export Key Section */
    .export-key-section {
      display: block;
      margin: 1.5rem 0 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-soft);
    }

    .export-key-section.hidden {
      display: none;
    }

    .export-key-section h3 {
      font-family: var(--font-serif);
      font-size: 1rem;
      font-weight: 400;
      margin: 0 0 0.75rem;
      color: var(--text);
    }

    .export-key-field {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .export-key-field input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      font-family: monospace;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-warm);
      color: var(--text);
    }

    .export-key-field button {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .export-key-field button:hover {
      border-color: var(--accent);
      background: var(--surface-warm);
    }

    .export-key-download {
      width: 100%;
      padding: 0.6rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-family: var(--font-body);
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s;
    }

    .export-key-download:hover {
      border-color: var(--accent);
    }

    /* Export Key Password Modal */
    .export-password-form {
      margin-top: 0.75rem;
      padding: 0.75rem;
      background: var(--surface-warm);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-soft);
    }

    .export-password-form label {
      display: block;
      font-size: 0.8rem;
      color: var(--text);
      margin-bottom: 0.35rem;
    }

    .export-password-form input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-size: 16px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      margin-bottom: 0.5rem;
      box-sizing: border-box;
    }

    .export-password-form input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .export-password-actions {
      display: flex;
      gap: 0.5rem;
    }

    .export-password-actions button {
      flex: 1;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all 0.2s;
    }

    .export-password-actions button[type="button"] {
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .export-password-actions button[type="submit"] {
      background: var(--purple);
      color: white;
      border: none;
    }

    .export-password-actions button[type="submit"]:hover {
      background: var(--purple-light);
    }

    .export-key-error {
      color: var(--error);
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    .profile-edit-btn {
      width: 100%;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-family: var(--font-body);
      font-weight: 500;
      background: var(--purple);
      color: white;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    .profile-edit-btn:hover {
      background: var(--purple-light);
    }

    .profile-edit-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .profile-edit-form h2 {
      margin: 0 0 0.5rem;
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
    }

    .profile-edit-form label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.875rem;
      color: var(--text);
    }

    .profile-edit-form input,
    .profile-edit-form textarea {
      padding: 0.6rem 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      font-size: 16px;
      font-family: var(--font-body);
      background: var(--surface);
      color: var(--text);
    }

    .profile-edit-form input:focus,
    .profile-edit-form textarea:focus {
      outline: none;
      border-color: var(--accent);
    }

    .profile-edit-form textarea {
      resize: vertical;
      min-height: 80px;
    }

    .profile-edit-status {
      text-align: center;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      margin: 0;
    }

    .profile-edit-status.success {
      background: #f0fdf4;
      color: var(--success);
      border: 1px solid #bbf7d0;
    }

    .profile-edit-status.error {
      background: #fef2f2;
      color: var(--error);
      border: 1px solid #fecaca;
    }

    .profile-edit-actions {
      display: flex;
      gap: 0.75rem;
    }

    .profile-edit-actions button {
      flex: 1;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all 0.2s;
    }

    .profile-edit-actions button[type="button"] {
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .profile-edit-actions button[type="button"]:hover {
      border-color: var(--accent);
    }

    .profile-edit-actions button[type="submit"] {
      background: var(--purple);
      color: white;
      border: none;
    }

    .profile-edit-actions button[type="submit"]:hover {
      background: var(--purple-light);
    }

    .profile-edit-actions button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .profile-loading {
      text-align: center;
      padding: 2rem 1rem;
      color: var(--muted);
    }

    /* Teleport Modal */
    .teleport-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61, 56, 51, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .teleport-modal-overlay[hidden] {
      display: none;
    }

    .teleport-modal {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      position: relative;
      box-shadow: var(--shadow-warm);
      border: 1px solid var(--border);
      text-align: center;
    }

    .teleport-modal-close {
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

    .teleport-modal-close:hover {
      color: var(--text);
    }

    .teleport-modal h2 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 0.75rem;
    }

    .teleport-modal p {
      color: var(--muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .teleport-instructions {
      color: var(--text-warm);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }

    .teleport-btn {
      width: 100%;
      padding: 0.875rem;
      font-size: 1rem;
      font-family: var(--font-body);
      font-weight: 500;
      background: var(--purple);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background 0.2s;
    }

    .teleport-btn:hover {
      background: var(--purple-light);
    }

    .teleport-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .teleport-error {
      color: var(--error);
      font-size: 0.875rem;
      margin-top: 0.75rem;
    }

    .teleport-error[hidden] {
      display: none;
    }

    /* Welcome Message Component */
    .welcome-message-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-soft);
      overflow: hidden;
    }

    .welcome-message-card[hidden] {
      display: none;
    }

    .welcome-message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      cursor: pointer;
      background: var(--surface-warm);
      border-bottom: 1px solid var(--border-soft);
      transition: background 0.2s;
    }

    .welcome-message-header:hover {
      background: var(--border-soft);
    }

    .welcome-message-header h2 {
      font-family: var(--font-serif);
      font-size: 1rem;
      font-weight: 400;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .welcome-message-header .chevron {
      color: var(--muted);
      transition: transform 0.2s;
    }

    .welcome-message-card.collapsed .welcome-message-header .chevron {
      transform: rotate(-90deg);
    }

    .welcome-message-card.collapsed .welcome-message-content {
      display: none;
    }

    .welcome-message-content {
      padding: 1.5rem;
    }

    .welcome-message-content .markdown-body {
      line-height: 1.6;
      color: var(--text);
    }

    .welcome-message-content .markdown-body h1 {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      font-weight: 400;
      margin: 0 0 1rem;
    }

    .welcome-message-content .markdown-body h2 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      margin: 1.5rem 0 0.75rem;
    }

    .welcome-message-content .markdown-body h3 {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 400;
      margin: 1.25rem 0 0.5rem;
    }

    .welcome-message-content .markdown-body p {
      margin: 0 0 1rem;
    }

    .welcome-message-content .markdown-body ul,
    .welcome-message-content .markdown-body ol {
      margin: 0 0 1rem;
      padding-left: 1.5rem;
    }

    .welcome-message-content .markdown-body li {
      margin-bottom: 0.25rem;
    }

    .welcome-message-content .markdown-body code {
      background: var(--surface-warm);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .welcome-message-content .markdown-body pre {
      background: var(--surface-warm);
      padding: 1rem;
      border-radius: var(--radius-sm);
      overflow-x: auto;
      margin: 0 0 1rem;
    }

    .welcome-message-content .markdown-body pre code {
      background: none;
      padding: 0;
    }

    .welcome-message-content .markdown-body a {
      color: var(--purple);
    }

    .welcome-message-content .markdown-body blockquote {
      margin: 0 0 1rem;
      padding-left: 1rem;
      border-left: 3px solid var(--border);
      color: var(--text-warm);
    }

    .welcome-message-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid var(--border-soft);
      margin-top: 1rem;
    }

    .welcome-message-dismiss {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-family: var(--font-body);
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
    }

    .welcome-message-dismiss:hover {
      border-color: var(--purple);
      color: var(--purple);
    }

    /* Invite Codes Component */
    .invite-codes-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-soft);
      overflow: hidden;
    }

    .invite-codes-card[hidden] {
      display: none;
    }

    .invite-codes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      cursor: pointer;
      background: var(--surface-warm);
      border-bottom: 1px solid var(--border-soft);
      transition: background 0.2s;
    }

    .invite-codes-header:hover {
      background: var(--border-soft);
    }

    .invite-codes-header h2 {
      font-family: var(--font-serif);
      font-size: 1rem;
      font-weight: 400;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .invite-codes-header .chevron {
      color: var(--muted);
      transition: transform 0.2s;
    }

    .invite-codes-card.collapsed .invite-codes-header .chevron {
      transform: rotate(-90deg);
    }

    .invite-codes-card.collapsed .invite-codes-content {
      display: none;
    }

    .invite-codes-content {
      padding: 1.5rem;
    }

    .invite-codes-intro {
      margin: 0 0 1rem;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .invite-codes-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .invite-code-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.875rem 1rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
    }

    .invite-code-app {
      font-weight: 500;
      color: var(--text);
    }

    .invite-code-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .invite-code-value code {
      font-family: monospace;
      font-size: 0.9rem;
      background: var(--bg);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      border: 1px solid var(--border);
      color: var(--text);
    }

    .invite-code-copy {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-family: var(--font-body);
      background: var(--surface);
      color: var(--muted);
      border: 1px solid var(--border);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .invite-code-copy:hover {
      border-color: var(--purple);
      color: var(--purple);
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="page-header">
      <h1>Other Stuff</h1>
      <div class="user-menu">
        <button class="avatar-chip" id="avatar-btn" title="Account menu">
          <span id="avatar-fallback">...</span>
        </button>
        <div class="user-dropdown" id="user-dropdown" hidden>
          <div class="user-npub" id="user-npub">...</div>
          <button type="button" id="view-profile-btn">View Profile</button>
          <button type="button" id="copy-npub">Copy ID</button>
          <button type="button" id="admin-link-btn" hidden>Admin</button>
          <button type="button" id="logout-btn">Log out</button>
        </div>
      </div>
    </header>

    <!-- Welcome Message Component -->
    <div class="welcome-message-card" id="welcome-message-card" hidden>
      <div class="welcome-message-header" id="welcome-message-header">
        <h2>Welcome Message</h2>
        <span class="chevron">&#9660;</span>
      </div>
      <div class="welcome-message-content">
        <div class="markdown-body" id="welcome-message-body"></div>
        <div class="welcome-message-actions" id="welcome-message-actions">
          <button class="welcome-message-dismiss" id="welcome-message-dismiss">Dismiss</button>
        </div>
      </div>
    </div>

    <!-- Invite Codes Component -->
    <div class="invite-codes-card" id="invite-codes-card" hidden>
      <div class="invite-codes-header" id="invite-codes-header">
        <h2>Your Invite Codes</h2>
        <span class="chevron">&#9660;</span>
      </div>
      <div class="invite-codes-content">
        <p class="invite-codes-intro">The following invite codes have been assigned to you for use in other apps:</p>
        <div class="invite-codes-list" id="invite-codes-list"></div>
      </div>
    </div>

    <div class="card">
      <h2>Your Apps</h2>
      <div class="apps-list" id="apps-list">
        <div class="apps-empty">
          <p>No apps available yet.</p>
        </div>
      </div>
    </div>


  </div>

  <!-- Profile Modal -->
  <div class="profile-modal-overlay" id="profile-modal" hidden>
    <div class="profile-modal">
      <button class="profile-modal-close" type="button" id="profile-close" aria-label="Close">&times;</button>

      <div class="profile-loading" id="profile-loading">Loading profile...</div>

      <div class="profile-view" id="profile-view" hidden>
        <div class="profile-header">
          <div class="profile-avatar" id="profile-avatar">
            <span id="profile-avatar-fallback"></span>
          </div>
          <div class="profile-info">
            <h2 class="profile-name" id="profile-name">Anonymous</h2>
            <p class="profile-nip05" id="profile-nip05"></p>
          </div>
        </div>
        <p class="profile-about" id="profile-about"></p>
        <p class="profile-npub" id="profile-npub-display"></p>

        <!-- Export Key Section (only shown if user has nsec) -->
        <div class="export-key-section hidden" id="export-key-section">
          <h3>Export Key</h3>
          <div class="export-key-field">
            <input type="password" id="export-key-input" readonly />
            <button type="button" id="export-key-toggle" title="Show/hide key">👁</button>
            <button type="button" id="export-key-copy" title="Copy to clipboard">Copy</button>
          </div>
          <button type="button" class="export-key-download" id="export-key-download">Download Encrypted Backup</button>
          <form class="export-password-form" id="export-password-form" hidden>
            <label for="export-password-input">Enter a password to encrypt your backup:</label>
            <input type="password" id="export-password-input" placeholder="Password" autocomplete="new-password" />
            <div class="export-password-actions">
              <button type="button" id="export-password-cancel">Cancel</button>
              <button type="submit" id="export-password-submit">Download</button>
            </div>
          </form>
          <p class="export-key-error" id="export-key-error" hidden></p>
        </div>

        <button type="button" class="profile-edit-btn" id="profile-edit-btn">Edit Profile</button>
      </div>

      <form class="profile-edit-form" id="profile-edit-form" hidden>
        <h2>Edit Profile</h2>
        <label>
          Display Name
          <input type="text" name="displayName" id="profile-edit-name" placeholder="Your name" />
        </label>
        <label>
          About
          <textarea name="about" id="profile-edit-about" rows="3" placeholder="Tell us about yourself"></textarea>
        </label>
        <label>
          Profile Picture URL
          <input type="url" name="picture" id="profile-edit-picture" placeholder="https://..." />
        </label>
        <p class="profile-edit-status" id="profile-edit-status" hidden></p>
        <div class="profile-edit-actions">
          <button type="button" id="profile-edit-cancel">Cancel</button>
          <button type="submit" id="profile-edit-save">Save Profile</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Teleport Modal for Key Transfer -->
  <div class="teleport-modal-overlay" id="teleport-modal" hidden>
    <div class="teleport-modal">
      <button class="teleport-modal-close" type="button" id="teleport-close" aria-label="Close">&times;</button>
      <h2>Transfer Identity</h2>
      <p>Click below to copy your unlock code and open <strong id="teleport-app-name"></strong>.</p>
      <p class="teleport-instructions">Paste the code when prompted to complete login.</p>
      <button id="teleport-copy-open" class="teleport-btn">Copy Code &amp; Open App</button>
      <p class="teleport-error" id="teleport-error" hidden></p>
    </div>
  </div>

  <script type="module">
    import { nip19, finalizeEvent, getPublicKey, generateSecretKey } from 'https://esm.sh/nostr-tools@2.7.2';
    import { Relay } from 'https://esm.sh/nostr-tools@2.7.2/relay';
    import * as nip44 from 'https://esm.sh/nostr-tools@2.7.2/nip44';
    import { encrypt as nip49Encrypt } from 'https://esm.sh/nostr-tools@2.7.2/nip49';
    import Dexie from 'https://esm.sh/dexie@4.0.4';

    // Initialize Dexie database for profile and secrets
    const db = new Dexie('OtherStuffDB');
    db.version(3).stores({
      profiles: 'npub, name, about, picture, nip05, updatedAt',
      secrets: 'npub',  // Stores encrypted nsec with salt and iv
      assets: 'url'     // Cached images/assets as blobs
    });

    // ============================================
    // Web Crypto helpers for encrypted key storage
    // ============================================

    // Derive an AES-GCM key from password using PBKDF2
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
        true,  // extractable for storage
        ['encrypt', 'decrypt']
      );
    }

    // Export CryptoKey to storable format
    async function exportKey(key) {
      const exported = await crypto.subtle.exportKey('raw', key);
      return new Uint8Array(exported);
    }

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

    // Encrypt nsec with AES-GCM
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

    // Store encrypted nsec in Dexie
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

    // Check if we have encrypted nsec stored
    async function hasStoredNsec(npub) {
      const stored = await db.secrets.get(npub);
      return !!stored;
    }

    // ============================================

    const RELAYS = ${JSON.stringify(NOSTR_RELAYS)};
    const ADMIN_NPUB = ${JSON.stringify(ADMIN_NPUB)};

    const avatarBtn = document.getElementById('avatar-btn');
    const avatarFallback = document.getElementById('avatar-fallback');
    const userDropdown = document.getElementById('user-dropdown');
    const userNpubEl = document.getElementById('user-npub');
    const copyNpubBtn = document.getElementById('copy-npub');
    const logoutBtn = document.getElementById('logout-btn');
    const viewProfileBtn = document.getElementById('view-profile-btn');

    // Invite codes elements
    const inviteCodesCard = document.getElementById('invite-codes-card');
    const inviteCodesHeader = document.getElementById('invite-codes-header');
    const inviteCodesList = document.getElementById('invite-codes-list');

    // Teleport modal elements
    const teleportModal = document.getElementById('teleport-modal');
    const teleportCloseBtn = document.getElementById('teleport-close');
    const teleportCopyOpenBtn = document.getElementById('teleport-copy-open');
    const teleportError = document.getElementById('teleport-error');
    const teleportAppName = document.getElementById('teleport-app-name');

    // Current teleport target
    let teleportTarget = null;

    // Profile modal elements
    const profileModal = document.getElementById('profile-modal');
    const profileCloseBtn = document.getElementById('profile-close');
    const profileLoading = document.getElementById('profile-loading');
    const profileView = document.getElementById('profile-view');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileAvatarFallback = document.getElementById('profile-avatar-fallback');
    const profileName = document.getElementById('profile-name');
    const profileNip05 = document.getElementById('profile-nip05');
    const profileAbout = document.getElementById('profile-about');
    const profileNpubDisplay = document.getElementById('profile-npub-display');
    const profileEditBtn = document.getElementById('profile-edit-btn');
    const profileEditForm = document.getElementById('profile-edit-form');
    const profileEditName = document.getElementById('profile-edit-name');
    const profileEditAbout = document.getElementById('profile-edit-about');
    const profileEditPicture = document.getElementById('profile-edit-picture');
    const profileEditStatus = document.getElementById('profile-edit-status');
    const profileEditCancel = document.getElementById('profile-edit-cancel');
    const profileEditSave = document.getElementById('profile-edit-save');

    // Export key elements
    const exportKeySection = document.getElementById('export-key-section');
    const exportKeyInput = document.getElementById('export-key-input');
    const exportKeyToggle = document.getElementById('export-key-toggle');
    const exportKeyCopy = document.getElementById('export-key-copy');
    const exportKeyDownload = document.getElementById('export-key-download');
    const exportPasswordForm = document.getElementById('export-password-form');
    const exportPasswordInput = document.getElementById('export-password-input');
    const exportPasswordCancel = document.getElementById('export-password-cancel');
    const exportKeyError = document.getElementById('export-key-error');

    // Welcome message elements
    const welcomeMessageCard = document.getElementById('welcome-message-card');
    const welcomeMessageHeader = document.getElementById('welcome-message-header');
    const welcomeMessageBody = document.getElementById('welcome-message-body');
    const welcomeMessageActions = document.getElementById('welcome-message-actions');
    const welcomeMessageDismiss = document.getElementById('welcome-message-dismiss');

    // Get session data
    const npub = sessionStorage.getItem('npub');
    let nsec = sessionStorage.getItem('nsec');  // May be null if using encrypted storage
    const onboarded = sessionStorage.getItem('onboarded');
    const cachedAvatar = sessionStorage.getItem('avatarUrl');
    const cachedName = sessionStorage.getItem('displayName');

    // Current profile data
    let currentProfile = { name: '', about: '', picture: '', nip05: '' };

    // Load nsec from encrypted Dexie storage if available
    async function initializeNsec() {
      if (nsec) return;  // Already have nsec from sessionStorage (raw nsec login)
      if (!npub) return;

      const decrypted = await loadDecryptedNsec(npub);
      if (decrypted) {
        nsec = decrypted;
      }
    }

    // Update header avatar with image or fallback
    function updateHeaderAvatar(pictureUrl, name) {
      const fallback = npub ? npub.replace(/^npub1/, '').slice(0, 2).toUpperCase() : '??';
      if (pictureUrl) {
        avatarBtn.innerHTML = '<img src="' + pictureUrl + '" alt="' + escapeHtml(name || 'Profile') + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.innerHTML=\\'' + fallback + '\\'"/>';
      } else {
        avatarBtn.innerHTML = '<span id="avatar-fallback">' + fallback + '</span>';
      }
    }

    // Cache profile data in sessionStorage
    async function cacheProfile(profile) {
      // Save to sessionStorage for quick access
      if (profile.picture) {
        sessionStorage.setItem('avatarUrl', profile.picture);
      } else {
        sessionStorage.removeItem('avatarUrl');
      }
      if (profile.name) {
        sessionStorage.setItem('displayName', profile.name);
      } else {
        sessionStorage.removeItem('displayName');
      }

      // Save to Dexie for persistence across sessions
      if (npub) {
        try {
          await db.profiles.put({
            npub,
            name: profile.name || '',
            about: profile.about || '',
            picture: profile.picture || '',
            nip05: profile.nip05 || '',
            updatedAt: Date.now()
          });
        } catch (err) {
          console.warn('Failed to cache profile to Dexie:', err);
        }
      }
    }

    // Load cached profile from Dexie
    async function loadCachedProfile() {
      if (!npub) return null;
      try {
        return await db.profiles.get(npub);
      } catch (err) {
        console.warn('Failed to load cached profile from Dexie:', err);
        return null;
      }
    }

    // Validate session - if npub is missing or invalid, clear and redirect
    if (!npub || !npub.startsWith('npub1')) {
      sessionStorage.clear();
      window.location.href = '/?logout';
    } else if (!onboarded) {
      window.location.href = '/onboarding';
    } else {
      // Initialize with Dexie cached profile and encrypted nsec
      (async () => {
        // Load encrypted nsec from Dexie
        await initializeNsec();

        let displayName = cachedName;
        let avatarUrl = cachedAvatar;

        // Try to load from Dexie if sessionStorage is empty
        if (!displayName || !avatarUrl) {
          const cached = await loadCachedProfile();
          if (cached) {
            displayName = cached.name || displayName;
            avatarUrl = cached.picture || avatarUrl;
            // Sync back to sessionStorage
            if (cached.name) sessionStorage.setItem('displayName', cached.name);
            if (cached.picture) sessionStorage.setItem('avatarUrl', cached.picture);
          }
        }

        updateHeaderAvatar(avatarUrl, displayName);
        userNpubEl.textContent = displayName || npub.slice(0, 12) + '...';
      })();
    }

    // Toggle dropdown
    avatarBtn.addEventListener('click', () => {
      userDropdown.hidden = !userDropdown.hidden;
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        userDropdown.hidden = true;
      }
    });

    // Copy npub
    copyNpubBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(npub);
      copyNpubBtn.textContent = 'Copied!';
      setTimeout(() => copyNpubBtn.textContent = 'Copy ID', 2000);
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = '/';
    });


    // === App Display and Teleport Functions ===

    let userApps = [];
    let userInviteCodes = {}; // Map of appId -> invite code

    async function loadUserApps() {
      try {
        const res = await fetch('/api/apps', {
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();

        if (!data.success || data.apps.length === 0) {
          return;
        }

        userApps = data.apps;
        renderUserApps();
      } catch (err) {
        console.error('Failed to load apps:', err);
      }
    }

    function renderUserApps() {
      const appsList = document.getElementById('apps-list');
      if (userApps.length === 0) {
        return;
      }

      appsList.innerHTML = userApps.map(app => {
        const iconHtml = app.icon_url
          ? '<img src="' + app.icon_url + '" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML=String.fromCharCode(128241)">'
          : '📱';
        const hasTeleport = !!app.teleport_pubkey;

        return '<div class="app-item' + (hasTeleport ? ' teleport-enabled' : '') + '" data-app-id="' + app.id + '" data-has-teleport="' + hasTeleport + '">' +
          '<div class="app-icon">' + iconHtml + '</div>' +
          '<div class="app-info">' +
            '<div class="app-name">' + escapeHtml(app.name) + '</div>' +
            '<div class="app-role">' + (app.description || 'Member') + '</div>' +
          '</div>' +
          '<span class="app-arrow">&rarr;</span>' +
        '</div>';
      }).join('');

      // Add click handlers
      appsList.querySelectorAll('.app-item').forEach(item => {
        item.addEventListener('click', () => {
          const appId = parseInt(item.dataset.appId, 10);
          const app = userApps.find(a => a.id === appId);
          if (!app) return;

          if (app.teleport_pubkey && nsec) {
            // Show teleport modal for key transfer
            showTeleportModal(app);
          } else {
            // Direct navigation
            window.open(app.url, '_blank');
          }
        });
      });
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Teleport modal helper functions
    function showTeleportError(message) {
      teleportError.textContent = message;
      teleportError.hidden = false;
    }

    function hideTeleportError() {
      teleportError.hidden = true;
    }

    function showTeleportModal(app) {
      teleportTarget = app;
      teleportAppName.textContent = app.name;
      hideTeleportError();
      teleportCopyOpenBtn.disabled = false;
      teleportCopyOpenBtn.textContent = 'Copy Code & Open App';
      teleportModal.hidden = false;
    }

    function hideTeleportModal() {
      teleportModal.hidden = true;
      teleportTarget = null;
      hideTeleportError();
    }

    function generateHashId() {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    }

    async function performTeleport() {
      if (!teleportTarget || !nsec) return;

      teleportCopyOpenBtn.disabled = true;
      teleportCopyOpenBtn.textContent = 'Processing...';
      hideTeleportError();

      try {
        // Decode nsec to get secret key bytes
        const { type, data: secretKey } = nip19.decode(nsec);
        if (type !== 'nsec') throw new Error('Invalid nsec');

        // Generate throwaway keypair
        const throwawayPrivkey = generateSecretKey();
        const throwawayPubkey = getPublicKey(throwawayPrivkey);

        // Encrypt nsec with NIP-44 using conversation key(user, throwaway)
        const conversationKey = nip44.v2.utils.getConversationKey(secretKey, throwawayPubkey);
        const encryptedNsec = nip44.v2.encrypt(nsec, conversationKey);

        // Generate unique hash ID
        const hashId = generateHashId();

        // Get base URL for the API route
        const baseUrl = window.location.origin;

        // Store on server and get the NIP-44 encrypted blob
        const res = await fetch('/api/teleport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hashId,
            encryptedNsec,
            npub,  // User's public key - needed by remote app for decryption
            appId: teleportTarget.id,
            baseUrl
          })
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to store teleport key');
        }

        // Build teleport URL with NIP-44 encrypted blob and invite code if available
        let teleportUrl = teleportTarget.url + (teleportTarget.url.includes('?') ? '&' : '?') + 'keyteleport=' + encodeURIComponent(data.blob);

        // Add invite code if one exists for this app
        const inviteCode = userInviteCodes[teleportTarget.id];
        if (inviteCode) {
          teleportUrl += '&ic=' + encodeURIComponent(inviteCode);
        }

        // Copy throwaway nsec to clipboard (the unlock code)
        const throwawayNsec = nip19.nsecEncode(throwawayPrivkey);
        await navigator.clipboard.writeText(throwawayNsec);

        // Open remote app
        window.open(teleportUrl, '_blank');

        hideTeleportModal();
      } catch (err) {
        console.error('Teleport error:', err);
        showTeleportError(err.message || 'Failed to transfer identity');
        teleportCopyOpenBtn.disabled = false;
        teleportCopyOpenBtn.textContent = 'Copy Code & Open App';
      }
    }

    // Teleport Modal Event Listeners
    teleportCloseBtn.addEventListener('click', hideTeleportModal);

    teleportModal.addEventListener('click', (e) => {
      if (e.target === teleportModal) {
        hideTeleportModal();
      }
    });

    // Copy & Open button click
    teleportCopyOpenBtn.addEventListener('click', performTeleport);

    // Keyboard escape to close teleport modal
    document.addEventListener('keydown', (e) => {
      if (teleportModal.hidden) return;
      if (e.key === 'Escape') {
        hideTeleportModal();
      }
    });

    // === Welcome Message Functions ===

    // Simple markdown to HTML converter
    function parseMarkdown(md) {
      if (!md) return '';

      // Helper for inline formatting
      function formatInline(text) {
        // Bold+italic (***text***)
        while (text.includes('***')) {
          const start = text.indexOf('***');
          const end = text.indexOf('***', start + 3);
          if (end === -1) break;
          text = text.slice(0, start) + '<strong><em>' + text.slice(start + 3, end) + '</em></strong>' + text.slice(end + 3);
        }
        // Bold (**text**)
        while (text.includes('**')) {
          const start = text.indexOf('**');
          const end = text.indexOf('**', start + 2);
          if (end === -1) break;
          text = text.slice(0, start) + '<strong>' + text.slice(start + 2, end) + '</strong>' + text.slice(end + 2);
        }
        // Italic (*text*)
        while (text.includes('*')) {
          const start = text.indexOf('*');
          const end = text.indexOf('*', start + 1);
          if (end === -1) break;
          text = text.slice(0, start) + '<em>' + text.slice(start + 1, end) + '</em>' + text.slice(end + 1);
        }
        // Code (\`text\`)
        while (text.includes('\`')) {
          const start = text.indexOf('\`');
          const end = text.indexOf('\`', start + 1);
          if (end === -1) break;
          text = text.slice(0, start) + '<code>' + text.slice(start + 1, end) + '</code>' + text.slice(end + 1);
        }
        return text;
      }

      // Process line by line
      const lines = md.split(String.fromCharCode(10));
      let html = '';
      let inList = false;

      for (let line of lines) {
        // Escape HTML first
        line = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Headers
        if (line.startsWith('### ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<h3>' + formatInline(line.slice(4)) + '</h3>';
        } else if (line.startsWith('## ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<h2>' + formatInline(line.slice(3)) + '</h2>';
        } else if (line.startsWith('# ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<h1>' + formatInline(line.slice(2)) + '</h1>';
        } else if (line.startsWith('&gt; ')) {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<blockquote>' + formatInline(line.slice(5)) + '</blockquote>';
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          if (!inList) { html += '<ul>'; inList = true; }
          html += '<li>' + formatInline(line.slice(2)) + '</li>';
        } else if (line.trim() === '') {
          if (inList) { html += '</ul>'; inList = false; }
        } else {
          if (inList) { html += '</ul>'; inList = false; }
          html += '<p>' + formatInline(line) + '</p>';
        }
      }

      if (inList) html += '</ul>';

      return html;
    }

    async function loadWelcomeMessage() {
      try {
        const res = await fetch('/api/welcome', {
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();

        if (!data.success || !data.welcomeMessage) {
          // No welcome message, hide the card
          welcomeMessageCard.hidden = true;
          return;
        }

        // Render markdown
        welcomeMessageBody.innerHTML = parseMarkdown(data.welcomeMessage);
        welcomeMessageCard.hidden = false;

        if (data.dismissed) {
          // Already dismissed - show collapsed
          welcomeMessageCard.classList.add('collapsed');
          welcomeMessageActions.hidden = true;
        } else {
          // Not dismissed - show expanded
          welcomeMessageCard.classList.remove('collapsed');
          welcomeMessageActions.hidden = false;
        }
      } catch (err) {
        console.error('Failed to load welcome message:', err);
        welcomeMessageCard.hidden = true;
      }
    }

    async function dismissWelcomeMessage() {
      try {
        const res = await fetch('/api/welcome/dismiss', {
          method: 'POST',
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();

        if (data.success) {
          // Collapse the card and hide dismiss button
          welcomeMessageCard.classList.add('collapsed');
          welcomeMessageActions.hidden = true;
        }
      } catch (err) {
        console.error('Failed to dismiss welcome message:', err);
      }
    }

    // Welcome message event listeners
    welcomeMessageHeader.addEventListener('click', () => {
      welcomeMessageCard.classList.toggle('collapsed');
    });

    welcomeMessageDismiss.addEventListener('click', () => {
      dismissWelcomeMessage();
    });

    // Load welcome message on page load
    loadWelcomeMessage();

    // === Invite Codes Functions ===

    async function loadInviteCodes() {
      try {
        const res = await fetch('/api/user/invite-codes', {
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();

        if (!data.success || !data.inviteCodes || data.inviteCodes.length === 0) {
          // No invite codes, hide the card
          inviteCodesCard.hidden = true;
          return;
        }

        // Store invite codes for teleport use
        data.inviteCodes.forEach(ic => {
          userInviteCodes[ic.appId] = ic.code;
        });

        // Render invite codes
        inviteCodesList.innerHTML = data.inviteCodes.map(ic =>
          '<div class="invite-code-item">' +
            '<span class="invite-code-app">' + escapeHtml(ic.appName) + '</span>' +
            '<div class="invite-code-value">' +
              '<code>' + escapeHtml(ic.code) + '</code>' +
              '<button class="invite-code-copy" data-code="' + escapeHtml(ic.code) + '">Copy</button>' +
            '</div>' +
          '</div>'
        ).join('');

        inviteCodesCard.hidden = false;

        // Add copy handlers
        inviteCodesList.querySelectorAll('.invite-code-copy').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const code = e.target.dataset.code;
            await navigator.clipboard.writeText(code);
            e.target.textContent = 'Copied!';
            setTimeout(() => e.target.textContent = 'Copy', 2000);
          });
        });
      } catch (err) {
        console.error('Failed to load invite codes:', err);
        inviteCodesCard.hidden = true;
      }
    }

    // Invite codes event listeners
    inviteCodesHeader.addEventListener('click', () => {
      inviteCodesCard.classList.toggle('collapsed');
    });

    // Load invite codes on page load
    loadInviteCodes();

    // Load user apps on page load
    loadUserApps();

    // === Profile Modal Functions ===

    async function fetchProfile() {
      if (!npub) return null;

      try {
        const { type, data: pubkey } = nip19.decode(npub);
        if (type !== 'npub') return null;

        // Try each relay until we get a profile
        for (const url of RELAYS) {
          try {
            const relay = await Relay.connect(url);

            const profile = await new Promise((resolve, reject) => {
              let found = null;
              const timeout = setTimeout(() => {
                relay.close();
                resolve(found);
              }, 5000);

              const sub = relay.subscribe([
                { kinds: [0], authors: [pubkey], limit: 1 }
              ], {
                onevent(event) {
                  try {
                    found = JSON.parse(event.content);
                  } catch (e) {
                    console.warn('Failed to parse profile:', e);
                  }
                },
                oneose() {
                  clearTimeout(timeout);
                  relay.close();
                  resolve(found);
                }
              });
            });

            if (profile) return profile;
          } catch (err) {
            console.warn('Failed to connect to relay:', url, err);
          }
        }

        return null;
      } catch (err) {
        console.error('Error fetching profile:', err);
        return null;
      }
    }

    function displayProfile(profile) {
      profileLoading.hidden = true;
      profileView.hidden = false;
      profileEditForm.hidden = true;

      currentProfile = {
        name: profile?.name || '',
        about: profile?.about || '',
        picture: profile?.picture || '',
        nip05: profile?.nip05 || ''
      };

      // Cache profile and update header avatar and dropdown name
      cacheProfile(currentProfile);
      updateHeaderAvatar(currentProfile.picture, currentProfile.name);
      userNpubEl.textContent = currentProfile.name || npub.slice(0, 12) + '...';

      // Avatar
      if (currentProfile.picture) {
        profileAvatar.innerHTML = '<img src="' + currentProfile.picture + '" alt="Profile" onerror="this.parentElement.innerHTML=\\'<span>' + npub.replace(/^npub1/, '').slice(0, 2).toUpperCase() + '</span>\\'" />';
      } else {
        profileAvatarFallback.textContent = npub.replace(/^npub1/, '').slice(0, 2).toUpperCase();
        profileAvatar.innerHTML = '<span>' + profileAvatarFallback.textContent + '</span>';
      }

      // Name
      profileName.textContent = currentProfile.name || 'Anonymous';

      // NIP-05
      if (currentProfile.nip05) {
        profileNip05.textContent = currentProfile.nip05;
        profileNip05.hidden = false;
      } else {
        profileNip05.hidden = true;
      }

      // About
      if (currentProfile.about) {
        profileAbout.textContent = currentProfile.about;
        profileAbout.hidden = false;
      } else {
        profileAbout.hidden = true;
      }

      // Npub
      profileNpubDisplay.textContent = npub;

      // Export key section - only show if user has nsec (loaded from Dexie or sessionStorage)
      if (nsec) {
        exportKeySection.classList.remove('hidden');
        exportKeyInput.value = nsec;
        exportKeyInput.type = 'password';
        exportKeyToggle.textContent = '👁';
        exportPasswordForm.hidden = true;
        exportKeyError.hidden = true;
      } else {
        exportKeySection.classList.add('hidden');
      }

      // Only show edit button if we have nsec
      profileEditBtn.hidden = !nsec;
    }

    function showEditForm() {
      profileView.hidden = true;
      profileEditForm.hidden = false;
      profileEditStatus.hidden = true;

      profileEditName.value = currentProfile.name;
      profileEditAbout.value = currentProfile.about;
      profileEditPicture.value = currentProfile.picture;
    }

    function showProfileView() {
      profileEditForm.hidden = true;
      profileView.hidden = false;
    }

    async function saveProfile() {
      if (!nsec) return;

      profileEditSave.disabled = true;
      profileEditSave.textContent = 'Saving...';
      profileEditStatus.hidden = true;

      try {
        const { type, data: secretKey } = nip19.decode(nsec);
        if (type !== 'nsec') throw new Error('Invalid nsec');

        const pubkey = getPublicKey(secretKey);

        const newProfile = {
          name: profileEditName.value.trim(),
          about: profileEditAbout.value.trim(),
          picture: profileEditPicture.value.trim(),
          nip05: currentProfile.nip05 // preserve existing nip05
        };

        const event = finalizeEvent({
          kind: 0,
          created_at: Math.floor(Date.now() / 1000),
          tags: [],
          content: JSON.stringify(newProfile)
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

        if (published > 0) {
          currentProfile = newProfile;
          displayProfile(newProfile); // This also caches profile and updates header avatar

          profileEditStatus.textContent = 'Profile updated!';
          profileEditStatus.className = 'profile-edit-status success';
          profileEditStatus.hidden = false;

          setTimeout(() => {
            showProfileView();
          }, 1500);
        } else {
          throw new Error('Could not publish to any relay');
        }
      } catch (err) {
        console.error('Failed to save profile:', err);
        profileEditStatus.textContent = 'Failed to save profile. Please try again.';
        profileEditStatus.className = 'profile-edit-status error';
        profileEditStatus.hidden = false;
      } finally {
        profileEditSave.disabled = false;
        profileEditSave.textContent = 'Save Profile';
      }
    }

    // === Profile Modal Event Listeners ===

    viewProfileBtn.addEventListener('click', async () => {
      userDropdown.hidden = true;
      profileModal.hidden = false;
      profileLoading.hidden = false;
      profileView.hidden = true;
      profileEditForm.hidden = true;

      const profile = await fetchProfile();
      displayProfile(profile);
    });

    profileCloseBtn.addEventListener('click', () => {
      profileModal.hidden = true;
    });

    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) {
        profileModal.hidden = true;
      }
    });

    profileEditBtn.addEventListener('click', showEditForm);
    profileEditCancel.addEventListener('click', showProfileView);

    profileEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProfile();
    });

    // === Export Key Handlers ===

    // Toggle key visibility
    exportKeyToggle.addEventListener('click', () => {
      if (exportKeyInput.type === 'password') {
        exportKeyInput.type = 'text';
        exportKeyToggle.textContent = '🙈';
      } else {
        exportKeyInput.type = 'password';
        exportKeyToggle.textContent = '👁';
      }
    });

    // Copy key with confirmation
    exportKeyCopy.addEventListener('click', async () => {
      const confirmed = confirm(
        'Warning: Your private key gives full control of your Nostr identity.\\n\\n' +
        'Only copy this if you understand the risks and are in a secure environment.\\n\\n' +
        'Continue?'
      );
      if (!confirmed) return;

      try {
        if (!nsec) {
          exportKeyError.textContent = 'No key available to copy';
          exportKeyError.hidden = false;
          return;
        }
        await navigator.clipboard.writeText(nsec);
        exportKeyCopy.textContent = 'Copied!';
        setTimeout(() => {
          exportKeyCopy.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        exportKeyError.textContent = 'Failed to copy to clipboard';
        exportKeyError.hidden = false;
      }
    });

    // Show download password form
    exportKeyDownload.addEventListener('click', () => {
      exportPasswordForm.hidden = false;
      exportPasswordInput.value = '';
      exportPasswordInput.focus();
      exportKeyError.hidden = true;
    });

    // Cancel download
    exportPasswordCancel.addEventListener('click', () => {
      exportPasswordForm.hidden = true;
      exportPasswordInput.value = '';
    });

    // Download encrypted backup
    exportPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      exportKeyError.hidden = true;

      const password = exportPasswordInput.value;
      if (!password) {
        exportKeyError.textContent = 'Please enter a password';
        exportKeyError.hidden = false;
        return;
      }

      try {
        // Use nsec loaded from Dexie or sessionStorage
        if (!nsec) {
          throw new Error('No key available');
        }

        // Decode nsec to get the secret key bytes
        const { type, data: secretKey } = nip19.decode(nsec);
        if (type !== 'nsec') {
          throw new Error('Invalid nsec format');
        }

        // Encrypt with NIP-49 (logN=16 for good security)
        const ncryptsec = nip49Encrypt(secretKey, password, 16, 0x00);

        // Create backup file content
        const backupContent = [
          '# OtherStuff Nostr Key Backup',
          '# Created: ' + new Date().toISOString(),
          '# Public Key: ' + npub,
          '#',
          '# This file contains your encrypted private key (ncryptsec).',
          '# You will need your password to decrypt it.',
          '#',
          ncryptsec
        ].join('\\n');

        // Download file
        const blob = new Blob([backupContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'OtherStuff_Encrypted_Key_Backup.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Reset form
        exportPasswordForm.hidden = true;
        exportPasswordInput.value = '';
      } catch (err) {
        console.error('Failed to create backup:', err);
        exportKeyError.textContent = 'Failed to create encrypted backup';
        exportKeyError.hidden = false;
      }
    });

    // === Admin Functions ===

    const isAdmin = npub && ADMIN_NPUB && npub === ADMIN_NPUB;

    // Show admin link in dropdown if admin
    const adminLinkBtn = document.getElementById('admin-link-btn');
    if (isAdmin && adminLinkBtn) {
      adminLinkBtn.hidden = false;
      adminLinkBtn.addEventListener('click', () => {
        window.location.href = '/admin';
      });
    }
  </script>
</body>
</html>`;
}
