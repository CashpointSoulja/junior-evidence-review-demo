import { CALL_BY_ID, COHORT_LABEL, QUESTIONS } from "../data/project";
import { checkClaim, resolveCitations } from "./checks";
import type { Claim, Cohort, Gap, GapType } from "./types";

const PRIORITY: GapType[] = ["CONFLICT", "NO_EVIDENCE", "UNRESOLVED_REVIEW", "SCOPE", "COHORT_LIMITED", "SINGLE_SOURCE"];

export function computeGaps(claims: Claim[]): Gap[] {
  const gaps: Gap[] = [];
  for (const q of QUESTIONS) {
    const topicClaims = claims.filter((c) => c.topic === q.id && c.included);
    const usable = topicClaims.filter((c) => c.review.status !== "disputed" && c.review.status !== "insufficient");
    const quotes = usable.flatMap((c) => resolveCitations(c).valid);
    const findings = topicClaims.flatMap(checkClaim);
    const add = (type: GapType, title: string, detail: string, extra: Partial<Gap> = {}) =>
      gaps.push({ id: `GAP-${q.id}-${type}${extra.targetCohort ? `-${extra.targetCohort}` : ""}`, type, topic: q.id, title, detail, claimIds: topicClaims.map((c) => c.id), quoteIds: [], ...extra });

    const conflicts = findings.filter((f) => f.code === "CONTRADICTION");
    if (conflicts.length) {
      add("CONFLICT", `Conflicting evidence: ${q.subject}`, "Sources give different figures for the same scope and period.", {
        claimIds: [...new Set(conflicts.map((f) => f.claimId))],
        quoteIds: [...new Set(conflicts.flatMap((f) => f.quoteIds))],
      });
    }
    if (quotes.length === 0) {
      add("NO_EVIDENCE", `No usable evidence: ${q.subject}`, topicClaims.length ? "Every claim on this question is uncited, disputed or insufficient." : "No claim in the brief addresses this question.");
    }
    const unresolved = topicClaims.filter((c) => c.review.status === "disputed" || c.review.status === "insufficient");
    if (unresolved.length) {
      add("UNRESOLVED_REVIEW", `Reviewer flagged: ${q.subject}`, `${unresolved.map((c) => `${c.id} marked ${c.review.status}`).join("; ")}.`, { claimIds: unresolved.map((c) => c.id) });
    }
    const scope = findings.filter((f) => f.code === "SCOPE_MISMATCH");
    if (scope.length) {
      add("SCOPE", `Evidence narrower than claim: ${q.subject}`, "Claims generalise beyond the segment the experts spoke about.", {
        claimIds: [...new Set(scope.map((f) => f.claimId))],
        quoteIds: [...new Set(scope.flatMap((f) => f.quoteIds))],
      });
    }
    if (quotes.length) {
      const cohorts = new Set(quotes.map((x) => CALL_BY_ID.get(x.callId)!.cohort));
      for (const need of q.requiredCohorts) {
        if (!cohorts.has(need)) {
          add("COHORT_LIMITED", `Missing ${COHORT_LABEL[need].toLowerCase()} view: ${q.subject}`, `No cited ${COHORT_LABEL[need].toLowerCase()} quote on this question yet.`, { targetCohort: need as Cohort });
        }
      }
      const calls = new Set(quotes.map((x) => x.callId));
      if (calls.size === 1) {
        add("SINGLE_SOURCE", `Single source: ${q.subject}`, `All cited evidence comes from ${[...calls][0]}.`, { quoteIds: quotes.map((x) => x.id) });
      }
    }
  }
  return gaps.sort((a, b) => PRIORITY.indexOf(a.type) - PRIORITY.indexOf(b.type));
}
