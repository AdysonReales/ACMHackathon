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
### 2026-06-25 - Responsive Web App Architecture with Localized Core Game Loop

Decision:

We are building a responsive, mobile-first Web Application titled Proseso: Academic Showdown using React (Vite), TypeScript, Tailwind CSS, and Supabase. The gameplay combines a turn-based Pokémon battle state machine (HP tracking, status bars) with an Ace Attorney courtroom visual aesthetic. The system generates a single-pass static JSON level from user-uploaded documents, processes speech/text responses natively in the browser via the Deepgram API, evaluates results with a low-token client-heavy grading system, handles asset delivery through a dedicated art pipeline folder (/assets/sprites/), and streams audio/text metadata directly into Supabase.

Why:

Shifting from a Chrome Extension to a mobile-responsive web app maximizes UI delivery speed and ensures device accessibility for learners in low-bandwidth environments (Theme 2). It keeps active turn-based combat calculations client-side to eliminate server latency and keep API token usage exceptionally low, while tracking data pipelines to collect a structured Taglish speech dataset for open-source research (Theme 1).

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

### 2026-06-26 - Dual AI Provider and Controller-per-Feature Architecture

Decision:
We migrated the AI compilation and grading systems from Ollama-only to a dual-mode provider setup (supporting Gemini 2.5 Flash and local Ollama) based on environment configuration. We also introduced a controller-per-feature modular architecture with new hooks: useDocumentController (RAG chunking & vector retrieval), useGradingController (RAG-backed defense grading), useEvidenceController, useProfileController, and useScheduleController.

Why:
To support team members using different local setups (some with Ollama, some with Gemini API keys), while incorporating Gemini 2.5 RAG capabilities for contextual source-based grading. The modular controller structure isolates business logic cleanly from UI views, preventing code clutter in useCombatController.

Alternatives considered:
- Ollama-only: Discarded to support Gemini 2.5.
- Unified single-controller: Discarded because combat, schedule, profile, evidence, and RAG represent distinct domains.

Consequences:
- Positive: Developers can easily toggle backends via VITE_AI_PROVIDER. RAG improves grading precision.
- Negative: Additional configuration needed (.env file).
- Risks: Gemini API key usage billing; Ollama doesn't support vector embeddings natively (falls back to keyword-based RAG retrieval).

Supersedes: N/A

Status: active

References:
- `src/lib/aiProvider.ts`
- `src/controllers/useDocumentController.ts`
- `src/controllers/useGradingController.ts`

