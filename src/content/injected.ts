/**
 * BugSnap Injected Telemetry Hook (Runs in MAIN World context)
 * Transparently captures unhandled errors, warnings, and failed network requests
 * WITHOUT recording sensitive bodies, passwords, or tokens.
 */

(function () {
  // Prevent double injection
  if ((window as any).__BUGSNAP_HOOKED__) return;
  (window as any).__BUGSNAP_HOOKED__ = true;

  function dispatchTelemetry(category: 'CONSOLE' | 'NETWORK', payload: any) {
    try {
      window.postMessage(
        {
          source: 'BUGSNAP_MAIN',
          category,
          payload,
        },
        '*'
      );
    } catch {
      // Ignore postMessage serialization issues safely
    }
  }

  // --- Console & Error Hooks ---
  const origError = console.error;
  const origWarn = console.warn;

  function serializeArg(arg: any): string {
    if (arg instanceof Error) {
      return `${arg.name}: ${arg.message}${arg.stack ? '\n' + arg.stack : ''}`;
    }
    if (typeof arg === 'object' && arg !== null) {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  }

  console.error = function (...args: any[]) {
    try {
      const message = args.map(serializeArg).join(' ');
      const errObj = args.find((a) => a instanceof Error);
      const stack = errObj?.stack || new Error().stack;

      dispatchTelemetry('CONSOLE', {
        type: 'error',
        message: message.slice(0, 1000),
        stack: stack ? stack.slice(0, 3000) : undefined,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
    return origError.apply(console, args);
  };

  console.warn = function (...args: any[]) {
    try {
      const message = args.map(serializeArg).join(' ');
      dispatchTelemetry('CONSOLE', {
        type: 'warn',
        message: message.slice(0, 1000),
        timestamp: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
    return origWarn.apply(console, args);
  };

  // Global window.onerror
  window.addEventListener('error', (event) => {
    try {
      dispatchTelemetry('CONSOLE', {
        type: 'window.onerror',
        message: event.message || 'Script error',
        sourceUrl: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
  });

  // Global unhandled promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      let msg = 'Unhandled Promise Rejection';
      let stack: string | undefined;

      if (reason instanceof Error) {
        msg = reason.message;
        stack = reason.stack;
      } else if (typeof reason === 'string') {
        msg = reason;
      } else if (reason && typeof reason === 'object') {
        try {
          msg = JSON.stringify(reason);
        } catch {
          msg = String(reason);
        }
      }

      dispatchTelemetry('CONSOLE', {
        type: 'unhandledrejection',
        message: msg.slice(0, 1000),
        stack: stack ? stack.slice(0, 3000) : undefined,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
  });

  // --- Network Failure Hooks ---
  // Hook window.fetch
  if (typeof window.fetch === 'function') {
    const origFetch = window.fetch;
    window.fetch = async function (...args: any[]) {
      const startTime = performance.now();
      const input = args[0];
      const init = args[1];

      let method = 'GET';
      let url = '';

      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else if (input && typeof input === 'object' && 'url' in input) {
        url = (input as Request).url;
        method = (input as Request).method || 'GET';
      }

      if (init && init.method) {
        method = init.method;
      }

      try {
        const response = await origFetch.apply(this, args);
        const duration = performance.now() - startTime;

        // Catch 4xx and 5xx responses
        if (response.status >= 400) {
          dispatchTelemetry('NETWORK', {
            method,
            url,
            status: response.status,
            statusText: response.statusText,
            duration,
            timestamp: new Date().toISOString(),
          });
        }
        return response;
      } catch (err: any) {
        const duration = performance.now() - startTime;
        // Network drop or CORS failure
        dispatchTelemetry('NETWORK', {
          method,
          url,
          status: 0,
          statusText: err?.message || 'Network Failed / Blocked',
          duration,
          timestamp: new Date().toISOString(),
          errorType: 'FETCH_ERROR',
        });
        throw err;
      }
    };
  }

  // Hook XMLHttpRequest
  if (typeof window.XMLHttpRequest === 'function') {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      this: any,
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      this.__bugsnap_meta = {
        method,
        url: typeof url === 'string' ? url : url.toString(),
        startTime: performance.now(),
      };
      return origOpen.apply(this, [method, url, ...rest] as any);
    };

    XMLHttpRequest.prototype.send = function (this: any, ...args: any[]) {
      if (this.__bugsnap_meta) {
        const meta = this.__bugsnap_meta;

        this.addEventListener('loadend', () => {
          const duration = performance.now() - meta.startTime;
          const status = this.status;

          // 0 is network failure, >= 400 is HTTP error
          if (status === 0 || status >= 400) {
            dispatchTelemetry('NETWORK', {
              method: meta.method,
              url: meta.url,
              status,
              statusText: this.statusText || (status === 0 ? 'Network Failure / Aborted' : 'HTTP Error'),
              duration,
              timestamp: new Date().toISOString(),
            });
          }
        });
      }
      return origSend.apply(this, args);
    };
  }
})();
