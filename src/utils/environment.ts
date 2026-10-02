import type { EnvironmentInfo } from '../types';
import { sanitizeUrl } from './sanitizer';

/**
 * Parses browser name and major version from user agent
 */
export function getBrowserInfo(ua: string): string {
  if (/Edg\/([0-9]+)/i.test(ua)) {
    const match = ua.match(/Edg\/([0-9]+)/i);
    return `Edge ${match ? match[1] : ''}`.trim();
  }
  if (/Chrome\/([0-9]+)/i.test(ua)) {
    const match = ua.match(/Chrome\/([0-9]+)/i);
    return `Chrome ${match ? match[1] : ''}`.trim();
  }
  if (/Firefox\/([0-9]+)/i.test(ua)) {
    const match = ua.match(/Firefox\/([0-9]+)/i);
    return `Firefox ${match ? match[1] : ''}`.trim();
  }
  if (/Safari\/([0-9]+)/i.test(ua) && !/Chrome/i.test(ua)) {
    const match = ua.match(/Version\/([0-9]+)/i);
    return `Safari ${match ? match[1] : ''}`.trim();
  }
  return 'Chromium Browser';
}

/**
 * Parses operating system from user agent
 */
export function getOsInfo(ua: string): string {
  if (/Windows NT 10.0/i.test(ua)) {
    // Windows 10 / 11 user agent string distinction
    return 'Windows 11 / 10';
  }
  if (/Windows NT 6.3/i.test(ua)) return 'Windows 8.1';
  if (/Windows NT 6.1/i.test(ua)) return 'Windows 7';
  if (/Mac OS X ([0-9_\.]+)/i.test(ua)) {
    const match = ua.match(/Mac OS X ([0-9_\.]+)/i);
    const ver = match ? match[1].replace(/_/g, '.') : '';
    return `macOS ${ver}`.trim();
  }
  if (/Android ([0-9\.]+)/i.test(ua)) {
    const match = ua.match(/Android ([0-9\.]+)/i);
    return `Android ${match ? match[1] : ''}`.trim();
  }
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown OS';
}

/**
 * Formats a Date object to YYYY-MM-DD HH:mm:ss
 */
export function formatTimestamp(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

/**
 * Collects client environment info in the page context
 */
export function collectEnvironmentInfo(pageUrl?: string, pageTitle?: string): EnvironmentInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const now = new Date();

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  const screenWidth = typeof screen !== 'undefined' ? screen.width : 0;
  const screenHeight = typeof screen !== 'undefined' ? screen.height : 0;

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const lang = typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en';

  let tz = 'UTC';
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    // ignore
  }

  const rawUrl = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const title = pageTitle || (typeof document !== 'undefined' ? document.title : '');

  return {
    browser: getBrowserInfo(ua),
    os: getOsInfo(ua),
    viewport: `${viewportWidth} × ${viewportHeight}`,
    screen: `${screenWidth} × ${screenHeight}`,
    devicePixelRatio: dpr,
    url: sanitizeUrl(rawUrl),
    pageTitle: title || 'Untitled Page',
    timestamp: formatTimestamp(now),
    language: lang,
    timezone: tz,
    userAgent: ua,
  };
}
