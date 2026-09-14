export type UnlockTier = "free" | "snabb" | "djup" | "tung";
export type ScanIntent = "teaser" | "snabb" | "djup";
export type SizeClass = "normal" | "heavy";
export type JobStatus = "queued" | "running" | "complete" | "error" | "awaiting_payment";

export type IssueSeverity = "critical" | "high" | "medium" | "low" | "info";
export type IssueCategory = "security" | "performance" | "seo" | "a11y" | "design" | "best-practice";

export type HeaderGrade = "A+" | "A" | "B" | "C" | "D" | "E" | "F";

export type ScanIssue = {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  description: string;
  recommendation: string;
  evidence?: string;
};

export type SecurityHeaderResult = {
  name: string;
  present: boolean;
  value?: string;
  ok: boolean;
  note: string;
};

export type ScanFacts = {
  title?: string;
  description?: string;
  canonical?: string;
  lang?: string;
  charset?: string;
  viewport?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  generator?: string;
  headings: { h1: number; h2: number; h3: number };
  images: { total: number; withAlt: number; withoutAlt: number };
  links: { internal: number; external: number };
  jsonLdTypes: string[];
  wordCount: number;
  hasFavicon: boolean;
};

export type RoadmapItem = {
  order: number;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  action: string;
};

export type ScanReport = {
  url: string;
  fetchedUrl: string;
  scannedAt: string;
  isDemo: boolean;
  demoReason?: string;
  facts: ScanFacts;
  security: {
    grade: HeaderGrade;
    https: boolean;
    headers: SecurityHeaderResult[];
    tlsNote: string;
    score: number;
  };
  performance: {
    score: number;
    ttfbMs: number;
    totalBytes: number;
    compressed: boolean;
    encoding?: string;
    cacheControl?: string;
    contentType?: string;
    redirectCount: number;
    metrics: { name: string; value: number; unit: string }[];
  };
  seo: { score: number };
  a11y: { score: number };
  design: { score: number };
  eeat: { score: number; notes: string[] };
  overall: number;
  issues: ScanIssue[];
  summary: string;
  deepSummary: string;
  roadmap: RoadmapItem[];
  enriched?: boolean;
  enrichLevel?: 0 | 1 | 2;
  pagespeed?: {
    performance?: number;
    seo?: number;
    accessibility?: number;
    bestPractices?: number;
    source: "pagespeed";
  };
};

export type ScanProgress = {
  step: string;
  percent: number;
};

export type ScanJob = {
  id: string;
  url: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  error?: string;
  progress: ScanProgress;
  report?: ScanReport;
  unlock?: UnlockTier;
  intent?: ScanIntent;
  sizeClass?: SizeClass;
  heavyReasons?: string[];
  previewReady?: boolean;
  deepPending?: boolean;
  paidAt?: string;
  stripeSessionId?: string;
};
