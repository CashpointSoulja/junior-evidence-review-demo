import type { ReactNode } from "react";
import { CALL_BY_ID, COHORT_LABEL, QUOTE_BY_ID } from "../data/project";
import type { Finding, ReviewStatus, Severity } from "../engine/types";
import type { ReadinessStatus } from "../engine/readiness";

export const REVIEW_LABEL: Record<ReviewStatus, string> = {
  unreviewed: "Not reviewed",
  supported: "Supported",
  disputed: "Disputed",
  insufficient: "Insufficient",
};

export const SEVERITY_LABEL: Record<Severity, string> = { blocking: "Blocks handoff", review: "Needs review", info: "Context" };

export const FINDING_LABEL: Record<Finding["code"], string> = {
  MISSING_CITATION: "Missing citation",
  BROKEN_CITATION: "Broken citation",
  METRIC_UNSOURCED: "Figure not in source",
  METRIC_MISMATCH: "Figure differs from source",
  UNIT_OR_PERIOD_MISMATCH: "Unit or period mismatch",
  SCOPE_MISMATCH: "Scope mismatch",
  CONTRADICTION: "Real contradiction",
  SINGLE_SOURCE_CONSENSUS: "'Experts agree' from one call",
  HEDGED_SOURCE: "Hedged source",
  COHORT_DIFFERENCE: "Different cohort, not a contradiction",
};

export const READINESS_LABEL: Record<ReadinessStatus, string> = {
  blocked: "Blocked",
  ready_to_approve: "Ready to approve",
  approved: "Handoff-ready",
  changed_since_approval: "Changed since approval",
};

export function Tag({ tone = "neutral", children }: { tone?: "neutral" | "accent" | "ok" | "warn" | "bad"; children: ReactNode }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

export function ReviewTag({ status }: { status: ReviewStatus }) {
  const tone = status === "supported" ? "ok" : status === "disputed" ? "bad" : status === "insufficient" ? "warn" : "neutral";
  return <Tag tone={tone}>{REVIEW_LABEL[status]}</Tag>;
}

export function SeverityTag({ severity }: { severity: Severity }) {
  return <Tag tone={severity === "blocking" ? "bad" : severity === "review" ? "warn" : "neutral"}>{SEVERITY_LABEL[severity]}</Tag>;
}

export function ReadinessTag({ status }: { status: ReadinessStatus }) {
  const tone = status === "approved" ? "ok" : status === "ready_to_approve" ? "accent" : status === "changed_since_approval" ? "warn" : "bad";
  return <Tag tone={tone}>{READINESS_LABEL[status]}</Tag>;
}

export function SourceChip({ quoteId, onOpen, onRemove }: { quoteId: string; onOpen: (id: string) => void; onRemove?: () => void }) {
  const q = QUOTE_BY_ID.get(quoteId);
  const call = q ? CALL_BY_ID.get(q.callId) : undefined;
  return (
    <span className={`source-chip${q ? "" : " source-chip-broken"}`}>
      {q && call ? (
        <button type="button" className="source-open" onClick={() => onOpen(q.id)} aria-label={`Open source ${q.id} in transcript, ${call.id} at ${q.ts}`}>
          <span className="mono">{q.id}</span>
          <span className="source-meta">{call.id} · {q.ts} · {COHORT_LABEL[call.cohort]}</span>
        </button>
      ) : (
        <span className="source-open"><span className="mono">{quoteId}</span><span className="source-meta">not found</span></span>
      )}
      {onRemove && (
        <button type="button" className="source-remove" onClick={onRemove} aria-label={`Remove citation ${quoteId}`}>
          ×
        </button>
      )}
    </span>
  );
}

export function Initials({ name }: { name: string }) {
  return <span className="avatar" aria-hidden="true">{name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</span>;
}
