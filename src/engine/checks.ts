import { ALL_QUOTES, CALL_BY_ID, METRIC_LABEL, QUOTE_BY_ID, SCOPE_LABEL } from "../data/project";
import type { Claim, Finding, Quote, Scope } from "./types";

const RELATIVE_TOLERANCE = 0.1;
const PERCENT_POINT_TOLERANCE = 1;

/** Percentages compare in absolute points; other units compare relatively. */
export function differs(a: number, b: number, unit: string = "%"): boolean {
  if (unit === "%") return Math.abs(a - b) > PERCENT_POINT_TOLERANCE;
  const base = Math.max(Math.abs(a), Math.abs(b), 1);
  return Math.abs(a - b) / base > RELATIVE_TOLERANCE;
}

const SCOPE_BREADTH: Record<Scope, number> = { all_customers: 3, mid_market: 2, small_firms: 2, single_firm: 1 };

/** True when evidence from `quoteScope` cannot on its own support a claim about `claimScope`. */
export function scopeNarrower(claimScope: Scope, quoteScope: Scope): boolean {
  if (claimScope === quoteScope) return false;
  if (claimScope === "single_firm") return false;
  return SCOPE_BREADTH[quoteScope] <= SCOPE_BREADTH[claimScope];
}

export function resolveCitations(claim: Claim): { valid: Quote[]; broken: string[] } {
  const valid: Quote[] = [];
  const broken: string[] = [];
  for (const id of claim.citations) {
    const q = QUOTE_BY_ID.get(id);
    if (q && q.speaker === "Expert") valid.push(q);
    else broken.push(id);
  }
  return { valid, broken };
}

export function checkClaim(claim: Claim): Finding[] {
  const out: Finding[] = [];
  const push = (f: Omit<Finding, "claimId">) => out.push({ ...f, claimId: claim.id });
  const { valid, broken } = resolveCitations(claim);

  if (claim.citations.length === 0) {
    push({ code: "MISSING_CITATION", severity: "blocking", message: "No source quote is cited. Add at least one expert quote.", quoteIds: [] });
  }
  if (broken.length) {
    push({ code: "BROKEN_CITATION", severity: "blocking", message: `Cited ID ${broken.join(", ")} does not match an expert quote in the calls.`, quoteIds: broken });
  }

  for (const q of valid) {
    if (q.hedged) {
      push({ code: "HEDGED_SOURCE", severity: "review", message: `${q.id} is hedged by the expert (estimate or uncertainty). Check the claim does not state it as fact.`, quoteIds: [q.id] });
    }
  }

  const narrower = valid.filter((q) => scopeNarrower(claim.scope, q.scope));
  if (valid.length && narrower.length === valid.length) {
    push({
      code: "SCOPE_MISMATCH",
      severity: "review",
      message: `Claim covers ${SCOPE_LABEL[claim.scope].toLowerCase()}, but the cited evidence only covers ${[...new Set(narrower.map((q) => SCOPE_LABEL[q.scope].toLowerCase()))].join(" and ")}.`,
      quoteIds: narrower.map((q) => q.id),
    });
  }

  if (claim.generality === "consensus") {
    const calls = new Set(valid.map((q) => q.callId));
    if (calls.size < 2) {
      push({ code: "SINGLE_SOURCE_CONSENSUS", severity: "review", message: `Claim says experts agree, but cites ${calls.size} call${calls.size === 1 ? "" : "s"}. Agreement needs at least 2.`, quoteIds: valid.map((q) => q.id) });
    }
  }

  const m = claim.claimedMetric;
  if (m) {
    const label = METRIC_LABEL[m.key];
    const sameKey = valid.filter((q) => q.metric?.key === m.key);
    if (valid.length && sameKey.length === 0) {
      push({ code: "METRIC_UNSOURCED", severity: "review", message: `Claim states ${m.value}${m.unit} ${label}, but no cited quote gives a ${label} figure.`, quoteIds: valid.map((q) => q.id) });
    }
    for (const q of sameKey) {
      const qm = q.metric!;
      if (qm.unit !== m.unit || qm.period !== m.period) {
        push({ code: "UNIT_OR_PERIOD_MISMATCH", severity: "review", message: `${q.id} reports ${qm.value} ${qm.unit} for ${qm.period}; the claim states ${m.value} ${m.unit} for ${m.period}.`, quoteIds: [q.id] });
      } else if (differs(qm.value, m.value, m.unit)) {
        push({ code: "METRIC_MISMATCH", severity: "review", message: `${q.id} says ${qm.value}${unitSuffix(qm.unit)}; the claim says ${m.value}${unitSuffix(m.unit)}.`, quoteIds: [q.id] });
      }
    }

    const cited = new Set(claim.citations);
    for (const q of ALL_QUOTES) {
      if (cited.has(q.id) || q.metric?.key !== m.key || q.speaker !== "Expert") continue;
      const qm = q.metric;
      if (qm.unit !== m.unit) continue;
      if (!differs(qm.value, m.value, m.unit)) continue;
      const cohort = CALL_BY_ID.get(q.callId)!.cohort;
      if (qm.scope === claim.scope && qm.period === m.period) {
        push({ code: "CONTRADICTION", severity: "review", message: `${q.id} (${cohort.replace("_", " ")}) gives ${qm.value}${unitSuffix(qm.unit)} for the same scope (${SCOPE_LABEL[qm.scope].toLowerCase()}) and period. This is a real conflict.`, quoteIds: [q.id] });
      } else {
        push({ code: "COHORT_DIFFERENCE", severity: "info", message: `${q.id} gives ${qm.value}${unitSuffix(qm.unit)} for ${SCOPE_LABEL[qm.scope].toLowerCase()}, ${qm.period}. Different ${qm.scope === claim.scope ? "period" : "scope"}, so this is not a contradiction.`, quoteIds: [q.id] });
      }
    }
  }
  return out;
}

export function unitSuffix(u: string): string {
  return u === "%" ? "%" : ` ${u}`;
}

export function needsReview(claim: Claim, findings: Finding[]): boolean {
  return claim.keyThesis || findings.some((f) => f.severity !== "info");
}
