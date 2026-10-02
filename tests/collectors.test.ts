import { describe, it, expect } from 'vitest';
import {
  normalizeWindowError,
  normalizeUnhandledRejection,
  normalizeConsoleArgs,
} from '../src/collectors/consoleCollector';
import { createNetworkFailure, isNetworkFailure } from '../src/collectors/networkCollector';

describe('Collectors & Normalizers', () => {
  describe('Console & Error Collector', () => {
    it('normalizes window.onerror event', () => {
      const entry = normalizeWindowError(
        'Uncaught ReferenceError: foo is not defined',
        'https://app.test/main.js',
        42,
        10,
        new Error('Uncaught ReferenceError: foo is not defined')
      );
      expect(entry.type).toBe('window.onerror');
      expect(entry.message).toContain('foo is not defined');
      expect(entry.sourceUrl).toBe('https://app.test/main.js');
      expect(entry.line).toBe(42);
      expect(entry.column).toBe(10);
    });

    it('normalizes unhandled promise rejection with Error', () => {
      const err = new Error('Database connection failed');
      const entry = normalizeUnhandledRejection(err);
      expect(entry.type).toBe('unhandledrejection');
      expect(entry.message).toBe('Database connection failed');
      expect(entry.stack).toBeDefined();
    });

    it('normalizes console.error arguments with objects and strings', () => {
      const entry = normalizeConsoleArgs('error', [
        'Failed to fetch user:',
        { id: 42, reason: 'unauthorized' },
      ]);
      expect(entry.type).toBe('error');
      expect(entry.message).toContain('Failed to fetch user:');
      expect(entry.message).toContain('"id":42');
    });
  });

  describe('Network Failure Collector', () => {
    it('identifies 4xx, 5xx, and status 0 as network failures', () => {
      expect(isNetworkFailure(400)).toBe(true);
      expect(isNetworkFailure(404)).toBe(true);
      expect(isNetworkFailure(500)).toBe(true);
      expect(isNetworkFailure(503)).toBe(true);
      expect(isNetworkFailure(0)).toBe(true); // drop / CORS
      expect(isNetworkFailure(200)).toBe(false);
      expect(isNetworkFailure(204)).toBe(false);
      expect(isNetworkFailure(304)).toBe(false);
    });

    it('creates network failure with sanitized URL and computed duration', () => {
      const failure = createNetworkFailure({
        method: 'post',
        url: 'https://example.com/api/v1/auth?token=mysecret',
        status: 502,
        statusText: 'Bad Gateway',
        duration: 124.6,
      });

      expect(failure.method).toBe('POST');
      expect(failure.status).toBe(502);
      expect(failure.statusText).toBe('Bad Gateway');
      expect(failure.duration).toBe(125);
      expect(failure.url).toContain('token=%5BREDACTED%5D');
      expect(failure.url).not.toContain('mysecret');
    });
  });
});
