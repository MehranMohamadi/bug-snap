# Agent Guide for BugSnap

## Project

BugSnap is a Chrome/Chromium Manifest V3 extension for collecting a visible-tab screenshot, console errors and warnings, failed network requests, and page environment details into an editable bug report. It is built with TypeScript, Vue 3, Vite, and Vitest. Read `README.md` for user-facing behavior and installation steps.

## Repository Map

- `public/manifest.json`: extension permissions, entry points, and web-accessible resources.
- `src/background/index.ts`: service worker, message handling, tab capture, badges, and report creation.
- `src/content/index.ts`: isolated-world bridge between page messages and the extension.
- `src/content/injected.ts`: page-world console and network hooks.
- `src/collectors/`: normalization of captured console and network events.
- `src/utils/sanitizer.ts`: sensitive-data redaction; `storage.ts`: bounded Chrome local storage; `environment.ts`: environment details.
- `src/types/index.ts`: shared report, settings, telemetry, and message types.
- `src/popup/`, `src/report/`, `src/settings/`: Vue user interfaces. Their HTML entry points are at the repository root.
- `src/formatters/` and `src/integrations/`: export formats and issue-creation links.
- `src/styles/main.css`: shared visual styles.
- `scripts/build.js`: builds the three HTML pages and the background, content, and injected scripts into `dist/`.
- `tests/`: Vitest unit tests for sanitization, collectors, environment, and formatters.

## Working Rules

- Start with the files relevant to the request. Keep changes scoped and follow existing TypeScript, Vue, and CSS patterns.
- Make source changes under `src/`, `public/`, or `scripts/` as appropriate. Treat `dist/` as generated output; do not hand-edit it.
- Keep the manifest and build outputs aligned. If an entry point, filename, permission, or web-accessible resource changes, update `public/manifest.json` and `scripts/build.js` together, then inspect `dist/` after building.
- Preserve the three execution contexts: page-world `injected.ts`, isolated-world `content/index.ts`, and extension service worker `background/index.ts`. Data crossing those boundaries must be explicitly validated and sanitized. Page messages are untrusted input.
- Preserve privacy guarantees: redact credentials, tokens, cookies, and sensitive URL parameters before storage or export. Do not add request/response body capture or external data transmission without an explicit product requirement.
- Keep telemetry and storage bounded. Preserve per-tab isolation and cleanup when a tab closes.
- Use shared types for report and settings changes. Update all consumers and formatters when changing a field or section toggle.
- Avoid adding permissions, dependencies, or browser APIs without checking their impact on the extension's behavior and privacy.
- Add focused tests for changes to sanitization, collectors, environment parsing, report formatting, or other shared logic. For UI or browser API changes, perform a manual extension smoke test.
- Do not overwrite unrelated local changes. This folder may not be a Git repository; check before relying on Git commands.

## Commands

Run these from the repository root (Node.js 18+ and npm 9+):

```powershell
npm install
npm run dev
npm run build
npm test
npx tsc --noEmit
```

`npm run dev` previews the Vite UI; it does not exercise the full extension runtime. `npm run build` is the source of the loadable extension in `dist/`. Run `npm run icons` only when icon assets need regeneration.

## Browser Verification

1. Run `npm run build` and confirm `dist/manifest.json`, `background.js`, `content.js`, `injected.js`, and the three HTML pages exist.
2. Open `chrome://extensions/` (or the equivalent Chromium extensions page), enable Developer mode, and load `dist/` with **Load unpacked**. Reload the extension there after each rebuild.
3. On a normal web page, open the popup, capture a bug, and check that the report editor opens with the screenshot and relevant telemetry. Restricted browser pages such as `chrome://` cannot be used to test content-script capture.
4. Check settings and each affected export format when those areas change. Verify sensitive values remain redacted in both the report and exported text.

## Completion

Report what changed, which checks ran, and any browser behavior that could not be verified. Do not claim the extension was tested in Chrome solely because unit tests or the build passed.
