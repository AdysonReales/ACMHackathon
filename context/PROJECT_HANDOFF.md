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

## Current State

Working:
- **Dual AI Provider**: Clean abstraction implemented in `src/lib/aiProvider.ts` to seamlessly toggle between Gemini 2.5 Flash and local Ollama via environment config.
- **RAG-Backed Grading**: PDF document chunking, embedding, and cosine similarity lookup implemented. When presenting defenses, relevant context blocks are retrieved and passed to the LLM to guide grading accuracy.
- **Controller-per-Feature Architecture**: Added independent hooks `useDocumentController`, `useGradingController`, `useEvidenceController`, `useProfileController`, and `useScheduleController` to isolate core logic without touching UI `.tsx` screens.
- **Build Cleanliness**: App compiles and builds successfully via `npm run build` (tsc and Vite bundle generation complete with zero errors).

In progress:
- Connecting new controllers (`useEvidenceController`, `useProfileController`, `useScheduleController`) into their respective page views without visual design changes.

Blocked:
- None.

## Last Meaningful Changes
- Switched default LLM generation and grading pipeline from local Ollama to Gemini 2.5 Flash, while maintaining full fallback compatibility for local Ollama deployments via a simple `.env` switch.
- Fixed TypeScript compile warnings/unused variables on page views.

## Risks or Stale Facts
- If running Ollama, embeddings are not generated natively, so the RAG pipeline automatically falls back to keyword similarity ranking (tested and operational).

## Verification Gaps
- Real-time Deepgram speech transcription needs integration with the mock microphone recording state.

## Next Focus
1. Connect `useEvidenceController`, `useProfileController`, and `useScheduleController` state models directly to the view files (`EvidenceScreen.tsx`, `ProfileScreen.tsx`, `ScheduleScreen.tsx`) to supply dynamic mock details without changing any visual styling.
2. Hook up active level completion in the combat screen loop to update progress via `useScheduleController`.
