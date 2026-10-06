import { useMemo, useState } from "react";
import { IDENTIFIERS } from "../data/project";
import { buildExport } from "../engine/export";
import { readiness } from "../engine/readiness";
import { RESIDUAL_RISK_WARNING, residualHits, rulesFor } from "../engine/redact";
import type { Action } from "../engine/store";
import type { AppState } from "../engine/types";
import { ReadinessTag } from "./common";
import { href } from "./route";

export function ExportView({ state, dispatch, baseUrl }: { state: AppState; dispatch: (a: Action) => void; baseUrl: string }) {
  const r = readiness(state);
  const [previewed, setPreviewed] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  const [custom, setCustom] = useState(state.customRedactions.join(", "));
  const [copied, setCopied] = useState(false);
  const exportedAt = useMemo(() => new Date().toISOString(), []);
  const text = buildExport(state, baseUrl, exportedAt);
  const stale = previewed !== text;
  const rules = rulesFor(state.redactions, state.customRedactions);
  const leftover = residualHits(text, rules);
  const terms = [...new Map(IDENTIFIERS.map((i) => [i.term, i])).values()];

  const toggle = (term: string) =>
    dispatch({ type: "setRedactions", terms: state.redactions.includes(term) ? state.redactions.filter((t) => t !== term) : [...state.redactions, term] });

  const markUsed = () => {
    dispatch({ type: "logEvent", name: "brief_exported", props: { status: r.status } });
    if (state.guide) dispatch({ type: "logEvent", name: "guide_used", props: { guideCreatedAt: state.guide.createdAt, via: "export" } });
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-kestrel-brief-${r.status}.md`;
    a.click();
    URL.revokeObjectURL(url);
    markUsed();
  };
  const copy = async () => {
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    markUsed();
  };

  return (
    <section aria-labelledby="export-h">
      <h1 id="export-h" className="view-title">Handoff and export</h1>

      <div className="panel">
        <h2 className="h2">Handoff gate <ReadinessTag status={r.status} /></h2>
        {r.blockers.length > 0 ? (
          <>
            <p>Handoff-ready status is blocked until every included claim has a valid citation and every required review is resolved.</p>
            <ul className="blockers">
              {r.blockers.map((b, i) => (
                <li key={i}>{b.claimId ? <a href={href("claims", b.claimId)}>{b.message}</a> : b.message}</li>
              ))}
            </ul>
          </>
        ) : r.status === "approved" ? (
          <p>Approved at {state.approval!.at.slice(0, 19).replace("T", " ")} UTC. Any later change to an included claim clears this status.</p>
        ) : (
          <p>All checks pass. {r.status === "changed_since_approval" ? "The brief changed after approval." : ""} Approve to mark the brief handoff-ready.</p>
        )}
        <button type="button" className="btn btn-primary" disabled={r.blockers.length > 0 || r.status === "approved"} onClick={() => dispatch({ type: "approve" })}>
          {r.status === "approved" ? "Approved" : "Approve as handoff-ready"}
        </button>
        <p className="muted small">Approval means a reviewer checked claims against cited quotes. It is not investment advice or a compliance sign-off.</p>
        <div className="demo-box">
          <p className="small"><strong>Demo:</strong> break and fix the gate.</p>
          <div className="row">
            <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "removeCitation", claimId: "CL-1", quoteId: "QA-02" })} disabled={!state.claims.find((c) => c.id === "CL-1")?.citations.includes("QA-02")}>Break: remove CL-1's source</button>
            <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: "addCitation", claimId: "CL-1", quoteId: "QA-02" })} disabled={!!state.claims.find((c) => c.id === "CL-1")?.citations.includes("QA-02")}>Fix: restore QA-02</button>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 className="h2">Redact identifiers</h2>
        <fieldset>
          <legend className="small">Select what to replace in the export</legend>
          <div className="check-grid">
            {terms.map((i) => (
              <label key={i.term} className="check">
                <input type="checkbox" checked={state.redactions.includes(i.term)} onChange={() => toggle(i.term)} />
                <span>{i.term}</span> <span className="muted small">{i.kind} → {i.replacement}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor="custom-red" className="small">Other terms (comma-separated)</label>
        <input id="custom-red" value={custom} onChange={(e) => setCustom(e.target.value)} onBlur={() => dispatch({ type: "setCustomRedactions", terms: custom.split(",").map((t) => t.trim()).filter(Boolean) })} />
        <p className="warning" role="note"><strong>Residual risk.</strong> {RESIDUAL_RISK_WARNING}</p>
      </div>

      <div className="panel">
        <h2 className="h2">Preview</h2>
        <p className="small">Brief and guide as Markdown, with source links, gaps and synthetic labels. Read it before you share it.</p>
        <button type="button" className="btn btn-secondary" onClick={() => { setPreviewed(text); setAck(false); setCopied(false); }}>
          {previewed && !stale ? "Preview is current" : previewed ? "Refresh preview" : "Show preview"}
        </button>
        {previewed !== null && (
          <>
            {stale && <p className="hint">The export changed since this preview. Refresh it before exporting.</p>}
            <pre className="preview" tabIndex={0} aria-label="Export preview">{previewed}</pre>
            {leftover.length > 0 && <p className="hint">Selected terms still present: {leftover.length}.</p>}
            <label className="check">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} disabled={stale} />
              I have read the preview and the residual-risk warning.
            </label>
            <div className="row">
              <button type="button" className="btn btn-primary" disabled={!ack || stale} onClick={download}>Download .md</button>
              <button type="button" className="btn btn-secondary" disabled={!ack || stale} onClick={copy}>{copied ? "Copied" : "Copy"}</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
