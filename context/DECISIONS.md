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

### 2026-06-26 - Integration of Google Gemini 2.5 Flash API and Split-Stage Compilation

Decision:
We upgraded the backend from local Ollama (running Phi-3) to the Google Gemini 2.5 Flash API via cloud calls, secured with a local `VITE_GEMINI_API_KEY` stored in `.env`. To address latency and truncation issues during full-document level compilation, we designed and implemented a **Split-Stage Compilation** pattern in `useCombatController.ts`:
1. **Immediate Stage (Phase 1):** Compiles the first phase of the level instantly and feeds it to the frontend, allowing the user to start playing and interacting immediately.
2. **Background Stage (Phases 2 & 3):** Initiates background compilation of the remaining level phases simultaneously. While compiling, a subtle progress indicator/loading system handles the background state. If a user reaches subsequent phases before the background generation completes, a dedicated loading overlay blocks input until completion.

Why:
Local Ollama generation was highly latency-heavy and frequently truncated response outputs when parsing larger documents, causing JSON parsing errors on the client. Upgrading to Google Gemini 2.5 Flash via a secure API key enables high-speed, JSON-constrained formatting (using `responseMimeType: "application/json"`). The split-stage generation design ensures zero-latency starts for players, keeping the UI highly responsive while resolving long processing times for multi-phase level files.

Alternatives considered:
- Running smaller local models: Rejected due to poor parsing of complex syllabus/lecture notes.
- Synchronously generating all phases: Rejected because waiting 10-15 seconds for a full 3-phase level to compile degrades the user experience.

Consequences:
- Positive: Instant UI transitions, robust JSON validation, and fluid player interaction.
- Negative: Requires an active Internet connection and a Gemini API key.
- Risks: If the API key is missing or calls fail, a fallback/self-healing state is triggered to degrade gracefully.

Supersedes: N/A

Status: active

References: [useCombatController.ts](file:///c:/Users/Lleyton%20Flores/Desktop/Work/Hackathons/FEU-ACM-TechSprint/ACMHackathon/src/controllers/useCombatController.ts), [CombatScreen.tsx](file:///c:/Users/Lleyton%20Flores/Desktop/Work/Hackathons/FEU-ACM-TechSprint/ACMHackathon/src/pages/CombatScreen.tsx), [types.ts](file:///c:/Users/Lleyton%20Flores/Desktop/Work/Hackathons/FEU-ACM-TechSprint/ACMHackathon/src/models/types.ts)

