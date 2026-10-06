import { COHORT_LABEL, QUESTIONS } from "../data/project";
import type { Gap } from "../engine/types";
import { SourceChip, Tag } from "./common";
import { href } from "./route";

export const GAP_LABEL: Record<Gap["type"], string> = {
  CONFLICT: "Conflict",
  NO_EVIDENCE: "No evidence",
  UNRESOLVED_REVIEW: "Reviewer flagged",
  SCOPE: "Scope",
  COHORT_LIMITED: "Missing cohort",
  SINGLE_SOURCE: "Single source",
};

export function GapsView({ gaps, hasGuide, onGenerate, openSource }: { gaps: Gap[]; hasGuide: boolean; onGenerate: () => void; openSource: (id: string) => void }) {
  return (
    <section aria-labelledby="gaps-h">
      <h1 id="gaps-h" className="view-title">Diligence gap queue</h1>
      <p className="muted">Computed from the current claims, citations and review decisions, ordered conflicts first. It updates as you review.</p>
      <div className="row">
        <button type="button" className="btn btn-primary" onClick={onGenerate} disabled={!gaps.length}>
          {hasGuide ? "Add new gaps to guide" : `Build follow-up guide from ${gaps.length} gaps`}
        </button>
        <a className="btn btn-secondary" href={href("guide")}>Open guide</a>
      </div>
      <ol className="gap-list">
        {gaps.map((g) => (
          <li key={g.id} className={`panel gap gap-${g.type}`}>
            <div className="claim-head">
              <Tag tone={g.type === "CONFLICT" || g.type === "NO_EVIDENCE" ? "bad" : "warn"}>{GAP_LABEL[g.type]}</Tag>
              <span className="mono small">{g.id}</span>
              {g.targetCohort && <Tag>Ask a {COHORT_LABEL[g.targetCohort].toLowerCase()}</Tag>}
            </div>
            <h2 className="gap-title">{g.title}</h2>
            <p className="muted small">{QUESTIONS.find((q) => q.id === g.topic)!.question}</p>
            <p>{g.detail}</p>
            <div className="chips">
              {g.claimIds.map((c) => <a key={c} className="tag tag-accent" href={href("claims", c)}>{c}</a>)}
              {g.quoteIds.map((q) => <SourceChip key={q} quoteId={q} onOpen={openSource} />)}
            </div>
          </li>
        ))}
      </ol>
      {!gaps.length && <p className="panel">No open gaps.</p>}
    </section>
  );
}
