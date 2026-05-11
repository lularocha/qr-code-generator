# "Download App" Feature — Proposal

## Goal

Let users run the QR Code Generator on their machine without internet access,
and optionally install it as a desktop shortcut with an icon.

---

## Approach 1: PWA (Progressive Web App)

### How it works

1. Add a **`manifest.json`** — defines the app name, icon, colors, and that it runs
   in a standalone window (no browser chrome).
2. Add a **service worker** (`sw.js`) — caches all assets (`index.html`, `styles.css`,
   `script.js`, `qrcode.min.js`, `favicon.png`) on first visit.
3. The browser detects the manifest + service worker and shows a native
   **"Install"** prompt (or the user clicks **"Add to Desktop"** from the menu).
4. A shortcut with the app icon appears on the desktop / home screen.
5. Subsequent launches open in a standalone window and work **fully offline**.

### Pros

- One-click install, no zip, no extraction, no file management.
- Desktop icon with custom icon — looks like a native app.
- Automatically updates when online, works offline when not.
- No OS quarantine warnings (no downloaded files to flag).
- Familiar UX — users trust "Install" prompts from sites like Twitter, Spotify, Figma.

### Cons

- Requires HTTPS (or `localhost`) for the service worker to register.
- Slightly more complex to implement (manifest + service worker + caching
  strategy).

---

## Approach 2: Zip Download

### How it works

1. Use a JavaScript library like **JSZip** to bundle all project files in-browser.
2. A **"Download App"** button triggers a zip download containing:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `qrcode.min.js`
   - `favicon.png`
   - `README.md` (instructions for use and shortcut creation)
3. The user extracts the zip and opens `index.html` in their browser.

### Pros

- Simple to implement.
- Truly portable — carry on a USB stick, share via email, host anywhere.
- Works completely offline after download.
- README can guide users through manual shortcut creation per OS.

### Cons

- User must extract and manage files manually.
- macOS Gatekeeper / Windows SmartScreen may flag the zip as "unverified" (see
  Security section below).
- No automatic updates — user must re-download to get new versions.
- Manual shortcut creation is OS-specific and non-trivial for some users.

---

## Security

### Inherent safety

This project is **plain HTML, CSS, and JavaScript**. There are no binaries, no
executables, and no installers. Everything runs inside the browser sandbox,
which has no access to the filesystem. Opening `index.html` is as safe as
visiting any website.

Anyone can inspect every file with a text editor before opening it — full
transparency.

### Threat model & mitigations

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Man-in-the-middle (MITM)** — an attacker intercepts and modifies files during download | Low | High | HTTPS via GitHub Pages prevents tampering in transit. Users see the padlock in their browser. |
| **Spoofed site** — user lands on a copycat domain serving a malicious zip | Low | High | Link to the **public GitHub repo** prominently on the site. Users can verify source and even download directly from GitHub Releases. |
| **QR library tampering** — `qrcode.min.js` replaced with malicious code | Low | High | Self-hosting is already done (no CDN). Can add an **SRI hash** to `<script>` so the browser rejects modified files. |
| **OS quarantine flags** — macOS Gatekeeper or Windows SmartScreen warns "this file was downloaded from the internet" | Medium | Low (cosmetic) | Only affects the **zip approach**. PWA avoids this entirely. README explains the quarantine is normal for any downloaded file and how to bypass it. |
| **Auto-execution on extract** — fear that extracting a zip runs something | None | None | ZIPs don't auto-execute. Double-clicking `index.html` opens it in the browser sandbox. README should explain this plainly. |

### PWA vs Zip — security comparison

| Concern | PWA | Zip |
|---|---|---|
| MITM during download | Protected by HTTPS | Protected by HTTPS |
| Spoofed site | User trusts browser URL bar | User must verify source (GitHub link) |
| Downloaded file flagged by OS | No file downloaded | Possible quarantine warning |
| Tampered library | SRI hash + service worker integrity | SRI hash + user can inspect files |
| Offline use after first visit | Yes (service worker cache) | Yes (local files) |

---

## Recommendation

**Implement both.** They solve different needs:

- **PWA** — The polished one-click experience for online users. The browser
  prompts "Install" and the app appears on the desktop with an icon. Works
  offline after first visit. This is what most users will use.

- **Zip Download** — A fallback for power users who want a portable copy on a
  USB stick, need to share it offline, or simply prefer local files they can
  inspect and keep forever.

### Implementation order

1. **PWA first** — manifest.json + service worker. This covers ~95% of the
   "download app" use case with the best UX and zero security friction.
2. **Zip later** — JSZip bundle with README. Low priority, nice-to-have for
   the portable/offline niche.

### README contents (for the zip)

The README inside the zip should cover:

- How to open the app (double-click `index.html`).
- That all files are plain text — inspect them with Notepad or TextEdit.
- That the app runs in the browser sandbox and cannot touch the filesystem.
- How to create a desktop shortcut manually on Windows, macOS, and Linux.
- A link back to the GitHub repo for updates and source verification.