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
- Integration of Google Gemini 2.5 Flash API as backend LLM for level compilation and answer grading.
- Split-stage background compilation (Phase 1 immediate compile, Phases 2 & 3 compiled in background with self-healing states) implemented in [useCombatController.ts](file:///c:/Users/Lleyton%20Flores/Desktop/Work/Hackathons/FEU-ACM-TechSprint/ACMHackathon/src/controllers/useCombatController.ts).
- PDF.js Worker initialization resolved using Vite's native URL constructor.
- UI changes merged on `UIChange` branch with teammate's Pokemon-style side-by-side sprite battle screen design.
- Local TypeScript builds pass successfully (`npx tsc --noEmit` returns 0 errors).

In progress:
- Manual testing of the document upload and gameplay loop on the local dev server.

Blocked:
- None. (Supabase integrations and Deepgram speech credentials will be set up in subsequent stages).

## Last Meaningful Changes
- Refactored `useCombatController.ts`, `types.ts`, and `CombatScreen.tsx` to shift backend from local Ollama (Phi-3) to Google Gemini 2.5 Flash API.
- Implemented background thread generation for secondary/tertiary levels to solve local model latency.
- Upgraded layout in `CombatScreen.tsx` to support teammate's updated Pokemon-style battle arena screen design.

## Risks or Stale Facts
- The Gemini API Key is stored in `.env` as `VITE_GEMINI_API_KEY`, which is locally ignored. Teammates need this key defined in their local `.env` files.

## Verification Gaps
- Speech input validation and Deepgram audio export functions are implemented theoretically; full end-to-end sandbox testing of stutter detection awaits integration.

## Next Focus
1. User to manually verify upload and combat loop logic on `http://localhost:5173/`.
2. Stage and commit the modified controller, model, and view files.
3. Integrate real-time speech validation via Deepgram.

## Closeout Checklist

- [x] Add major durable decisions to `context/DECISIONS.md`.
- [x] Update `context/PROJECT_GUIDE.md` if stable project rules changed.
- [x] Update `README.md` if public setup, usage, or behavior changed.
- [x] Remove or correct stale facts in touched files.
- [x] Replace duplicated durable facts with pointers to the owning file.
- [x] Scan for repeated high-risk facts such as repo URLs, release names, version numbers, dataset counts, environment paths, current status, public/private rules, and submission wording.
- [x] Record only the next useful state here, not a full session diary.
- [x] Verify with the lightest meaningful check and note any gaps.
