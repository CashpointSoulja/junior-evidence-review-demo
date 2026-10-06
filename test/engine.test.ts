import { describe, expect, it } from "vitest";
import { ALL_QUOTES, CALLS, IDENTIFIERS, seedClaims } from "../src/data/project";
import { checkClaim } from "../src/engine/checks";
import { buildExport, SYNTHETIC_LABEL, NO_ASSURANCE, AFFILIATION, sourceLink } from "../src/engine/export";
import { computeGaps } from "../src/engine/gaps";
import { buildGuide, leadingIssues, TEMPLATES } from "../src/engine/guide";
import { analystsReturning, callToReady, guidesUsed, sourcedAcceptance } from "../src/engine/metrics";
import { readiness } from "../src/engine/readiness";
import { redact, RESIDUAL_RISK_WARNING, rulesFor } from "../src/engine/redact";
import { freshState, load, reduce, save, STORAGE_KEY, type Action } from "../src/engine/store";
import type { AppState } from "../src/engine/types";

const T0 = "2026-09-18T17:00:00.000Z";
const codes = (s: AppState, id: string) => checkClaim(s.claims.find((c) => c.id === id)!).map((f) => f.code);
const run = (s: AppState, ...actions: Action[]) => actions.reduce((acc, a, i) => reduce(acc, a, new Date(Date.parse(T0) + (i + 1) * 60000).toISOString()), s);

/** Resolves every seeded issue the way a careful reviewer would. */
export function resolveAll(s: AppState): AppState {
  return run(
    s,
    { type: "review", claimId: "CL-1", status: "supported", note: "" },
    { type: "edit", claimId: "CL-2", text: "Mid-market retention is strong (about 95% GRR, FY2025, one former employee); small firms look weaker.", scope: "mid_market", generality: "single", reason: "Narrow to cited scope" },
    { type: "review", claimId: "CL-2", status: "supported", note: "" },
    { type: "review", claimId: "CL-3", status: "disputed", note: "Competitor says 12% across the board; conflict open." },
    { type: "toggleInclude", claimId: "CL-3" },
    { type: "toggleInclude", claimId: "CL-4" },
    { type: "review", claimId: "CL-5", status: "supported", note: "" },
    { type: "edit", claimId: "CL-6", text: "In small firms, Tallyfern says it won about 60% of head-to-heads in 2025.", scope: "small_firms", reason: "Match source scope" },
    { type: "review", claimId: "CL-6", status: "supported", note: "" },
    { type: "addCitation", claimId: "CL-7", quoteId: "QB-04" },
    { type: "review", claimId: "CL-7", status: "supported", note: "" },
    { type: "review", claimId: "CL-8", status: "insufficient", note: "Expert did not know if it shipped." },
    { type: "toggleInclude", claimId: "CL-8" },
  );
}

describe("synthetic data and provenance", () => {
  it("has exactly three calls, each quote with id, timestamp, date, cohort and scope", () => {
    expect(CALLS).toHaveLength(3);
    expect(new Set(CALLS.map((c) => c.cohort)).size).toBe(3);
    const ids = ALL_QUOTES.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of CALLS) {
      expect(c.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const q of c.quotes) {
        expect(q.callId).toBe(c.id);
        expect(q.ts).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        expect(q.scope).toBeTruthy();
        if (q.metric) expect(q.metric.unit).toBeTruthy();
      }
    }
  });
  it("flags a claim with no citation as blocking", () => {
    const s = freshState(T0);
    expect(codes(s, "CL-7")).toContain("MISSING_CITATION");
  });
  it("flags a citation that does not resolve, or points at the interviewer", () => {
    const s = freshState(T0);
    s.claims[0] = { ...s.claims[0], citations: ["QZ-99", "QA-01"] };
    const f = checkClaim(s.claims[0]);
    expect(f.find((x) => x.code === "BROKEN_CITATION")?.quoteIds).toEqual(["QZ-99", "QA-01"]);
  });
  it("flags figure mismatch between claim and cited quote", () => {
    expect(codes(freshState(T0), "CL-4")).toContain("METRIC_MISMATCH");
  });
  it("flags hedged sources", () => {
    expect(codes(freshState(T0), "CL-8")).toContain("HEDGED_SOURCE");
  });
  it("flags 'experts agree' backed by one call", () => {
    const s = run(freshState(T0), { type: "removeCitation", claimId: "CL-2", quoteId: "QC-05" });
    expect(codes(s, "CL-2")).toContain("SINGLE_SOURCE_CONSENSUS");
  });
  it("passes a clean claim with no findings", () => {
    expect(codes(freshState(T0), "CL-9")).toEqual([]);
  });
});

describe("cohort differences vs real contradictions, and scope mismatch", () => {
  it("treats same-scope same-period conflict as a contradiction", () => {
    const f = checkClaim(freshState(T0).claims.find((c) => c.id === "CL-3")!);
    expect(f.find((x) => x.code === "CONTRADICTION")?.quoteIds).toEqual(["QC-03"]);
  });
  it("treats a different-cohort figure as context, not a contradiction", () => {
    const f = checkClaim(freshState(T0).claims.find((c) => c.id === "CL-3")!);
    const cohort = f.filter((x) => x.code === "COHORT_DIFFERENCE");
    expect(cohort.map((x) => x.quoteIds[0])).toEqual(["QB-02"]);
    expect(cohort[0].severity).toBe("info");
    const grr = checkClaim(freshState(T0).claims.find((c) => c.id === "CL-1")!);
    expect(grr.filter((x) => x.code === "CONTRADICTION")).toHaveLength(0);
    expect(grr.filter((x) => x.code === "COHORT_DIFFERENCE").map((x) => x.quoteIds[0]).sort()).toEqual(["QA-03", "QC-04"]);
  });
  it("flags a claim generalising beyond the cited segment", () => {
    expect(codes(freshState(T0), "CL-6")).toContain("SCOPE_MISMATCH");
    expect(codes(freshState(T0), "CL-2")).toContain("SCOPE_MISMATCH");
  });
  it("clears scope mismatch when the claim is narrowed", () => {
    const s = run(freshState(T0), { type: "edit", claimId: "CL-6", text: "Small firms only.", scope: "small_firms", reason: "" });
    expect(codes(s, "CL-6")).not.toContain("SCOPE_MISMATCH");
  });
});

describe("readiness gate: break, fix, approve", () => {
  it("is blocked on the seeded brief with citation and review blockers", () => {
    const r = readiness(freshState(T0));
    expect(r.status).toBe("blocked");
    expect(r.blockers.some((b) => b.kind === "citation" && b.claimId === "CL-7")).toBe(true);
    expect(r.blockers.some((b) => b.kind === "review" && b.claimId === "CL-1")).toBe(true);
  });
  it("refuses approval while blocked", () => {
    const s = run(freshState(T0), { type: "approve" });
    expect(s.approval).toBeNull();
  });
  it("blocks on disputed or insufficient included claims", () => {
    const s = run(freshState(T0), { type: "review", claimId: "CL-3", status: "disputed", note: "conflict" });
    expect(readiness(s).blockers.some((b) => b.kind === "rejected" && b.claimId === "CL-3")).toBe(true);
  });
  it("requires a note to accept over open checks, or to dispute", () => {
    const s = freshState(T0);
    expect(run(s, { type: "review", claimId: "CL-4", status: "supported", note: "" }).claims[3].review.status).toBe("unreviewed");
    expect(run(s, { type: "review", claimId: "CL-3", status: "disputed", note: " " }).claims[2].review.status).toBe("unreviewed");
    expect(run(s, { type: "review", claimId: "CL-1", status: "supported", note: "" }).claims[0].review.status).toBe("supported");
  });
  it("approves once resolved, breaks on citation removal, and needs re-approval after fix", () => {
    let s = resolveAll(freshState(T0));
    expect(readiness(s)).toEqual({ status: "ready_to_approve", blockers: [] });
    s = run(s, { type: "approve" });
    expect(readiness(s).status).toBe("approved");
    s = run(s, { type: "removeCitation", claimId: "CL-1", quoteId: "QA-02" });
    expect(readiness(s).status).toBe("changed_since_approval");
    expect(readiness(s).blockers.map((b) => b.kind)).toContain("citation");
    s = run(s, { type: "addCitation", claimId: "CL-1", quoteId: "QA-02" });
    expect(readiness(s).blockers.map((b) => b.kind)).toEqual(["review"]);
    s = run(s, { type: "review", claimId: "CL-1", status: "supported", note: "" });
    expect(readiness(s).status).toBe("changed_since_approval");
    s = run(s, { type: "approve" });
    expect(readiness(s).status).toBe("approved");
  });
});

describe("edit lineage", () => {
  it("records versions with prior review and resets review on edit", () => {
    let s = run(freshState(T0), { type: "review", claimId: "CL-1", status: "supported", note: "" });
    s = run(s, { type: "edit", claimId: "CL-1", text: "GRR about 91% in FY2025, full base.", reason: "tighten" });
    const c = s.claims[0];
    expect(c.review.status).toBe("unreviewed");
    expect(c.history).toHaveLength(2);
    expect(c.history[1]).toMatchObject({ v: 2, change: "text", priorReview: "supported", text: "GRR about 91% in FY2025, full base." });
    expect(c.history[1].detail).toContain("review reset (was supported)");
    expect(c.history[0].text).toBe(seedClaims()[0].text);
  });
  it("records citation changes and figure edits", () => {
    const s = run(freshState(T0), { type: "addCitation", claimId: "CL-7", quoteId: "QB-04" }, { type: "edit", claimId: "CL-4", text: "One customer saw 12%.", metricValue: 12, scope: "single_firm", reason: "match source" });
    expect(s.claims[6].history[1]).toMatchObject({ change: "citation_added", citations: ["QB-04"] });
    expect(s.claims[3].history[1].detail).toContain("figure 15 → 12");
    expect(s.claims[3].claimedMetric?.value).toBe(12);
    expect(codes(s, "CL-4")).not.toContain("METRIC_MISMATCH");
  });
  it("ignores no-op edits", () => {
    const s0 = freshState(T0);
    expect(run(s0, { type: "edit", claimId: "CL-1", text: s0.claims[0].text, reason: "" })).toBe(s0);
  });
});

describe("gap queue and template guide", () => {
  it("queues conflicts first and links gaps to claims and quotes", () => {
    const gaps = computeGaps(freshState(T0).claims);
    expect(gaps[0].type).toBe("CONFLICT");
    expect(gaps[0].topic).toBe("pricing");
    expect(gaps[0].quoteIds).toContain("QC-03");
    expect(gaps.some((g) => g.type === "COHORT_LIMITED" && g.topic === "implementation" && g.targetCohort === "customer")).toBe(true);
    expect(gaps.some((g) => g.type === "NO_EVIDENCE" && g.topic === "switching")).toBe(true);
  });
  it("updates gaps when claims are fixed", () => {
    const s = run(freshState(T0), { type: "addCitation", claimId: "CL-7", quoteId: "QB-04" });
    expect(computeGaps(s.claims).some((g) => g.type === "NO_EVIDENCE" && g.topic === "switching")).toBe(false);
  });
  it("builds a guide only from fixed templates, every question tied to a gap", () => {
    const gaps = computeGaps(freshState(T0).claims);
    const g = buildGuide(gaps, null, T0);
    const templateIds = new Set(Object.values(TEMPLATES).flat().map((t) => t.id));
    expect(g.items.length).toBeGreaterThan(0);
    for (const it of g.items) {
      expect(gaps.map((x) => x.id)).toContain(it.gapId);
      expect(templateIds.has(it.templateId!)).toBe(true);
      expect(it.text).not.toMatch(/\{|\}/);
      expect(leadingIssues(it.text)).toEqual([]);
    }
  });
  it("keeps edits when regenerating and marks them edited", () => {
    let s = run(freshState(T0), { type: "generateGuide" });
    const first = s.guide!.items[0];
    s = run(s, { type: "editGuideItem", id: first.id, text: "What did your 2025 renewal invoice show?" }, { type: "generateGuide" });
    expect(s.guide!.items[0]).toMatchObject({ text: "What did your 2025 renewal invoice show?", origin: "edited" });
    expect(s.events.filter((e) => e.name === "guide_created")).toHaveLength(1);
  });
  it("flags leading wording", () => {
    expect(leadingIssues("Surely churn is low, right?")).toHaveLength(2);
    expect(leadingIssues("Can you confirm that prices rose?")).toHaveLength(1);
  });
});

describe("export labels and redaction", () => {
  const base = "https://example.test/app/";
  it("labels draft exports, includes source links, gaps, guide and synthetic labels", () => {
    const s = run(freshState(T0), { type: "generateGuide" });
    const md = buildExport(s, base, T0);
    expect(md).toContain(SYNTHETIC_LABEL);
    expect(md).toContain(NO_ASSURANCE);
    expect(md).toContain(AFFILIATION);
    expect(md).toContain("DRAFT: NOT HANDOFF-READY");
    expect(md).toContain(sourceLink(base, "QA-02"));
    expect(md).toContain("## Diligence gaps");
    expect(md).toContain("GAP-pricing-CONFLICT");
    expect(md).toContain("Template-based");
    expect(md).toContain(RESIDUAL_RISK_WARNING);
    expect(md).not.toMatch(/HANDOFF-READY \(approved/);
  });
  it("labels approved exports and lists excluded claims", () => {
    const s = run(resolveAll(freshState(T0)), { type: "approve" });
    const md = buildExport(s, base, T0);
    expect(md).toMatch(/Status: HANDOFF-READY \(approved /);
    expect(md).toContain("## Excluded claims");
    expect(md).toContain("Edit history: v1");
  });
  it("redacts only selected identifiers, longest first, and leaves source links intact", () => {
    let s = run(freshState(T0), { type: "setRedactions", terms: ["Helena Marsh", "Helena", "Dev Okafor", "+44 7700 900123", "Carrow & Lyle LLP"] });
    s = run(s, { type: "addCitation", claimId: "CL-7", quoteId: "QB-01" }, { type: "addCitation", claimId: "CL-1", quoteId: "QA-01" });
    const md = buildExport(s, base, T0);
    for (const t of ["Helena", "Dev Okafor", "Carrow & Lyle LLP"]) expect(md).not.toContain(t);
    expect(md).toContain("[EXPERT-B]");
    expect(md).toContain("[CUSTOMER-FIRM]");
    expect(md).toContain("Quillmoor");
    expect(md).toContain(sourceLink(base, "QB-01"));
  });
  it("does not redact inside other words", () => {
    expect(redact("Development by Dev.", rulesFor(["Dev"], [])).text).toBe("Development by [EXPERT-B].");
    expect(IDENTIFIERS.length).toBeGreaterThan(5);
  });
  it("supports custom terms with regex characters safely", () => {
    expect(redact("cost (a+b) here", rulesFor([], ["(a+b)"])).text).toBe("cost [REDACTED] here");
  });
});

describe("XSS payloads are treated as data", () => {
  it("escapes angle brackets in exported claim text and notes", () => {
    const payload = `<img src=x onerror=alert(1)><script>alert(2)</script>`;
    const s = run(freshState(T0), { type: "edit", claimId: "CL-9", text: payload, reason: payload }, { type: "review", claimId: "CL-3", status: "disputed", note: payload });
    const md = buildExport(s, "https://x/", T0);
    expect(md).not.toContain("<img");
    expect(md).not.toContain("<script");
    expect(md).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });
});

describe("persistence and reset", () => {
  it("round-trips through storage", () => {
    const s = run(freshState(T0), { type: "review", claimId: "CL-1", status: "supported", note: "" });
    save(localStorage, s);
    const l = load(localStorage, T0);
    expect(l.restored).toBe(true);
    expect(l.state.claims[0].review.status).toBe("supported");
  });
  it("discards corrupt or wrong-shape storage", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(load(localStorage, T0)).toMatchObject({ restored: false, discarded: true });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 2, claims: [] }));
    expect(load(localStorage, T0).discarded).toBe(true);
  });
  it("reset restores seed claims and clears guide, approval and redactions", () => {
    let s = run(resolveAll(freshState(T0)), { type: "approve" }, { type: "generateGuide" }, { type: "setRedactions", terms: ["Helena"] });
    s = run(s, { type: "reset" });
    expect(s.claims).toEqual(seedClaims());
    expect(s.guide).toBeNull();
    expect(s.approval).toBeNull();
    expect(s.redactions).toEqual([]);
    expect(s.events[0].name).toBe("reset");
  });
});

describe("metrics have explicit numerators, denominators and windows", () => {
  it("computes sourced accepted / reviewed", () => {
    const s = run(freshState(T0), { type: "review", claimId: "CL-1", status: "supported", note: "" }, { type: "review", claimId: "CL-3", status: "disputed", note: "x" });
    expect(sourcedAcceptance(s.claims)).toMatchObject({ numerator: 1, denominator: 2 });
  });
  it("does not count an accepted claim without a valid citation", () => {
    const s = run(freshState(T0), { type: "review", claimId: "CL-7", status: "supported", note: "" });
    expect(sourcedAcceptance(s.claims)).toMatchObject({ numerator: 0, denominator: 1 });
  });
  it("measures final-call-to-ready only after approval", () => {
    const s = resolveAll(freshState(T0));
    expect(callToReady(s.events).ms).toBeNull();
    const a = run(s, { type: "approve" });
    expect(callToReady(a.events).ms).toBeGreaterThan(0);
  });
  it("reports analysts and guides with denominators", () => {
    const s = run(freshState(T0), { type: "generateGuide" });
    expect(analystsReturning(s.events, new Date(T0))).toMatchObject({ numerator: 0, denominator: 0, window: "Trailing 4 ISO weeks" });
    expect(guidesUsed(s.events, s.guide)).toMatchObject({ numerator: 0, denominator: 1 });
    const u = run(s, { type: "logEvent", name: "guide_used", props: { guideCreatedAt: s.guide!.createdAt } });
    expect(guidesUsed(u.events, u.guide)).toMatchObject({ numerator: 1, denominator: 1 });
  });
});
