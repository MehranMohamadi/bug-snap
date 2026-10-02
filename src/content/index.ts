/**
 * BugSnap Content Script (Isolated World)
 * Injects telemetry hooks into MAIN world and communicates with background service worker.
 */

import { sanitizeText, sanitizeUrl } from '../utils/sanitizer';

// Inject MAIN world script
function injectMainHook() {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = () => {
      script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  } catch (e) {
    console.warn('[BugSnap] Hook injection deferred/failed:', e);
  }
}

injectMainHook();

// Listen for messages from injected.js
window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || event.data.source !== 'BUGSNAP_MAIN') {
    return;
  }

  const { category, payload } = event.data;

  try {
    if (category === 'CONSOLE') {
      const sanitizedEntry = {
        ...payload,
        message: sanitizeText(payload.message),
        stack: payload.stack ? sanitizeText(payload.stack) : undefined,
      };

      chrome.runtime.sendMessage({
        type: 'LOG_CONSOLE',
        payload: sanitizedEntry,
      });
    } else if (category === 'NETWORK') {
      const sanitizedNetwork = {
        ...payload,
        url: sanitizeUrl(payload.url),
      };

      chrome.runtime.sendMessage({
        type: 'LOG_NETWORK',
        payload: sanitizedNetwork,
      });
    }
  } catch {
    // If extension context invalidated during reload, fail quietly
  }
});

// Respond to page context requests from popup or background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_PAGE_INFO') {
    sendResponse({
      url: window.location.href,
      title: document.title,
      viewport: `${window.innerWidth} × ${window.innerHeight}`,
      screen: `${screen.width} × ${screen.height}`,
      dpr: window.devicePixelRatio || 1,
      language: navigator.language || 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    });
  }
  return true;
});
