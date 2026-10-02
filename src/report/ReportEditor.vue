<template>
  <div class="editor-page" :data-theme="currentTheme">
    <!-- Top Navigation / Action Bar -->
    <header class="top-nav">
      <div class="nav-left">
        <div class="nav-logo">
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
          <h1 class="nav-title">BugSnap <span class="nav-subtitle">Report Editor</span></h1>
          <p class="nav-url" :title="report.environment?.url">{{ report.environment?.url || 'Local session' }}</p>
        </div>
      </div>

      <!-- Quick Export Toolbar -->
      <div class="nav-actions">
        <button class="btn btn-secondary btn-sm" @click="copyMarkdown">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>Copy Markdown</span>
        </button>

        <button class="btn btn-secondary btn-sm" @click="copyPlainText">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 7 4 4 20 4 20 7"/>
            <line x1="9" x2="15" y1="20" y2="20"/>
            <line x1="12" x2="12" y1="4" y2="20"/>
          </svg>
          <span>Copy Plain Text</span>
        </button>

        <button class="btn btn-secondary btn-sm" @click="downloadReport">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" x2="12" y1="15" y2="3"/>
          </svg>
          <span>Download</span>
        </button>

        <button class="btn btn-secondary btn-sm" @click="openGitHubIssue">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>Open in GitHub</span>
        </button>

        <button class="btn btn-secondary btn-sm" @click="handleJiraAction">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.53 2c0 2.4-1.97 4.35-4.4 4.35H2.8a.8.8 0 0 0-.8.8v4.32c0 2.4 1.97 4.35 4.4 4.35h4.33c2.43 0 4.4-1.95 4.4-4.35V2h-3.6zm0 10.97c0 2.4-1.97 4.35-4.4 4.35H2.8a.8.8 0 0 0-.8.8V22a.8.8 0 0 0 .8.8h4.33c2.43 0 4.4-1.95 4.4-4.35v-5.48h-3.6zm5.87-5.48c0 2.4-1.97 4.35-4.4 4.35h-4.33a.8.8 0 0 0-.8.8v4.32c0 2.4 1.97 4.35 4.4 4.35h4.33c2.43 0 4.4-1.95 4.4-4.35V7.49h-3.6z"/>
          </svg>
          <span>Jira Ready</span>
        </button>

        <!-- Theme Toggle -->
        <button class="theme-btn" title="Toggle Theme" @click="toggleTheme">
          <svg v-if="currentTheme === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Container -->
    <main class="main-content">
      <!-- Top Grid: Screenshot (Left) & Bug Information (Right) -->
      <section class="top-grid">
        <!-- Left: Screenshot Preview Card -->
        <div class="panel screenshot-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <h2>Screenshot</h2>
            </div>
            <div class="panel-toggle">
              <label class="switch" title="Include in report">
                <input type="checkbox" v-model="report.enabledSections.screenshot" />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="screenshot-body">
            <div v-if="report.screenshotBase64" class="screenshot-wrapper" @click="showZoomModal = true">
              <img :src="report.screenshotBase64" alt="Captured Tab Screenshot" class="screenshot-img" />
              <div class="zoom-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <span>Click to Expand</span>
              </div>
            </div>
            <div v-else class="empty-state">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <line x1="3" y1="3" x2="21" y2="21"/>
              </svg>
              <p>No screenshot captured for this report</p>
            </div>

            <div v-if="report.screenshotBase64" class="screenshot-footer">
              <span class="text-xs text-muted">Viewport: {{ report.environment?.viewport }}</span>
              <button class="btn btn-ghost btn-sm text-danger" @click="removeScreenshot">
                Remove Screenshot
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Bug Information Card -->
        <div class="panel bug-info-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <h2>Bug Details</h2>
            </div>
            <span class="report-badge">{{ report.severity.toUpperCase() }}</span>
          </div>

          <div class="panel-body form-grid">
            <!-- Title -->
            <div class="form-group">
              <label class="form-label" for="bug-title">Title *</label>
              <input
                id="bug-title"
                v-model="report.title"
                class="input"
                type="text"
                placeholder="e.g. Login button does not respond after failed authentication"
              />
            </div>

            <!-- Severity Pills -->
            <div class="form-group">
              <label class="form-label">Severity</label>
              <div class="severity-selector">
                <button
                  v-for="s in (['low', 'medium', 'high', 'critical'] as const)"
                  :key="s"
                  type="button"
                  class="severity-pill"
                  :class="[`pill-${s}`, { active: report.severity === s }]"
                  @click="report.severity = s"
                >
                  {{ s.charAt(0).toUpperCase() + s.slice(1) }}
                </button>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label" for="bug-desc">Description</label>
              <textarea
                id="bug-desc"
                v-model="report.description"
                class="textarea"
                rows="3"
                placeholder="Brief summary of what went wrong..."
              ></textarea>
            </div>

            <!-- Steps to Reproduce -->
            <div class="form-group">
              <div class="form-label-row">
                <label class="form-label" for="bug-steps">Steps to Reproduce</label>
                <label class="switch-inline">
                  <input type="checkbox" v-model="report.enabledSections.steps" />
                  <span class="text-xs text-muted">Include</span>
                </label>
              </div>
              <textarea
                id="bug-steps"
                v-model="report.stepsToReproduce"
                class="textarea font-mono"
                rows="3"
                placeholder="1. Open page&#10;2. Click button..."
              ></textarea>
            </div>

            <!-- Expected vs Actual Behavior -->
            <div class="columns-2">
              <div class="form-group">
                <label class="form-label" for="bug-expected">Expected Behavior</label>
                <textarea
                  id="bug-expected"
                  v-model="report.expectedBehavior"
                  class="textarea"
                  rows="2"
                  placeholder="What should have happened..."
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label" for="bug-actual">Actual Behavior</label>
                <textarea
                  id="bug-actual"
                  v-model="report.actualBehavior"
                  class="textarea"
                  rows="2"
                  placeholder="What actually occurred..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom: Diagnostic Information Sections -->
      <section class="diagnostic-section">
        <!-- 1. Console Errors Accordion -->
        <div class="accordion-card">
          <div class="accordion-header" @click="toggleSection('console')">
            <div class="accordion-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 22 22 22 12 2"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h3>Console Errors & Warnings</h3>
              <span class="badge" :class="report.consoleErrors.length > 0 ? 'badge-danger' : 'badge-neutral'">
                {{ report.consoleErrors.length }}
              </span>
            </div>
            <div class="accordion-actions" @click.stop>
              <label class="switch" title="Toggle section in report">
                <input type="checkbox" v-model="report.enabledSections.consoleErrors" />
                <span class="slider"></span>
              </label>
              <button class="chevron-btn" @click="toggleSection('console')">
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  :style="{ transform: openSections.console ? 'rotate(180deg)' : 'rotate(0)' }"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-show="openSections.console" class="accordion-body">
            <div v-if="report.consoleErrors.length === 0" class="empty-list">
              <p>No console errors or unhandled exceptions recorded for this tab.</p>
            </div>
            <div v-else class="error-cards-list">
              <div v-for="(err, idx) in report.consoleErrors" :key="err.id || idx" class="error-card">
                <div class="error-card-header">
                  <div class="error-type-group">
                    <span class="badge" :class="err.type === 'warn' ? 'badge-warning' : 'badge-danger'">
                      {{ err.type.toUpperCase() }}
                    </span>
                    <span class="text-xs text-muted">{{ err.timestamp }}</span>
                  </div>
                  <div class="error-card-actions">
                    <button class="btn btn-ghost btn-sm" title="Copy Error" @click="copyText(err.message + (err.stack ? '\n' + err.stack : ''))">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                      <span>Copy</span>
                    </button>
                    <button class="btn btn-ghost btn-sm text-danger" title="Remove" @click="removeConsoleError(idx)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="error-card-message font-mono">
                  {{ err.message }}
                </div>

                <div v-if="err.sourceUrl" class="error-card-source font-mono text-xs">
                  <span>Source: {{ err.sourceUrl }}{{ err.line ? `:${err.line}` : '' }}{{ err.column ? `:${err.column}` : '' }}</span>
                </div>

                <!-- Collapsible Stack Trace -->
                <div v-if="err.stack" class="stack-wrapper">
                  <button class="stack-toggle-btn" @click="toggleStack(err.id)">
                    <span>{{ expandedStacks[err.id] ? 'Hide Stack Trace' : 'View Stack Trace' }}</span>
                  </button>
                  <pre v-if="expandedStacks[err.id]" class="stack-content font-mono">{{ err.stack }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Failed Network Requests Accordion -->
        <div class="accordion-card">
          <div class="accordion-header" @click="toggleSection('network')">
            <div class="accordion-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              <h3>Failed Network Requests</h3>
              <span class="badge" :class="report.networkFailures.length > 0 ? 'badge-warning' : 'badge-neutral'">
                {{ report.networkFailures.length }}
              </span>
            </div>
            <div class="accordion-actions" @click.stop>
              <label class="switch" title="Toggle section in report">
                <input type="checkbox" v-model="report.enabledSections.networkFailures" />
                <span class="slider"></span>
              </label>
              <button class="chevron-btn" @click="toggleSection('network')">
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  :style="{ transform: openSections.network ? 'rotate(180deg)' : 'rotate(0)' }"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-show="openSections.network" class="accordion-body">
            <div v-if="report.networkFailures.length === 0" class="empty-list">
              <p>No failed network requests (HTTP 4xx/5xx or drops) detected.</p>
            </div>
            <div v-else class="network-table-wrapper">
              <div v-for="(net, idx) in report.networkFailures" :key="net.id || idx" class="network-row-item">
                <div class="network-row" @click="toggleNetworkDetail(net.id)">
                  <div class="net-left">
                    <span class="method-tag" :class="`method-${net.method.toLowerCase()}`">{{ net.method }}</span>
                    <span class="net-status-badge" :class="net.status >= 500 ? 'status-5xx' : net.status === 0 ? 'status-0' : 'status-4xx'">
                      {{ net.status === 0 ? 'DROP / CORS' : net.status }}
                    </span>
                    <span class="net-url font-mono" :title="net.url">{{ net.url }}</span>
                  </div>
                  <div class="net-right">
                    <span v-if="net.duration !== undefined" class="net-duration font-mono">{{ net.duration }}ms</span>
                    <button class="btn btn-ghost btn-sm text-danger" @click.stop="removeNetworkFailure(idx)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Expanded Network Detail -->
                <div v-if="expandedNetworks[net.id]" class="network-expanded-card font-mono text-xs">
                  <div class="expanded-row">
                    <span class="label">Status:</span>
                    <span class="val">{{ net.status }} {{ net.statusText }}</span>
                  </div>
                  <div class="expanded-row">
                    <span class="label">Time:</span>
                    <span class="val">{{ net.timestamp }}</span>
                  </div>
                  <div class="expanded-row">
                    <span class="label">URL:</span>
                    <span class="val break-all">{{ net.url }}</span>
                  </div>
                  <div class="expanded-row privacy-note">
                    <span class="label">Privacy:</span>
                    <span class="val">Headers and bodies are redacted locally for your security.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Environment & Page Information Accordion -->
        <div class="accordion-card">
          <div class="accordion-header" @click="toggleSection('env')">
            <div class="accordion-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="14" x="2" y="3" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <h3>Environment & Page Information</h3>
            </div>
            <div class="accordion-actions" @click.stop>
              <label class="switch" title="Toggle section in report">
                <input type="checkbox" v-model="report.enabledSections.environment" />
                <span class="slider"></span>
              </label>
              <button class="chevron-btn" @click="toggleSection('env')">
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  :style="{ transform: openSections.env ? 'rotate(180deg)' : 'rotate(0)' }"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-show="openSections.env" class="accordion-body">
            <div class="env-grid">
              <div class="env-item">
                <span class="env-k">Browser</span>
                <span class="env-v">{{ report.environment?.browser }}</span>
              </div>
              <div class="env-item">
                <span class="env-k">Operating System</span>
                <span class="env-v">{{ report.environment?.os }}</span>
              </div>
              <div class="env-item">
                <span class="env-k">Viewport</span>
                <span class="env-v font-mono">{{ report.environment?.viewport }}</span>
              </div>
              <div class="env-item">
                <span class="env-k">Screen Resolution</span>
                <span class="env-v font-mono">{{ report.environment?.screen }}</span>
              </div>
              <div class="env-item">
                <span class="env-k">Device Pixel Ratio</span>
                <span class="env-v font-mono">{{ report.environment?.devicePixelRatio }}</span>
              </div>
              <div class="env-item">
                <span class="env-k">Language</span>
                <span class="env-v">{{ report.environment?.language }}</span>
              </div>
              <div class="env-item">
                <span class="env-k">Timezone</span>
                <span class="env-v font-mono">{{ report.environment?.timezone }}</span>
              </div>
              <div class="env-item">
                <span class="env-k">Capture Timestamp</span>
                <span class="env-v font-mono">{{ report.environment?.timestamp }}</span>
              </div>
              <div class="env-item span-full">
                <span class="env-k">Page URL</span>
                <span class="env-v font-mono break-all">{{ report.environment?.url }}</span>
              </div>
              <div class="env-item span-full">
                <span class="env-k">Page Title</span>
                <span class="env-v">{{ report.environment?.pageTitle }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal for Zoomed Screenshot -->
    <div v-if="showZoomModal && report.screenshotBase64" class="modal-backdrop" @click="showZoomModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-header">
          <h3>Full Screenshot Preview</h3>
          <button class="icon-btn" @click="showZoomModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <img :src="report.screenshotBase64" alt="Enlarged Tab Screenshot" class="modal-img" />
        </div>
      </div>
    </div>

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
import { ref, reactive, onMounted } from 'vue';
import type { BugReport, ReportSettings } from '../types';
import { getCurrentReport, getSettings, saveSettings } from '../utils/storage';
import { formatBugReport } from '../formatters';
import { createGitHubIssueUrl } from '../integrations/github';
import { getJiraClipboardReport, createJiraDirectUrl } from '../integrations/jira';

// Initial empty model
const report = ref<BugReport>({
  id: '',
  title: '',
  description: '',
  stepsToReproduce: '1. Open the page\n2. Perform action\n3. Observe the bug',
  expectedBehavior: '',
  actualBehavior: '',
  severity: 'medium',
  environment: {
    browser: 'Chrome',
    os: 'Windows',
    viewport: '1920 × 945',
    screen: '1920 × 1080',
    devicePixelRatio: 1,
    url: '',
    pageTitle: '',
    timestamp: '',
    language: 'en',
    timezone: 'UTC',
    userAgent: '',
  },
  consoleErrors: [],
  networkFailures: [],
  enabledSections: {
    environment: true,
    consoleErrors: true,
    networkFailures: true,
    screenshot: true,
    pageInformation: true,
    steps: true,
  },
  createdAt: '',
});

const settings = ref<ReportSettings | null>(null);
const currentTheme = ref('dark');
const showZoomModal = ref(false);
const toastMessage = ref('');
let toastTimer: any = null;

// Collapsible accordion states
const openSections = reactive({
  console: true,
  network: true,
  env: false,
});

const expandedStacks = reactive<Record<string, boolean>>({});
const expandedNetworks = reactive<Record<string, boolean>>({});

function showToast(msg: string) {
  toastMessage.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2500);
}

function toggleSection(sec: 'console' | 'network' | 'env') {
  openSections[sec] = !openSections[sec];
}

function toggleStack(id: string) {
  expandedStacks[id] = !expandedStacks[id];
}

function toggleNetworkDetail(id: string) {
  expandedNetworks[id] = !expandedNetworks[id];
}

function removeScreenshot() {
  report.value.screenshotBase64 = undefined;
  report.value.enabledSections.screenshot = false;
  showToast('Screenshot removed');
}

function removeConsoleError(index: number) {
  report.value.consoleErrors.splice(index, 1);
}

function removeNetworkFailure(index: number) {
  report.value.networkFailures.splice(index, 1);
}

// Copy helpers
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch {
    showToast('Copy failed');
  }
}

async function copyMarkdown() {
  const md = formatBugReport(report.value, 'markdown');
  await copyText(md);
}

async function copyPlainText() {
  const txt = formatBugReport(report.value, 'plainText');
  await copyText(txt);
}

function downloadReport() {
  const md = formatBugReport(report.value, 'markdown');
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeTitle = (report.value.title || 'bug-report')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  a.download = `${safeTitle || 'bug-report'}-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Report downloaded!');
}

function openGitHubIssue() {
  const repo = settings.value?.githubRepo;
  const issueUrl = createGitHubIssueUrl(report.value, repo);
  window.open(issueUrl, '_blank');
}

async function handleJiraAction() {
  const markup = getJiraClipboardReport(report.value);
  await copyText(markup);
  showToast('Copied Jira-formatted report to clipboard!');

  if (settings.value?.jiraBaseUrl) {
    const directUrl = createJiraDirectUrl(settings.value, report.value);
    if (directUrl) {
      window.open(directUrl, '_blank');
    }
  }
}

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme.value);
  saveSettings({ theme: currentTheme.value as any });
}

onMounted(async () => {
  const loadedSettings = await getSettings();
  settings.value = loadedSettings;
  currentTheme.value = loadedSettings.theme || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme.value);

  const existingReport = await getCurrentReport();
  if (existingReport) {
    report.value = existingReport;
    if (!report.value.title && report.value.environment?.pageTitle) {
      report.value.title = `Issue on ${report.value.environment.pageTitle}`;
    }
  } else {
    // Demo fallback for standalone preview
    report.value.title = 'Login button does not respond after failed authentication';
    report.value.description = 'Login button stops responding after entering an incorrect password.';
    report.value.expectedBehavior = 'Login request should be sent again with loading indicator.';
    report.value.actualBehavior = 'Button does not trigger another request and becomes inactive.';
  }
});
</script>

<style scoped>
.editor-page {
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

/* Navigation Bar */
.top-nav {
  height: 60px;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 40;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.nav-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.nav-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
}

.nav-subtitle {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text-muted);
}

.nav-url {
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-btn {
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  padding: 0.45rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-btn:hover {
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* Main Layout */
.main-content {
  flex: 1;
  max-width: 1360px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.top-grid {
  display: grid;
  grid-template-columns: 440px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 980px) {
  .top-grid {
    grid-template-columns: 1fr;
  }
}

/* Panels */
.panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.panel-header {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-title-group h2 {
  font-size: 0.95rem;
  font-weight: 600;
}

.panel-body {
  padding: 1.25rem;
}

/* Screenshot Preview */
.screenshot-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.screenshot-wrapper {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-default);
  cursor: zoom-in;
  background-color: #000;
  max-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screenshot-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.zoom-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.screenshot-wrapper:hover .zoom-overlay {
  opacity: 1;
}

.screenshot-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 1rem;
  color: var(--text-muted);
  text-align: center;
  font-size: 0.85rem;
}

/* Form Styles */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.columns-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.severity-selector {
  display: flex;
  gap: 0.5rem;
}

.severity-pill {
  flex: 1;
  padding: 0.4rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  border: 1px solid var(--border-default);
  background: var(--bg-surface-elevated);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.severity-pill.pill-low.active {
  background: rgba(14, 165, 233, 0.15);
  border-color: #0ea5e9;
  color: #38bdf8;
}

.severity-pill.pill-medium.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
  color: #fbbf24;
}

.severity-pill.pill-high.active {
  background: rgba(249, 115, 22, 0.15);
  border-color: #f97316;
  color: #fb923c;
}

.severity-pill.pill-critical.active {
  background: rgba(244, 63, 94, 0.15);
  border-color: #f43f5e;
  color: #fb7185;
}

.report-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
}

/* Accordion Section */
.diagnostic-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accordion-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 0.75rem;
  overflow: hidden;
}

.accordion-header {
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--bg-surface);
  transition: background-color 0.15s;
}

.accordion-header:hover {
  background-color: var(--bg-surface-elevated);
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.accordion-title h3 {
  font-size: 0.95rem;
  font-weight: 600;
}

.accordion-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chevron-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.accordion-body {
  border-top: 1px solid var(--border-subtle);
  padding: 1.25rem;
  background-color: var(--bg-app);
}

.empty-list {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
  padding: 1.5rem;
}

/* Error Card List */
.error-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.error-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 0.5rem;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.error-type-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-card-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.error-card-message {
  font-size: 0.85rem;
  color: var(--danger);
  word-break: break-word;
  white-space: pre-wrap;
}

.error-card-source {
  color: var(--text-muted);
}

.stack-toggle-btn {
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-top: 0.25rem;
}

.stack-content {
  background-color: var(--bg-app);
  border: 1px solid var(--border-subtle);
  border-radius: 0.375rem;
  padding: 0.65rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  overflow-x: auto;
  max-height: 240px;
  margin-top: 0.4rem;
}

/* Network Failure Rows */
.network-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.network-row-item {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 0.5rem;
  overflow: hidden;
}

.network-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
}

.network-row:hover {
  background-color: var(--bg-surface-elevated);
}

.net-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  overflow: hidden;
}

.method-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  background: var(--bg-surface-elevated);
}
.method-get { color: #10b981; }
.method-post { color: #6366f1; }
.method-delete { color: #f43f5e; }
.method-put, .method-patch { color: #f59e0b; }

.net-status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
}
.status-4xx { background: var(--warning-bg); color: var(--warning); }
.status-5xx { background: var(--danger-bg); color: var(--danger); }
.status-0 { background: var(--danger-bg); color: var(--danger); }

.net-url {
  font-size: 0.8rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 600px;
}

.net-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.net-duration {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.network-expanded-card {
  padding: 0.65rem 0.85rem;
  background-color: var(--bg-app);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.expanded-row {
  display: flex;
  gap: 0.5rem;
}
.expanded-row .label {
  color: var(--text-muted);
  width: 60px;
  flex-shrink: 0;
}
.expanded-row .val {
  color: var(--text-primary);
}
.privacy-note .val {
  color: var(--success);
}

/* Environment Key-Value Grid */
.env-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}

.env-item {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 0.5rem;
  padding: 0.65rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.env-item.span-full {
  grid-column: 1 / -1;
}

.env-k {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.env-v {
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
}

.modal-dialog {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: 1rem;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 0.375rem;
}

/* Toast */
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

.break-all {
  word-break: break-all;
}
.text-xs {
  font-size: 0.75rem;
}
.text-muted {
  color: var(--text-muted);
}
.text-danger {
  color: var(--danger) !important;
}
</style>
