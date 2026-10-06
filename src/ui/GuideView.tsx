import { useState } from "react";
import { COHORT_LABEL } from "../data/project";
import { leadingIssues } from "../engine/guide";
import type { Action } from "../engine/store";
import type { Guide } from "../engine/types";
import { Tag } from "./common";

export function GuideView({ guide, gapCount, dispatch, onCopy }: { guide: Guide | null; gapCount: number; dispatch: (a: Action) => void; onCopy: () => void }) {
  const [draft, setDraft] = useState("");
  return (
    <section aria-labelledby="guide-h">
      <h1 id="guide-h" className="view-title">Follow-up interview guide</h1>
      <p className="notice">
        Template-based. Each question is filled from a fixed, neutral template using the gap it closes. No model writes or rewrites
        questions here. Edit freely; edits are tracked.
      </p>
      {!guide ? (
        <div className="panel">
          <p>No guide yet. {gapCount} gaps are open.</p>
          <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "generateGuide" })}>Build guide from gaps</button>
        </div>
      ) : (
        <>
          <div className="row">
            <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: "generateGuide" })}>Add new gaps</button>
            <button type="button" className="btn btn-secondary" onClick={onCopy}>Copy guide</button>
          </div>
          <ol className="guide-list">
            {guide.items.map((it, i) => {
              const issues = leadingIssues(it.text);
              return (
                <li key={it.id} className="panel guide-item">
                  <div className="claim-head">
                    <span className="mono small">Q{i + 1}</span>
                    <Tag tone={it.origin === "template" ? "neutral" : "accent"}>{it.origin === "template" ? "From template" : it.origin === "edited" ? "Edited" : "Added manually"}</Tag>
                    {it.gapId && <span className="mono small muted">{it.gapId}</span>}
                    {it.targetCohort && <Tag>Ask a {COHORT_LABEL[it.targetCohort].toLowerCase()}</Tag>}
                  </div>
                  <label className="sr-only" htmlFor={`gq-${i}`}>Question {i + 1}</label>
                  <textarea id={`gq-${i}`} rows={2} value={it.text} onChange={(e) => dispatch({ type: "editGuideItem", id: it.id, text: e.target.value })} aria-describedby={issues.length ? `gqw-${i}` : undefined} />
                  {issues.length > 0 && <p id={`gqw-${i}`} className="hint">Possibly leading: {issues.join("; ")}.</p>}
                  <div className="row">
                    <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "moveGuideItem", id: it.id, dir: -1 })} disabled={i === 0} aria-label={`Move question ${i + 1} up`}>↑</button>
                    <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "moveGuideItem", id: it.id, dir: 1 })} disabled={i === guide.items.length - 1} aria-label={`Move question ${i + 1} down`}>↓</button>
                    <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "removeGuideItem", id: it.id })} aria-label={`Remove question ${i + 1}`}>Remove</button>
                  </div>
                </li>
              );
            })}
          </ol>
          <form className="panel" onSubmit={(e) => { e.preventDefault(); dispatch({ type: "addGuideItem", text: draft }); setDraft(""); }}>
            <label htmlFor="new-q" className="small">Add your own question</label>
            <textarea id="new-q" rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} />
            {leadingIssues(draft).length > 0 && <p className="hint">Possibly leading: {leadingIssues(draft).join("; ")}.</p>}
            <button type="submit" className="btn btn-secondary" disabled={!draft.trim()}>Add question</button>
          </form>
        </>
      )}
    </section>
  );
}
