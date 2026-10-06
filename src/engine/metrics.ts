import type { AppEvent, Claim, Guide } from "./types";
import { resolveCitations } from "./checks";

export interface Ratio {
  label: string;
  numerator: number | null;
  denominator: number | null;
  window: string;
  definition: string;
  note?: string;
}

const WEEK_MS = 7 * 24 * 3600 * 1000;

function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${Math.ceil(((t.getTime() - y.getTime()) / 86400000 + 1) / 7)}`;
}

export function sourcedAcceptance(claims: Claim[]): Ratio {
  const reviewed = claims.filter((c) => c.review.status !== "unreviewed");
  const accepted = reviewed.filter((c) => c.review.status === "supported" && c.included && resolveCitations(c).valid.length > 0);
  return {
    label: "Sourced accepted claims / reviewed claims",
    numerator: accepted.length,
    denominator: reviewed.length,
    window: "Current brief",
    definition: "Claims marked supported, included, with at least one valid expert-quote citation, over claims with any review decision.",
  };
}

export function callToReady(events: AppEvent[]): Ratio & { ms: number | null } {
  const ingested = events.find((e) => e.name === "final_call_ingested");
  const approved = events.find((e) => e.name === "brief_approved" && ingested && e.at >= ingested.at);
  const ms = ingested && approved ? Date.parse(approved.at) - Date.parse(ingested.at) : null;
  return {
    label: "Final call to handoff-ready",
    numerator: ms,
    denominator: null,
    window: "This browser, current brief",
    definition: "Time from the last call being available for review to first approval of the brief.",
    note: "Demo timer: starts when this browser first loads the synthetic project. It is not a customer benchmark.",
    ms,
  };
}

export function analystsReturning(events: AppEvent[], now: Date): Ratio {
  const since = now.getTime() - 4 * WEEK_MS;
  const recent = events.filter((e) => Date.parse(e.at) >= since);
  const activated = new Set(recent.filter((e) => e.name === "brief_approved").map((e) => e.analystId));
  const returning = [...activated].filter((a) => new Set(recent.filter((e) => e.analystId === a).map((e) => isoWeek(new Date(e.at)))).size >= 2);
  return {
    label: "Weekly returning analysts / activated analysts",
    numerator: returning.length,
    denominator: activated.size,
    window: "Trailing 4 ISO weeks",
    definition: "Activated: approved at least one brief in the window. Returning: activated and active in 2 or more ISO weeks of the window.",
    note: "Browser-local: at most one analyst (this browser). Real values need multi-user telemetry in a pilot.",
  };
}

export function guidesUsed(events: AppEvent[], guide: Guide | null): Ratio {
  const created = events.filter((e) => e.name === "guide_created").length;
  const used = new Set(events.filter((e) => e.name === "guide_used").map((e) => String(e.props?.guideCreatedAt ?? ""))).size;
  return {
    label: "Guides used / guides created",
    numerator: used,
    denominator: created,
    window: "This browser, all time",
    definition: "Used: a generated guide was exported or copied at least once. Created: guides generated from the gap queue.",
    note: guide ? `Current guide has ${guide.items.length} questions.` : "No guide generated yet.",
  };
}

export function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m ${s % 60}s`;
}
