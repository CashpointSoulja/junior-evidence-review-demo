import { CALLS, CALL_BY_ID } from "../data/project";
import { CallHeader, Transcript } from "./Transcript";
import { href } from "./route";

export function CallsView({ callId, source }: { callId: string | null; source: string | null }) {
  const call = CALL_BY_ID.get(callId ?? "") ?? CALLS[0];
  return (
    <section aria-labelledby="calls-h">
      <h1 id="calls-h" className="view-title">Expert calls</h1>
      <p className="muted">Three synthetic calls for {"Project Kestrel"}. Every quote carries an ID, timestamp, date, cohort and scope.</p>
      <nav className="tabs" aria-label="Calls">
        {CALLS.map((c) => (
          <a key={c.id} href={href("calls", c.id)} className={`tab${c.id === call.id ? " tab-active" : ""}`} aria-current={c.id === call.id ? "page" : undefined}>
            {c.id} · {c.expertName}
          </a>
        ))}
      </nav>
      <div className="panel">
        <CallHeader call={call} />
        <Transcript call={call} highlight={source} />
      </div>
    </section>
  );
}
