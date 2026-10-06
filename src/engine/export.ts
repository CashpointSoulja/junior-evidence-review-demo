import { CALL_BY_ID, COHORT_LABEL, PROJECT, QUESTIONS, QUOTE_BY_ID, SCOPE_LABEL } from "../data/project";
import { checkClaim } from "./checks";
import { computeGaps } from "./gaps";
import { readiness } from "./readiness";
import { redact, RESIDUAL_RISK_WARNING, rulesFor } from "./redact";
import type { AppState } from "./types";

export const SYNTHETIC_LABEL = "SYNTHETIC DEMO DATA: fictional companies, people and figures. Not from real expert calls.";
export const NO_ASSURANCE =
  "This brief is a review aid. It is not investment advice, not a recommendation, and not a compliance, MNPI or legal review.";
export const AFFILIATION = "Independent concept by Ayo Ahmed, not affiliated with Junior AI.";

export function sourceLink(baseUrl: string, quoteId: string): string {
  return `${baseUrl}#/source/${encodeURIComponent(quoteId)}`;
}

/** Neutralise characters that would turn data into Markdown/HTML structure in other viewers. */
export function mdText(s: string): string {
  return s.replace(/[<>]/g, (ch) => (ch === "<" ? "&lt;" : "&gt;")).replace(/\r?\n/g, " ");
}

export function buildExport(state: AppState, baseUrl: string, now: string): string {
  const r = readiness(state);
  const status =
    r.status === "approved" ? `HANDOFF-READY (approved ${state.approval!.at})` :
    r.status === "changed_since_approval" ? "DRAFT: changed since approval, re-approval needed" :
    r.status === "ready_to_approve" ? "DRAFT: checks pass, not yet approved" :
    `DRAFT: NOT HANDOFF-READY (${r.blockers.length} blocker${r.blockers.length === 1 ? "" : "s"})`;
  const L: string[] = [];
  L.push(`# ${PROJECT.code}: evidence brief and follow-up guide`, "");
  L.push(`> ${SYNTHETIC_LABEL}`, `> ${NO_ASSURANCE}`, `> ${AFFILIATION}`, "");
  L.push(`- Status: ${status}`, `- Target (synthetic): ${PROJECT.target}. ${PROJECT.sector}.`, `- Exported: ${now}`, "");
  if (r.blockers.length) {
    L.push("## Open blockers", "");
    for (const b of r.blockers) L.push(`- ${mdText(b.message)}`);
    L.push("");
  }
  L.push("## Claims", "");
  for (const q of QUESTIONS) {
    const claims = state.claims.filter((c) => c.topic === q.id && c.included);
    if (!claims.length) continue;
    L.push(`### ${q.question}`, "");
    for (const c of claims) {
      L.push(`- **${c.id}** [${c.review.status}] ${mdText(c.text)}`);
      L.push(`  - Scope: ${SCOPE_LABEL[c.scope]}${c.claimedMetric ? `; figure ${c.claimedMetric.value}${c.claimedMetric.unit === "%" ? "%" : ` ${c.claimedMetric.unit}`} (${c.claimedMetric.period})` : ""}`);
      if (c.review.note) L.push(`  - Reviewer note: ${mdText(c.review.note)}`);
      for (const id of c.citations) {
        const quote = QUOTE_BY_ID.get(id);
        if (!quote) { L.push(`  - Source ${mdText(id)}: NOT FOUND`); continue; }
        const call = CALL_BY_ID.get(quote.callId)!;
        L.push(`  - Source ${quote.id} · ${call.id} · ${call.date} · ${quote.ts} · ${COHORT_LABEL[call.cohort]} · ${SCOPE_LABEL[quote.scope]}: "${mdText(quote.text)}" (${sourceLink(baseUrl, quote.id)})`);
      }
      for (const f of checkClaim(c)) L.push(`  - Check ${f.code} (${f.severity}): ${mdText(f.message)}`);
      if (c.history.length > 1) L.push(`  - Edit history: ${c.history.map((h) => `v${h.v} ${mdText(h.detail)}`).join("; ")}`);
    }
    L.push("");
  }
  const excluded = state.claims.filter((c) => !c.included);
  if (excluded.length) {
    L.push("## Excluded claims (not in brief)", "");
    for (const c of excluded) L.push(`- ${c.id}: ${mdText(c.text)} [${c.review.status}]`);
    L.push("");
  }
  L.push("## Diligence gaps", "");
  const gaps = computeGaps(state.claims);
  if (!gaps.length) L.push("- None open.");
  for (const g of gaps) L.push(`- ${g.id} (${g.type}): ${g.title}. ${g.detail}${g.quoteIds.length ? ` Sources: ${g.quoteIds.join(", ")}` : ""}`);
  L.push("");
  L.push("## Follow-up interview guide", "", "Template-based: questions are filled from fixed templates using the gap fields above, then edited by the analyst. No model generated them.", "");
  if (!state.guide || !state.guide.items.length) L.push("- No guide generated.");
  else state.guide.items.forEach((it, i) => L.push(`${i + 1}. ${mdText(it.text)} _(${it.gapId ?? "manual"}${it.targetCohort ? `; ask a ${COHORT_LABEL[it.targetCohort].toLowerCase()}` : ""}; ${it.origin})_`));
  L.push("");
  const rules = rulesFor(state.redactions, state.customRedactions);
  L.push("## Redaction", "", rules.length ? `Applied to this export: ${rules.length} selected identifier${rules.length === 1 ? "" : "s"} (terms withheld).` : "No identifiers selected. Names and contact details appear as written.", "", `Residual risk: ${RESIDUAL_RISK_WARNING}`, "");
  L.push("---", SYNTHETIC_LABEL, AFFILIATION, "");
  const body = L.join("\n");
  return rules.length ? redact(body, rules).text : body;
}
