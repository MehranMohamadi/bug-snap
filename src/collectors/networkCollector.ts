import type { NetworkFailure } from '../types';
import { sanitizeUrl } from '../utils/sanitizer';
import { formatTimestamp } from '../utils/environment';

export function createNetworkFailure(params: {
  method: string;
  url: string;
  status: number;
  statusText?: string;
  duration?: number;
  errorType?: string;
}): NetworkFailure {
  const cleanUrl = sanitizeUrl(params.url);
  const statusText = params.statusText || (params.status === 0 ? 'Network Error / Blocked' : 'HTTP Error');

  return {
    id: `net_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    method: (params.method || 'GET').toUpperCase(),
    url: cleanUrl,
    status: params.status,
    statusText,
    duration: params.duration ? Math.round(params.duration) : undefined,
    timestamp: formatTimestamp(),
    errorType: params.errorType,
  };
}

/**
 * Checks if an HTTP status or network result constitutes a failure
 */
export function isNetworkFailure(status: number): boolean {
  // 0 indicates network drop, CORS block, or DNS error
  // 400-599 indicates client or server HTTP errors
  return status === 0 || (status >= 400 && status <= 599);
}
