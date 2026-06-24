---
context_role: core
owner: decisions
read_when: durable choice, architecture, public/private posture, repeated workflow, or conflict between docs
stability: stable
update_mode: append_entries
---

# DECISIONS.md

Record public-safe decisions that affect future work.

The reason behind a decision is as important as the decision itself. Use this file to help teammates and AI tools avoid reopening settled debates without context.

Do not log brainstorming, temporary ideas, routine edits, credentials, private personal details, internal strategy, or observations that do not change future work.

Do not edit accepted entries. If a decision changes, write a new entry and mark the old one as superseded.

Keep decisions focused on the decision, rationale, tradeoffs, and consequences. If setup commands, current status, public usage, or private workflow details are owned elsewhere, reference the owning file instead of copying those details here.

## Entry Template

```md
### YYYY-MM-DD - Short Decision Title

Decision:

Why:

Alternatives considered:

Consequences:
- Positive:
- Negative:
- Risks:

Supersedes: <!-- YYYY-MM-DD [title] or N/A -->

Status: <!-- active | superseded by YYYY-MM-DD [title] | deprecated -->

References:
```

Use `References` to point to owner files instead of duplicating their content.

## Decisions

### YYYY-MM-DD - Initial Project Direction

Decision:

Why:

Alternatives considered:

Consequences:
- Positive:
- Negative:
- Risks:

Supersedes: N/A

Status: active

References:
