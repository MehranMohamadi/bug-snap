import type { BugReport, ConsoleEntry, NetworkFailure, ReportSettings } from '../types';

export const DEFAULT_SETTINGS: ReportSettings = {
  captureConsole: true,
  captureNetwork: true,
  includeBrowserInfo: true,
  maxConsoleEntries: 50,
  maxNetworkEntries: 50,
  defaultReportFormat: 'markdown',
  theme: 'dark',
};

// Check if chrome.storage.local is available
function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local;
}

// In-memory fallback for testing or non-extension context
const memoryStore = new Map<string, any>();

async function getStorageItem<T>(key: string, defaultValue: T): Promise<T> {
  if (isChromeStorageAvailable()) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] !== undefined ? (result[key] as T) : defaultValue;
    } catch (e) {
      console.warn('[BugSnap Storage] Error reading key:', key, e);
      return defaultValue;
    }
  }
  return memoryStore.has(key) ? (memoryStore.get(key) as T) : defaultValue;
}

async function setStorageItem<T>(key: string, value: T): Promise<void> {
  if (isChromeStorageAvailable()) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return;
    } catch (e) {
      console.warn('[BugSnap Storage] Error writing key:', key, e);
    }
  }
  memoryStore.set(key, value);
}

async function removeStorageItem(key: string): Promise<void> {
  if (isChromeStorageAvailable()) {
    try {
      await chrome.storage.local.remove(key);
      return;
    } catch (e) {
      console.warn('[BugSnap Storage] Error removing key:', key, e);
    }
  }
  memoryStore.delete(key);
}

// Settings
export async function getSettings(): Promise<ReportSettings> {
  const saved = await getStorageItem<Partial<ReportSettings>>('bugsnap_settings', {});
  return { ...DEFAULT_SETTINGS, ...saved };
}

export async function saveSettings(settings: Partial<ReportSettings>): Promise<ReportSettings> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await setStorageItem('bugsnap_settings', updated);
  return updated;
}

// Tab Console Entries (bounded to max limit)
export async function addConsoleEntry(tabId: number, entry: ConsoleEntry, maxLimit = 50): Promise<void> {
  const key = `tab_${tabId}_console`;
  const entries = await getStorageItem<ConsoleEntry[]>(key, []);
  entries.push(entry);
  // Keep only the newest items within limit
  const pruned = entries.slice(-maxLimit);
  await setStorageItem(key, pruned);
}

export async function getConsoleEntries(tabId: number): Promise<ConsoleEntry[]> {
  const key = `tab_${tabId}_console`;
  return getStorageItem<ConsoleEntry[]>(key, []);
}

// Tab Network Failures (bounded to max limit)
export async function addNetworkFailure(tabId: number, failure: NetworkFailure, maxLimit = 50): Promise<void> {
  const key = `tab_${tabId}_network`;
  const list = await getStorageItem<NetworkFailure[]>(key, []);
  list.push(failure);
  const pruned = list.slice(-maxLimit);
  await setStorageItem(key, pruned);
}

export async function getNetworkFailures(tabId: number): Promise<NetworkFailure[]> {
  const key = `tab_${tabId}_network`;
  return getStorageItem<NetworkFailure[]>(key, []);
}

// Clear all logs for a tab
export async function clearTabLogs(tabId: number): Promise<void> {
  await removeStorageItem(`tab_${tabId}_console`);
  await removeStorageItem(`tab_${tabId}_network`);
}

// Active Report Editor Session
export async function setCurrentReport(report: BugReport): Promise<void> {
  await setStorageItem('bugsnap_current_report', report);
}

export async function getCurrentReport(): Promise<BugReport | null> {
  return getStorageItem<BugReport | null>('bugsnap_current_report', null);
}
