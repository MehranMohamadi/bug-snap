import type { BugReport } from '../types';
import { formatAsGitHubMarkdown } from '../formatters/githubFormatter';

export function createGitHubIssueUrl(report: BugReport, repo?: string): string {
  const targetRepo = repo?.trim() || '';
  const title = encodeURIComponent(report.title || 'Bug Report');
  const body = encodeURIComponent(formatAsGitHubMarkdown(report));

  if (targetRepo && targetRepo.includes('/')) {
    return `https://github.com/${targetRepo}/issues/new?title=${title}&body=${body}`;
  }

  // Fallback to github new issue or general search
  return `https://github.com/new?title=${title}&body=${body}`;
}
