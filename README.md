### Quick Tab Reorder

Move the current tab to the first position with a single keyboard shortcut so you can instantly jump back to it using your browser's built‑in tab shortcuts (Cmd/Ctrl+1).

## Why
- **Stay in flow**: Keep your focus tab bound to the browser's fastest switch shortcut.
- **Zero mouse**: No dragging tabs, no searching by title.

## What it does
- **Primary actions**:
  - Move active tab to position 1–4 using shortcuts (defaults below)
  - Positions respect pinned/unpinned ordering
- **Built‑in synergy**: Immediately use `Command+1` (macOS) or `Ctrl+1` (Windows/Linux) to jump back to this tab at any time.
- **Pinned tabs**: If the active tab is pinned, it becomes the first pinned tab. If it is not pinned and there are pinned tabs, it becomes the first unpinned tab (right after all pinned tabs). This mirrors Chrome/Edge tab ordering rules.
- **Per‑window**: Reordering happens within the current window only.

## Install (unpacked)
Chrome and Edge support loading extensions from a local folder for development and personal use.

### Install (from stores)
- Chrome Web Store: coming soon
- Microsoft Edge Add-ons: coming soon

### Chrome
1. Open `chrome://extensions`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this project folder.

### Microsoft Edge
1. Open `edge://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select this project folder.

## Usage
- Press a shortcut to move the active tab to positions 1–4:
  - macOS: `Command+Ctrl+1` … `Command+Ctrl+4`
  - Windows/Linux: `Ctrl+Shift+1` … `Ctrl+Shift+4`
- Then use your browser's native shortcut to return to it at any time:
  - macOS: `Command+1`
  - Windows/Linux: `Ctrl+1`

### Customize the shortcuts
- Chrome: open `chrome://extensions/shortcuts` and set the commands "Move active tab to position 1" … "position 4".
- Edge: open `edge://extensions/shortcuts` and set the same commands.

## Permissions
- `tabs`: Required to move the active tab within the current window.

## Privacy
- No data collection, tracking, or analytics.
- No network access; the extension does not make external requests.
- No content scripts; it does not read or modify page content.

## How it works (high‑level)
- A background service worker listens for a command.
- When triggered, it finds the active tab in the focused window and moves it to the requested position (1–4) within its group using the Tabs API:
  - If the active tab is pinned, it moves to that position among pinned tabs.
  - If unpinned, it moves to that position among unpinned tabs (right after all pinned tabs).
  - Positions are clamped to available tabs to avoid errors.

## Store listing (copy‑ready)

### Short description
Move the active tab to positions 1–4 with keyboard shortcuts, respecting pinned/unpinned tabs. Stay in flow; jump back with Cmd/Ctrl+1.

### Full description
Quick Tab Reorder keeps your focus where you need it. With a single shortcut, move the current tab to a consistent spot so you can instantly jump back to it using your browser’s built‑in switch‑to‑tab shortcuts.

- Move active tab to position 1–4 using configurable shortcuts
- Respects pinned/unpinned ordering (follows Chrome/Edge tab rules)
- Works per window; no cross‑window moves
- Minimal permissions, no tracking, no page access

Keyboard shortcuts (defaults):
- macOS: Command+Control+1 … Command+Control+4
- Windows/Linux: Ctrl+Shift+1 … Ctrl+Shift+4

You can customize these in your browser’s extension shortcuts page.

Privacy: This extension does not collect data and does not access page content.

Permissions: Uses the `tabs` permission solely to reorder tabs in the current window.

## Publish to stores

### Chrome Web Store (CWS)
1. Build package: zip the folder contents (exclude `.git`, `.github`, `*.md` if desired). Ensure `manifest.json`, `background.js`, and icons are included.
2. Create a new item at the Chrome Web Store Developer Dashboard.
3. Upload the zip, paste the Short/Full description above, and add screenshots (1280×800 or 640×400) and an icon (128×128 required; 16/32/48 recommended).
4. Select categories, regions, and visibility, then submit for review.

### Microsoft Edge Add-ons
1. Reuse the same zip. Go to the Partner Center → Edge Add-ons.
2. Create a new extension listing, upload the zip, and provide the same metadata and assets.
3. Submit for review.

See `SPEC.md` for detailed behavior and manifest/logic design.

## Compatibility
- **Chrome**: Manifest V3 supported.
- **Microsoft Edge (Chromium)**: Manifest V3 supported.

## Development
- Load the folder as an unpacked extension (see Install above).
- Use `chrome://extensions` or `edge://extensions` to view logs for the background service worker if needed.

## FAQ
- **Will this move tabs across windows?** No. It reorders within the current window only.
- **What happens with pinned tabs?** Pinned tabs stay within the pinned area. Pinned tabs moved become the first pinned tab; unpinned tabs moved become the first unpinned tab.
- **Does it access page content?** No. There are no content scripts and no network requests.

## Contributing
Issues and PRs are welcome. Please keep the extension focused and permissions minimal.
