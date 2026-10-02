import type { BugReport, ReportSettings } from '../types';
import { formatAsJiraMarkup } from '../formatters/jiraFormatter';

export function getJiraClipboardReport(report: BugReport): string {
  return formatAsJiraMarkup(report);
}

export function createJiraDirectUrl(settings: ReportSettings, report: BugReport): string | null {
  if (!settings.jiraBaseUrl) return null;

  try {
    const base = settings.jiraBaseUrl.replace(/\/+$/, '');
    const project = settings.jiraProjectKey ? `&pid=${encodeURIComponent(settings.jiraProjectKey)}` : '';
    const issueType = settings.jiraIssueType ? `&issuetype=${encodeURIComponent(settings.jiraIssueType)}` : '';
    const summary = encodeURIComponent(report.title || 'Bug Report');
    const description = encodeURIComponent(formatAsJiraMarkup(report));

    return `${base}/secure/CreateIssueDetails!init.jspa?summary=${summary}&description=${description}${project}${issueType}`;
  } catch {
    return null;
  }
}
