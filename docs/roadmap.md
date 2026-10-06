# Roadmap and v2 (hypothesis, ordered by learning value)

**v1** is this increment. **v2** is the "Next" rows: real Junior call data, multiple reviewers, and redaction suggestions from entity recognition. v2 is gated on the pilot decision in [viability-memo.md](viability-memo.md).

| Horizon | Item | Depends on |
|---|---|---|
| v1 Now (this increment) | Deterministic checks, manual review, gate, gap queue, template guide, export with selected redaction | — |
| v2 Next (2–4 weeks) | Pull quotes and cohorts from real Junior call data; claims linked to synthesis output | Data model access; discovery D2, D8 |
| v2 Next | Multi-reviewer: analyst reviews, VP approves; comments on claims | Auth, roles |
| v2 Next | Use Junior's existing entity recognition to *suggest* identifiers for redaction (still human-selected) | Existing redaction/NER service |
| Later | Model-suggested citations and contradiction hints, always behind the same human gate, with measured precision | Evaluation set; cost budget |
| Later | Gap queue feeds directly into scheduling the next expert call and Athena interview guides | Expert-network integrations; Athena |
| Later | Approved claims saved to Alexandria with provenance, so later projects reuse checked evidence | Alexandria data model |

Not planned: automatic compliance or MNPI decisions inside this feature.
