<template>
  <div class="popup-container" :data-theme="currentTheme">
    <!-- Header -->
    <header class="header">
      <div class="brand">
        <div class="logo-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m8 2 1.88 1.88"/>
            <path d="M14.12 3.88 16 2"/>
            <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
            <path d="M12 20v-9"/>
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5"/>
            <path d="M6 13H2"/>
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/>
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
            <path d="M22 13h-4"/>
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
          </svg>
        </div>
        <div>
          <h1 class="title">BugSnap</h1>
          <div class="status-indicator">
            <span class="pulse-dot"></span>
            <span class="status-text">Monitoring this page</span>
          </div>
        </div>
      </div>
      <button class="icon-btn" title="Open Settings" @click="openSettings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
    </header>

    <!-- Page Context Info -->
    <div class="page-badge" :title="activeTabUrl">
      <span class="page-icon">🌐</span>
      <span class="page-url">{{ truncatedUrl }}</span>
    </div>

    <!-- Telemetry Cards -->
    <div class="metrics-grid">
      <div class="metric-card" :class="{ 'has-errors': summary.consoleErrorCount > 0 }">
        <div class="metric-header">
          <span class="metric-label">Console Errors</span>
          <span class="metric-badge" :class="summary.consoleErrorCount > 0 ? 'badge-danger' : 'badge-neutral'">
            {{ summary.consoleErrorCount }}
          </span>
        </div>
        <p class="metric-hint">Exceptions & unhandled rejections</p>
      </div>

      <div class="metric-card" :class="{ 'has-network': summary.networkFailureCount > 0 }">
        <div class="metric-header">
          <span class="metric-label">Failed Requests</span>
          <span class="metric-badge" :class="summary.networkFailureCount > 0 ? 'badge-warning' : 'badge-neutral'">
            {{ summary.networkFailureCount }}
          </span>
        </div>
        <p class="metric-hint">4xx, 5xx & network drops</p>
      </div>
    </div>

    <!-- Main Capture CTA -->
    <div class="cta-section">
      <button class="capture-button" :disabled="isCapturing" @click="handleCapture">
        <span v-if="!isCapturing" class="btn-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span class="btn-text">Capture Bug</span>
        </span>
        <span v-else class="btn-loading">
          <span class="spinner"></span>
          <span>Capturing tab & logs...</span>
        </span>
      </button>
    </div>

    <!-- Secondary Actions -->
    <div class="footer-actions">
      <button class="footer-btn" @click="handleClearLogs">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        <span>Clear Logs</span>
      </button>
      <button class="footer-btn" @click="openSettings">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>Settings</span>
      </button>
    </div>

    <!-- Privacy Indicator -->
    <div class="privacy-footer">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      <span>Your debugging data stays on your device.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PageTelemetrySummary, ReportSettings } from '../types';
import { getSettings } from '../utils/storage';

const summary = ref<PageTelemetrySummary>({
  consoleErrorCount: 0,
  consoleWarnCount: 0,
  networkFailureCount: 0,
  url: '',
  title: '',
});

const activeTabId = ref<number | null>(null);
const activeTabUrl = ref<string>('');
const isCapturing = ref(false);
const currentTheme = ref('dark');

const truncatedUrl = computed(() => {
  if (!activeTabUrl.value) return 'No active tab';
  try {
    const parsed = new URL(activeTabUrl.value);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return activeTabUrl.value.slice(0, 32);
  }
});

async function loadTabData() {
  const settings = await getSettings();
  currentTheme.value = settings.theme || 'dark';

  if (typeof chrome !== 'undefined' && chrome.tabs) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      activeTabId.value = tab.id;
      activeTabUrl.value = tab.url || '';

      chrome.runtime.sendMessage(
        {
          type: 'GET_TAB_SUMMARY',
          payload: { tabId: tab.id, url: tab.url, title: tab.title },
        },
        (res: PageTelemetrySummary) => {
          if (res) {
            summary.value = res;
          }
        }
      );
    }
  }
}

async function handleCapture() {
  isCapturing.value = true;
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'CAPTURE_BUG' }, () => {
        isCapturing.value = false;
        window.close(); // Close popup once report viewer tab is created
      });
    } else {
      setTimeout(() => {
        isCapturing.value = false;
        window.open('report.html', '_blank');
      }, 500);
    }
  } catch {
    isCapturing.value = false;
  }
}

async function handleClearLogs() {
  if (activeTabId.value && typeof chrome !== 'undefined') {
    chrome.runtime.sendMessage(
      { type: 'CLEAR_TAB_LOGS', payload: { tabId: activeTabId.value } },
      () => {
        summary.value.consoleErrorCount = 0;
        summary.value.consoleWarnCount = 0;
        summary.value.networkFailureCount = 0;
      }
    );
  }
}

function openSettings() {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  } else {
    window.open('settings.html', '_blank');
  }
}

onMounted(() => {
  loadTabData();
});
</script>

<style scoped>
.popup-container {
  width: 340px;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  padding: 1.25rem;
  user-select: none;
  border: 1px solid var(--border-subtle);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.logo-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 2px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.status-text {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
}
.icon-btn:hover {
  color: var(--text-primary);
  background-color: var(--bg-surface-elevated);
}

.page-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--bg-app);
  border: 1px solid var(--border-subtle);
  padding: 0.4rem 0.6rem;
  border-radius: 0.375rem;
  margin-bottom: 0.9rem;
  overflow: hidden;
}

.page-icon {
  font-size: 0.8rem;
}

.page-url {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-mono);
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-bottom: 1.1rem;
}

.metric-card {
  background-color: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 0.5rem;
  padding: 0.65rem 0.75rem;
  transition: border-color 0.2s;
}

.metric-card.has-errors {
  border-color: var(--danger-border);
}

.metric-card.has-network {
  border-color: var(--warning-border);
}

.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.2rem;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.metric-hint {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.cta-section {
  margin-bottom: 0.9rem;
}

.capture-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.6rem;
  border: none;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
}

.capture-button:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
}

.capture-button:active:not(:disabled) {
  transform: translateY(0);
}

.capture-button:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-subtle);
  margin-bottom: 0.75rem;
}

.footer-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.15s;
}

.footer-btn:hover {
  background-color: var(--bg-surface-elevated);
  color: var(--text-primary);
}

.privacy-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  color: var(--text-muted);
}

.privacy-footer svg {
  color: #10b981;
}
</style>
