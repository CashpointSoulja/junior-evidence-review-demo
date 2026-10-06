import { useCallback, useEffect, useReducer, useState } from "react";
import { CALLS, PROJECT } from "../data/project";
import { checkClaim, needsReview } from "../engine/checks";
import { computeGaps } from "../engine/gaps";
import { readiness } from "../engine/readiness";
import { load, reduce, save, type Action } from "../engine/store";
import type { AppState } from "../engine/types";
import { CallsView } from "./CallsView";
import { ClaimsView } from "./ClaimsView";
import { ReadinessTag } from "./common";
import { ExportView } from "./ExportView";
import { GapsView } from "./GapsView";
import { GuideView } from "./GuideView";
import { MetricsView } from "./MetricsView";
import { go, href, useRoute, type View } from "./route";
import { SourceDrawer } from "./SourceDrawer";

function init(): { state: AppState; notice: string | null } {
  const { state, restored, discarded } = load(window.localStorage, new Date().toISOString());
  return { state, notice: discarded ? "Saved data was unreadable, so the synthetic project was reloaded." : restored ? "Restored your review from this browser." : null };
}

export function App() {
  const [boot] = useState(init);
  const [state, rawDispatch] = useReducer((s: AppState, a: Action) => reduce(s, a), boot.state);
  const [notice, setNotice] = useState(boot.notice);
  const route = useRoute();
  const dispatch = rawDispatch;

  useEffect(() => save(window.localStorage, state), [state]);

  const openSource = useCallback((id: string) => go(href(route.view === "calls" ? "claims" : route.view, route.view === "calls" ? null : route.id, id)), [route.view, route.id]);
  const closeSource = useCallback(() => go(href(route.view, route.id)), [route.view, route.id]);

  const gaps = computeGaps(state.claims);
  const r = readiness(state);
  const toReview = state.claims.filter((c) => c.included && c.review.status === "unreviewed" && needsReview(c, checkClaim(c))).length;
  const baseUrl = `${window.location.origin}${window.location.pathname}`;

  const copyGuide = async () => {
    if (!state.guide) return;
    await navigator.clipboard?.writeText(state.guide.items.map((i, n) => `${n + 1}. ${i.text}`).join("\n"));
    dispatch({ type: "logEvent", name: "guide_used", props: { guideCreatedAt: state.guide.createdAt, via: "copy" } });
  };

  const reset = () => {
    if (window.confirm("Reset all reviews, edits, guide and events in this browser to the original synthetic project?")) {
      dispatch({ type: "reset" });
      setNotice("Reset to the original synthetic project.");
      go(href("claims"));
    }
  };

  const nav: { view: View; label: string; count?: number }[] = [
    { view: "claims", label: "Claims", count: toReview },
    { view: "gaps", label: "Gap queue", count: gaps.length },
    { view: "guide", label: "Follow-up guide", count: state.guide?.items.length },
    { view: "export", label: "Handoff & export" },
    { view: "metrics", label: "Metrics" },
  ];

  return (
    <div className="app">
      <a href="#main" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <header className="topbar">
        <a className="brand" href={href("claims")} aria-label="Evidence Review home">
          <img src={`${import.meta.env.BASE_URL}brand/junior-logo.svg`} alt="Junior" width={69} height={20} />
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-product">Evidence Review</span>
        </a>
        <div className="topbar-right">
          <span className="project-chip"><span className="mono">{PROJECT.code}</span> <span className="tag tag-warn">Synthetic</span></span>
          <a href={href("export")} className="status-link" aria-label={`Brief status: ${r.status.replace(/_/g, " ")}`}><ReadinessTag status={r.status} /></a>
          <button type="button" className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>
      </header>
      <p className="banner">Synthetic demo data · stored only in this browser · no AI or API calls · not investment advice</p>
      <div className="layout">
        <nav className="rail" aria-label="Sections">
          <p className="rail-label">Review</p>
          <ul>
            {nav.map((n) => (
              <li key={n.view}>
                <a href={href(n.view)} className={`rail-item${route.view === n.view ? " rail-item-active" : ""}`} aria-current={route.view === n.view ? "page" : undefined}>
                  {n.label}
                  {n.count !== undefined && n.count > 0 && <span className="rail-count">{n.count}</span>}
                </a>
              </li>
            ))}
          </ul>
          <p className="rail-label">Calls</p>
          <ul>
            {CALLS.map((c) => (
              <li key={c.id}>
                <a href={href("calls", c.id)} className={`rail-item${route.view === "calls" && route.id === c.id ? " rail-item-active" : ""}`} aria-current={route.view === "calls" && route.id === c.id ? "page" : undefined}>
                  {c.id}
                  <span className="rail-sub">{c.date.slice(5)}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main" tabIndex={-1} className="main">
          {notice && (
            <div className="toast" role="status">
              {notice} <button type="button" className="link-btn" onClick={() => setNotice(null)}>Dismiss</button>
            </div>
          )}
          <div className="deal">
            <span className="mono small">{PROJECT.code}</span>
            <span className="small muted">{PROJECT.target} (fictional) · {PROJECT.sector} · 3 expert calls, 14–18 Sep 2026</span>
          </div>
          {route.view === "claims" && <ClaimsView claims={state.claims} selectedId={route.id} dispatch={dispatch} openSource={openSource} />}
          {route.view === "gaps" && <GapsView gaps={gaps} hasGuide={!!state.guide} onGenerate={() => { dispatch({ type: "generateGuide" }); go(href("guide")); }} openSource={openSource} />}
          {route.view === "calls" && <CallsView callId={route.id} source={route.source} />}
          {route.view === "guide" && <GuideView guide={state.guide} gapCount={gaps.length} dispatch={dispatch} onCopy={copyGuide} />}
          {route.view === "export" && <ExportView state={state} dispatch={dispatch} baseUrl={baseUrl} />}
          {route.view === "metrics" && <MetricsView state={state} />}
        </main>
      </div>
      {route.source && route.view !== "calls" && <SourceDrawer quoteId={route.source} onClose={closeSource} />}
      <footer className="footer">
        <p>Independent concept by Ayo Ahmed, not affiliated with Junior AI.</p>
        <p className="muted small">Junior name and logo belong to Junior AI and are shown only to place the concept. All companies, people, calls and figures are synthetic.</p>
      </footer>
    </div>
  );
}
