export type ConsoleEntryType = 'error' | 'warn' | 'window.onerror' | 'unhandledrejection';

export interface ConsoleEntry {
  id: string;
  type: ConsoleEntryType;
  message: string;
  timestamp: string;
  stack?: string;
  sourceUrl?: string;
  line?: number;
  column?: number;
}

export interface NetworkFailure {
  id: string;
  method: string;
  url: string;
  status: number;
  statusText: string;
  duration?: number;
  timestamp: string;
  errorType?: string;
}

export interface EnvironmentInfo {
  browser: string;
  os: string;
  viewport: string;
  screen: string;
  devicePixelRatio: number;
  url: string;
  pageTitle: string;
  timestamp: string;
  language: string;
  timezone: string;
  userAgent: string;
}

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ReportSectionsToggle {
  environment: boolean;
  consoleErrors: boolean;
  networkFailures: boolean;
  screenshot: boolean;
  pageInformation: boolean;
  steps: boolean;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  severity: BugSeverity;
  environment: EnvironmentInfo;
  consoleErrors: ConsoleEntry[];
  networkFailures: NetworkFailure[];
  screenshotBase64?: string;
  enabledSections: ReportSectionsToggle;
  createdAt: string;
}

export type ReportFormat = 'markdown' | 'plainText' | 'github' | 'jira';

export interface ReportSettings {
  captureConsole: boolean;
  captureNetwork: boolean;
  includeBrowserInfo: boolean;
  maxConsoleEntries: number;
  maxNetworkEntries: number;
  defaultReportFormat: ReportFormat;
  githubRepo?: string; // owner/repo
  jiraBaseUrl?: string;
  jiraProjectKey?: string;
  jiraIssueType?: string;
  theme: 'dark' | 'light' | 'system';
}

export interface PageTelemetrySummary {
  consoleErrorCount: number;
  consoleWarnCount: number;
  networkFailureCount: number;
  url: string;
  title: string;
}

export interface ExtensionMessage<T = any> {
  type: string;
  payload?: T;
}
