import { describe, it, expect } from 'vitest';
import type { BugReport } from '../src/types';
import { formatAsMarkdown } from '../src/formatters/markdownFormatter';
import { formatAsPlainText } from '../src/formatters/plainTextFormatter';
import { formatAsGitHubMarkdown } from '../src/formatters/githubFormatter';
import { formatAsJiraMarkup } from '../src/formatters/jiraFormatter';

const sampleReport: BugReport = {
  id: 'rep_123',
  title: 'Login button does not respond after failed authentication',
  description: 'Login button stops responding after entering an incorrect password.',
  stepsToReproduce: '1. Open login page\n2. Enter invalid credentials\n3. Click Login',
  expectedBehavior: 'Login request should be sent again.',
  actualBehavior: 'Button does not trigger another request.',
  severity: 'high',
  environment: {
    browser: 'Chrome 154',
    os: 'Windows 11',
    viewport: '1920 × 945',
    screen: '1920 × 1080',
    devicePixelRatio: 1,
    url: 'https://example.com/login',
    pageTitle: 'Login Page',
    timestamp: '2026-10-02 14:30:00',
    language: 'en-US',
    timezone: 'UTC',
    userAgent: 'Mozilla/5.0 Chrome/154.0.0.0',
  },
  consoleErrors: [
    {
      id: 'ce_1',
      type: 'error',
      message: 'TypeError: Cannot read properties of undefined',
      timestamp: '2026-10-02 14:29:55',
      stack: 'TypeError: Cannot read properties of undefined\n    at login.js:142:15',
      sourceUrl: 'https://example.com/login.js',
      line: 142,
      column: 15,
    },
  ],
  networkFailures: [
    {
      id: 'net_1',
      method: 'POST',
      url: 'https://example.com/api/login',
      status: 500,
      statusText: 'Internal Server Error',
      duration: 245,
      timestamp: '2026-10-02 14:29:58',
    },
  ],
  screenshotBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  enabledSections: {
    environment: true,
    consoleErrors: true,
    networkFailures: true,
    screenshot: true,
    pageInformation: true,
    steps: true,
  },
  createdAt: '2026-10-02T14:30:00Z',
};

describe('Report Formatters', () => {
  it('formats Markdown according to requirements', () => {
    const md = formatAsMarkdown(sampleReport);
    expect(md).toContain('# Login button does not respond after failed authentication');
    expect(md).toContain('**Severity:** `HIGH`');
    expect(md).toContain('## Description');
    expect(md).toContain('## Steps to Reproduce');
    expect(md).toContain('## Expected Behavior');
    expect(md).toContain('## Actual Behavior');
    expect(md).toContain('## Environment');
    expect(md).toContain('**Browser:** Chrome 154');
    expect(md).toContain('**OS:** Windows 11');
    expect(md).toContain('## Console Errors');
    expect(md).toContain('TypeError: Cannot read properties of undefined');
    expect(md).toContain('## Failed Network Requests');
    expect(md).toContain('| `POST` | **500** (Internal Server Error) | 245ms | `https://example.com/api/login` |');
  });

  it('respects disabled sections in Markdown', () => {
    const partialReport: BugReport = {
      ...sampleReport,
      enabledSections: {
        ...sampleReport.enabledSections,
        consoleErrors: false,
        networkFailures: false,
        steps: false,
      },
    };
    const md = formatAsMarkdown(partialReport);
    expect(md).not.toContain('## Console Errors');
    expect(md).not.toContain('## Failed Network Requests');
    expect(md).not.toContain('## Steps to Reproduce');
  });

  it('formats plain text properly', () => {
    const txt = formatAsPlainText(sampleReport);
    expect(txt).toContain('BUG REPORT: Login button does not respond after failed authentication');
    expect(txt).toContain('STEPS TO REPRODUCE:');
    expect(txt).toContain('ENVIRONMENT:');
    expect(txt).toContain('FAILED NETWORK REQUESTS (1):');
  });

  it('formats GitHub issue markdown with details tags', () => {
    const gh = formatAsGitHubMarkdown(sampleReport);
    expect(gh).toContain('<details>');
    expect(gh).toContain('<summary><b>Console Errors (1)</b></summary>');
    expect(gh).toContain('<summary><b>Failed Network Requests (1)</b></summary>');
    expect(gh).toContain('### Steps to Reproduce');
  });

  it('formats Jira markup correctly', () => {
    const jira = formatAsJiraMarkup(sampleReport);
    expect(jira).toContain('*Severity:* HIGH');
    expect(jira).toContain('h2. Description');
    expect(jira).toContain('{code:javascript}');
    expect(jira).toContain('||Method||Status||Duration||URL||');
    expect(jira).toContain('|POST|500 (Internal Server Error)|245ms|https://example.com/api/login|');
  });
});
