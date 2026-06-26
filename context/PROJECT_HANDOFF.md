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
- **Dynamic Hints & styled Prompts**: Implemented `useHintController.ts` which generates styled open-ended questions based on the active professor's personality (Reyes is mean/demanding, Santos is kind, etc.) and calls the AI provider to generate RAG-supported hints that append directly to the courtroom log.
- **Controller-per-Feature Architecture**: Added independent hooks `useDocumentController`, `useGradingController`, `useEvidenceController`, `useProfileController`, `useScheduleController`, and `useHintController` to isolate core logic without touching UI `.tsx` screens.
- **Controller Screen Connections**: Connected `useEvidenceController`, `useProfileController`, and `useScheduleController` directly into `EvidenceScreen.tsx`, `ProfileScreen.tsx`, and `ScheduleScreen.tsx` to drive stats, level progression, and evidence items from active hook states.
- **Supabase SSR Helpers**: Configured `utils/supabase/server.ts`, `utils/supabase/client.ts`, and `utils/supabase/middleware.ts` for cookie-based session management, as well as Next.js page template in `page.tsx` and `.env.local` parameters.
- **Prisma Integration**: Installed `prisma` and `@prisma/client`, and initialized `prisma/schema.prisma` mapping database tables `StudentProfile`, `TopicScore`, `LevelProgress`, and `SpeechRecord` pointing to Supabase PostgreSQL database via `DATABASE_URL` env variable.
- **Stutter Removal**: Completely deleted filler warnings and stutter penalties from the combat loop and evaluation pipelines. Replaced stutter ratio tracking on the user profile screen with a dynamic win-rate metric.
- **JSON Grading Config**: Created `src/data/gradingConfig.json` which externalizes system instructions, passing thresholds, default damage variables, and fallback keyword arrays out of typescript code files.
- **GISADO KA Defeat Display**: Implemented a bold, neo-brutalist bright-red box notification overlay when player health is depleted, prompting the player to restart their defense.
- **Build Cleanliness**: App compiles and builds successfully via `npm run build` (tsc and Vite bundle generation complete with zero errors).

In progress:
- None.

Blocked:
- None.

## Last Meaningful Changes
- Removed filler warning logic, stutter statistics, and ASR penalty parameters across combat screens, profile pages, and grading controllers.
- Created `gradingConfig.json` configuration and linked it to the grading pipeline.
- Added huge red defeat banner "GISADO KA!" on player defeat in `CombatScreen.tsx`.

## Risks or Stale Facts
- If running Ollama, embeddings are not generated natively, so the RAG pipeline automatically falls back to keyword similarity ranking (tested and operational).

## Verification Gaps
- Real-time Deepgram speech transcription needs integration with the mock microphone recording state.

## Next Focus
1. Continue fine-tuning personalized professor hint structures.
