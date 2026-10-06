import { COHORT_LABEL, QUESTIONS } from "../data/project";
import type { Gap, GapType, Guide, GuideItem } from "./types";

// Fixed templates. Placeholders are filled from gap fields only; there is no model call.
export const TEMPLATES: Record<GapType, { id: string; text: string }[]> = {
  CONFLICT: [
    { id: "T-CONFLICT-1", text: "We have heard different figures for {subject}. From what you saw directly, what was it, and what is that figure based on?" },
    { id: "T-CONFLICT-2", text: "Did {subject} vary by firm size, contract type or region? If so, how?" },
  ],
  NO_EVIDENCE: [{ id: "T-NOEVID-1", text: "How would you describe {subject}? What would you look at to judge it?" }],
  UNRESOLVED_REVIEW: [{ id: "T-UNRES-1", text: "What, if anything, do you know first-hand about {subject}? How confident are you, and why?" }],
  SCOPE: [{ id: "T-SCOPE-1", text: "Does what you have seen on {subject} apply to all firm sizes, or mainly to particular segments?" }],
  COHORT_LIMITED: [{ id: "T-COHORT-1", text: "From your position as a {cohort}, how would you describe {subject}?" }],
  SINGLE_SOURCE: [{ id: "T-SINGLE-1", text: "How does your experience of {subject} compare with what is typical, as far as you know?" }],
};

export const LEADING_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b(don't|wouldn't|isn't|aren't|didn't) you (think|agree)\b/i, reason: "asks the expert to agree" },
  { pattern: /\b(surely|obviously|clearly|of course)\b/i, reason: "presumes the answer" },
  { pattern: /\bconfirm that\b/i, reason: "asks for confirmation instead of evidence" },
  { pattern: /\b(how bad|how great|how much better|how much worse)\b/i, reason: "embeds a judgement" },
  { pattern: /\bright\?\s*$/i, reason: "tag question invites agreement" },
];

export function leadingIssues(text: string): string[] {
  return LEADING_PATTERNS.filter((p) => p.pattern.test(text)).map((p) => p.reason);
}

export function fillTemplate(template: string, gap: Gap): string {
  const q = QUESTIONS.find((x) => x.id === gap.topic)!;
  return template
    .replace(/\{subject\}/g, q.subject)
    .replace(/\{cohort\}/g, gap.targetCohort ? COHORT_LABEL[gap.targetCohort].toLowerCase() : "participant");
}

export function itemsForGap(gap: Gap): GuideItem[] {
  return TEMPLATES[gap.type].map((t) => ({
    id: `${gap.id}:${t.id}`,
    gapId: gap.id,
    topic: gap.topic,
    targetCohort: gap.targetCohort ?? null,
    templateId: t.id,
    text: fillTemplate(t.text, gap),
    origin: "template" as const,
  }));
}

/** Build a guide from gaps; keeps existing edited/manual items and adds templates for new gaps. */
export function buildGuide(gaps: Gap[], existing: Guide | null, now: string): Guide {
  const items = existing ? [...existing.items] : [];
  const have = new Set(items.map((i) => i.id));
  for (const g of gaps) for (const it of itemsForGap(g)) if (!have.has(it.id)) items.push(it);
  return { createdAt: existing?.createdAt ?? now, items };
}

export function editItem(guide: Guide, id: string, text: string): Guide {
  return { ...guide, items: guide.items.map((i) => (i.id === id ? { ...i, text, origin: i.origin === "manual" ? "manual" : "edited" } : i)) };
}

export function moveItem(guide: Guide, id: string, dir: -1 | 1): Guide {
  const items = [...guide.items];
  const i = items.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= items.length) return guide;
  [items[i], items[j]] = [items[j], items[i]];
  return { ...guide, items };
}
