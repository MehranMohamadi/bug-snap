/**
 * BugSnap Background Service Worker (Manifest V3)
 * Orchestrates telemetry logging, badges, tab capture, and report initialization.
 */

import type { BugReport, ConsoleEntry, NetworkFailure, PageTelemetrySummary } from '../types';
import {
  addConsoleEntry,
  addNetworkFailure,
  clearTabLogs,
  getConsoleEntries,
  getNetworkFailures,
  getSettings,
  setCurrentReport,
} from '../utils/storage';
import { collectEnvironmentInfo } from '../utils/environment';
import { sanitizeUrl } from '../utils/sanitizer';

// Update extension icon badge for a tab
async function updateBadge(tabId: number) {
  try {
    const [consoleList, networkList] = await Promise.all([
      getConsoleEntries(tabId),
      getNetworkFailures(tabId),
    ]);

    const errorCount =
      consoleList.filter((c) => c.type === 'error' || c.type === 'window.onerror').length +
      networkList.length;

    if (errorCount > 0) {
      await chrome.action.setBadgeBackgroundColor({ color: '#E11D48', tabId });
      await chrome.action.setBadgeText({ text: String(errorCount), tabId });
    } else {
      await chrome.action.setBadgeText({ text: '', tabId });
    }
  } catch {
    // Tab may be closed or inactive
  }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;

  if (message.type === 'LOG_CONSOLE' && tabId !== undefined) {
    (async () => {
      const settings = await getSettings();
      if (!settings.captureConsole) return;
      await addConsoleEntry(tabId, message.payload, settings.maxConsoleEntries);
      await updateBadge(tabId);
    })();
    return true;
  }

  if (message.type === 'LOG_NETWORK' && tabId !== undefined) {
    (async () => {
      const settings = await getSettings();
      if (!settings.captureNetwork) return;
      await addNetworkFailure(tabId, message.payload, settings.maxNetworkEntries);
      await updateBadge(tabId);
    })();
    return true;
  }

  if (message.type === 'GET_TAB_SUMMARY') {
    (async () => {
      const activeTabId = message.payload?.tabId;
      if (!activeTabId) {
        sendResponse({
          consoleErrorCount: 0,
          consoleWarnCount: 0,
          networkFailureCount: 0,
          url: '',
          title: '',
        } as PageTelemetrySummary);
        return;
      }

      const [consoleLogs, networkLogs] = await Promise.all([
        getConsoleEntries(activeTabId),
        getNetworkFailures(activeTabId),
      ]);

      const consoleErrorCount = consoleLogs.filter(
        (c) => c.type === 'error' || c.type === 'window.onerror' || c.type === 'unhandledrejection'
      ).length;
      const consoleWarnCount = consoleLogs.filter((c) => c.type === 'warn').length;

      sendResponse({
        consoleErrorCount,
        consoleWarnCount,
        networkFailureCount: networkLogs.length,
        url: message.payload?.url || '',
        title: message.payload?.title || '',
      } as PageTelemetrySummary);
    })();
    return true;
  }

  if (message.type === 'CLEAR_TAB_LOGS') {
    (async () => {
      const activeTabId = message.payload?.tabId;
      if (activeTabId) {
        await clearTabLogs(activeTabId);
        await chrome.action.setBadgeText({ text: '', tabId: activeTabId });
      }
      sendResponse({ success: true });
    })();
    return true;
  }

  if (message.type === 'CAPTURE_BUG') {
    (async () => {
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!activeTab || !activeTab.id) {
          sendResponse({ success: false, error: 'No active tab found' });
          return;
        }

        const tabId = activeTab.id;
        const windowId = activeTab.windowId;

        // 1. Capture screenshot of visible tab
        let screenshotBase64 = '';
        try {
          screenshotBase64 = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
        } catch (screenshotErr) {
          console.warn('[BugSnap] Screenshot capture skipped or failed:', screenshotErr);
        }

        // 2. Query page content script for fresh environment information
        let pageData: any = {};
        try {
          pageData = await chrome.tabs.sendMessage(tabId, { type: 'GET_PAGE_INFO' });
        } catch {
          // Content script not ready or page is chrome:// url
        }

        const env = collectEnvironmentInfo(activeTab.url, activeTab.title);
        if (pageData) {
          if (pageData.viewport) env.viewport = pageData.viewport;
          if (pageData.screen) env.screen = pageData.screen;
          if (pageData.dpr) env.devicePixelRatio = pageData.dpr;
          if (pageData.language) env.language = pageData.language;
          if (pageData.timezone) env.timezone = pageData.timezone;
        }

        // 3. Fetch stored logs for this tab
        const [consoleErrors, networkFailures] = await Promise.all([
          getConsoleEntries(tabId),
          getNetworkFailures(tabId),
        ]);

        // 4. Build initial BugReport object
        const newReport: BugReport = {
          id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          title: '',
          description: '',
          stepsToReproduce: '1. Open the page\n2. Perform action\n3. Observe the issue',
          expectedBehavior: '',
          actualBehavior: '',
          severity: 'medium',
          environment: env,
          consoleErrors,
          networkFailures,
          screenshotBase64: screenshotBase64 || undefined,
          enabledSections: {
            environment: true,
            consoleErrors: true,
            networkFailures: true,
            screenshot: true,
            pageInformation: true,
            steps: true,
          },
          createdAt: new Date().toISOString(),
        };

        // 5. Store current report for the editor page
        await setCurrentReport(newReport);

        // 6. Open Report Preview page in new tab
        const reportUrl = chrome.runtime.getURL('report.html');
        await chrome.tabs.create({ url: reportUrl });

        sendResponse({ success: true });
      } catch (err: any) {
        console.error('[BugSnap] Error capturing bug:', err);
        sendResponse({ success: false, error: err.message || 'Capture failed' });
      }
    })();
    return true; // Keep message channel open for async response
  }
});

// Clean up tab logs when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabLogs(tabId).catch(() => {});
});
