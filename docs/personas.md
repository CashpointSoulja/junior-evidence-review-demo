# Hypothesis personas

**Status: hypotheses, not research findings.** I have not interviewed anyone in these roles for this project. The personas come from three public sources: Junior's site, Junior's London Senior PM job description, and general knowledge of how buy-side commercial due diligence is run. Each persona ends with the assumption that would most change the product if it turned out wrong. The [discovery plan](discovery-plan.md) explains how each one would be tested.

## P1. Deal-team associate (primary user)

- **Context (assumed):** At a mid-market PE fund. Runs 4 to 8 expert calls a week on one or two live deals, then writes the expert-call section of an IC memo or commercial due diligence update.
- **Job:** Turn several calls into claims they can defend, under time pressure ([JTBD](JTBD.md)).
- **Pain (assumed):** Checking claims against transcripts by hand is slow and gets skipped. "Experts agree" sometimes rests on one call. Figures from one customer get generalised to the whole base.
- **What they need from the product:** A source one click away, a clear verdict on each claim, and a gate that stops them handing off a brief they would be embarrassed by.
- **Riskiest assumption:** That associates will review claim by claim instead of skimming. If they won't, the gate becomes a box-ticking step and value moves to auto-flagging only.

## P2. VP / deal lead (reviewer and buyer of the outcome)

- **Context (assumed):** Reads the synthesis before IC. Cares whether the evidence holds up and whether conflicts are surfaced, not about the tool.
- **Job:** Trust a brief without re-listening to calls.
- **Pain (assumed):** Discovering at IC that an "expert consensus" was one voice, or that a figure came from another segment.
- **What they need from the product:** A status they can trust ("handoff-ready" means checked against cited quotes) and visible open gaps.
- **Riskiest assumption:** That a VP values an explicit "ready" state more than speed. If not, the gate must be optional, with blockers shown as warnings.

## P3. Research or knowledge manager (pilot sponsor)

- **Context (assumed):** Owns the expert-network budget and the firm's research library (in Junior's terms, Alexandria).
- **Job:** Get more decision value from each paid call and keep the library clean.
- **Pain (assumed):** Follow-up calls are booked without a clear gap to close, and unverified claims spread into later deals.
- **What they need from the product:** Gap-driven follow-up guides, plus metrics with honest denominators ([metrics](metrics.md)).
- **Riskiest assumption:** That follow-up guides tied to gaps change which calls get booked. If not, the guide is a convenience, not a lever.

## P4. Compliance reviewer (gatekeeper, not a daily user)

- **Context (assumed):** Approves expert-network use and checks for MNPI and personal data before material leaves the deal team.
- **Need:** No false assurances. Redaction must be shown as what it is.
- **What the product does for them:** Shows an exact-string redaction preview with a residual-risk warning, and states that it does no compliance or MNPI review ([risk](risk-privacy-mnpi.md)).
- **Riskiest assumption:** That a preview plus acknowledgement is acceptable at all. A firm may require redaction inside its own controlled systems only.

## Non-personas

These are out of scope for v1: expert networks, the experts themselves, and portfolio-company operators.
