import { useEffect, useRef } from "react";
import { CALL_BY_ID, QUOTE_BY_ID } from "../data/project";
import { CallHeader, Transcript } from "./Transcript";

export function SourceDrawer({ quoteId, onClose }: { quoteId: string; onClose: () => void }) {
  const q = QUOTE_BY_ID.get(quoteId)!;
  const call = CALL_BY_ID.get(q.callId)!;
  const headRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    headRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [quoteId, onClose]);
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-h" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-top">
          <h2 id="drawer-h" ref={headRef} tabIndex={-1}>
            Source <span className="mono">{q.id}</span> at <span className="mono">{q.ts}</span>
          </h2>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close<span className="sr-only"> transcript</span>
          </button>
        </div>
        <CallHeader call={call} />
        <div className="tabs" role="presentation"><span className="tab tab-active">Transcript</span></div>
        <Transcript call={call} highlight={q.id} />
      </aside>
    </div>
  );
}
