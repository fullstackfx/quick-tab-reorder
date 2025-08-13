/*
  Quick Tab Reorder — background service worker (MV3)
  Moves the active tab to the first position (respecting pinned/unpinned ordering)
*/

chrome.runtime.onInstalled.addListener(() => {
  // Optional: could add one-time initialization or logging here
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'move-active-tab-first') return;

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!activeTab || activeTab.id == null) return;

    const windowTabs = await chrome.tabs.query({ windowId: activeTab.windowId });
    const pinnedCount = windowTabs.filter((t) => t.pinned).length;

    const targetIndex = activeTab.pinned ? 0 : pinnedCount;
    if (typeof activeTab.index === 'number' && activeTab.index === targetIndex) {
      return; // no-op if already at target
    }

    await chrome.tabs.move(activeTab.id, { index: targetIndex });
  } catch (error) {
    // Silently ignore errors; optionally log for debugging using the extensions page
    // console.warn('Quick Tab Reorder error', error);
  }
});


