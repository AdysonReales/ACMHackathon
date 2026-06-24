---
context_role: core
owner: project_rules
read_when: always
stability: stable
update_mode: edit_in_place
---

# PROJECT_GUIDE.md

Stable project context for teammates and AI tools.

Keep this file short. Update or remove obsolete rules instead of adding competing ones.

## Project Snapshot

- Project:
- Users:
- Goal:
- Current stage:
- Primary repository/app:
- Non-goals:

## Tech Stack

- Language(s):
- Frontend:
- Backend:
- Database:
- Infrastructure:
- Key dependencies:

## Commit Format

- Convention: (e.g. `feat: ...`, `fix: ...`, `chore: ...` — or leave blank if no format required)

## Source Order

When files conflict, trust the highest source and fix the stale lower one:

1. `context/PROJECT_GUIDE.md` - stable project context and collaboration rules
2. `context/DECISIONS.md` - durable decisions and rationale
3. `context/PROJECT_HANDOFF.md` - current state, risks, and next focus
4. `context/UI.md` - visual design system when UI exists
5. `context/TEAM_INTERNAL.md` - private workflow and repository safety
6. `README.md` - public setup and usage
7. Other project documentation

## Context Routing

Use frontmatter in `context/*.md` for progressive disclosure:

```sh
python3 scripts/context_map.py
```

Read file bodies only when `read_when` matches the task. Frontmatter routes attention; Markdown bodies remain the source of truth.

## Working Protocol

For tiny tasks, read only what the task needs. For substantial work:

1. Read this file.
2. Run `python3 scripts/context_map.py` or skim frontmatter.
3. Read `context/DECISIONS.md` for durable choices.
4. Read `context/PROJECT_HANDOFF.md` for current state.
5. Read `context/UI.md` only for frontend or visual work.
6. Read `context/TEAM_INTERNAL.md` only for private workflow, public release safety, deployment coordination, or private context syncing.
7. Inspect relevant files before acting.

Ask before acting when assumptions affect architecture, deletion, credentials, production, billing, privacy, public/private exposure, broad refactors, dependencies, or user-visible behavior.

## Editing Rules

- Resolve low-risk ambiguity by inspecting files; ask when remaining ambiguity is risky.
- Make the smallest useful change and prefer existing project patterns.
- Do not invent project facts, APIs, dependencies, deadlines, or team decisions.
- Do not overwrite teammate changes to make your own work easier.
- Update docs only when the change affects future work.
- Before editing context files, name the owner for each fact.
- Keep each fact in one owner file; use pointers instead of duplicate explanations.

## Verification

Use the lightest check that proves the work enough for its risk.

- Trivial wording or pointer edits: readback or targeted `rg` is enough.
- Context/routing edits: run `python3 scripts/context_map.py --check`.
- Code or behavior changes: run the narrow relevant test, lint, build, or manual check.
- Broad or high-risk changes: use stronger verification and record gaps.

Do not run expensive checks just to satisfy a ritual. If a useful check is skipped to save time or tokens, say so briefly in `PROJECT_HANDOFF.md` or the final note.

## Context Ownership

- Stable project rules and source order: `context/PROJECT_GUIDE.md`
- Durable decisions and rationale: `context/DECISIONS.md`
- Current state, blockers, verification gaps, and next focus: `context/PROJECT_HANDOFF.md`
- Visual design system: `context/UI.md`
- Private workflow and repository safety: `context/TEAM_INTERNAL.md`
- Public setup and usage: `README.md`
- Secrets and credentials: never commit; use local environment files or secret managers

## Session Close

Before ending meaningful work:

1. Update the owning context file for durable facts, or leave it unchanged if no durable fact changed.
2. Move major decisions to `context/DECISIONS.md`.
3. Replace `context/PROJECT_HANDOFF.md` with only current state, risks, gaps, and next focus.
4. Remove stale duplicated facts in touched files.
5. Run only the lightest meaningful verification and note skipped checks when relevant.

## Boundaries

Allowed:

- Edit context files, README, scripts, and AI adapter files
- Add project-specific rules after ownership is clear

Avoid:

- Duplicating facts across context files
- Turning `PROJECT_HANDOFF.md` into a history log
- Adding tool-specific automation without a verification path
- Copying setup, status, public/private, or credential rules into multiple files

Requires confirmation:

- Destructive commands, broad refactors, dependency changes, public/private exposure changes, production/billing changes, credential handling changes, or scope expansion
