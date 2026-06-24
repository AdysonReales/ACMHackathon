---
context_role: core
owner: handoff
read_when: session start, resume, meaningful work, or before ending work
stability: current
update_mode: replace_each_session
---

# PROJECT_HANDOFF.md

Use this at the end of a meaningful work session.

This file is for current continuity, not permanent history. Keep only what the next teammate or AI session needs to continue safely.

Before updating this file, check whether the new fact belongs in another owner. If yes, update the owner and point to it here instead of copying the details:

- Durable decision: `context/DECISIONS.md`
- Stable project rule or source order: `context/PROJECT_GUIDE.md`
- Private team process or repository safety workflow: `context/TEAM_INTERNAL.md`
- Public setup, usage, or behavior: `README.md`
- Current state, risks, and next focus only: `context/PROJECT_HANDOFF.md`

Use pointers for durable facts. Examples:

- "Repository setup is documented in `README.md`."
- "The active data-storage decision is in `context/DECISIONS.md`."
- "Current design tokens are in `context/UI.md`."

Do not copy the same repo URL, version number, dataset count, policy rule, setup command, or final wording into this file unless it is the current temporary state the next session must act on.

## Current State

Working:

- 

In progress:

- 

Blocked:

- 

## Last Meaningful Changes

- 

## Risks or Stale Facts

- 

## Verification Gaps

<!-- What wasn't checked when this session ended. Next session: don't assume these are good. -->

- 

## Next Focus

1. 
2. 
3. 

## Closeout Checklist

- Add major durable decisions to `context/DECISIONS.md`.
- Update `context/PROJECT_GUIDE.md` if stable project rules changed.
- Update `README.md` if public setup, usage, or behavior changed.
- Remove or correct stale facts in touched files.
- Replace duplicated durable facts with pointers to the owning file.
- Scan for repeated high-risk facts such as repo URLs, release names, version numbers, dataset counts, environment paths, current status, public/private rules, and submission wording.
- Record only the next useful state here, not a full session diary.
- Verify with the lightest meaningful check and note any gaps.
