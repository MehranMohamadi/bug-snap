/**
 * Sensitive Data Redactor & URL Sanitizer for BugSnap
 * Ensures zero credentials, tokens, cookies, or secrets leave the user's browser.
 */

const SENSITIVE_QUERY_PARAMS = new Set([
  'token',
  'access_token',
  'refresh_token',
  'id_token',
  'api_key',
  'apikey',
  'key',
  'secret',
  'client_secret',
  'password',
  'pass',
  'pwd',
  'session',
  'session_id',
  'sessionid',
  'auth',
  'authorization',
  'code',
  'sig',
  'signature',
  'private_key',
  'credentials',
  'credential',
  'bearer',
]);

const SENSITIVE_HEADER_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-access-token',
  'x-csrf-token',
  'x-xsrf-token',
  'proxy-authorization',
]);

// JWT pattern: three base64 segments separated by dots
const JWT_PATTERN = /ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g;

// Bearer token pattern
const BEARER_PATTERN = /Bearer\s+([A-Za-z0-9_\-\.~+/]+=*)/gi;

// Password in string pattern e.g. password=xyz, password: "xyz"
const PASSWORD_FIELD_PATTERN = /(["']?(?:password|passwd|secret|api_?key|access_?token)["']?\s*[:=]\s*["'])([^"'&\s]+)(["'])/gi;

/**
 * Sanitizes URLs by replacing values of sensitive query parameters and token patterns
 */
export function sanitizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  try {
    // Handle relative or full URLs safely
    const isRelative = !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://');
    const dummyBase = 'https://bugsnap.internal';
    const parsed = new URL(rawUrl, dummyBase);

    // Redact sensitive search parameters
    const params = new URLSearchParams(parsed.search);
    let changed = false;

    for (const [key] of Array.from(params.entries())) {
      const lowerKey = key.toLowerCase();
      if (
        SENSITIVE_QUERY_PARAMS.has(lowerKey) ||
        lowerKey.includes('token') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('auth') ||
        lowerKey.includes('key') ||
        lowerKey.includes('password')
      ) {
        params.set(key, '[REDACTED]');
        changed = true;
      }
    }

    if (changed) {
      parsed.search = params.toString() ? `?${params.toString()}` : '';
    }

    // Mask JWTs in path if present
    parsed.pathname = parsed.pathname.replace(JWT_PATTERN, '[REDACTED_JWT]');

    let result = isRelative ? parsed.pathname + parsed.search + parsed.hash : parsed.toString();
    result = result.replace(JWT_PATTERN, '[REDACTED_JWT]');
    return result;
  } catch {
    // Fallback if URL parsing failed: simple regex redaction
    return rawUrl
      .replace(PASSWORD_FIELD_PATTERN, '$1[REDACTED]$3')
      .replace(JWT_PATTERN, '[REDACTED_JWT]');
  }
}

/**
 * Redacts arbitrary text (error messages, stack traces, console outputs)
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(JWT_PATTERN, '[REDACTED_JWT]')
    .replace(BEARER_PATTERN, 'Bearer [REDACTED]')
    .replace(PASSWORD_FIELD_PATTERN, '$1[REDACTED]$3');
}

/**
 * Redacts HTTP headers, filtering out sensitive authorization and cookie headers
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  if (!headers || typeof headers !== 'object') return {};

  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_HEADER_KEYS.has(lowerKey)) {
      clean[key] = '[REDACTED]';
    } else {
      clean[key] = sanitizeText(value);
    }
  }
  return clean;
}
