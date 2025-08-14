/*
  Quick Tab Reorder — background service worker (MV3)
  Moves the active tab to the first position (respecting pinned/unpinned ordering)
*/

chrome.runtime.onInstalled.addListener(() => {
  // Optional: could add one-time initialization or logging here
});

chrome.commands.onCommand.addListener(async (command) => {
  // Supported commands: move-active-tab-to-1 .. move-active-tab-to-4
  const match = command.match(/^move-active-tab-to-([1-4])$/);
  if (!match) return;

  const requestedHumanPosition = Number(match[1]); // 1..5

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!activeTab || activeTab.id == null) return;

    const windowTabs = await chrome.tabs.query({ windowId: activeTab.windowId });
    const pinnedCount = windowTabs.filter((t) => t.pinned).length;
    const unpinnedCount = windowTabs.length - pinnedCount;

    // Determine the target index respecting pinned/unpinned partition
    let targetIndex;
    if (activeTab.pinned) {
      // Position within pinned area
      const positionWithinPinnedArea = Math.min(requestedHumanPosition, Math.max(pinnedCount, 1)) - 1; // clamp to 0..pinnedCount-1
      targetIndex = positionWithinPinnedArea;
    } else {
      // Position within unpinned area (immediately after all pinned tabs)
      const positionWithinUnpinnedArea = Math.min(requestedHumanPosition, Math.max(unpinnedCount, 1)) - 1; // 0-based within unpinned
      targetIndex = pinnedCount + positionWithinUnpinnedArea;
    }

    if (typeof activeTab.index === 'number' && activeTab.index === targetIndex) {
      return; // no-op if already at target
    }

    await chrome.tabs.move(activeTab.id, { index: targetIndex });
  } catch (error) {
    // Silently ignore errors; optionally log for debugging using the extensions page
    // console.warn('Quick Tab Reorder error', error);
  }
});


