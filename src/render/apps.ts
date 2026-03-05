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

    .profile-teleport-badge {
      display: inline-block;
      margin: 0 0 1rem;
      padding: 0.35rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #166534;
      background: #dcfce7;
      border: 1px solid #86efac;
      border-radius: 999px;
    }

    .profile-teleport-badge[hidden] {
      display: none;
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

    /* Teleport Fallback UI for mobile permission errors */
    .teleport-fallback {
      margin-top: 1.5rem;
      text-align: left;
    }

    .teleport-fallback[hidden] {
      display: none;
    }

    .teleport-fallback-label {
      font-size: 0.8rem;
      color: var(--muted);
      margin-bottom: 0.5rem;
      display: block;
    }

    .teleport-fallback-box {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .teleport-fallback-input {
      flex: 1;
      padding: 0.75rem;
      font-size: 0.85rem;
      font-family: var(--font-mono, monospace);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-alt, #f9f8f6);
      color: var(--text);
      word-break: break-all;
    }

    .teleport-fallback-input:focus {
      outline: 2px solid var(--purple);
      outline-offset: 1px;
    }

    .teleport-copy-btn {
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      background: var(--surface-alt, #f9f8f6);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }

    .teleport-copy-btn:hover {
      background: var(--border);
    }

    .teleport-copy-btn.copied {
      background: var(--success, #4ade80);
      color: white;
      border-color: var(--success, #4ade80);
    }

    .teleport-fallback-note {
      font-size: 0.8rem;
      color: var(--muted);
      margin-top: 1rem;
      padding: 0.75rem;
      background: var(--surface-alt, #f9f8f6);
      border-radius: var(--radius-sm);
      line-height: 1.5;
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

    /* Add your own apps link */
    .add-apps-link {
      text-align: center;
      margin-top: 1rem;
      padding: 0.75rem;
    }

    .add-apps-link a {
      color: var(--purple);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }

    .add-apps-link a:hover {
      color: var(--purple-light);
    }

    /* Teleport Key Vault */
    .key-vault-card {
      margin-bottom: 1.5rem;
    }

    .key-vault-status {
      color: var(--muted);
      font-size: 0.9rem;
      margin-bottom: 0.85rem;
      line-height: 1.5;
    }

    .key-vault-form {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .key-vault-form input {
      width: 100%;
      padding: 0.7rem 0.75rem;
      font-size: 0.85rem;
      font-family: monospace;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-warm);
      color: var(--text);
    }

    .key-vault-form input:focus {
      outline: 2px solid var(--purple);
      outline-offset: 1px;
    }

    .key-vault-remove-btn {
      margin-top: 0.7rem;
      width: 100%;
      background: var(--surface-warm);
      color: var(--text-warm);
      border: 1px solid var(--border);
    }

    .key-vault-remove-btn:hover {
      border-color: var(--error);
      color: var(--error);
      background: #fef2f2;
    }

    .key-vault-error {
      margin-top: 0.7rem;
      font-size: 0.85rem;
      color: var(--error);
    }

    .key-vault-error[hidden] {
      display: none;
    }

    /* User app item with delete button */
    .user-app-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }

    .user-app-item:hover {
      border-color: var(--purple);
      box-shadow: var(--shadow-soft);
    }

    .user-app-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 0;
      cursor: pointer;
    }

    .user-app-delete {
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
      font-family: var(--font-body);
      background: transparent;
      color: var(--muted);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .user-app-delete:hover {
      border-color: var(--error);
      color: var(--error);
      background: #fef2f2;
    }

    /* Remote Signer Card */
    .signer-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-soft);
      overflow: hidden;
    }
    .signer-card[hidden] { display: none; }
    .signer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      cursor: pointer;
      background: var(--surface-warm);
      border-bottom: 1px solid var(--border-soft);
      transition: background 0.2s;
    }
    .signer-header:hover { background: var(--border-soft); }
    .signer-header h2 {
      font-family: var(--font-serif);
      font-size: 1rem;
      font-weight: 400;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .signer-badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .signer-badge.active {
      background: #dcfce7;
      color: #166534;
    }
    .signer-badge.inactive {
      background: var(--surface-warm);
      color: var(--muted);
    }
    .signer-content { padding: 1.5rem; }
    .signer-card.collapsed .signer-content { display: none; }
    .signer-card.collapsed .signer-header .chevron { transform: rotate(-90deg); }
    .signer-header .chevron {
      color: var(--muted);
      transition: transform 0.2s;
    }
    .signer-info {
      font-size: 0.85rem;
      color: var(--muted);
      margin-bottom: 1rem;
    }
    .signer-bunker-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.35rem;
    }
    .signer-bunker-row input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      font-family: monospace;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-warm);
      color: var(--text);
    }
    .signer-bunker-row button {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .signer-bunker-row button:hover {
      border-color: var(--purple);
      color: var(--purple);
    }
    .signer-section-title {
      font-family: var(--font-serif);
      font-size: 0.9rem;
      font-weight: 400;
      margin: 1rem 0 0.5rem;
      color: var(--text);
    }
    .signer-client-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
    }
    .signer-client-pub {
      font-family: monospace;
      color: var(--text-warm);
    }
    .signer-client-time {
      color: var(--muted);
      font-size: 0.75rem;
    }
    .approval-item {
      padding: 0.75rem;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: var(--radius-sm);
      margin-bottom: 0.5rem;
    }
    .approval-desc {
      font-size: 0.85rem;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    .approval-client {
      font-size: 0.75rem;
      font-family: monospace;
      color: var(--muted);
      margin-bottom: 0.5rem;
    }
    .approval-actions {
      display: flex;
      gap: 0.5rem;
    }
    .approval-actions button {
      flex: 1;
      padding: 0.4rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all 0.15s;
    }
    .approval-approve {
      background: var(--success);
      color: white;
      border: none;
    }
    .approval-reject {
      background: var(--surface);
      color: var(--error);
      border: 1px solid var(--error);
    }
    .signer-session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
    }
    .signer-session-name { font-weight: 500; }
    .signer-session-revoke {
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
      background: transparent;
      color: var(--muted);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
    }
    .signer-session-revoke:hover {
      border-color: var(--error);
      color: var(--error);
    }
    .signer-policy-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      font-size: 0.85rem;
      color: var(--text-warm);
    }
    .signer-policy-row select {
      padding: 0.3rem 0.5rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-size: 0.8rem;
      color: var(--text);
    }

    /* Teleport Mode Selector */
    .teleport-mode-select {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      text-align: left;
    }
    .teleport-mode-option {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s;
    }
    .teleport-mode-option:has(input:checked) {
      border-color: var(--purple);
      background: #faf5ff;
    }
    .teleport-mode-option input[type="radio"] {
      margin-top: 0.15rem;
      accent-color: var(--purple);
    }
    .teleport-mode-label strong {
      display: block;
      font-size: 0.9rem;
      margin-bottom: 0.15rem;
    }
    .teleport-mode-label small {
      font-size: 0.8rem;
      color: var(--muted);
    }
    .teleport-mode-info {
      color: var(--muted);
      font-size: 0.85rem;
      margin-bottom: 1rem;
      line-height: 1.5;
      text-align: left;
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

    <!-- Remote Signer Card -->
    <div class="signer-card" id="signer-card" hidden>
      <div class="signer-header" id="signer-header">
        <h2>Remote Signer <span class="signer-badge inactive" id="signer-badge">Inactive</span></h2>
        <span class="chevron">&#9660;</span>
      </div>
      <div class="signer-content" id="signer-content">
        <div class="signer-info" id="signer-info">Connecting to relays...</div>

        <label style="font-size:0.8rem;color:var(--text-warm);display:block;margin-bottom:0.25rem;">Bunker URI</label>
        <div class="signer-bunker-row">
          <input type="text" id="signer-bunker-uri" readonly />
          <button type="button" id="signer-copy-uri">Copy</button>
        </div>

        <div id="signer-approvals-section" hidden>
          <h3 class="signer-section-title">Pending Approvals</h3>
          <div id="signer-approvals-list"></div>
        </div>

        <div id="signer-clients-section" hidden>
          <h3 class="signer-section-title">Connected Apps</h3>
          <div id="signer-clients-list"></div>
        </div>

        <div id="signer-sessions-section" hidden>
          <h3 class="signer-section-title">Bunker Sessions</h3>
          <div id="signer-sessions-list"></div>
        </div>

        <div class="signer-policy-row">
          <span>Policy:</span>
          <select id="signer-policy">
            <option value="ask">Ask every time</option>
            <option value="auto-login">Auto-sign logins</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Teleport Key Vault -->
    <div class="card key-vault-card" id="key-vault-card" hidden>
      <h2>Key Teleport Key</h2>
      <p class="key-vault-status" id="key-vault-status">
        Save your key for teleport package generation when using extension login.
      </p>
      <form class="key-vault-form" id="key-vault-form">
        <input
          type="password"
          id="key-vault-input"
          placeholder="Paste nsec1..."
          autocomplete="off"
        />
        <button type="submit" class="btn btn-primary" id="key-vault-save-btn">Save Teleport Key</button>
      </form>
      <button type="button" class="btn key-vault-remove-btn" id="key-vault-remove-btn" hidden>Remove Saved Key</button>
      <p class="key-vault-error" id="key-vault-error" hidden></p>
    </div>

    <div class="card">
      <h2>Your Apps</h2>
      <div class="apps-list" id="apps-list">
        <div class="apps-empty">
          <p>No apps available yet.</p>
        </div>
      </div>
    </div>

    <!-- User's Custom Teleport Apps -->
    <div class="card" id="user-apps-card" hidden>
      <h2>Your Custom Apps</h2>
      <div class="apps-list" id="user-apps-list"></div>
    </div>

    <!-- Add your own apps link -->
    <div class="add-apps-link">
      <a href="/teleport/setup">[ Add your own apps ]</a>
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
        <p class="profile-teleport-badge" id="profile-teleport-badge" hidden>Teleport key saved on server</p>

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

  <!-- Teleport Modal -->
  <div class="teleport-modal-overlay" id="teleport-modal" hidden>
    <div class="teleport-modal">
      <button class="teleport-modal-close" type="button" id="teleport-close" aria-label="Close">&times;</button>
      <h2>Connect to <span id="teleport-app-name"></span></h2>

      <div class="teleport-mode-select" id="teleport-mode-select" hidden>
        <label class="teleport-mode-option">
          <input type="radio" name="teleport-mode" value="bunker" checked />
          <div class="teleport-mode-label">
            <strong>Connect as signer</strong>
            <small>App gets signing access. Your key stays here.</small>
          </div>
        </label>
        <label class="teleport-mode-option">
          <input type="radio" name="teleport-mode" value="key" />
          <div class="teleport-mode-label">
            <strong>Transfer key</strong>
            <small>Send your nsec to the app.</small>
          </div>
        </label>
      </div>

      <p class="teleport-mode-info" id="teleport-mode-info"></p>

      <button id="teleport-copy-open" class="teleport-btn">Connect</button>
      <p class="teleport-error" id="teleport-error" hidden></p>

      <!-- Fallback UI for mobile permission errors -->
      <div class="teleport-fallback" id="teleport-fallback" hidden>
        <label class="teleport-fallback-label">1. Copy your key teleport package:</label>
        <div class="teleport-fallback-box">
          <input type="text" class="teleport-fallback-input" id="teleport-fallback-url" readonly />
          <button type="button" class="teleport-copy-btn" id="teleport-copy-url-btn">Copy Package</button>
        </div>

        <label class="teleport-fallback-label">2. Copy temporary nsec (unlock code):</label>
        <div class="teleport-fallback-box">
          <input type="password" class="teleport-fallback-input" id="teleport-fallback-nsec" readonly />
          <button type="button" class="teleport-copy-btn" id="teleport-copy-nsec-btn">Copy</button>
        </div>

        <button type="button" class="teleport-btn" id="teleport-open-app-btn">Open App With Package</button>

        <div class="teleport-fallback-note" id="teleport-fallback-note">
          Paste the package in your app first, then paste the temporary nsec when prompted.
        </div>
      </div>
    </div>
  </div>

  <!-- Password Prompt Modal for Teleport -->
  <div class="teleport-modal-overlay" id="teleport-password-modal" hidden>
    <div class="teleport-modal">
      <button class="teleport-modal-close" type="button" id="teleport-password-close" aria-label="Close">&times;</button>
      <h2>Enter Password</h2>
      <p>Your key is encrypted. Enter your password to continue.</p>
      <form id="teleport-password-form">
        <input type="password" id="teleport-password-input" placeholder="Password" autocomplete="current-password" style="width:100%;padding:0.75rem;margin-bottom:1rem;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:16px;" />
        <button type="submit" class="teleport-btn">Continue</button>
      </form>
      <p class="teleport-error" id="teleport-password-error" hidden></p>
    </div>
  </div>

  <script type="module">
    import { nip19, finalizeEvent, getPublicKey, generateSecretKey } from 'https://esm.sh/nostr-tools@2.7.2';
    import { Relay } from 'https://esm.sh/nostr-tools@2.7.2/relay';
    import * as nip44 from 'https://esm.sh/nostr-tools@2.7.2/nip44';
    import { encrypt as nip49Encrypt } from 'https://esm.sh/nostr-tools@2.7.2/nip49';
    import Dexie from 'https://esm.sh/dexie@4.0.4';
    import { BrowserSigner } from '/signer.js';

    // Initialize Dexie database for profile and secrets
    const db = new Dexie('OtherStuffDB');
    db.version(3).stores({
      profiles: 'npub, name, about, picture, nip05, updatedAt',
      secrets: 'npub',
      assets: 'url'
    });
    db.version(4).stores({
      profiles: 'npub, name, about, picture, nip05, updatedAt',
      secrets: 'npub',
      assets: 'url',
      signerSessions: '++id, secret, active'
    });

    // ============================================
    // Background image caching
    // ============================================

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

    // Teleport fallback elements (for mobile permission errors)
    const teleportFallback = document.getElementById('teleport-fallback');
    const teleportFallbackUrl = document.getElementById('teleport-fallback-url');
    const teleportFallbackNsec = document.getElementById('teleport-fallback-nsec');
    const teleportCopyUrlBtn = document.getElementById('teleport-copy-url-btn');
    const teleportCopyNsecBtn = document.getElementById('teleport-copy-nsec-btn');
    const teleportOpenAppBtn = document.getElementById('teleport-open-app-btn');
    const teleportFallbackNote = document.getElementById('teleport-fallback-note');

    // Password prompt modal elements
    const teleportPasswordModal = document.getElementById('teleport-password-modal');
    const teleportPasswordClose = document.getElementById('teleport-password-close');
    const teleportPasswordForm = document.getElementById('teleport-password-form');
    const teleportPasswordInput = document.getElementById('teleport-password-input');
    const teleportPasswordError = document.getElementById('teleport-password-error');

    // Password prompt resolver
    let passwordResolver = null;

    // Current teleport target
    let teleportTarget = null;
    let teleportMode = 'key';

    // Browser signer instance
    let signer = null;

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
    const profileTeleportBadge = document.getElementById('profile-teleport-badge');
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

    // Teleport key vault
    const keyVaultCard = document.getElementById('key-vault-card');
    const keyVaultForm = document.getElementById('key-vault-form');
    const keyVaultInput = document.getElementById('key-vault-input');
    const keyVaultSaveBtn = document.getElementById('key-vault-save-btn');
    const keyVaultRemoveBtn = document.getElementById('key-vault-remove-btn');
    const keyVaultStatus = document.getElementById('key-vault-status');
    const keyVaultError = document.getElementById('key-vault-error');

    // Get session data
    const npub = sessionStorage.getItem('npub');
    let nsec = sessionStorage.getItem('nsec');  // May be null if using encrypted storage
    const loginMethod = sessionStorage.getItem('loginMethod');
    const onboarded = sessionStorage.getItem('onboarded');
    const cachedAvatar = sessionStorage.getItem('avatarUrl');
    const cachedName = sessionStorage.getItem('displayName');
    let hasServerTeleportKey = false;
    let welcomePubkeyHex = null;

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

    function showKeyVaultError(message) {
      keyVaultError.textContent = message;
      keyVaultError.hidden = false;
    }

    function hideKeyVaultError() {
      keyVaultError.hidden = true;
    }

    function refreshKeyVaultVisibility() {
      const shouldShow = loginMethod === 'extension' || hasServerTeleportKey;
      keyVaultCard.hidden = !shouldShow;

      if (!shouldShow) return;

      if (hasServerTeleportKey) {
        keyVaultStatus.textContent = 'Saved. Your key is stored as NIP-44 ciphertext and can be used to generate teleport packages.';
        keyVaultSaveBtn.textContent = 'Update Teleport Key';
        keyVaultRemoveBtn.hidden = false;
      } else {
        keyVaultStatus.textContent = 'Paste your nsec once to store a NIP-44 encrypted teleport key for package generation.';
        keyVaultSaveBtn.textContent = 'Save Teleport Key';
        keyVaultRemoveBtn.hidden = true;
      }

      if (profileTeleportBadge) {
        profileTeleportBadge.hidden = !hasServerTeleportKey;
      }
    }

    async function ensureWelcomePubkeyHex() {
      if (welcomePubkeyHex) return welcomePubkeyHex;

      const res = await fetch('/api/teleport/welcome-pubkey');
      const data = await res.json();
      if (!data.success || !data.npub) {
        throw new Error(data.error || 'Unable to load welcome pubkey');
      }

      const decoded = nip19.decode(data.npub);
      if (decoded.type !== 'npub') {
        throw new Error('Invalid welcome pubkey response');
      }

      welcomePubkeyHex = decoded.data;
      return welcomePubkeyHex;
    }

    async function loadServerTeleportKeyStatus() {
      if (!npub) return;
      try {
        const res = await fetch('/auth/teleport-key', {
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();
        hasServerTeleportKey = !!(data.success && data.hasTeleportKey);
      } catch (err) {
        hasServerTeleportKey = false;
      }
      refreshKeyVaultVisibility();
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
        await loadServerTeleportKeyStatus();

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

        // Initialize browser signer if key is available
        if (nsec) {
          try {
            const { data: sk } = nip19.decode(nsec);
            signer = new BrowserSigner(sk, RELAYS);

            // Reload saved bunker sessions
            const saved = await db.signerSessions.where('active').equals(1).toArray();
            for (const s of saved) {
              signer.addSession(s.id, s.secret);
            }

            signer.onUpdate = updateSignerUI;
            signer.policy = sessionStorage.getItem('signerPolicy') || 'ask';
            await signer.start();
            updateSignerUI();
          } catch (err) {
            console.warn('[Signer] Failed to start:', err);
          }
        }
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

    keyVaultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideKeyVaultError();

      const candidate = keyVaultInput.value.trim();
      if (!candidate || !candidate.startsWith('nsec1')) {
        showKeyVaultError('Enter a valid nsec1 key.');
        return;
      }

      keyVaultSaveBtn.disabled = true;
      keyVaultSaveBtn.textContent = 'Saving...';

      try {
        const decoded = nip19.decode(candidate);
        if (decoded.type !== 'nsec') {
          throw new Error('Invalid nsec format');
        }

        const secretKey = decoded.data;
        const derivedNpub = nip19.npubEncode(getPublicKey(secretKey));
        if (derivedNpub !== npub) {
          throw new Error('This key does not match your signed-in account.');
        }

        const welcomeHex = await ensureWelcomePubkeyHex();
        const conversationKey = nip44.v2.utils.getConversationKey(secretKey, welcomeHex);
        const encryptedNsecNip44 = nip44.v2.encrypt(candidate, conversationKey);

        const res = await fetch('/auth/teleport-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
          body: JSON.stringify({ encryptedNsecNip44 })
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to save teleport key');
        }

        hasServerTeleportKey = true;
        keyVaultInput.value = '';
        refreshKeyVaultVisibility();
        keyVaultStatus.textContent = 'Saved. Your key is now available for manual key teleport package generation.';
      } catch (err) {
        showKeyVaultError(err.message || 'Failed to save teleport key');
      } finally {
        keyVaultSaveBtn.disabled = false;
        keyVaultSaveBtn.textContent = hasServerTeleportKey ? 'Update Teleport Key' : 'Save Teleport Key';
      }
    });

    keyVaultRemoveBtn.addEventListener('click', async () => {
      hideKeyVaultError();
      keyVaultRemoveBtn.disabled = true;
      try {
        const res = await fetch('/auth/teleport-key', {
          method: 'DELETE',
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to remove teleport key');
        }
        hasServerTeleportKey = false;
        refreshKeyVaultVisibility();
      } catch (err) {
        showKeyVaultError(err.message || 'Failed to remove teleport key');
      } finally {
        keyVaultRemoveBtn.disabled = false;
      }
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

          if (app.teleport_pubkey && (nsec || hasServerTeleportKey)) {
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

    function hideTeleportFallback() {
      teleportFallback.hidden = true;
      teleportFallbackUrl.value = '';
      teleportFallbackNsec.value = '';
      teleportFallbackNsec.type = 'password';
      teleportCopyUrlBtn.textContent = 'Copy Package';
      teleportCopyUrlBtn.dataset.defaultLabel = 'Copy Package';
      teleportCopyUrlBtn.classList.remove('copied');
      teleportCopyNsecBtn.textContent = 'Copy';
      teleportCopyNsecBtn.dataset.defaultLabel = 'Copy';
      teleportCopyNsecBtn.classList.remove('copied');
      teleportOpenAppBtn.hidden = true;
      teleportOpenAppBtn.dataset.url = '';
    }

    function showTeleportFallback(primaryValue, secondValue, isBunker, openUrl = '') {
      teleportFallbackUrl.value = primaryValue;
      teleportFallbackNsec.value = secondValue;
      teleportFallbackNsec.type = isBunker ? 'text' : 'password';
      const labels = teleportFallback.querySelectorAll('.teleport-fallback-label');
      if (labels[0]) labels[0].textContent = isBunker
        ? '1. Copy bunker URI to paste in your app:'
        : '1. Copy your key teleport package:';
      if (labels[1]) labels[1].textContent = isBunker
        ? '2. Copy bunker URI (or use open button):'
        : '2. Copy temporary nsec (unlock code):';
      teleportCopyUrlBtn.textContent = isBunker ? 'Copy URI' : 'Copy Package';
      teleportCopyUrlBtn.dataset.defaultLabel = teleportCopyUrlBtn.textContent;
      teleportCopyNsecBtn.dataset.defaultLabel = 'Copy';
      teleportFallbackNote.textContent = isBunker
        ? 'Paste bunker URI into the target app or open it directly with bunkerconnect.'
        : 'Paste the package into your app first, then paste temporary nsec when prompted.';
      teleportOpenAppBtn.hidden = !openUrl;
      teleportOpenAppBtn.dataset.url = openUrl || '';
      teleportFallback.hidden = false;
      teleportCopyOpenBtn.hidden = false;
      teleportCopyOpenBtn.disabled = false;
      teleportCopyOpenBtn.textContent = isBunker ? 'Generate New Session' : 'Generate New Package';
    }

    function showTeleportModal(app) {
      teleportTarget = app;
      teleportAppName.textContent = app.name;
      hideTeleportError();
      hideTeleportFallback();
      teleportCopyOpenBtn.hidden = false;
      teleportCopyOpenBtn.disabled = false;

      const modeSelect = document.getElementById('teleport-mode-select');
      const modeInfo = document.getElementById('teleport-mode-info');

      if (signer && signer.active) {
        modeSelect.hidden = false;
        teleportMode = 'bunker';
        const bunkerRadio = document.querySelector('input[name="teleport-mode"][value="bunker"]');
        if (bunkerRadio) bunkerRadio.checked = true;
        teleportCopyOpenBtn.textContent = 'Connect';
        modeInfo.textContent = 'The app will request signatures through your browser. You approve each one.';
      } else {
        modeSelect.hidden = true;
        teleportMode = 'key';
        teleportCopyOpenBtn.textContent = 'Generate Package';
        modeInfo.textContent = 'Generate a manual key teleport package, then copy temporary nsec when prompted by the app.';
      }

      teleportModal.hidden = false;
    }

    function hideTeleportModal() {
      teleportModal.hidden = true;
      teleportTarget = null;
      hideTeleportError();
      hideTeleportFallback();
    }

    function generateHashId() {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    }

    async function performTeleport() {
      if (!teleportTarget) return;
      if (teleportMode === 'bunker') return performBunkerTeleport();

      // Check if we have nsec available locally, else use stored server ciphertext.
      let currentNsec = nsec;
      let useStoredTeleportKey = false;
      if (!currentNsec) {
        // Try to load from Dexie with existing session key
        currentNsec = await loadNsecFromDexie(npub);

        // If still no nsec, check if encrypted key exists and prompt for password
        if (!currentNsec && await hasStoredNsec(npub)) {
          currentNsec = await promptForPassword();
          if (!currentNsec) {
            // User cancelled password prompt
            return;
          }
        }

        if (!currentNsec && hasServerTeleportKey) {
          useStoredTeleportKey = true;
        } else if (!currentNsec) {
          showTeleportError('No key available. Save a teleport key first.');
          return;
        }
      }

      teleportCopyOpenBtn.disabled = true;
      teleportCopyOpenBtn.textContent = 'Processing...';
      hideTeleportError();

      try {
        // Generate throwaway keypair
        const throwawayPrivkey = generateSecretKey();
        const throwawayPubkey = getPublicKey(throwawayPrivkey);
        const throwawayNsec = nip19.nsecEncode(throwawayPrivkey);

        // Encrypt nsec with NIP-44 using conversation key(user, throwaway)
        let encryptedNsec = null;
        if (!useStoredTeleportKey) {
          const { type, data: secretKey } = nip19.decode(currentNsec);
          if (type !== 'nsec') throw new Error('Invalid nsec');
          const conversationKey = nip44.v2.utils.getConversationKey(secretKey, throwawayPubkey);
          encryptedNsec = nip44.v2.encrypt(currentNsec, conversationKey);
        }

        // Generate unique hash ID
        const hashId = generateHashId();

        // Get base URL for the API route
        const baseUrl = window.location.origin;

        // Build request body - use appPubkey for user apps, appId for admin apps
        const requestBody = {
          hashId,
          npub,  // User's public key - needed by remote app for decryption
          baseUrl
        };

        if (useStoredTeleportKey) {
          requestBody.useStoredTeleportKey = true;
          requestBody.throwawayPubkey = throwawayPubkey;
        } else {
          requestBody.encryptedNsec = encryptedNsec;
        }

        if (teleportTarget.isUserApp) {
          // User teleport app - send pubkey directly
          requestBody.appPubkey = teleportTarget.teleport_pubkey;
        } else {
          // Admin-managed app - send app ID for lookup
          requestBody.appId = teleportTarget.id;
        }

        // Store on server and get the NIP-44 encrypted blob
        const res = await fetch('/api/teleport', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to store teleport key');
        }

        // Build teleport URL with NIP-44 encrypted blob in fragment (server never sees it)
        let teleportUrl = teleportTarget.url + (teleportTarget.url.includes('#') ? '&' : '#') + 'keyteleport=' + encodeURIComponent(data.blob);

        // Add invite code if one exists for this app (only for admin apps)
        if (!teleportTarget.isUserApp) {
          const inviteCode = userInviteCodes[teleportTarget.id];
          if (inviteCode) {
            teleportUrl += '&ic=' + encodeURIComponent(inviteCode);
          }
        }

        // Always show manual package + temporary nsec workflow.
        showTeleportFallback(data.blob, throwawayNsec, false, teleportUrl);
      } catch (err) {
        console.error('Teleport error:', err);
        showTeleportError(err.message || 'Failed to transfer identity');
        teleportCopyOpenBtn.disabled = false;
        teleportCopyOpenBtn.textContent = 'Generate Package';
      }
    }

    // === Bunker Teleport ===

    async function performBunkerTeleport() {
      if (!teleportTarget || !signer || !signer.active) return;

      teleportCopyOpenBtn.disabled = true;
      teleportCopyOpenBtn.textContent = 'Connecting...';
      hideTeleportError();

      try {
        const secret = crypto.randomUUID();

        // Store session in Dexie
        const sessionId = await db.signerSessions.add({
          appName: teleportTarget.name,
          appUrl: teleportTarget.url,
          secret: secret,
          clientPubkey: null,
          active: 1,
          createdAt: Date.now()
        });

        signer.addSession(sessionId, secret);

        const bunkerUri = signer.getBunkerUri(secret);
        const separator = teleportTarget.url.includes('#') ? '&' : '#';
        const teleportUrl = teleportTarget.url + separator + 'bunkerconnect=' + encodeURIComponent(bunkerUri);
        showTeleportFallback(bunkerUri, bunkerUri, true, teleportUrl);
        updateSignerUI();
      } catch (err) {
        console.error('Bunker teleport error:', err);
        showTeleportError(err.message || 'Failed to create connection');
        teleportCopyOpenBtn.disabled = false;
        teleportCopyOpenBtn.textContent = 'Connect';
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

    // Fallback copy button handlers
    async function copyWithFeedback(inputEl, btnEl) {
      const value = inputEl.value;
      if (!value) return;
      const defaultLabel = btnEl.dataset.defaultLabel || 'Copy';

      try {
        await navigator.clipboard.writeText(value);
        btnEl.textContent = 'Copied!';
        btnEl.classList.add('copied');
        setTimeout(() => {
          btnEl.textContent = defaultLabel;
          btnEl.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // If clipboard still fails, select the text so user can copy manually
        inputEl.type = 'text';
        inputEl.select();
        inputEl.setSelectionRange(0, 99999); // For mobile
        btnEl.textContent = 'Select & Copy';
      }
    }

    teleportCopyUrlBtn.addEventListener('click', () => {
      copyWithFeedback(teleportFallbackUrl, teleportCopyUrlBtn);
    });

    teleportCopyNsecBtn.addEventListener('click', () => {
      const wasPassword = teleportFallbackNsec.type === 'password';
      if (wasPassword) teleportFallbackNsec.type = 'text';
      copyWithFeedback(teleportFallbackNsec, teleportCopyNsecBtn).then(() => {
        if (wasPassword) {
          setTimeout(() => { teleportFallbackNsec.type = 'password'; }, 3000);
        }
      });
    });

    teleportOpenAppBtn.addEventListener('click', () => {
      const targetUrl = teleportOpenAppBtn.dataset.url;
      if (!targetUrl) return;
      window.open(targetUrl, '_blank');
    });

    // === Teleport Mode Selection ===
    document.querySelectorAll('input[name="teleport-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        teleportMode = e.target.value;
        const modeInfo = document.getElementById('teleport-mode-info');
        if (teleportMode === 'bunker') {
          teleportCopyOpenBtn.textContent = 'Connect';
          modeInfo.textContent = 'The app will request signatures through your browser. You approve each one.';
        } else {
          teleportCopyOpenBtn.textContent = 'Generate Package';
          modeInfo.textContent = 'Generate a manual key teleport package, then copy temporary nsec when prompted by the app.';
        }
      });
    });

    // === Signer UI ===

    const signerCard = document.getElementById('signer-card');
    const signerBadge = document.getElementById('signer-badge');
    const signerInfo = document.getElementById('signer-info');
    const signerBunkerUri = document.getElementById('signer-bunker-uri');
    const signerCopyUri = document.getElementById('signer-copy-uri');
    const signerApprovalsList = document.getElementById('signer-approvals-list');
    const signerClientsList = document.getElementById('signer-clients-list');
    const signerSessionsList = document.getElementById('signer-sessions-list');
    const signerPolicySelect = document.getElementById('signer-policy');

    // Signer card toggle
    document.getElementById('signer-header')?.addEventListener('click', () => {
      signerCard.classList.toggle('collapsed');
    });

    // Copy bunker URI
    signerCopyUri?.addEventListener('click', async () => {
      const uri = signerBunkerUri.value;
      if (!uri) return;
      try {
        await navigator.clipboard.writeText(uri);
        signerCopyUri.textContent = 'Copied!';
        setTimeout(() => signerCopyUri.textContent = 'Copy', 2000);
      } catch {}
    });

    // Policy change
    signerPolicySelect?.addEventListener('change', () => {
      if (signer) {
        signer.policy = signerPolicySelect.value;
        sessionStorage.setItem('signerPolicy', signerPolicySelect.value);
      }
    });

    function updateSignerUI() {
      if (!signer) {
        signerCard.hidden = true;
        return;
      }

      signerCard.hidden = false;
      const connected = signer.connectedCount;

      if (signer.active && connected > 0) {
        signerBadge.textContent = 'Active';
        signerBadge.className = 'signer-badge active';
        signerInfo.textContent = connected + ' relay' + (connected !== 1 ? 's' : '') + ' connected';
      } else if (signer.active) {
        signerBadge.textContent = 'Reconnecting';
        signerBadge.className = 'signer-badge inactive';
        signerInfo.textContent = 'Reconnecting to relays...';
      } else {
        signerBadge.textContent = 'Inactive';
        signerBadge.className = 'signer-badge inactive';
        signerInfo.textContent = 'Signer is not running';
      }

      // Bunker URI (no secret - reusable, requires approval)
      signerBunkerUri.value = signer.getBunkerUri();

      // Policy
      signerPolicySelect.value = signer.policy;

      // Pending approvals
      const approvalsSection = document.getElementById('signer-approvals-section');
      if (signer.pendingApprovals.length > 0) {
        approvalsSection.hidden = false;
        signerApprovalsList.innerHTML = signer.pendingApprovals.map(a => {
          const shortClient = a.client.slice(0, 12) + '...';
          return '<div class="approval-item">' +
            '<div class="approval-desc">' + escapeHtml(a.description) + '</div>' +
            '<div class="approval-client">from ' + shortClient + '</div>' +
            '<div class="approval-actions">' +
              '<button class="approval-approve" data-id="' + a.id + '">Approve</button>' +
              '<button class="approval-reject" data-id="' + a.id + '">Reject</button>' +
            '</div>' +
          '</div>';
        }).join('');

        signerApprovalsList.querySelectorAll('.approval-approve').forEach(btn => {
          btn.addEventListener('click', () => signer.resolveApproval(btn.dataset.id, true));
        });
        signerApprovalsList.querySelectorAll('.approval-reject').forEach(btn => {
          btn.addEventListener('click', () => signer.resolveApproval(btn.dataset.id, false));
        });
      } else {
        approvalsSection.hidden = true;
      }

      // Connected clients
      const clientsSection = document.getElementById('signer-clients-section');
      if (signer.clients.size > 0) {
        clientsSection.hidden = false;
        let html = '';
        for (const [pub, info] of signer.clients) {
          const ago = Math.round((Date.now() - info.lastSeen) / 1000);
          const timeStr = ago < 60 ? ago + 's ago' : Math.round(ago / 60) + 'm ago';
          html += '<div class="signer-client-item">' +
            '<span class="signer-client-pub">' + pub.slice(0, 16) + '...</span>' +
            '<span class="signer-client-time">' + timeStr + '</span>' +
          '</div>';
        }
        signerClientsList.innerHTML = html;
      } else {
        clientsSection.hidden = true;
      }

      // Bunker sessions from Dexie
      updateSignerSessions();
    }

    async function updateSignerSessions() {
      const sessionsSection = document.getElementById('signer-sessions-section');
      try {
        const sessions = await db.signerSessions.where('active').equals(1).toArray();
        if (sessions.length > 0) {
          sessionsSection.hidden = false;
          signerSessionsList.innerHTML = sessions.map(s =>
            '<div class="signer-session-item">' +
              '<span class="signer-session-name">' + escapeHtml(s.appName) + '</span>' +
              '<button class="signer-session-revoke" data-id="' + s.id + '" data-secret="' + s.secret + '">Revoke</button>' +
            '</div>'
          ).join('');

          signerSessionsList.querySelectorAll('.signer-session-revoke').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = parseInt(btn.dataset.id, 10);
              const secret = btn.dataset.secret;
              if (!confirm('Revoke this session?')) return;
              await db.signerSessions.update(id, { active: 0 });
              if (signer) signer.removeSession(secret);
              updateSignerUI();
            });
          });
        } else {
          sessionsSection.hidden = true;
        }
      } catch (err) {
        sessionsSection.hidden = true;
      }
    }

    // Password prompt modal event listeners
    teleportPasswordClose.addEventListener('click', () => {
      teleportPasswordModal.hidden = true;
      if (passwordResolver) {
        passwordResolver(null);
        passwordResolver = null;
      }
    });

    teleportPasswordModal.addEventListener('click', (e) => {
      if (e.target === teleportPasswordModal) {
        teleportPasswordModal.hidden = true;
        if (passwordResolver) {
          passwordResolver(null);
          passwordResolver = null;
        }
      }
    });

    teleportPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = teleportPasswordInput.value;
      if (!password) {
        teleportPasswordError.textContent = 'Please enter your password';
        teleportPasswordError.hidden = false;
        return;
      }

      try {
        const stored = await db.secrets.get(npub);
        if (!stored) {
          teleportPasswordError.textContent = 'No encrypted key found';
          teleportPasswordError.hidden = false;
          return;
        }

        const key = await deriveKeyFromPassword(password, new Uint8Array(stored.salt));
        const decrypted = await decryptSecret(
          new Uint8Array(stored.ciphertext),
          key,
          new Uint8Array(stored.iv)
        );

        // Store derived key in session for future use
        const exportedKey = await exportKey(key);
        sessionStorage.setItem('derivedKey', JSON.stringify(Array.from(exportedKey)));

        teleportPasswordModal.hidden = true;
        teleportPasswordInput.value = '';
        teleportPasswordError.hidden = true;

        if (passwordResolver) {
          passwordResolver(decrypted);
          passwordResolver = null;
        }
      } catch (err) {
        console.error('Password decryption failed:', err);
        teleportPasswordError.textContent = 'Incorrect password';
        teleportPasswordError.hidden = false;
      }
    });

    // Prompt for password and return decrypted nsec (or null if cancelled)
    function promptForPassword() {
      return new Promise((resolve) => {
        passwordResolver = resolve;
        teleportPasswordInput.value = '';
        teleportPasswordError.hidden = true;
        teleportPasswordModal.hidden = false;
        teleportPasswordInput.focus();
      });
    }

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

    // === User Teleport Apps Functions ===

    const userAppsCard = document.getElementById('user-apps-card');
    const userAppsList = document.getElementById('user-apps-list');
    let userTeleportApps = [];

    async function loadUserTeleportApps() {
      try {
        const res = await fetch('/api/user/teleport-apps', {
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();

        if (!data.success || !data.apps || data.apps.length === 0) {
          userAppsCard.hidden = true;
          return;
        }

        userTeleportApps = data.apps;
        renderUserTeleportApps();
        userAppsCard.hidden = false;
      } catch (err) {
        console.error('Failed to load user teleport apps:', err);
        userAppsCard.hidden = true;
      }
    }

    function renderUserTeleportApps() {
      if (userTeleportApps.length === 0) {
        userAppsCard.hidden = true;
        return;
      }

      userAppsList.innerHTML = userTeleportApps.map(app => {
        const firstLetter = app.app_name.charAt(0).toUpperCase();
        return '<div class="user-app-item" data-app-id="' + app.id + '">' +
          '<div class="user-app-content" data-pubkey="' + app.app_pubkey + '" data-url="' + escapeHtml(app.app_url) + '" data-name="' + escapeHtml(app.app_name) + '">' +
            '<div class="app-icon" style="background:var(--purple);color:white;">' + firstLetter + '</div>' +
            '<div class="app-info">' +
              '<div class="app-name">' + escapeHtml(app.app_name) + '</div>' +
              '<div class="app-role">' + (app.app_description || 'Custom App') + '</div>' +
            '</div>' +
            '<span class="app-arrow">&rarr;</span>' +
          '</div>' +
          '<button class="user-app-delete" data-app-id="' + app.id + '" title="Remove app">X</button>' +
        '</div>';
      }).join('');

      // Add click handlers for teleport
      userAppsList.querySelectorAll('.user-app-content').forEach(item => {
        item.addEventListener('click', () => {
          const pubkey = item.dataset.pubkey;
          const url = item.dataset.url;
          const name = item.dataset.name;
          const app = userTeleportApps.find(a => a.app_pubkey === pubkey);
          if (!app) return;

          if (nsec || hasServerTeleportKey) {
            // Show teleport modal for user app
            showUserAppTeleportModal(app);
          } else {
            // Direct navigation
            window.open(url, '_blank');
          }
        });
      });

      // Add delete handlers
      userAppsList.querySelectorAll('.user-app-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const appId = parseInt(btn.dataset.appId, 10);
          const app = userTeleportApps.find(a => a.id === appId);
          if (!app) return;

          if (!confirm('Remove "' + app.app_name + '" from your apps?')) return;

          try {
            const res = await fetch('/api/user/teleport-apps/' + appId, {
              method: 'DELETE',
              headers: { 'X-Npub': npub }
            });
            const data = await res.json();

            if (data.success) {
              userTeleportApps = userTeleportApps.filter(a => a.id !== appId);
              renderUserTeleportApps();
            } else {
              alert('Failed to remove app: ' + (data.error || 'Unknown error'));
            }
          } catch (err) {
            console.error('Failed to delete user app:', err);
            alert('Failed to remove app');
          }
        });
      });
    }

    // Teleport to user app - reuse common showTeleportModal
    function showUserAppTeleportModal(app) {
      showTeleportModal({
        id: app.id,
        name: app.app_name,
        url: app.app_url,
        teleport_pubkey: app.app_pubkey,
        isUserApp: true
      });
    }

    // Load user teleport apps on page load
    loadUserTeleportApps();

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

      // Teleport key badge
      if (profileTeleportBadge) {
        profileTeleportBadge.hidden = !hasServerTeleportKey;
      }

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
