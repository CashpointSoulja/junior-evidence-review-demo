import { useEffect, useRef } from "react";
import { COHORT_LABEL, SCOPE_LABEL } from "../data/project";
import type { Call } from "../engine/types";
import { Initials, Tag } from "./common";

export function CallHeader({ call }: { call: Call }) {
  return (
    <div className="call-header">
      <Initials name={call.expertName} />
      <div className="call-who">
        <div className="call-name">
          {call.expertName} <Tag>{COHORT_LABEL[call.cohort]}</Tag> <Tag tone="warn">Synthetic</Tag>
        </div>
        <div className="muted small">{call.role}</div>
      </div>
      <div className="call-when muted small">
        <span className="mono">{call.id}</span>
        <br />
        {call.date} · {call.durationMin} min
      </div>
    </div>
  );
}

export function Transcript({ call, highlight }: { call: Call; highlight: string | null }) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView?.({ block: "center" });
  }, [highlight, call.id]);
  return (
    <ol className="transcript" aria-label={`Transcript of ${call.id}`}>
      {call.quotes.map((q) => (
        <li key={q.id} id={`quote-${q.id}`} ref={q.id === highlight ? ref : undefined} className={`turn${q.id === highlight ? " turn-highlight" : ""}`} aria-current={q.id === highlight ? "true" : undefined}>
          <div className="turn-meta">
            <span className="mono">{q.ts}</span>
            <span className="mono">{q.id}</span>
            <span>{q.speaker}</span>
            <span className="muted">{SCOPE_LABEL[q.scope]}</span>
            {q.metric && (
              <span className="muted">
                {q.metric.value}
                {q.metric.unit === "%" ? "%" : ` ${q.metric.unit}`} · {q.metric.period}
                {q.metric.estimate ? " · estimate" : ""}
              </span>
            )}
            {q.hedged && <Tag tone="warn">Hedged</Tag>}
          </div>
          <p className="turn-text">{q.text}</p>
        </li>
      ))}
    </ol>
  );
}
