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
- "The active game architecture decision is in `context/DECISIONS.md`."
- "Current Y2K design tokens are in `context/UI.md`."

## Current State

Working:
- Architecture choice finalized: Mobile-responsive turn-based Web App (React + Vite + TypeScript).
- UI design tokens, 80-10-5-5 layout scaling principles, and game rules locked down in `context/UI.md`.
- Art assets pipeline configured to point exclusively to the absolute directory path `/assets/sprites/`.

In progress:
- Creating the core directory skeleton and setting up local system files.

Blocked:
- Generation of live API access configurations (Supabase endpoints and Deepgram credentials) to insert inside the upcoming secure `.env.local` file.

## Last Meaningful Changes
- Abandoned the Google Chrome Extension concept to pursue a high-performance web dashboard layout to better scale on touchscreens and accommodate low-bandwidth constraints.

## Risks or Stale Facts
- Native browser constraints require active secure contexts (`https://` or `localhost`) for microphone recording arrays to capture speech streams successfully on targeted mobile platforms.

## Verification Gaps

- Integration with real-time continuous streaming arrays via Deepgram has only been structured theoretically; data payload feedback under variable network connectivity hasn't been simulated.

## Next Focus

1. Initialize the Vite React workspace engine and integrate Tailwind CSS configs.
2. Deliver the initial base pixel-art character sheets and template elements into `/assets/sprites/`.
3. Scaffold the main turn state machine interface component (`CombatScreen.tsx`) executing the double-bezel containment structure.

## Closeout Checklist

- [x] Add major durable decisions to `context/DECISIONS.md`.
- [x] Update `context/PROJECT_GUIDE.md` if stable project rules changed.
- [x] Update `README.md` if public setup, usage, or behavior changed.
- [x] Remove or correct stale facts in touched files.
- [x] Replace duplicated durable facts with pointers to the owning file.
- [x] Scan for repeated high-risk facts such as repo URLs, release names, version numbers, dataset counts, environment paths, current status, public/private rules, and submission wording.
- [x] Record only the next useful state here, not a full session diary.
- [x] Verify with the lightest meaningful check and note any gaps.