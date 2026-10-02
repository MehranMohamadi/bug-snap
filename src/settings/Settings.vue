<template>
  <div class="settings-page" :data-theme="settings.theme">
    <header class="header">
      <div class="brand">
        <div class="logo-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <h1 class="title">BugSnap Settings</h1>
          <p class="subtitle">Customize telemetry collectors, default report formats, and integrations</p>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-secondary btn-sm" @click="resetDefaults">Reset Defaults</button>
        <button class="btn btn-primary btn-sm" @click="handleSave">Save Changes</button>
      </div>
    </header>

    <main class="settings-content">
      <!-- 1. Telemetry Collectors Section -->
      <section class="card">
        <h2 class="card-title">Telemetry Collectors</h2>
        <p class="card-desc">Control which diagnostic data BugSnap listens to while browsing.</p>

        <div class="setting-row">
          <div>
            <div class="setting-label">Capture console errors & warnings</div>
            <div class="setting-desc">Hooks console.error, console.warn, and unhandled promise rejections.</div>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.captureConsole" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-label">Capture failed network requests</div>
            <div class="setting-desc">Tracks HTTP 4xx, 5xx, and CORS/network failures with zero body inspection.</div>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.captureNetwork" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-label">Include browser & environment details</div>
            <div class="setting-desc">Collects OS, browser name, viewport size, and screen resolution.</div>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.includeBrowserInfo" />
            <span class="slider"></span>
          </label>
        </div>
      </section>

      <!-- 2. Storage & Memory Limits -->
      <section class="card">
        <h2 class="card-title">Storage & Retention Limits</h2>
        <p class="card-desc">Keep local storage light and fast. Old entries are automatically pruned.</p>

        <div class="setting-row">
          <div>
            <div class="setting-label">Maximum console entries</div>
            <div class="setting-desc">Number of recent logs kept per browser tab (Default: 50).</div>
          </div>
          <input
            type="number"
            class="input input-num"
            v-model.number="settings.maxConsoleEntries"
            min="10"
            max="200"
          />
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-label">Maximum network entries</div>
            <div class="setting-desc">Number of recent failed network requests kept per tab (Default: 50).</div>
          </div>
          <input
            type="number"
            class="input input-num"
            v-model.number="settings.maxNetworkEntries"
            min="10"
            max="200"
          />
        </div>
      </section>

      <!-- 3. Formats & Appearance -->
      <section class="card">
        <h2 class="card-title">Format & Appearance</h2>

        <div class="setting-row">
          <div>
            <div class="setting-label">Default report format</div>
            <div class="setting-desc">Preferred output format when clicking quick copy actions.</div>
          </div>
          <select class="select select-compact" v-model="settings.defaultReportFormat">
            <option value="markdown">Markdown (.md)</option>
            <option value="plainText">Plain Text (.txt)</option>
            <option value="github">GitHub Markdown</option>
            <option value="jira">Jira Markup</option>
          </select>
        </div>

        <div class="setting-row">
          <div>
            <div class="setting-label">Editor Theme</div>
            <div class="setting-desc">Choose your preferred UI theme.</div>
          </div>
          <select class="select select-compact" v-model="settings.theme">
            <option value="dark">Dark Theme</option>
            <option value="light">Light Theme</option>
          </select>
        </div>
      </section>

      <!-- 4. Integrations -->
      <section class="card">
        <h2 class="card-title">Integrations (Optional)</h2>
        <p class="card-desc">Configure default destinations for one-click issue creation.</p>

        <div class="form-grid">
          <div class="form-group">
            <label class="setting-label" for="gh-repo">Default GitHub Repository</label>
            <input
              id="gh-repo"
              class="input font-mono"
              v-model="settings.githubRepo"
              type="text"
              placeholder="owner/repository (e.g. facebook/react)"
            />
            <span class="setting-desc">When set, "Open in GitHub" redirects directly to this repo's new issue page.</span>
          </div>

          <div class="columns-3">
            <div class="form-group">
              <label class="setting-label" for="jira-url">Jira Base URL</label>
              <input
                id="jira-url"
                class="input font-mono"
                v-model="settings.jiraBaseUrl"
                type="text"
                placeholder="https://company.atlassian.net"
              />
            </div>
            <div class="form-group">
              <label class="setting-label" for="jira-proj">Project Key</label>
              <input
                id="jira-proj"
                class="input font-mono"
                v-model="settings.jiraProjectKey"
                type="text"
                placeholder="BUG"
              />
            </div>
            <div class="form-group">
              <label class="setting-label" for="jira-type">Issue Type</label>
              <input
                id="jira-type"
                class="input"
                v-model="settings.jiraIssueType"
                type="text"
                placeholder="Bug"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Privacy Guarantee Card -->
      <div class="privacy-box">
        <div class="privacy-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <h4>Privacy & Security Guarantee</h4>
          <p>
            BugSnap performs 100% of telemetry redaction and report generation locally in your browser.
            Authorization headers, cookies, passwords, API keys, and session tokens are stripped or redacted ([REDACTED]) before anything is rendered.
            No data is transmitted to third-party cloud servers without your explicit action.
          </p>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toastMessage" class="toast-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ReportSettings } from '../types';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from '../utils/storage';

const settings = ref<ReportSettings>({ ...DEFAULT_SETTINGS });
const toastMessage = ref('');
let timer: any = null;

function showToast(msg: string) {
  toastMessage.value = msg;
  clearTimeout(timer);
  timer = setTimeout(() => {
    toastMessage.value = '';
  }, 2500);
}

async function handleSave() {
  await saveSettings(settings.value);
  document.documentElement.setAttribute('data-theme', settings.value.theme);
  showToast('Settings saved successfully!');
}

async function resetDefaults() {
  settings.value = { ...DEFAULT_SETTINGS };
  await saveSettings(settings.value);
  document.documentElement.setAttribute('data-theme', settings.value.theme);
  showToast('Reset to default settings');
}

onMounted(async () => {
  const loaded = await getSettings();
  settings.value = loaded;
  document.documentElement.setAttribute('data-theme', loaded.theme);
});
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.header {
  height: 70px;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.2;
}

.subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-content {
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--border-subtle);
}
.setting-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.setting-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.input-num {
  width: 80px;
  text-align: center;
  font-family: var(--font-mono);
}

.select-compact {
  width: 180px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.columns-3 {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 720px) {
  .columns-3 {
    grid-template-columns: 1fr;
  }
}

.privacy-box {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.privacy-icon {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.privacy-box h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.privacy-box p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.toast-pill {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #10b981;
  color: #ffffff;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
  z-index: 200;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
