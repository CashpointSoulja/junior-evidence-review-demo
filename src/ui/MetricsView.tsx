import { analystsReturning, callToReady, formatDuration, guidesUsed, sourcedAcceptance, type Ratio } from "../engine/metrics";
import type { AppState } from "../engine/types";

function Card({ r, value }: { r: Ratio; value: string }) {
  return (
    <li className="panel metric">
      <h2 className="metric-label">{r.label}</h2>
      <p className="metric-value">{value}</p>
      <dl className="small">
        <dt>Window</dt><dd>{r.window}</dd>
        <dt>Definition</dt><dd>{r.definition}</dd>
        {r.note && (<><dt>Note</dt><dd>{r.note}</dd></>)}
      </dl>
    </li>
  );
}

const ratio = (r: Ratio) => (r.denominator ? `${r.numerator} / ${r.denominator}` : `${r.numerator ?? 0} / 0 (no denominator yet)`);

export function MetricsView({ state }: { state: AppState }) {
  const now = new Date();
  const t = callToReady(state.events);
  return (
    <section aria-labelledby="metrics-h">
      <h1 id="metrics-h" className="view-title">Metrics</h1>
      <p className="notice">Computed live from events stored in this browser only. There is no baseline, no customer data and no telemetry. Pilot targets are hypotheses in docs/metrics.md.</p>
      <ul className="metric-grid">
        <Card r={sourcedAcceptance(state.claims)} value={ratio(sourcedAcceptance(state.claims))} />
        <Card r={t} value={t.ms === null ? "Not yet approved" : formatDuration(t.ms)} />
        <Card r={analystsReturning(state.events, now)} value={ratio(analystsReturning(state.events, now))} />
        <Card r={guidesUsed(state.events, state.guide)} value={ratio(guidesUsed(state.events, state.guide))} />
      </ul>
      <p className="muted small">{state.events.length} local events recorded.</p>
    </section>
  );
}
