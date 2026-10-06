import { IDENTIFIERS } from "../data/project";

export interface RedactionRule {
  term: string;
  replacement: string;
}

export const RESIDUAL_RISK_WARNING =
  "Redaction here is exact string replacement of the identifiers you selected. It does not find misspellings, nicknames, indirect identifiers (job title plus employer plus dates can still identify someone), or anything you did not select. A person must read the preview before sharing. This is not anonymisation and not a compliance or MNPI review.";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function rulesFor(selected: string[], custom: string[]): RedactionRule[] {
  const known = IDENTIFIERS.filter((i) => selected.includes(i.term)).map((i) => ({ term: i.term, replacement: i.replacement }));
  const extra = custom.map((t) => t.trim()).filter(Boolean).map((t) => ({ term: t, replacement: "[REDACTED]" }));
  // Longest first so "Helena Marsh" wins over "Helena".
  return [...known, ...extra].sort((a, b) => b.term.length - a.term.length);
}

export function redact(text: string, rules: RedactionRule[]): { text: string; count: number } {
  let count = 0;
  let out = text;
  for (const r of rules) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(r.term)}(?![\\p{L}\\p{N}])`, "gu");
    out = out.replace(re, () => {
      count++;
      return r.replacement;
    });
  }
  return { text: out, count };
}

/** Selected terms that still appear after redaction (should be none). */
export function residualHits(text: string, rules: RedactionRule[]): string[] {
  return rules.filter((r) => text.includes(r.term)).map((r) => r.term);
}
