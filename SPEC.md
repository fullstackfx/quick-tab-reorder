### Quick Tab Reorder — Specification

## Overview
Move the current active tab to the first position in its window using a keyboard shortcut. This ensures the tab is reachable via the browser’s built‑in quick switch shortcut (`Cmd+1` on macOS, `Ctrl+1` on Windows/Linux).

## Goals
- **Primary**: On shortcut press, move the active tab to the first allowed position in its window.
- **Respect pinned rules**: Maintain Chrome/Edge ordering constraints between pinned and unpinned tabs.
- **Minimal permissions**: Use only what’s required (`tabs`).
- **No content access**: No content scripts, no host permissions, no network.

## Non‑Goals
- Cross‑window moves.
- Managing multiple actions or complex workflows.
- Persisting state or analytics.

## User Stories
- As a user, when I press the shortcut, the current tab becomes the first tab, so I can immediately return to it with `Cmd/Ctrl+1` later.
- As a user with pinned tabs, I expect pinned tabs to remain before unpinned tabs and the move to follow those rules.
- As a user, I can customize the shortcut in the browser’s extension shortcuts page.

## Platforms
- Google Chrome (Manifest V3)
- Microsoft Edge (Chromium, Manifest V3)

## Permissions
- `tabs`: required to read/move the active tab.

## Commands (Keyboard Shortcuts)
- Default shortcut:
  - macOS: `Command+Shift+1`
  - Windows/Linux: `Ctrl+Shift+1`
- Users can customize via `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`.

## Behavior Details
- When invoked:
  1. Determine the active tab in the focused window.
  2. Determine the target index:
     - If the tab is pinned: target index = 0 (first pinned tab position).
     - If the tab is not pinned: target index = number of pinned tabs in the window (first unpinned tab position).
     - If already at target index, no-op.
  3. Move the tab to the target index.

- Notes about Chrome/Edge rules:
  - Pinned tabs always precede unpinned tabs.
  - Moving an unpinned tab to an index < pinned count results in the browser placing it at the first unpinned position.
  - Moving a tab out of its group may ungroup it (browser behavior). This extension does not manage groups explicitly.

## Error Handling
- If no active tab/window is found: do nothing.
- If move fails (rare, e.g., tab closed): swallow and optionally log to console in the service worker.

## Privacy & Security
- No content scripts or host permissions.
- No external requests.
- No data storage.

## Manifest Design (MV3)
- Background: service worker listening to `commands.onCommand`.
- Permissions: `tabs`.
- Commands: one command with platform‑specific defaults and user customization support.

Example minimal manifest:
```json
{
  "name": "Quick Tab Reorder",
  "description": "Move the active tab to the first position with a shortcut to pair with Cmd/Ctrl+1.",
  "version": "0.1.0",
  "manifest_version": 3,
  "permissions": ["tabs"],
  "background": {
    "service_worker": "background.js"
  },
  "commands": {
    "move-active-tab-first": {
      "description": "Move active tab to first position",
      "suggested_key": {
        "default": "Ctrl+Shift+1",
        "mac": "Command+Shift+1"
      }
    }
  }
}
```

## Background Logic (Reference)
Example service worker implementation outline:
```js
// background.js (MV3 service worker)
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'move-active-tab-first') return;

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!activeTab || activeTab.id == null) return;

    const windowTabs = await chrome.tabs.query({ windowId: activeTab.windowId });
    const pinnedCount = windowTabs.filter(t => t.pinned).length;

    const targetIndex = activeTab.pinned ? 0 : pinnedCount;
    if (activeTab.index === targetIndex) return;

    await chrome.tabs.move(activeTab.id, { index: targetIndex });
  } catch (err) {
    // Optional: console.warn('Quick Tab Reorder error', err);
  }
});
```

## UX Copy
- Command name: "Move active tab to first position".
- Short description: "Pair with Cmd/Ctrl+1 to jump back instantly." (used in README/store listing if applicable)

## Testing & QA
- With no pinned tabs:
  - Active unpinned tab moves to index 0.
  - Re‑invoke on the first tab is a no‑op.
- With pinned tabs present:
  - Active pinned tab becomes the first pinned tab (index 0).
  - Active unpinned tab becomes first unpinned (index = pinned count).
- With tab groups:
  - Moving from within a group places the tab at the target area; group membership may be removed by Chrome.
- Multiple windows:
  - Only the active tab of the focused window is affected.
- Incognito (if enabled):
  - Behavior is identical and isolated to the incognito window.

## Release Checklist
- Validate manifest (MV3) and permissions.
- Verify default shortcut registers and works on macOS and Windows/Linux.
- Confirm `chrome://extensions/shortcuts` customization works.
- Test pinned/unpinned behavior.
- Smoke test on Edge.

## Future Enhancements (Optional)
- Secondary command to move to last position or to second position.
- Option to toggle pin state while moving.
- Per‑window remembered priority order or recent‑tab hotkeying.

