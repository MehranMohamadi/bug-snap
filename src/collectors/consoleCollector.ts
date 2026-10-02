import type { ConsoleEntry, ConsoleEntryType } from '../types';
import { sanitizeText } from '../utils/sanitizer';
import { formatTimestamp } from '../utils/environment';

export function createConsoleEntry(
  type: ConsoleEntryType,
  message: string,
  stack?: string,
  sourceUrl?: string,
  line?: number,
  column?: number
): ConsoleEntry {
  return {
    id: `ce_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    message: sanitizeText(message || 'Unknown error'),
    timestamp: formatTimestamp(),
    stack: stack ? sanitizeText(stack) : undefined,
    sourceUrl,
    line,
    column,
  };
}

/**
 * Normalizes an ErrorEvent from window.onerror
 */
export function normalizeWindowError(
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: any
): ConsoleEntry {
  let msg = 'Window Error';
  if (typeof message === 'string') {
    msg = message;
  } else if (error && error.message) {
    msg = error.message;
  }

  const stack = error && error.stack ? String(error.stack) : undefined;

  return createConsoleEntry(
    'window.onerror',
    msg,
    stack,
    source,
    lineno,
    colno
  );
}

/**
 * Normalizes an unhandledrejection event
 */
export function normalizeUnhandledRejection(reason: any): ConsoleEntry {
  let message = 'Unhandled Promise Rejection';
  let stack: string | undefined;

  if (typeof reason === 'string') {
    message = reason;
  } else if (reason instanceof Error) {
    message = reason.message;
    stack = reason.stack;
  } else if (reason && typeof reason === 'object') {
    try {
      message = JSON.stringify(reason);
    } catch {
      message = String(reason);
    }
  }

  return createConsoleEntry('unhandledrejection', message, stack);
}

/**
 * Normalizes console.error or console.warn arguments
 */
export function normalizeConsoleArgs(type: 'error' | 'warn', args: any[]): ConsoleEntry {
  const parts: string[] = [];
  let foundStack: string | undefined;

  for (const arg of args) {
    if (arg instanceof Error) {
      parts.push(`${arg.name}: ${arg.message}`);
      if (!foundStack && arg.stack) {
        foundStack = arg.stack;
      }
    } else if (typeof arg === 'object' && arg !== null) {
      try {
        parts.push(JSON.stringify(arg));
      } catch {
        parts.push(String(arg));
      }
    } else {
      parts.push(String(arg));
    }
  }

  const message = parts.join(' ') || `[Empty console.${type}]`;

  // If stack wasn't found in an Error object, create a synthetic trace if in dev
  return createConsoleEntry(type, message, foundStack);
}
