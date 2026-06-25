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

