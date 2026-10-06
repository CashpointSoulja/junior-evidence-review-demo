import { checkClaim, needsReview } from "./checks";
import type { AppState, Claim } from "./types";

export interface Blocker {
  claimId: string | null;
  kind: "citation" | "review" | "rejected" | "empty";
  message: string;
}

export type ReadinessStatus = "blocked" | "ready_to_approve" | "approved" | "changed_since_approval";

export function blockers(claims: Claim[]): Blocker[] {
  const included = claims.filter((c) => c.included);
  const out: Blocker[] = [];
  if (included.length === 0) out.push({ claimId: null, kind: "empty", message: "The brief has no included claims." });
  for (const c of included) {
    const f = checkClaim(c);
    for (const b of f.filter((x) => x.severity === "blocking")) out.push({ claimId: c.id, kind: "citation", message: `${c.id}: ${b.message}` });
    if (c.review.status === "unreviewed" && needsReview(c, f)) {
      out.push({ claimId: c.id, kind: "review", message: `${c.id}: required review not done${c.keyThesis ? " (key thesis claim)" : ""}.` });
    }
    if (c.review.status === "disputed" || c.review.status === "insufficient") {
      out.push({ claimId: c.id, kind: "rejected", message: `${c.id}: marked ${c.review.status}. Edit the claim or exclude it from the brief.` });
    }
  }
  return out;
}

/** Stable fingerprint of what the approver saw; any later change invalidates approval. */
export function fingerprint(claims: Claim[]): string {
  const basis = claims
    .filter((c) => c.included)
    .map((c) => [c.id, c.text, c.scope, c.generality, c.citations.join(","), c.claimedMetric ? JSON.stringify(c.claimedMetric) : "", c.review.status].join("|"))
    .join("\n");
  let h = 2166136261;
  for (let i = 0; i < basis.length; i++) {
    h ^= basis.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function readiness(state: AppState): { status: ReadinessStatus; blockers: Blocker[] } {
  const b = blockers(state.claims);
  if (b.length) return { status: state.approval ? "changed_since_approval" : "blocked", blockers: b };
  if (!state.approval) return { status: "ready_to_approve", blockers: [] };
  const current = state.approval.valid && state.approval.fingerprint === fingerprint(state.claims);
  return { status: current ? "approved" : "changed_since_approval", blockers: [] };
}
