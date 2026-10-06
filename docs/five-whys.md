# Five Whys

Starting point (from Junior's public writing): errors in transcripts or synthesis can introduce false claims into downstream research.

1. **Why would a false claim reach a partner or client?** Because the synthesis step turns many calls into a few confident sentences, and the person reading the sentence cannot see the quote behind it.
2. **Why can't they see it?** Citations show *that* a source exists, not whether it matches the claim's figure, segment and period, or whether another expert disagreed.
3. **Why isn't that checked before handoff?** Re-reading three to ten transcripts per claim is slow (assumed), and the deadline is the next meeting, so checking is skipped or done for the headline claims only.
4. **Why is it slow?** Comparison is manual: the analyst must remember who said what, in which cohort, and spot that 12% "for one firm" is not the same as 12% "across the board".
5. **Why manual?** The evidence isn't held as structured, comparable records (ID, cohort, scope, unit, period) tied to each claim, so no tool can tell a real contradiction from a cohort difference.

**Root cause to test:** claims and quotes aren't linked as comparable, structured records with a required human decision at handoff.

**This increment's response:** structure the evidence, run deterministic comparisons, require a decision on the risky claims, and turn what's left into the next call's guide.

The causal chain is a hypothesis. Steps 3 and 4 in particular need confirming in discovery ([discovery-plan.md](discovery-plan.md)).
