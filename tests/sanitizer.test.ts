import { describe, it, expect } from 'vitest';
import { sanitizeUrl, sanitizeText, sanitizeHeaders } from '../src/utils/sanitizer';

describe('Sanitizer & Sensitive Data Redactor', () => {
  describe('sanitizeUrl', () => {
    it('redacts sensitive query parameters like token and password', () => {
      const raw = 'https://example.com/api/v1/auth?token=secret12345&user=john&password=mypassword';
      const sanitized = sanitizeUrl(raw);
      expect(sanitized).toContain('token=%5BREDACTED%5D');
      expect(sanitized).toContain('password=%5BREDACTED%5D');
      expect(sanitized).toContain('user=john');
      expect(sanitized).not.toContain('secret12345');
      expect(sanitized).not.toContain('mypassword');
    });

    it('redacts access_token, api_key, and session_id', () => {
      const raw = 'https://api.service.io/graphql?api_key=ak_999&access_token=xyz&session_id=s_123';
      const sanitized = sanitizeUrl(raw);
      expect(sanitized).toContain('api_key=%5BREDACTED%5D');
      expect(sanitized).toContain('access_token=%5BREDACTED%5D');
      expect(sanitized).toContain('session_id=%5BREDACTED%5D');
    });

    it('handles relative paths properly', () => {
      const raw = '/dashboard/profile?secret=12345';
      const sanitized = sanitizeUrl(raw);
      expect(sanitized).toContain('secret=%5BREDACTED%5D');
      expect(sanitized).not.toContain('12345');
    });

    it('redacts JWT in pathname', () => {
      const raw = 'https://example.com/auth/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c/verify';
      const sanitized = sanitizeUrl(raw);
      expect(sanitized).toContain('[REDACTED_JWT]');
      expect(sanitized).not.toContain('eyJhbGciOiJIUzI1Ni');
    });
  });

  describe('sanitizeText', () => {
    it('redacts Bearer tokens in error strings', () => {
      const errorText = 'Authorization failed: Bearer ya29.a0AfH6SMDh_very_secret_token_value';
      const clean = sanitizeText(errorText);
      expect(clean).toBe('Authorization failed: Bearer [REDACTED]');
      expect(clean).not.toContain('ya29');
    });

    it('redacts JWT patterns in stack traces', () => {
      const stack = 'Error at verify (auth.js:12: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4ifQ.abc123def456)';
      const clean = sanitizeText(stack);
      expect(clean).toContain('[REDACTED_JWT]');
      expect(clean).not.toContain('eyJhbGci');
    });

    it('redacts password key-value assignments', () => {
      const log = 'Payload: { "password": "superSecretPassword123" }';
      const clean = sanitizeText(log);
      expect(clean).toContain('"password": "[REDACTED]"');
      expect(clean).not.toContain('superSecretPassword123');
    });
  });

  describe('sanitizeHeaders', () => {
    it('redacts Authorization, Cookie, and Set-Cookie headers', () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer secret_token',
        Cookie: 'session_id=12345; user=admin',
        'X-API-KEY': 'key_live_9999',
      };
      const clean = sanitizeHeaders(headers);
      expect(clean['Content-Type']).toBe('application/json');
      expect(clean['Authorization']).toBe('[REDACTED]');
      expect(clean['Cookie']).toBe('[REDACTED]');
      expect(clean['X-API-KEY']).toBe('[REDACTED]');
    });
  });
});
