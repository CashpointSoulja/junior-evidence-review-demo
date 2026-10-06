import { useSyncExternalStore } from "react";
import { QUOTE_BY_ID } from "../data/project";

export type View = "claims" | "gaps" | "calls" | "guide" | "export" | "metrics";
export interface Route {
  view: View;
  id: string | null;
  source: string | null;
}

const VIEWS: View[] = ["claims", "gaps", "calls", "guide", "export", "metrics"];

export function parseHash(hash: string): Route {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const source = new URLSearchParams(query).get("source");
  if (parts[0] === "source" && parts[1]) {
    const q = QUOTE_BY_ID.get(parts[1]);
    return { view: "calls", id: q?.callId ?? null, source: q ? q.id : null };
  }
  const view = (VIEWS as string[]).includes(parts[0]) ? (parts[0] as View) : "claims";
  return { view, id: parts[1] ?? null, source: source && QUOTE_BY_ID.has(source) ? source : null };
}

export function href(view: View, id?: string | null, source?: string | null): string {
  return `#/${view}${id ? `/${encodeURIComponent(id)}` : ""}${source ? `?source=${encodeURIComponent(source)}` : ""}`;
}

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  return parseHash(hash);
}

export function go(h: string) {
  if (window.location.hash !== h) window.location.hash = h;
}
