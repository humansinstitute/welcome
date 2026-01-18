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

    /* Join form */
    .join-form {
      display: flex;
      gap: 0.75rem;
    }

    .join-form input {
      flex: 1;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-family: var(--font-body);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }

    .join-form input:focus {
      border-color: var(--accent);
    }

    .join-form input::placeholder {
      color: var(--muted);
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

    /* PIN Modal */
    .pin-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61, 56, 51, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .pin-modal-overlay[hidden] {
      display: none;
    }

    .pin-modal {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 360px;
      width: 90%;
      position: relative;
      box-shadow: var(--shadow-warm);
      border: 1px solid var(--border);
      text-align: center;
    }

    .pin-modal-close {
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

    .pin-modal-close:hover {
      color: var(--text);
    }

    .pin-modal h2 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }

    .pin-modal p {
      color: var(--muted);
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
    }

    .pin-input {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1.25rem;
      font-family: monospace;
      text-align: center;
      letter-spacing: 0.25em;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      margin-bottom: 1rem;
    }

    .pin-input:focus {
      outline: none;
      border-color: var(--purple);
    }

    .pin-submit {
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

    .pin-submit:hover {
      background: var(--purple-light);
    }

    .pin-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .pin-error {
      color: var(--error);
      font-size: 0.875rem;
      margin-top: 0.75rem;
    }

    .pin-error[hidden] {
      display: none;
    }

    /* Edit App Modal */
    .edit-app-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61, 56, 51, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .edit-app-modal-overlay[hidden] {
      display: none;
    }

    .edit-app-modal {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 480px;
      width: 90%;
      position: relative;
      box-shadow: var(--shadow-warm);
      border: 1px solid var(--border);
    }

    .edit-app-modal-close {
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

    .edit-app-modal-close:hover {
      color: var(--text);
    }

    .edit-app-modal h2 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .edit-app-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .edit-app-form label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--text);
    }

    .edit-app-form input {
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
    }

    .edit-app-form input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .edit-app-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .edit-app-actions button {
      flex: 1;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all 0.2s;
    }

    .edit-app-actions button[type="button"] {
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .edit-app-actions button[type="button"]:hover {
      border-color: var(--accent);
    }

    .edit-app-actions button[type="submit"] {
      background: var(--purple);
      color: white;
      border: none;
    }

    .edit-app-actions button[type="submit"]:hover {
      background: var(--purple-light);
    }

    .edit-app-actions button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Admin Panel */
    .admin-panel {
      margin-top: 1.5rem;
      border-top: 2px solid var(--purple);
    }

    .admin-panel h2 {
      color: var(--purple);
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .admin-header h2 {
      margin-bottom: 0;
    }

    .invite-codes-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .invite-code-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .invite-code-item.inactive {
      opacity: 0.6;
    }

    .invite-code-info {
      flex: 1;
      min-width: 0;
    }

    .invite-code-text {
      font-family: monospace;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .invite-code-meta {
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 0.25rem;
    }

    .invite-code-actions {
      display: flex;
      gap: 0.5rem;
    }

    .invite-code-actions button {
      padding: 0.35rem 0.6rem;
      font-size: 0.75rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      transition: all 0.2s;
    }

    .invite-code-actions button:hover {
      border-color: var(--purple);
      color: var(--purple);
    }

    .invite-code-actions button.delete:hover {
      border-color: var(--error);
      color: var(--error);
    }

    .add-code-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .add-code-form input {
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
    }

    .add-code-form input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .add-code-row {
      display: flex;
      gap: 0.5rem;
    }

    .add-code-row input {
      flex: 1;
    }

    .add-code-row input.small {
      flex: 0 0 80px;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .copy-link-btn {
      padding: 0.35rem 0.6rem;
      font-size: 0.7rem;
      background: var(--purple);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .copy-link-btn:hover {
      background: var(--purple-light);
    }

    .admin-empty {
      text-align: center;
      padding: 1rem;
      color: var(--muted);
      font-size: 0.9rem;
    }

    /* App Management */
    .apps-admin-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .app-admin-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .app-admin-item.hidden-app {
      opacity: 0.6;
    }

    .app-admin-icon {
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

    .app-admin-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .app-admin-info {
      flex: 1;
      min-width: 0;
    }

    .app-admin-name {
      font-weight: 500;
      font-size: 0.95rem;
    }

    .app-admin-url {
      font-size: 0.75rem;
      color: var(--muted);
      word-break: break-all;
    }

    .app-admin-desc {
      font-size: 0.8rem;
      color: var(--text-warm);
      margin-top: 0.25rem;
    }

    .add-app-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--surface-warm);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
    }

    .add-app-form input {
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
    }

    .add-app-form input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .app-icon-section {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .app-icon-preview {
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

    .app-icon-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .app-icon-inputs {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .app-icon-row {
      display: flex;
      gap: 0.5rem;
    }

    .app-icon-row input {
      flex: 1;
    }

    .app-upload-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      white-space: nowrap;
    }

    .app-upload-btn:hover {
      border-color: var(--purple);
      color: var(--purple);
    }

    .section-divider {
      margin: 1.5rem 0;
      border: none;
      border-top: 1px solid var(--border-soft);
    }

    /* Edit Invite Code Modal */
    .edit-code-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(61, 56, 51, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .edit-code-modal-overlay[hidden] {
      display: none;
    }

    .edit-code-modal {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 480px;
      width: 90%;
      position: relative;
      box-shadow: var(--shadow-warm);
      border: 1px solid var(--border);
    }

    .edit-code-modal-close {
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

    .edit-code-modal-close:hover {
      color: var(--text);
    }

    .edit-code-modal h2 {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .edit-code-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .edit-code-form label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--text);
    }

    .edit-code-form input,
    .edit-code-form textarea {
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
    }

    .edit-code-form input:focus,
    .edit-code-form textarea:focus {
      outline: none;
      border-color: var(--accent);
    }

    .edit-code-form textarea {
      resize: vertical;
      min-height: 100px;
    }

    .edit-code-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .edit-code-actions button {
      flex: 1;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all 0.2s;
    }

    .edit-code-actions button[type="button"] {
      background: var(--surface-warm);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .edit-code-actions button[type="button"]:hover {
      border-color: var(--accent);
    }

    .edit-code-actions button[type="submit"] {
      background: var(--purple);
      color: white;
      border: none;
    }

    .edit-code-actions button[type="submit"]:hover {
      background: var(--purple-light);
    }

    .edit-code-actions button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .add-code-form textarea {
      padding: 0.6rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      font-family: var(--font-body);
      resize: vertical;
      min-height: 80px;
    }

    .add-code-form textarea:focus {
      outline: none;
      border-color: var(--accent);
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

    <div class="card">
      <h2>Your Apps</h2>
      <div class="apps-list" id="apps-list">
        <div class="apps-empty">
          <p>No apps yet.</p>
          <p>Join an app with an invite code below.</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Join an App</h2>
      <form class="join-form" id="join-form">
        <input type="text" name="code" placeholder="Enter invite code" autocomplete="off">
        <button class="btn btn-primary" type="submit">Join</button>
      </form>
    </div>

    <!-- Admin Panel (only visible to admin) -->
    <div class="card admin-panel" id="admin-panel" hidden>
      <div class="admin-header">
        <h2>Manage Apps</h2>
      </div>
      <div class="apps-admin-list" id="apps-admin-list">
        <div class="admin-empty">Loading...</div>
      </div>
      <form class="add-app-form" id="add-app-form">
        <input type="text" name="name" placeholder="App name" required>
        <input type="text" name="description" placeholder="Short description">
        <input type="url" name="url" placeholder="https://app.example.com" required>
        <input type="text" name="teleportPubkey" placeholder="Teleport pubkey (npub or hex) - optional">
        <div class="app-icon-section">
          <div class="app-icon-preview" id="app-icon-preview">
            <span>📱</span>
          </div>
          <div class="app-icon-inputs">
            <div class="app-icon-row">
              <input type="url" name="iconUrl" id="app-icon-url" placeholder="Icon URL">
              <button type="button" class="app-upload-btn" id="app-upload-btn">Upload</button>
              <input type="file" id="app-icon-file" accept="image/*" hidden>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-small">Add App</button>
      </form>

      <hr class="section-divider">

      <div class="admin-header">
        <h2>Invite Codes</h2>
      </div>
      <div class="invite-codes-list" id="invite-codes-list">
        <div class="admin-empty">Loading...</div>
      </div>
      <form class="add-code-form" id="add-code-form">
        <div class="add-code-row">
          <input type="text" name="code" placeholder="New invite code" required>
          <input type="number" name="maxUses" class="small" placeholder="Max" min="1">
        </div>
        <input type="text" name="description" placeholder="Description (optional)">
        <textarea name="welcomeMessage" placeholder="Welcome message (markdown, optional)"></textarea>
        <button type="submit" class="btn btn-primary btn-small">Add Code</button>
      </form>
    </div>

  <!-- Edit Invite Code Modal -->
  <div class="edit-code-modal-overlay" id="edit-code-modal" hidden>
    <div class="edit-code-modal">
      <button class="edit-code-modal-close" type="button" id="edit-code-close" aria-label="Close">&times;</button>
      <h2>Edit Invite Code</h2>
      <form class="edit-code-form" id="edit-code-form">
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
        <div class="edit-code-actions">
          <button type="button" id="edit-code-cancel">Cancel</button>
          <button type="submit" id="edit-code-save">Save Changes</button>
        </div>
      </form>
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

  <!-- PIN Modal for Key Teleport -->
  <div class="pin-modal-overlay" id="pin-modal" hidden>
    <div class="pin-modal">
      <button class="pin-modal-close" type="button" id="pin-close" aria-label="Close">&times;</button>
      <h2>Transfer Identity</h2>
      <p id="pin-modal-desc">Enter a PIN to securely transfer your identity to <span id="pin-app-name"></span></p>
      <form id="pin-form">
        <input type="password" class="pin-input" id="pin-input" placeholder="Enter PIN" minlength="4" maxlength="21" required autocomplete="off">
        <button type="submit" class="pin-submit" id="pin-submit">Transfer</button>
        <p class="pin-error" id="pin-error" hidden></p>
      </form>
    </div>
  </div>

  <!-- Edit App Modal -->
  <div class="edit-app-modal-overlay" id="edit-app-modal" hidden>
    <div class="edit-app-modal">
      <button class="edit-app-modal-close" type="button" id="edit-app-close" aria-label="Close">&times;</button>
      <h2>Edit App</h2>
      <form class="edit-app-form" id="edit-app-form">
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
        <div class="edit-app-actions">
          <button type="button" id="edit-app-cancel">Cancel</button>
          <button type="submit" id="edit-app-save">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <script type="module">
    import { nip19, finalizeEvent, getPublicKey } from 'https://esm.sh/nostr-tools@2.7.2';
    import { Relay } from 'https://esm.sh/nostr-tools@2.7.2/relay';
    import { encrypt as nip49Encrypt } from 'https://esm.sh/nostr-tools@2.7.2/nip49';

    const RELAYS = ${JSON.stringify(NOSTR_RELAYS)};
    const ADMIN_NPUB = ${JSON.stringify(ADMIN_NPUB)};

    const avatarBtn = document.getElementById('avatar-btn');
    const avatarFallback = document.getElementById('avatar-fallback');
    const userDropdown = document.getElementById('user-dropdown');
    const userNpubEl = document.getElementById('user-npub');
    const copyNpubBtn = document.getElementById('copy-npub');
    const logoutBtn = document.getElementById('logout-btn');
    const viewProfileBtn = document.getElementById('view-profile-btn');
    const joinForm = document.getElementById('join-form');

    // Admin elements
    const adminPanel = document.getElementById('admin-panel');
    const inviteCodesList = document.getElementById('invite-codes-list');
    const addCodeForm = document.getElementById('add-code-form');

    // App admin elements
    const appsAdminList = document.getElementById('apps-admin-list');
    const addAppForm = document.getElementById('add-app-form');
    const appIconUrl = document.getElementById('app-icon-url');
    const appIconPreview = document.getElementById('app-icon-preview');
    const appUploadBtn = document.getElementById('app-upload-btn');
    const appIconFile = document.getElementById('app-icon-file');

    // Edit app modal elements
    const editAppModal = document.getElementById('edit-app-modal');
    const editAppCloseBtn = document.getElementById('edit-app-close');
    const editAppForm = document.getElementById('edit-app-form');
    const editAppId = document.getElementById('edit-app-id');
    const editAppName = document.getElementById('edit-app-name');
    const editAppDescription = document.getElementById('edit-app-description');
    const editAppUrl = document.getElementById('edit-app-url');
    const editAppIconUrl = document.getElementById('edit-app-icon-url');
    const editAppTeleportPubkey = document.getElementById('edit-app-teleport-pubkey');
    const editAppCancel = document.getElementById('edit-app-cancel');
    const editAppSave = document.getElementById('edit-app-save');

    // PIN modal elements
    const pinModal = document.getElementById('pin-modal');
    const pinCloseBtn = document.getElementById('pin-close');
    const pinForm = document.getElementById('pin-form');
    const pinInput = document.getElementById('pin-input');
    const pinSubmit = document.getElementById('pin-submit');
    const pinError = document.getElementById('pin-error');
    const pinAppName = document.getElementById('pin-app-name');

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

    // Welcome message elements
    const welcomeMessageCard = document.getElementById('welcome-message-card');
    const welcomeMessageHeader = document.getElementById('welcome-message-header');
    const welcomeMessageBody = document.getElementById('welcome-message-body');
    const welcomeMessageActions = document.getElementById('welcome-message-actions');
    const welcomeMessageDismiss = document.getElementById('welcome-message-dismiss');

    // Get session data
    const npub = sessionStorage.getItem('npub');
    const nsec = sessionStorage.getItem('nsec');
    const onboarded = sessionStorage.getItem('onboarded');
    const cachedAvatar = sessionStorage.getItem('avatarUrl');
    const cachedName = sessionStorage.getItem('displayName');

    // Current profile data
    let currentProfile = { name: '', about: '', picture: '', nip05: '' };

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
    function cacheProfile(profile) {
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
    }

    // Validate session - if npub is missing or invalid, clear and redirect
    if (!npub || !npub.startsWith('npub1')) {
      sessionStorage.clear();
      window.location.href = '/?logout';
    } else if (!onboarded) {
      window.location.href = '/onboarding';
    } else {
      // Use cached avatar if available, otherwise show fallback
      updateHeaderAvatar(cachedAvatar, cachedName);
      userNpubEl.textContent = npub;
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

    // Join form (placeholder)
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = joinForm.elements.code.value.trim();
      if (!code) return;
      alert('App joining coming soon!');
    });

    // === App Display and Teleport Functions ===

    let userApps = [];

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
            // Show PIN modal for teleport
            showPinModal(app);
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

    function showPinModal(app) {
      teleportTarget = app;
      pinAppName.textContent = app.name;
      pinInput.value = '';
      pinError.hidden = true;
      pinSubmit.disabled = false;
      pinSubmit.textContent = 'Transfer';
      pinModal.hidden = false;
      pinInput.focus();
    }

    function hidePinModal() {
      pinModal.hidden = true;
      teleportTarget = null;
    }

    function generateHashId() {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    }

    async function performTeleport(pin) {
      if (!teleportTarget || !nsec) return;

      try {
        // Decode nsec to get secret key bytes
        const { type, data: secretKey } = nip19.decode(nsec);
        if (type !== 'nsec') throw new Error('Invalid nsec');

        // Encrypt with NIP-49 using the PIN
        const ncryptsec = nip49Encrypt(secretKey, pin);

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
            ncryptsec,
            appId: teleportTarget.id,
            baseUrl
          })
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to store teleport key');
        }

        // Build teleport URL with NIP-44 encrypted blob and open in new tab
        const teleportUrl = teleportTarget.url + (teleportTarget.url.includes('?') ? '&' : '?') + 'keyteleport=' + encodeURIComponent(data.blob);
        window.open(teleportUrl, '_blank');

        hidePinModal();
      } catch (err) {
        console.error('Teleport error:', err);
        pinError.textContent = err.message || 'Failed to transfer identity';
        pinError.hidden = false;
      }
    }

    // PIN Modal Event Listeners
    pinCloseBtn.addEventListener('click', hidePinModal);

    pinModal.addEventListener('click', (e) => {
      if (e.target === pinModal) {
        hidePinModal();
      }
    });

    pinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = pinInput.value;
      if (!pin || pin.length < 4) {
        pinError.textContent = 'PIN must be at least 4 characters';
        pinError.hidden = false;
        return;
      }

      pinSubmit.disabled = true;
      pinSubmit.textContent = 'Transferring...';
      pinError.hidden = true;

      await performTeleport(pin);

      pinSubmit.disabled = false;
      pinSubmit.textContent = 'Transfer';
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

      // Cache profile and update header avatar
      cacheProfile(currentProfile);
      updateHeaderAvatar(currentProfile.picture, currentProfile.name);

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

    // === Admin Functions ===

    const isAdmin = npub && ADMIN_NPUB && npub === ADMIN_NPUB;

    async function loadInviteCodes() {
      try {
        const res = await fetch('/admin/codes', {
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();

        if (!data.success) {
          inviteCodesList.innerHTML = '<div class="admin-empty">Failed to load codes</div>';
          return;
        }

        if (data.codes.length === 0) {
          inviteCodesList.innerHTML = '<div class="admin-empty">No invite codes yet</div>';
          return;
        }

        // Store codes data for edit modal
        window.adminCodesData = {};

        inviteCodesList.innerHTML = data.codes.map(code => {
          // Store code data in JS object
          window.adminCodesData[code.code] = code;

          const usageText = code.max_uses
            ? code.uses + '/' + code.max_uses + ' uses'
            : code.uses + ' uses';
          const statusText = code.active ? '' : ' (disabled)';
          const inactiveClass = code.active ? '' : ' inactive';
          const welcomeBadge = code.welcome_message
            ? '<span style="font-size:0.7rem;background:#dbeafe;color:#1e40af;padding:2px 6px;border-radius:4px;margin-left:6px">Welcome</span>'
            : '';

          return '<div class="invite-code-item' + inactiveClass + '" data-code="' + code.code + '">' +
            '<div class="invite-code-info">' +
              '<div class="invite-code-text">' + code.code + statusText + welcomeBadge + '</div>' +
              '<div class="invite-code-meta">' + usageText + (code.description ? ' - ' + code.description : '') + '</div>' +
            '</div>' +
            '<div class="invite-code-actions">' +
              '<button type="button" class="copy-link-btn" data-copy-link="' + code.code + '">Copy Link</button>' +
              '<button type="button" data-edit-code="' + code.code + '">Edit</button>' +
              '<button type="button" data-toggle="' + code.code + '" data-active="' + code.active + '">' + (code.active ? 'Disable' : 'Enable') + '</button>' +
              '<button type="button" class="delete" data-delete="' + code.code + '">Delete</button>' +
            '</div>' +
          '</div>';
        }).join('');

        // Add event listeners
        inviteCodesList.querySelectorAll('[data-copy-link]').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = btn.dataset.copyLink;
            const link = window.location.origin + '/?ic=' + encodeURIComponent(code);
            navigator.clipboard.writeText(link);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy Link', 2000);
          });
        });

        inviteCodesList.querySelectorAll('[data-edit-code]').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = btn.dataset.editCode;
            const codeData = window.adminCodesData[code];
            if (codeData) {
              showEditCodeModal(codeData);
            }
          });
        });

        inviteCodesList.querySelectorAll('[data-toggle]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const code = btn.dataset.toggle;
            const currentActive = btn.dataset.active === '1';
            await toggleCode(code, !currentActive);
          });
        });

        inviteCodesList.querySelectorAll('[data-delete]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const code = btn.dataset.delete;
            if (confirm('Delete invite code "' + code + '"?')) {
              await deleteCode(code);
            }
          });
        });

      } catch (err) {
        console.error('Failed to load invite codes:', err);
        inviteCodesList.innerHTML = '<div class="admin-empty">Failed to load codes</div>';
      }
    }

    async function createCode(code, description, maxUses, welcomeMessage) {
      try {
        const res = await fetch('/admin/codes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
          body: JSON.stringify({ code, description, maxUses, welcomeMessage })
        });
        const data = await res.json();

        if (data.success) {
          loadInviteCodes();
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
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
          body: JSON.stringify({ description, maxUses, welcomeMessage })
        });
        const data = await res.json();

        if (data.success) {
          loadInviteCodes();
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
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
          body: JSON.stringify({ active })
        });
        const data = await res.json();

        if (data.success) {
          loadInviteCodes();
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
          loadInviteCodes();
        } else {
          alert(data.error || 'Failed to delete code');
        }
      } catch (err) {
        console.error('Failed to delete code:', err);
        alert('Failed to delete code');
      }
    }

    // === App Management Functions ===

    async function loadApps() {
      try {
        const res = await fetch('/admin/apps', {
          headers: { 'X-Npub': npub }
        });
        const data = await res.json();

        if (!data.success) {
          appsAdminList.innerHTML = '<div class="admin-empty">Failed to load apps</div>';
          return;
        }

        if (data.apps.length === 0) {
          appsAdminList.innerHTML = '<div class="admin-empty">No apps configured yet</div>';
          return;
        }

        // Store apps data for edit modal
        window.adminAppsData = {};

        appsAdminList.innerHTML = data.apps.map(app => {
          // Store app data in JS object instead of data attribute
          window.adminAppsData[app.id] = app;

          const iconHtml = app.icon_url
            ? '<img src="' + app.icon_url + '" alt="" onerror="this.parentElement.innerHTML=String.fromCharCode(128241)">'
            : '<span>📱</span>';
          const teleportBadge = app.teleport_pubkey
            ? '<span style="font-size:0.7rem;background:#dcfce7;color:#166534;padding:2px 6px;border-radius:4px;margin-left:6px">Teleport</span>'
            : '';
          const isVisible = app.visible === 1;
          const hiddenClass = isVisible ? '' : ' hidden-app';
          const visibilityBadge = isVisible
            ? ''
            : '<span style="font-size:0.7rem;background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:4px;margin-left:6px">Hidden</span>';

          return '<div class="app-admin-item' + hiddenClass + '" data-app-id="' + app.id + '">' +
            '<div class="app-admin-icon">' + iconHtml + '</div>' +
            '<div class="app-admin-info">' +
              '<div class="app-admin-name">' + escapeHtml(app.name) + teleportBadge + visibilityBadge + '</div>' +
              '<div class="app-admin-url">' + escapeHtml(app.url) + '</div>' +
              (app.description ? '<div class="app-admin-desc">' + escapeHtml(app.description) + '</div>' : '') +
            '</div>' +
            '<div class="invite-code-actions">' +
              '<button type="button" data-toggle-app="' + app.id + '" data-visible="' + (isVisible ? '1' : '0') + '">' + (isVisible ? 'Hide' : 'Show') + '</button>' +
              '<button type="button" data-edit-app="' + app.id + '">Edit</button>' +
              '<button type="button" class="delete" data-delete-app="' + app.id + '">Delete</button>' +
            '</div>' +
          '</div>';
        }).join('');

        // Add event listeners
        appsAdminList.querySelectorAll('[data-toggle-app]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.toggleApp, 10);
            const currentVisible = btn.dataset.visible === '1';
            await toggleApp(id, !currentVisible);
          });
        });

        appsAdminList.querySelectorAll('[data-edit-app]').forEach(btn => {
          btn.addEventListener('click', () => {
            const appId = parseInt(btn.dataset.editApp, 10);
            const appData = window.adminAppsData[appId];
            if (appData) {
              showEditAppModal(appData);
            }
          });
        });

        appsAdminList.querySelectorAll('[data-delete-app]').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.deleteApp, 10);
            const appItem = btn.closest('.app-admin-item');
            const appName = appItem.querySelector('.app-admin-name').textContent;
            if (confirm('Delete app "' + appName + '"?')) {
              await deleteAppById(id);
            }
          });
        });

      } catch (err) {
        console.error('Failed to load apps:', err);
        appsAdminList.innerHTML = '<div class="admin-empty">Failed to load apps</div>';
      }
    }

    async function createAppEntry(name, description, iconUrl, url, teleportPubkey) {
      try {
        const res = await fetch('/admin/apps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
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

    async function deleteAppById(id) {
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

    async function toggleApp(id, visible) {
      try {
        const res = await fetch('/admin/apps/' + id + '/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
          body: JSON.stringify({ visible })
        });
        const data = await res.json();

        if (data.success) {
          loadApps();
          loadUserApps(); // Refresh user apps list too
        } else {
          alert(data.error || 'Failed to toggle app visibility');
        }
      } catch (err) {
        console.error('Failed to toggle app:', err);
        alert('Failed to toggle app visibility');
      }
    }

    // Edit invite code modal elements
    const editCodeModal = document.getElementById('edit-code-modal');
    const editCodeCloseBtn = document.getElementById('edit-code-close');
    const editCodeForm = document.getElementById('edit-code-form');
    const editCodeCode = document.getElementById('edit-code-code');
    const editCodeDisplay = document.getElementById('edit-code-display');
    const editCodeDescription = document.getElementById('edit-code-description');
    const editCodeMaxUses = document.getElementById('edit-code-max-uses');
    const editCodeWelcomeMessage = document.getElementById('edit-code-welcome-message');
    const editCodeCancel = document.getElementById('edit-code-cancel');
    const editCodeSave = document.getElementById('edit-code-save');

    // Edit invite code modal functions
    function showEditCodeModal(codeData) {
      editCodeCode.value = codeData.code;
      editCodeDisplay.value = codeData.code;
      editCodeDescription.value = codeData.description || '';
      editCodeMaxUses.value = codeData.max_uses || '';
      editCodeWelcomeMessage.value = codeData.welcome_message || '';
      editCodeSave.disabled = false;
      editCodeSave.textContent = 'Save Changes';
      editCodeModal.hidden = false;
    }

    function hideEditCodeModal() {
      editCodeModal.hidden = true;
    }

    // Edit code modal event listeners
    editCodeCloseBtn.addEventListener('click', hideEditCodeModal);
    editCodeCancel.addEventListener('click', hideEditCodeModal);

    editCodeModal.addEventListener('click', (e) => {
      if (e.target === editCodeModal) {
        hideEditCodeModal();
      }
    });

    editCodeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = editCodeCode.value;
      const description = editCodeDescription.value.trim();
      const maxUses = editCodeMaxUses.value;
      const welcomeMessage = editCodeWelcomeMessage.value.trim();

      editCodeSave.disabled = true;
      editCodeSave.textContent = 'Saving...';

      if (await updateCode(code, description || null, maxUses || null, welcomeMessage || null)) {
        hideEditCodeModal();
      }

      editCodeSave.disabled = false;
      editCodeSave.textContent = 'Save Changes';
    });

    // Edit app modal functions
    function showEditAppModal(app) {
      editAppId.value = app.id;
      editAppName.value = app.name || '';
      editAppDescription.value = app.description || '';
      editAppUrl.value = app.url || '';
      editAppIconUrl.value = app.icon_url || '';
      editAppTeleportPubkey.value = app.teleport_pubkey || '';
      editAppSave.disabled = false;
      editAppSave.textContent = 'Save Changes';
      editAppModal.hidden = false;
    }

    function hideEditAppModal() {
      editAppModal.hidden = true;
    }

    async function updateAppById(id, name, description, iconUrl, url, teleportPubkey) {
      try {
        const res = await fetch('/admin/apps/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Npub': npub
          },
          body: JSON.stringify({ name, description, iconUrl, url, teleportPubkey })
        });
        const data = await res.json();

        if (data.success) {
          loadApps();
          loadUserApps(); // Refresh user apps list too
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

    // Edit app modal event listeners
    editAppCloseBtn.addEventListener('click', hideEditAppModal);
    editAppCancel.addEventListener('click', hideEditAppModal);

    editAppModal.addEventListener('click', (e) => {
      if (e.target === editAppModal) {
        hideEditAppModal();
      }
    });

    editAppForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = parseInt(editAppId.value, 10);
      const name = editAppName.value.trim();
      const description = editAppDescription.value.trim();
      const url = editAppUrl.value.trim();
      const iconUrl = editAppIconUrl.value.trim();
      const teleportPubkey = editAppTeleportPubkey.value.trim();

      editAppSave.disabled = true;
      editAppSave.textContent = 'Saving...';

      if (await updateAppById(id, name, description || null, iconUrl || null, url, teleportPubkey || null)) {
        hideEditAppModal();
      }

      editAppSave.disabled = false;
      editAppSave.textContent = 'Save Changes';
    });

    // Initialize admin panel if admin
    if (isAdmin) {
      adminPanel.hidden = false;
      loadInviteCodes();
      loadApps();

      // Invite code form
      addCodeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = addCodeForm.elements.code.value.trim();
        const description = addCodeForm.elements.description.value.trim();
        const maxUses = addCodeForm.elements.maxUses.value;
        const welcomeMessage = addCodeForm.elements.welcomeMessage.value.trim();

        if (await createCode(code, description || null, maxUses || null, welcomeMessage || null)) {
          addCodeForm.reset();
        }
      });

      // App form
      addAppForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = addAppForm.elements.name.value.trim();
        const description = addAppForm.elements.description.value.trim();
        const url = addAppForm.elements.url.value.trim();
        const iconUrl = addAppForm.elements.iconUrl.value.trim();
        const teleportPubkey = addAppForm.elements.teleportPubkey.value.trim();

        if (await createAppEntry(name, description || null, iconUrl || null, url, teleportPubkey || null)) {
          addAppForm.reset();
          appIconPreview.innerHTML = '<span>📱</span>';
        }
      });

      // App icon preview
      appIconUrl.addEventListener('input', () => {
        const url = appIconUrl.value.trim();
        if (url) {
          appIconPreview.innerHTML = '<img src="' + url + '" alt="" onerror="this.parentElement.innerHTML=\\'<span>📱</span>\\'">';
        } else {
          appIconPreview.innerHTML = '<span>📱</span>';
        }
      });

      // App icon upload
      appUploadBtn.addEventListener('click', () => {
        appIconFile.click();
      });

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
    }
  </script>
</body>
</html>`;
}
