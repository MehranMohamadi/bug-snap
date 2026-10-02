import type { BugReport } from '../types';

export function formatAsPlainText(report: BugReport): string {
  const lines: string[] = [];

  lines.push(`BUG REPORT: ${report.title || 'Untitled'}`);
  lines.push(`Severity: ${(report.severity || 'medium').toUpperCase()}`);
  lines.push('='.repeat(60));
  lines.push('');

  if (report.description) {
    lines.push('DESCRIPTION:');
    lines.push(report.description);
    lines.push('');
  }

  if (report.enabledSections.steps && report.stepsToReproduce) {
    lines.push('STEPS TO REPRODUCE:');
    lines.push(report.stepsToReproduce);
    lines.push('');
  }

  if (report.expectedBehavior) {
    lines.push('EXPECTED BEHAVIOR:');
    lines.push(report.expectedBehavior);
    lines.push('');
  }

  if (report.actualBehavior) {
    lines.push('ACTUAL BEHAVIOR:');
    lines.push(report.actualBehavior);
    lines.push('');
  }

  if (report.enabledSections.environment && report.environment) {
    lines.push('ENVIRONMENT:');
    lines.push(`Browser: ${report.environment.browser}`);
    lines.push(`OS: ${report.environment.os}`);
    lines.push(`Viewport: ${report.environment.viewport}`);
    lines.push(`Screen: ${report.environment.screen}`);
    lines.push(`DPR: ${report.environment.devicePixelRatio}`);
    lines.push(`Language: ${report.environment.language}`);
    lines.push(`Timezone: ${report.environment.timezone}`);
    lines.push(`Time: ${report.environment.timestamp}`);
    lines.push('');
  }

  if (report.enabledSections.pageInformation && report.environment) {
    lines.push('PAGE INFORMATION:');
    lines.push(`Title: ${report.environment.pageTitle}`);
    lines.push(`URL: ${report.environment.url}`);
    lines.push('');
  }

  if (report.enabledSections.consoleErrors && report.consoleErrors && report.consoleErrors.length > 0) {
    lines.push(`CONSOLE ERRORS (${report.consoleErrors.length}):`);
    for (const err of report.consoleErrors) {
      lines.push(`[${err.type.toUpperCase()}] ${err.timestamp}`);
      lines.push(`Message: ${err.message}`);
      if (err.stack) {
        lines.push(`Stack: ${err.stack}`);
      }
      lines.push('-'.repeat(40));
    }
    lines.push('');
  }

  if (report.enabledSections.networkFailures && report.networkFailures && report.networkFailures.length > 0) {
    lines.push(`FAILED NETWORK REQUESTS (${report.networkFailures.length}):`);
    for (const net of report.networkFailures) {
      lines.push(`${net.method} ${net.url} -> Status: ${net.status} (${net.statusText}) [${net.duration || 0}ms]`);
    }
    lines.push('');
  }

  lines.push('='.repeat(60));
  lines.push('Reported via BugSnap');

  return lines.join('\n');
}
