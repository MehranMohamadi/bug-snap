import type { BugReport } from '../types';

export function formatAsJiraMarkup(report: BugReport): string {
  const lines: string[] = [];

  // Severity
  lines.push(`*Severity:* ${report.severity.toUpperCase()}`);
  lines.push('');

  // Description
  lines.push('h2. Description');
  lines.push(report.description || '_No description provided._');
  lines.push('');

  // Steps
  if (report.enabledSections.steps && report.stepsToReproduce) {
    lines.push('h2. Steps to Reproduce');
    lines.push(report.stepsToReproduce);
    lines.push('');
  }

  // Expected Behavior
  lines.push('h2. Expected Behavior');
  lines.push(report.expectedBehavior || '_Not specified._');
  lines.push('');

  // Actual Behavior
  lines.push('h2. Actual Behavior');
  lines.push(report.actualBehavior || '_Not specified._');
  lines.push('');

  // Environment
  if (report.enabledSections.environment && report.environment) {
    lines.push('h2. Environment');
    lines.push(`* *Browser:* ${report.environment.browser}`);
    lines.push(`* *OS:* ${report.environment.os}`);
    lines.push(`* *Viewport:* ${report.environment.viewport}`);
    lines.push(`* *Screen:* ${report.environment.screen}`);
    lines.push(`* *Device Pixel Ratio:* ${report.environment.devicePixelRatio}`);
    lines.push(`* *Timestamp:* ${report.environment.timestamp}`);
    lines.push(`* *URL:* ${report.environment.url}`);
    lines.push('');
  }

  // Console Errors
  if (report.enabledSections.consoleErrors && report.consoleErrors && report.consoleErrors.length > 0) {
    lines.push(`h2. Console Errors (${report.consoleErrors.length})`);
    for (const err of report.consoleErrors) {
      lines.push(`*${err.type.toUpperCase()}* - ${err.timestamp}`);
      lines.push('{code:javascript}');
      lines.push(err.message);
      if (err.stack) {
        lines.push('');
        lines.push(err.stack);
      }
      lines.push('{code}');
    }
    lines.push('');
  }

  // Failed Network Requests
  if (report.enabledSections.networkFailures && report.networkFailures && report.networkFailures.length > 0) {
    lines.push(`h2. Failed Network Requests (${report.networkFailures.length})`);
    lines.push('||Method||Status||Duration||URL||');
    for (const net of report.networkFailures) {
      lines.push(`|${net.method}|${net.status} (${net.statusText})|${net.duration || 0}ms|${net.url}|`);
    }
    lines.push('');
  }

  lines.push('----');
  lines.push('_Generated with BugSnap_');

  return lines.join('\n');
}
