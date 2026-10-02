# BugSnap ⚡

> **Report a frontend bug in less than 10 seconds.**  
> A high-performance, developer-first Chrome / Chromium extension for engineers, QA, and teams to capture visible screenshots, console exceptions, failed network requests, and environment telemetry with a single click.

---

## 🚀 Features

- 📸 **Visible Tab Screenshot**: Automatically captures clean, high-resolution viewport screenshots attached to your report.
- 🪵 **Console Telemetry**: Intercepts `console.error`, `console.warn`, `window.onerror`, and `unhandledrejection` with stack traces, source URLs, line, and column numbers.
- 🌐 **Network Failure Collector**: Tracks failed HTTP requests (`4xx`, `5xx`, fetch failures, CORS blocks, and network drops) without intrusive permissions.
- 🖥️ **Environment Metadata**: Collects browser version, operating system, viewport size, screen resolution, device pixel ratio, locale, and timezone.
- 🔒 **Zero-Trust Privacy & Redaction**: Automatically redacts passwords, tokens, API keys, JWTs, and Authorization/Cookie headers before anything is saved or previewed.
- 📝 **Interactive Bug Report Editor**:
  - Customize Title, Description, Steps to Reproduce, Expected & Actual behavior, and Severity levels (`Low`, `Medium`, `High`, `Critical`).
  - Toggle each section on/off before export.
  - Interactive collapsible diagnostic cards for Console Errors and Network Failures.
- 📤 **Multiple Export Formats**:
  - **Copy Markdown**: Standardized markdown ready for Slack, Notion, or internal wikis.
  - **Copy Plain Text**: Minimalist clean text for email or direct messaging.
  - **Download Report**: Saves a formatted `.md` file to your computer.
  - **Open in GitHub**: Prefills GitHub Issue creation with one click (supports configuring default `owner/repo`).
  - **Jira Ready**: Formats Atlassian Jira markup with `{code}` blocks and prefilled issue URLs.
- 🎨 **Modern Developer Aesthetic**: Minimal, ultra-responsive UI with dark/light themes and keyboard shortcuts (`Alt+Shift+B`).

---

## 📦 Installation (Load Unpacked in Chrome)

1. **Clone & Build the Extension**:
   ```bash
   git clone <repository-url>
   cd "bug snap"
   npm install
   npm run build
   ```
2. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/` in your Chrome / Brave / Edge browser.
   - Enable **Developer mode** toggle in the top right corner.
3. **Load Unpacked**:
   - Click the **Load unpacked** button in the top left.
   - Select the `dist/` directory inside this project folder (`bug snap/dist`).
4. **Pin BugSnap**:
   - Click the puzzle icon in Chrome's toolbar and pin **BugSnap** for instant access!

---

## 💻 Development & Workflow

### Prerequisites
- Node.js `v18+` (tested on Node `v22`)
- npm `v9+`

### Available Scripts

- **`npm run dev`**: Starts local Vite development server for previewing UI components in the browser.
- **`npm run build`**: Runs the multi-target Vite bundler to produce production-ready extension artifacts in `dist/`.
- **`npm test`**: Runs the Vitest unit test suite covering redaction, collectors, environment parsing, and report formatters.
- **`npm run icons`**: Regenerates crisp extension icon sets in `public/icons/`.

---

## 🏛️ Architecture

BugSnap is built with **TypeScript**, **Vue 3**, and **Vite** following Chrome **Manifest V3** best practices:

```
bug snap/
├── public/
│   ├── icons/                  # 16, 32, 48, 128 PNG extension icons
│   └── manifest.json           # Chrome Manifest V3 declaration
├── src/
│   ├── types/                  # Shared domain types (BugReport, ConsoleEntry, NetworkFailure, etc.)
│   ├── utils/
│   │   ├── sanitizer.ts        # Sensitive data redaction (JWTs, tokens, passwords, cookies)
│   │   ├── environment.ts      # Browser, OS, viewport, screen, and locale detection
│   │   └── storage.ts          # chrome.storage.local wrapper with bounds (max 50 entries)
│   ├── collectors/
│   │   ├── consoleCollector.ts # Error/warn normalization and stack trace parser
│   │   └── networkCollector.ts # HTTP 4xx/5xx and network drop normalizer
│   ├── formatters/
│   │   ├── markdownFormatter.ts
│   │   ├── plainTextFormatter.ts
│   │   ├── githubFormatter.ts
│   │   └── jiraFormatter.ts
│   ├── integrations/
│   │   ├── github.ts           # Prefilled GitHub new issue URL generator
│   │   └── jira.ts             # Jira markup & direct issue helper
│   ├── content/
│   │   ├── injected.ts         # MAIN world script: hooks console & fetch/XHR
│   │   └── index.ts            # Isolated world script: injects hook and relays telemetry
│   ├── background/
│   │   └── index.ts            # Service worker: screenshots, badges, tab communication
│   ├── popup/                  # Extension popup UI (status, metrics, "Capture Bug")
│   ├── report/                 # Full Report Editor & Preview UI (split view, diagnostics)
│   ├── settings/               # Extension settings & collector toggles
│   └── styles/
│       └── main.css            # Dark/light theme design system
├── tests/                      # Vitest unit test suite
├── scripts/
│   ├── build.js                # Multi-target Vite build runner
│   └── generate-icons.js       # Pure Node PNG icon generator
└── dist/                       # Packaged extension loaded into Chrome
```

### Telemetry Pipeline
1. **MAIN World Injection (`injected.ts`)**: Transparently wraps `console.error`, `console.warn`, `window.addEventListener('error')`, `window.addEventListener('unhandledrejection')`, and monkey-patches `window.fetch` and `XMLHttpRequest` in the page's execution context.
2. **Sanitization & Relay (`content/index.ts`)**: Posts telemetry to the isolated world content script via secure `window.postMessage`, which instantly redacts sensitive query parameters, passwords, and tokens.
3. **Background Coordination (`background/index.ts`)**: Persists telemetry in bounded tab-specific arrays (`tab_${tabId}_console`, `tab_${tabId}_network`), updates extension badges, and triggers `chrome.tabs.captureVisibleTab` on demand.
4. **Report Editor (`report/ReportEditor.vue`)**: Opens in a dedicated tab with split layout, live preview, collapsible diagnostics, and 1-click export.

---

## 🛡️ Permissions & Security

BugSnap follows the principle of **least privilege**. It does not use intrusive permissions such as `debugger` or `webRequestBlocking`:

| Permission | Purpose |
| :--- | :--- |
| `activeTab` | Required to capture visible viewport screenshots (`chrome.tabs.captureVisibleTab`) and read tab URL/title. |
| `storage` | Stores temporary telemetry logs per tab and user configuration locally (`chrome.storage.local`). |
| `tabs` | Opens the Report Preview tab when "Capture Bug" is clicked and clears logs when a tab closes. |

---

## 🔒 Privacy Considerations

- **100% Local Processing**: All telemetry collection, redaction, and markdown formatting are performed locally in your browser.
- **No Request/Response Bodies**: To ensure zero leak of confidential customer data, BugSnap deliberately **never records HTTP request or response bodies**.
- **Automatic Redaction**:
  - `Authorization` headers, `Cookie`, `Set-Cookie`, `x-api-key`, and session headers are stripped.
  - Query parameters like `token`, `access_token`, `api_key`, `secret`, `password`, `key`, `session` are replaced with `[REDACTED]`.
  - JWT strings in URLs or stack traces are masked with `[REDACTED_JWT]`.
- **Bounded Storage**: Console logs and network entries are capped (default 50) and automatically pruned when tabs close to prevent storage bloat.

---

## ⚠️ Known Limitations (MVP)

- **Chrome Internal Pages**: Screenshots and content scripts cannot run on restricted browser pages (`chrome://`, `edge://`, Chrome Web Store) due to browser security restrictions.
- **Visible Viewport Only**: In this initial release, screenshots capture the visible tab viewport. Full-page scrolling capture is planned for the roadmap.
- **Cross-Origin Iframes**: Telemetry is captured for the main page and same-origin frames. Cross-origin sandboxed iframes without permission are excluded by browser sandbox rules.

---

## 🗺️ Future Roadmap

- [ ] **AI-Assisted Bug Descriptions**: Automatic generation of reproducible steps, bug title, and probable cause from console errors and network failures using local/cloud LLMs.
- [ ] **Full-Page Screenshot & Annotation**: Scrolling full-page capture with pen, arrow, and blur redaction tools.
- [ ] **Direct API Integrations**:
  - Direct GitHub API / OAuth integration (create issues directly without leaving the tab).
  - Jira Cloud & Jira Server REST API integration.
  - Linear & GitLab issue trackers.
- [ ] **Screen Recording**: Lightweight 10-second GIF / WebM replay recorder.
- [ ] **DOM Element Inspector**: Click any DOM element on the page to attach its selector, computed styles, and accessibility tree to the report.

---

## 📄 License

MIT © 2026 BugSnap
