import { describe, it, expect } from 'vitest';
import { getBrowserInfo, getOsInfo, formatTimestamp } from '../src/utils/environment';

describe('Environment Collector', () => {
  it('detects Chrome version', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36';
    expect(getBrowserInfo(ua)).toBe('Chrome 154');
  });

  it('detects Edge version', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0';
    expect(getBrowserInfo(ua)).toBe('Edge 130');
  });

  it('detects Firefox version', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0';
    expect(getBrowserInfo(ua)).toBe('Firefox 132');
  });

  it('detects Windows OS', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
    expect(getOsInfo(ua)).toBe('Windows 11 / 10');
  });

  it('detects macOS', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)';
    expect(getOsInfo(ua)).toBe('macOS 14.5');
  });

  it('formats timestamp as YYYY-MM-DD HH:mm:ss', () => {
    const fixedDate = new Date(2026, 9, 2, 14, 30, 0); // Oct 2, 2026
    const str = formatTimestamp(fixedDate);
    expect(str).toBe('2026-10-02 14:30:00');
  });
});
