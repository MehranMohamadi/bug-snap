import type { BugReport } from '../types';

export function formatAsGitHubMarkdown(report: BugReport): string {
  const lines: string[] = [];

  lines.push(`### Description`);
  lines.push(report.description || '_No description provided._');
  lines.push('');

  if (report.enabledSections.steps && report.stepsToReproduce) {
    lines.push(`### Steps to Reproduce`);
    lines.push(report.stepsToReproduce);
    lines.push('');
  }

  lines.push(`### Expected Behavior`);
  lines.push(report.expectedBehavior || '_Not specified._');
  lines.push('');

  lines.push(`### Actual Behavior`);
  lines.push(report.actualBehavior || '_Not specified._');
  lines.push('');

  if (report.enabledSections.environment && report.environment) {
    lines.push(`<details>`);
    lines.push(`<summary><b>Environment Details</b></summary>`);
    lines.push('');
    lines.push(`- **Browser:** ${report.environment.browser}`);
    lines.push(`- **OS:** ${report.environment.os}`);
    lines.push(`- **Viewport:** ${report.environment.viewport}`);
    lines.push(`- **Screen:** ${report.environment.screen}`);
    lines.push(`- **DPR:** ${report.environment.devicePixelRatio}`);
    lines.push(`- **URL:** ${report.environment.url}`);
    lines.push(`- **Time:** ${report.environment.timestamp}`);
    lines.push(`</details>`);
    lines.push('');
  }

  if (report.enabledSections.consoleErrors && report.consoleErrors && report.consoleErrors.length > 0) {
    lines.push(`<details>`);
    lines.push(`<summary><b>Console Errors (${report.consoleErrors.length})</b></summary>`);
    lines.push('');
    for (const err of report.consoleErrors) {
      lines.push(`\`\`\`log`);
      lines.push(`[${err.type.toUpperCase()}] ${err.timestamp}`);
      lines.push(err.message);
      if (err.stack) {
        lines.push('');
        lines.push(err.stack);
      }
      lines.push(`\`\`\``);
    }
    lines.push(`</details>`);
    lines.push('');
  }

  if (report.enabledSections.networkFailures && report.networkFailures && report.networkFailures.length > 0) {
    lines.push(`<details>`);
    lines.push(`<summary><b>Failed Network Requests (${report.networkFailures.length})</b></summary>`);
    lines.push('');
    lines.push('| Method | Status | Duration | URL |');
    lines.push('| :--- | :--- | :--- | :--- |');
    for (const net of report.networkFailures) {
      lines.push(`| ${net.method} | ${net.status} (${net.statusText}) | ${net.duration || 0}ms | ${net.url} |`);
    }
    lines.push(`</details>`);
    lines.push('');
  }

  lines.push('---');
  lines.push('<sub>Reported with [BugSnap](https://github.com/)</sub>');

  return lines.join('\n');
}
