export type Cohort = "former_employee" | "customer" | "competitor";
export type Scope = "all_customers" | "mid_market" | "small_firms" | "single_firm";
export type Unit = "%" | "weeks" | "days";

export interface Metric {
  key: MetricKey;
  value: number;
  unit: Unit;
  period: string;
  scope: Scope;
  estimate?: boolean;
}

export type MetricKey = "grr" | "renewal_uplift" | "competitive_win_rate" | "implementation_time" | "support_response";

export interface Quote {
  id: string;
  callId: string;
  ts: string;
  speaker: "Expert" | "Interviewer";
  text: string;
  scope: Scope;
  metric?: Metric;
  hedged?: boolean;
}

export interface Call {
  id: string;
  expertName: string;
  role: string;
  cohort: Cohort;
  date: string;
  durationMin: number;
  quotes: Quote[];
}

export type TopicId = "retention" | "pricing" | "competition" | "implementation" | "switching" | "roadmap" | "support";

export interface DiligenceQuestion {
  id: TopicId;
  question: string;
  subject: string;
  metricKey?: MetricKey;
  period?: string;
  requiredCohorts: Cohort[];
}

export type ReviewStatus = "unreviewed" | "supported" | "disputed" | "insufficient";

export interface Review {
  status: ReviewStatus;
  note: string;
  at?: string;
}

export interface ClaimClaimedMetric {
  key: MetricKey;
  value: number;
  unit: Unit;
  period: string;
}

export interface ClaimVersion {
  v: number;
  at: string;
  change: "created" | "text" | "citation_added" | "citation_removed" | "metric" | "scope" | "excluded" | "included" | "generality";
  detail: string;
  text: string;
  citations: string[];
  priorReview: ReviewStatus;
}

export interface Claim {
  id: string;
  topic: TopicId;
  text: string;
  scope: Scope;
  generality: "single" | "consensus";
  citations: string[];
  claimedMetric?: ClaimClaimedMetric;
  keyThesis: boolean;
  included: boolean;
  review: Review;
  history: ClaimVersion[];
}

export type FindingCode =
  | "MISSING_CITATION"
  | "BROKEN_CITATION"
  | "METRIC_UNSOURCED"
  | "METRIC_MISMATCH"
  | "UNIT_OR_PERIOD_MISMATCH"
  | "SCOPE_MISMATCH"
  | "CONTRADICTION"
  | "SINGLE_SOURCE_CONSENSUS"
  | "HEDGED_SOURCE"
  | "COHORT_DIFFERENCE";

export type Severity = "blocking" | "review" | "info";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  claimId: string;
  message: string;
  quoteIds: string[];
}

export type GapType = "CONFLICT" | "NO_EVIDENCE" | "UNRESOLVED_REVIEW" | "SCOPE" | "COHORT_LIMITED" | "SINGLE_SOURCE";

export interface Gap {
  id: string;
  type: GapType;
  topic: TopicId;
  title: string;
  detail: string;
  claimIds: string[];
  quoteIds: string[];
  targetCohort?: Cohort;
}

export interface GuideItem {
  id: string;
  gapId: string | null;
  topic: TopicId | null;
  targetCohort: Cohort | null;
  templateId: string | null;
  text: string;
  origin: "template" | "edited" | "manual";
}

export interface Guide {
  createdAt: string;
  items: GuideItem[];
}

export interface Approval {
  at: string;
  fingerprint: string;
  valid: boolean;
}

export interface AppEvent {
  name:
    | "session_started"
    | "final_call_ingested"
    | "claim_reviewed"
    | "claim_edited"
    | "guide_created"
    | "guide_used"
    | "brief_approved"
    | "brief_exported"
    | "reset";
  at: string;
  analystId: string;
  props?: Record<string, string | number | boolean>;
}

export interface AppState {
  schema: 1;
  claims: Claim[];
  guide: Guide | null;
  approval: Approval | null;
  redactions: string[];
  customRedactions: string[];
  events: AppEvent[];
}
