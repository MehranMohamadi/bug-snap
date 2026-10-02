import type { BugReport, ReportFormat } from '../types';
import { formatAsMarkdown } from './markdownFormatter';
import { formatAsPlainText } from './plainTextFormatter';
import { formatAsGitHubMarkdown } from './githubFormatter';
import { formatAsJiraMarkup } from './jiraFormatter';

export { formatAsMarkdown, formatAsPlainText, formatAsGitHubMarkdown, formatAsJiraMarkup };

export function formatBugReport(report: BugReport, format: ReportFormat): string {
  switch (format) {
    case 'markdown':
      return formatAsMarkdown(report);
    case 'plainText':
      return formatAsPlainText(report);
    case 'github':
      return formatAsGitHubMarkdown(report);
    case 'jira':
      return formatAsJiraMarkup(report);
    default:
      return formatAsMarkdown(report);
  }
}
