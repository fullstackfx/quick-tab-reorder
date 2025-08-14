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
  - macOS: `Command+Shift+1` … `Command+Shift+4`
  - Windows/Linux: `Ctrl+Shift+1` … `Ctrl+Shift+4`
- Then use your browser's native shortcut to return to it at any time:
  - macOS: `Command+1`
  - Windows/Linux: `Ctrl+1`

### Customize the shortcuts
- Chrome: open `chrome://extensions/shortcuts` and set the commands "Move active tab to position 1" … "position 5".
- Edge: open `edge://extensions/shortcuts` and set the same commands.

## Permissions
- `tabs`: Required to move the active tab within the current window.

## How it works (high‑level)
- A background service worker listens for a command.
- When triggered, it finds the active tab in the focused window and moves it to index 0 via the Tabs API. Chrome/Edge enforce pinned/unpinned ordering; the extension respects that.

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
