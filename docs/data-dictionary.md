# Data dictionary

The source of truth is `src/engine/types.ts`. All data is synthetic and stored only in the browser's `localStorage` under the key `junior-evidence-review:v1` (`schema: 1`).

## Call
| Field | Type | Meaning |
|---|---|---|
| `id` | string | `CALL-A` / `CALL-B` / `CALL-C` |
| `expertName` | string | Fictional expert name (redactable) |
| `role` | string | Fictional role and employer |
| `cohort` | `former_employee` \| `customer` \| `competitor` | Why this voice is relevant |
| `date` | ISO date | Call date |
| `durationMin` | number | Call length in minutes |
| `quotes` | Quote[] | Transcript turns, in order |

## Quote
| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable ID, e.g. `QC-03` |
| `callId` | string | Parent call |
| `ts` | `hh:mm:ss` | Offset in the call |
| `speaker` | `Expert` \| `Interviewer` | Interviewer quotes cannot be evidence |
| `text` | string | Exact text, always rendered as plain text |
| `scope` | `all_customers` \| `mid_market` \| `small_firms` \| `single_firm` | Who the statement is about |
| `metric` | Metric? | Structured figure, if any |
| `hedged` | boolean? | Speaker signalled uncertainty |

## Metric / ClaimClaimedMetric
| Field | Type | Meaning |
|---|---|---|
| `key` | `grr` \| `renewal_uplift` \| `competitive_win_rate` \| `implementation_time` \| `support_response` | What is measured |
| `value` | number | Figure |
| `unit` | `%` \| `weeks` \| `days` | Unit; a unit mismatch blocks comparison |
| `period` | string | e.g. `FY2025`, `2025` |
| `scope` | Scope | Quote-side only |
| `estimate` | boolean? | Quote-side only |

## Claim
| Field | Type | Meaning |
|---|---|---|
| `id` | string | `CL-n` |
| `topic` | TopicId | Diligence question it answers |
| `text` | string | Claim wording |
| `scope` | Scope | Population the claim generalises to |
| `generality` | `single` \| `consensus` | Consensus needs 2 or more calls |
| `citations` | string[] | Quote IDs |
| `claimedMetric` | ClaimClaimedMetric? | Figure the claim asserts |
| `keyThesis` | boolean | Key-thesis claims always need review |
| `included` | boolean | Whether the claim is in the brief |
| `review` | `{status, note, at?}` | `unreviewed` \| `supported` \| `disputed` \| `insufficient` |
| `history` | ClaimVersion[] | Append-only lineage: `v`, `at`, `change`, `detail`, `text`, `citations`, `priorReview` |

## Derived (computed, not stored)
| Object | Fields | Source |
|---|---|---|
| Finding | `code`, `severity` (`blocking` \| `review` \| `info`), `claimId`, `message`, `quoteIds` | `checks.ts` |
| Gap | `id`, `type`, `topic`, `title`, `detail`, `claimIds`, `quoteIds`, `targetCohort?` | `gaps.ts` |
| Blocker | `claimId`, `kind` (`citation` \| `review` \| `rejected` \| `empty`), `message` | `readiness.ts` |
| Readiness | `blocked` \| `ready_to_approve` \| `approved` \| `changed_since_approval` | `readiness.ts` |

## Stored state
| Field | Meaning |
|---|---|
| `guide` | `{createdAt, items[]}`. Each item has `gapId`, `topic`, `targetCohort`, `templateId`, `text`, `origin` (`template` \| `edited` \| `manual`). |
| `approval` | `{at, fingerprint, valid}`. `valid` turns false on any claim change after approval. |
| `redactions`, `customRedactions` | Strings the user selected for exact replacement |
| `events` | Analytics log (below) |

## Events (local analytics)
Every event has the fields `name`, `at` (ISO), `analystId` (always `local-analyst`) and optional `props`.

| Event | Fires when | Used by metric |
|---|---|---|
| `session_started` | Seed state created (first load or reset) | Activity (any event counts toward weekly returning) |
| `final_call_ingested` | Seed state created (stands in for the last call becoming available) | Final call to handoff-ready (start) |
| `claim_reviewed` | A review is saved | Audit trail; the sourced-accepted ratio reads current claim state |
| `claim_edited` | An edit is saved | Lineage |
| `guide_created` | First guide is built (rebuilds do not fire it again) | Guides used / created (denominator) |
| `guide_used` | A guide is copied, or exported with the brief | Guides used / created (numerator) |
| `brief_approved` | Approval succeeds | Final call to handoff-ready (end); activation |
| `brief_exported` | Download or copy | Adoption signal |
| `reset` | Reset; the log restarts from the seed events | none |

Metric definitions, denominators and windows are in [metrics.md](metrics.md).
