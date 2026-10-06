import { useState } from "react";
import { ALL_QUOTES, CALL_BY_ID, COHORT_LABEL, METRIC_LABEL, QUESTIONS, SCOPE_LABEL } from "../data/project";
import { checkClaim, differs, needsReview, unitSuffix } from "../engine/checks";
import { reviewNoteRequired, type Action } from "../engine/store";
import type { Claim, ReviewStatus, Scope } from "../engine/types";
import { FINDING_LABEL, ReviewTag, SeverityTag, SourceChip, Tag } from "./common";
import { href } from "./route";

type Dispatch = (a: Action) => void;

export function ClaimsView({ claims, selectedId, dispatch, openSource }: { claims: Claim[]; selectedId: string | null; dispatch: Dispatch; openSource: (id: string) => void }) {
  const selected = claims.find((c) => c.id === selectedId) ?? null;
  return (
    <section aria-labelledby="claims-h" className={`claims${selected ? " claims-has-detail" : ""}`}>
      <div className="claims-list">
        <h1 id="claims-h" className="view-title">Draft brief claims</h1>
        <p className="muted small">Each claim is compared with the quotes it cites and with every other quote on the same figure.</p>
        <ul className="claim-list">
          {claims.map((c) => {
            const f = checkClaim(c);
            const blocking = f.filter((x) => x.severity === "blocking").length;
            const review = f.filter((x) => x.severity === "review").length;
            return (
              <li key={c.id}>
                <a href={href("claims", c.id)} className={`claim-row${c.id === selectedId ? " claim-row-active" : ""}${c.included ? "" : " claim-row-excluded"}`} aria-current={c.id === selectedId ? "true" : undefined}>
                  <span className="claim-row-top">
                    <span className="mono">{c.id}</span>
                    <ReviewTag status={c.review.status} />
                    {blocking > 0 && <Tag tone="bad">{blocking} blocking</Tag>}
                    {review > 0 && <Tag tone="warn">{review} to check</Tag>}
                    {!c.included && <Tag>Excluded</Tag>}
                  </span>
                  <span className="claim-row-text">{c.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      {selected ? <ClaimDetail key={selected.id} claim={selected} dispatch={dispatch} openSource={openSource} /> : (
        <div className="claim-detail claim-empty panel"><p className="muted">Select a claim to compare it with its sources.</p></div>
      )}
    </section>
  );
}

function ClaimDetail({ claim, dispatch, openSource }: { claim: Claim; dispatch: Dispatch; openSource: (id: string) => void }) {
  const findings = checkClaim(claim);
  const topic = QUESTIONS.find((q) => q.id === claim.topic)!;
  const [addId, setAddId] = useState("");
  const available = ALL_QUOTES.filter((q) => q.speaker === "Expert" && !claim.citations.includes(q.id));
  return (
    <article className="claim-detail panel" aria-labelledby="claim-h">
      <a className="back-link" href={href("claims")}>← All claims</a>
      <div className="claim-head">
        <span className="mono">{claim.id}</span>
        <ReviewTag status={claim.review.status} />
        {claim.keyThesis && <Tag tone="accent">Key thesis</Tag>}
        {needsReview(claim, findings) && <Tag>Review required</Tag>}
      </div>
      <h2 id="claim-h" className="claim-text">{claim.text}</h2>
      <p className="muted small">
        {topic.question} · Scope: {SCOPE_LABEL[claim.scope]}
        {claim.claimedMetric && <> · Figure: {claim.claimedMetric.value}{unitSuffix(claim.claimedMetric.unit)} ({claim.claimedMetric.period})</>}
        {claim.generality === "consensus" && <> · Says experts agree</>}
      </p>

      <h3>Cited sources</h3>
      <div className="chips">
        {claim.citations.length === 0 && <span className="muted">None cited.</span>}
        {claim.citations.map((id) => (
          <SourceChip key={id} quoteId={id} onOpen={openSource} onRemove={() => dispatch({ type: "removeCitation", claimId: claim.id, quoteId: id })} />
        ))}
      </div>
      <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (addId) { dispatch({ type: "addCitation", claimId: claim.id, quoteId: addId }); setAddId(""); } }}>
        <label htmlFor="add-cite" className="small">Add citation</label>
        <select id="add-cite" value={addId} onChange={(e) => setAddId(e.target.value)}>
          <option value="">Choose a quote…</option>
          {available.map((q) => (
            <option key={q.id} value={q.id}>{q.id} · {q.ts} · {q.text.slice(0, 60)}…</option>
          ))}
        </select>
        <button type="submit" className="btn btn-secondary" disabled={!addId}>Cite</button>
      </form>

      <h3>Checks</h3>
      {findings.length === 0 ? <p className="muted">No checks fired.</p> : (
        <ul className="findings">
          {findings.map((f, i) => (
            <li key={i} className={`finding finding-${f.severity}`}>
              <div><SeverityTag severity={f.severity} /> <strong>{FINDING_LABEL[f.code]}</strong></div>
              <p>{f.message}</p>
              {f.quoteIds.length > 0 && <div className="chips">{f.quoteIds.map((q) => <SourceChip key={q} quoteId={q} onOpen={openSource} />)}</div>}
            </li>
          ))}
        </ul>
      )}

      {claim.claimedMetric && <Comparison claim={claim} openSource={openSource} />}
      <ReviewForm key={`r${claim.history.length}${claim.review.status}`} claim={claim} dispatch={dispatch} />
      <EditForm key={`e${claim.history.length}`} claim={claim} dispatch={dispatch} />

      <div className="row">
        <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: "toggleInclude", claimId: claim.id })}>
          {claim.included ? "Exclude from brief" : "Return to brief"}
        </button>
      </div>

      <h3>Edit history</h3>
      <ol className="history">
        {claim.history.map((h) => (
          <li key={h.v}>
            <span className="mono">v{h.v}</span> <span className="muted small">{new Date(h.at).toISOString().slice(0, 16).replace("T", " ")} UTC</span> {h.detail}
            <div className="muted small">“{h.text}” · cites {h.citations.join(", ") || "nothing"}</div>
          </li>
        ))}
      </ol>
    </article>
  );
}

function Comparison({ claim, openSource }: { claim: Claim; openSource: (id: string) => void }) {
  const m = claim.claimedMetric!;
  const rows = ALL_QUOTES.filter((q) => q.metric?.key === m.key);
  return (
    <>
      <h3>Compare: {METRIC_LABEL[m.key]}</h3>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Comparison of claim figure with all quotes">
        <table>
          <thead>
            <tr><th scope="col">Source</th><th scope="col">Cohort</th><th scope="col">Scope</th><th scope="col">Period</th><th scope="col">Value</th><th scope="col">Reading</th></tr>
          </thead>
          <tbody>
            <tr className="row-claim"><td>{claim.id} (claim)</td><td>–</td><td>{SCOPE_LABEL[claim.scope]}</td><td>{m.period}</td><td>{m.value}{unitSuffix(m.unit)}</td><td>–</td></tr>
            {rows.map((q) => {
              const qm = q.metric!;
              const cited = claim.citations.includes(q.id);
              const same = qm.scope === claim.scope && qm.period === m.period;
              const diff = differs(qm.value, m.value, m.unit);
              const reading = !diff ? (same ? "Matches" : "Matches, different scope") : cited ? "Cited but differs" : same ? "Real contradiction" : `Different ${qm.scope === claim.scope ? "period" : "cohort"}, not a contradiction`;
              return (
                <tr key={q.id}>
                  <td><button type="button" className="link-btn mono" onClick={() => openSource(q.id)}>{q.id}</button>{cited && <span className="muted small"> cited</span>}</td>
                  <td>{COHORT_LABEL[CALL_BY_ID.get(q.callId)!.cohort]}</td>
                  <td>{SCOPE_LABEL[qm.scope]}</td>
                  <td>{qm.period}</td>
                  <td>{qm.value}{unitSuffix(qm.unit)}{qm.estimate ? " (est.)" : ""}</td>
                  <td>{reading}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

const STATUSES: ReviewStatus[] = ["supported", "disputed", "insufficient"];

function ReviewForm({ claim, dispatch }: { claim: Claim; dispatch: Dispatch }) {
  const [status, setStatus] = useState<ReviewStatus>(claim.review.status === "unreviewed" ? "supported" : claim.review.status);
  const [note, setNote] = useState(claim.review.note);
  const noteNeeded = reviewNoteRequired(claim, status);
  const missing = noteNeeded && !note.trim();
  return (
    <form className="review-form" onSubmit={(e) => { e.preventDefault(); if (!missing) dispatch({ type: "review", claimId: claim.id, status, note }); }}>
      <fieldset>
        <legend><h3>Manual review</h3></legend>
        <div className="radio-row">
          {STATUSES.map((s) => (
            <label key={s} className={`radio radio-${s}`}>
              <input type="radio" name={`review-${claim.id}`} value={s} checked={status === s} onChange={() => setStatus(s)} />
              {s === "supported" ? "Supported" : s === "disputed" ? "Disputed" : "Insufficient"}
            </label>
          ))}
        </div>
        <label htmlFor={`note-${claim.id}`} className="small">Reviewer note{noteNeeded ? " (required)" : " (optional)"}</label>
        <textarea id={`note-${claim.id}`} value={note} onChange={(e) => setNote(e.target.value)} rows={2} aria-describedby={missing ? `note-hint-${claim.id}` : undefined} />
        {missing && <p id={`note-hint-${claim.id}`} className="hint">{status === "supported" ? "Accepting over open checks needs a reason." : "Say what is wrong or missing."}</p>}
        <button type="submit" className="btn btn-primary" disabled={missing}>Save decision</button>
      </fieldset>
    </form>
  );
}

function EditForm({ claim, dispatch }: { claim: Claim; dispatch: Dispatch }) {
  const [text, setText] = useState(claim.text);
  const [scope, setScope] = useState<Scope>(claim.scope);
  const [value, setValue] = useState(claim.claimedMetric ? String(claim.claimedMetric.value) : "");
  const [generality, setGenerality] = useState(claim.generality);
  const [reason, setReason] = useState("");
  return (
    <details className="edit-box">
      <summary>Edit claim</summary>
      <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: "edit", claimId: claim.id, text, scope, generality, metricValue: claim.claimedMetric ? Number(value) : undefined, reason }); setReason(""); }}>
        <label htmlFor={`text-${claim.id}`} className="small">Claim text</label>
        <textarea id={`text-${claim.id}`} value={text} onChange={(e) => setText(e.target.value)} rows={3} />
        <div className="form-grid">
          <div>
            <label htmlFor={`scope-${claim.id}`} className="small">Scope</label>
            <select id={`scope-${claim.id}`} value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
              {Object.entries(SCOPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          {claim.claimedMetric && (
            <div>
              <label htmlFor={`val-${claim.id}`} className="small">Figure ({claim.claimedMetric.unit})</label>
              <input id={`val-${claim.id}`} type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          )}
          <div>
            <label htmlFor={`gen-${claim.id}`} className="small">Claim type</label>
            <select id={`gen-${claim.id}`} value={generality} onChange={(e) => setGenerality(e.target.value as Claim["generality"])}>
              <option value="single">Single view</option>
              <option value="consensus">Experts agree</option>
            </select>
          </div>
        </div>
        <label htmlFor={`reason-${claim.id}`} className="small">Reason for edit</label>
        <input id={`reason-${claim.id}`} value={reason} onChange={(e) => setReason(e.target.value)} />
        <p className="muted small">Saving creates a new version and clears any review decision.</p>
        <button type="submit" className="btn btn-secondary">Save new version</button>
      </form>
    </details>
  );
}
