import type { BugReport } from '../types';

export function formatAsMarkdown(report: BugReport): string {
  const lines: string[] = [];

  // Title
  lines.push(`# ${report.title || 'Untitled Bug Report'}`);
  lines.push('');

  // Severity
  if (report.severity) {
    const sev = report.severity.toUpperCase();
    lines.push(`**Severity:** \`${sev}\``);
    lines.push('');
  }

  // Description
  if (report.description) {
    lines.push('## Description');
    lines.push(report.description);
    lines.push('');
  }

  // Steps to Reproduce
  if (report.enabledSections.steps && report.stepsToReproduce) {
    lines.push('## Steps to Reproduce');
    lines.push(report.stepsToReproduce);
    lines.push('');
  }

  // Expected Behavior
  if (report.expectedBehavior) {
    lines.push('## Expected Behavior');
    lines.push(report.expectedBehavior);
    lines.push('');
  }

  // Actual Behavior
  if (report.actualBehavior) {
    lines.push('## Actual Behavior');
    lines.push(report.actualBehavior);
    lines.push('');
  }

  // Environment
  if (report.enabledSections.environment && report.environment) {
    lines.push('## Environment');
    lines.push(`- **Browser:** ${report.environment.browser}`);
    lines.push(`- **OS:** ${report.environment.os}`);
    lines.push(`- **Viewport:** ${report.environment.viewport}`);
    lines.push(`- **Screen:** ${report.environment.screen}`);
    lines.push(`- **Device Pixel Ratio:** ${report.environment.devicePixelRatio}`);
    lines.push(`- **Language:** ${report.environment.language}`);
    lines.push(`- **Timezone:** ${report.environment.timezone}`);
    lines.push(`- **Timestamp:** ${report.environment.timestamp}`);
    lines.push('');
  }

  // Page Information
  if (report.enabledSections.pageInformation && report.environment) {
    lines.push('## Page Information');
    lines.push(`- **Page Title:** ${report.environment.pageTitle}`);
    lines.push(`- **URL:** [${report.environment.url}](${report.environment.url})`);
    lines.push('');
  }

  // Console Errors
  if (report.enabledSections.consoleErrors && report.consoleErrors && report.consoleErrors.length > 0) {
    lines.push('## Console Errors');
    for (const err of report.consoleErrors) {
      lines.push(`### [${err.type.toUpperCase()}] ${err.timestamp}`);
      lines.push('```');
      lines.push(err.message);
      if (err.stack) {
        lines.push('');
        lines.push(err.stack);
      }
      lines.push('```');
      if (err.sourceUrl) {
        lines.push(`Source: \`${err.sourceUrl}${err.line ? `:${err.line}` : ''}${err.column ? `:${err.column}` : ''}\``);
      }
      lines.push('');
    }
  }

  // Failed Network Requests
  if (report.enabledSections.networkFailures && report.networkFailures && report.networkFailures.length > 0) {
    lines.push('## Failed Network Requests');
    lines.push('| Method | Status | Duration | URL | Time |');
    lines.push('| :--- | :--- | :--- | :--- | :--- |');
    for (const net of report.networkFailures) {
      const dur = net.duration !== undefined ? `${net.duration}ms` : 'N/A';
      lines.push(`| \`${net.method}\` | **${net.status}** (${net.statusText}) | ${dur} | \`${net.url}\` | ${net.timestamp} |`);
    }
    lines.push('');
  }

  // Screenshot
  if (report.enabledSections.screenshot) {
    lines.push('## Screenshot');
    if (report.screenshotBase64) {
      lines.push('Screenshot attached with report (Base64 data or see preview).');
    } else {
      lines.push('_No screenshot captured._');
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*Report generated in seconds with [BugSnap](https://github.com/)*');

  return lines.join('\n');
}
