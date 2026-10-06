import { seedClaims } from "../data/project";
import { buildGuide, editItem, moveItem } from "./guide";
import { computeGaps } from "./gaps";
import { checkClaim } from "./checks";
import { fingerprint, readiness } from "./readiness";
import type { AppEvent, AppState, Claim, ClaimVersion, ReviewStatus, Scope } from "./types";

export const STORAGE_KEY = "junior-evidence-review:v1";
export const ANALYST_ID = "local-analyst";

export type Action =
  | { type: "review"; claimId: string; status: ReviewStatus; note: string }
  | { type: "edit"; claimId: string; text: string; scope?: Scope; metricValue?: number; generality?: Claim["generality"]; reason: string }
  | { type: "addCitation"; claimId: string; quoteId: string }
  | { type: "removeCitation"; claimId: string; quoteId: string }
  | { type: "toggleInclude"; claimId: string }
  | { type: "approve" }
  | { type: "generateGuide" }
  | { type: "editGuideItem"; id: string; text: string }
  | { type: "removeGuideItem"; id: string }
  | { type: "moveGuideItem"; id: string; dir: -1 | 1 }
  | { type: "addGuideItem"; text: string }
  | { type: "setRedactions"; terms: string[] }
  | { type: "setCustomRedactions"; terms: string[] }
  | { type: "logEvent"; name: AppEvent["name"]; props?: AppEvent["props"] }
  | { type: "reset" };

export function freshState(now: string): AppState {
  return {
    schema: 1,
    claims: seedClaims(),
    guide: null,
    approval: null,
    redactions: [],
    customRedactions: [],
    events: [
      { name: "session_started", at: now, analystId: ANALYST_ID },
      { name: "final_call_ingested", at: now, analystId: ANALYST_ID, props: { callId: "CALL-C", synthetic: true } },
    ],
  };
}

/** A note is required for any non-supported decision, and for accepting a claim over open findings. */
export function reviewNoteRequired(claim: Claim, status: ReviewStatus): boolean {
  if (status === "unreviewed") return false;
  if (status !== "supported") return true;
  return checkClaim(claim).some((f) => f.severity === "review");
}

function version(c: Claim, change: ClaimVersion["change"], detail: string, next: Pick<Claim, "text" | "citations">, now: string): ClaimVersion {
  return { v: c.history.length + 1, at: now, change, detail, text: next.text, citations: [...next.citations], priorReview: c.review.status };
}

function withChange(c: Claim, change: ClaimVersion["change"], detail: string, patch: Partial<Claim>, now: string): Claim {
  const next = { ...c, ...patch };
  const reset = c.review.status !== "unreviewed";
  return {
    ...next,
    review: reset ? { status: "unreviewed", note: "" } : c.review,
    history: [...c.history, version(c, change, reset ? `${detail}; review reset (was ${c.review.status})` : detail, next, now)],
  };
}

function ev(name: AppEvent["name"], now: string, props?: AppEvent["props"]): AppEvent {
  return { name, at: now, analystId: ANALYST_ID, ...(props ? { props } : {}) };
}

const CLAIM_ACTIONS: Action["type"][] = ["review", "edit", "addCitation", "removeCitation", "toggleInclude"];

/** Any change to claims after approval voids it, even if later reverted. */
export function reduce(state: AppState, action: Action, now: string = new Date().toISOString()): AppState {
  const next = reduceInner(state, action, now);
  if (next !== state && next.approval?.valid && CLAIM_ACTIONS.includes(action.type)) return { ...next, approval: { ...next.approval, valid: false } };
  return next;
}

function reduceInner(state: AppState, action: Action, now: string): AppState {
  const mapClaim = (id: string, fn: (c: Claim) => Claim): Claim[] => state.claims.map((c) => (c.id === id ? fn(c) : c));
  switch (action.type) {
    case "review": {
      const claim = state.claims.find((c) => c.id === action.claimId);
      if (!claim) return state;
      if (reviewNoteRequired(claim, action.status) && !action.note.trim()) return state;
      return {
        ...state,
        claims: mapClaim(action.claimId, (c) => ({ ...c, review: { status: action.status, note: action.note.trim(), at: now } })),
        events: [...state.events, ev("claim_reviewed", now, { claimId: action.claimId, status: action.status })],
      };
    }
    case "edit": {
      const claim = state.claims.find((c) => c.id === action.claimId);
      if (!claim || !action.text.trim()) return state;
      const patch: Partial<Claim> = { text: action.text.trim() };
      const parts: string[] = [];
      if (patch.text !== claim.text) parts.push("text");
      if (action.scope && action.scope !== claim.scope) { patch.scope = action.scope; parts.push(`scope → ${action.scope}`); }
      if (action.generality && action.generality !== claim.generality) { patch.generality = action.generality; parts.push(`generality → ${action.generality}`); }
      if (claim.claimedMetric && action.metricValue !== undefined && !Number.isNaN(action.metricValue) && action.metricValue !== claim.claimedMetric.value) {
        patch.claimedMetric = { ...claim.claimedMetric, value: action.metricValue };
        parts.push(`figure ${claim.claimedMetric.value} → ${action.metricValue}`);
      }
      if (!parts.length) return state;
      const detail = `Edited ${parts.join(", ")}${action.reason.trim() ? `: ${action.reason.trim()}` : ""}`;
      return {
        ...state,
        claims: mapClaim(action.claimId, (c) => withChange(c, "text", detail, patch, now)),
        events: [...state.events, ev("claim_edited", now, { claimId: action.claimId })],
      };
    }
    case "addCitation":
      return {
        ...state,
        claims: mapClaim(action.claimId, (c) => (c.citations.includes(action.quoteId) ? c : withChange(c, "citation_added", `Cited ${action.quoteId}`, { citations: [...c.citations, action.quoteId] }, now))),
      };
    case "removeCitation":
      return {
        ...state,
        claims: mapClaim(action.claimId, (c) => (!c.citations.includes(action.quoteId) ? c : withChange(c, "citation_removed", `Removed ${action.quoteId}`, { citations: c.citations.filter((x) => x !== action.quoteId) }, now))),
      };
    case "toggleInclude":
      return {
        ...state,
        claims: mapClaim(action.claimId, (c) => {
          const included = !c.included;
          return { ...c, included, history: [...c.history, version(c, included ? "included" : "excluded", included ? "Returned to brief" : "Excluded from brief; listed as a gap in export", c, now)] };
        }),
      };
    case "approve": {
      if (readiness(state).blockers.length) return state;
      return { ...state, approval: { at: now, fingerprint: fingerprint(state.claims), valid: true }, events: [...state.events, ev("brief_approved", now)] };
    }
    case "generateGuide": {
      const guide = buildGuide(computeGaps(state.claims), state.guide, now);
      return { ...state, guide, events: state.guide ? state.events : [...state.events, ev("guide_created", now, { guideCreatedAt: guide.createdAt })] };
    }
    case "editGuideItem":
      return state.guide ? { ...state, guide: editItem(state.guide, action.id, action.text) } : state;
    case "removeGuideItem":
      return state.guide ? { ...state, guide: { ...state.guide, items: state.guide.items.filter((i) => i.id !== action.id) } } : state;
    case "moveGuideItem":
      return state.guide ? { ...state, guide: moveItem(state.guide, action.id, action.dir) } : state;
    case "addGuideItem": {
      if (!state.guide || !action.text.trim()) return state;
      const id = `MANUAL-${state.guide.items.filter((i) => i.origin === "manual").length + 1}-${now}`;
      return { ...state, guide: { ...state.guide, items: [...state.guide.items, { id, gapId: null, topic: null, targetCohort: null, templateId: null, text: action.text.trim(), origin: "manual" }] } };
    }
    case "setRedactions":
      return { ...state, redactions: [...new Set(action.terms)] };
    case "setCustomRedactions":
      return { ...state, customRedactions: action.terms };
    case "logEvent":
      return { ...state, events: [...state.events, ev(action.name, now, action.props)] };
    case "reset": {
      const fresh = freshState(now);
      return { ...fresh, events: [ev("reset", now), ...fresh.events] };
    }
  }
}

export function isAppState(x: unknown): x is AppState {
  if (!x || typeof x !== "object") return false;
  const s = x as Partial<AppState>;
  return s.schema === 1 && Array.isArray(s.claims) && Array.isArray(s.events) && Array.isArray(s.redactions) && Array.isArray(s.customRedactions) &&
    (s.approval === null || (typeof s.approval === "object" && typeof s.approval.valid === "boolean")) &&
    s.claims.every((c) => c && typeof c.id === "string" && typeof c.text === "string" && Array.isArray(c.citations) && Array.isArray(c.history) && typeof c.review?.status === "string");
}

export function load(storage: Storage, now: string): { state: AppState; restored: boolean; discarded: boolean } {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isAppState(parsed)) return { state: parsed, restored: true, discarded: false };
    } catch {
      /* fall through to fresh state */
    }
    return { state: freshState(now), restored: false, discarded: true };
  }
  return { state: freshState(now), restored: false, discarded: false };
}

export function save(storage: Storage, state: AppState): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
