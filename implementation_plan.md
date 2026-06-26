# ProsesoAI — Gemini 2.5 RAG Implementation Plan

## Current State

| Area | Current | Target |
|------|---------|--------|
| AI Backend | Ollama (`phi3`) via local proxy | **Gemini 2.5 Flash** via `@google/generative-ai` SDK |
| Document Processing | PDF text extraction → single Ollama call | PDF extraction → **RAG chunking** → Gemini embeddings + generation |
| Grading | Ollama call with fallback keyword matching | **Gemini RAG** grading against document context |
| Controllers | `useAppController`, `useCombatController` | Add **4 new controllers** (see below) |
| UI | Pixel-art battle theme | **NO CHANGES** |

## Architecture: Controller-per-Feature

```
src/
├── controllers/
│   ├── useAppController.ts          (exists — routing)
│   ├── useCombatController.ts       (exists — refactor to use Gemini)
│   ├── useDocumentController.ts     (NEW — upload, parse, chunk, embed)
│   ├── useGradingController.ts      (NEW — RAG-based defense evaluation)
│   ├── useEvidenceController.ts     (NEW — evidence deck state management)
│   ├── useProfileController.ts      (NEW — student profile + adaptive tracking)
│   └── useScheduleController.ts     (NEW — level map progression logic)
├── lib/
│   ├── supabaseClient.ts            (exists)
│   └── geminiClient.ts              (NEW — Gemini SDK singleton)
├── models/
│   └── types.ts                     (extend with new controller contracts)
```

## Implementation Steps

### Step 1: Install Gemini SDK + Add API Key

- Install `@google/generative-ai`
- Add `VITE_GEMINI_API_KEY` to `.env`
- Create `src/lib/geminiClient.ts` — exports singleton model instances

### Step 2: `geminiClient.ts` — Core RAG Engine

- Initialize Gemini 2.5 Flash model
- Expose `generateContent()` and `embedContent()` helpers
- All AI calls go through this module (single source of truth)

### Step 3: `useDocumentController.ts` — Upload & RAG Pipeline

**Responsibility:** File upload → text extraction → chunking → embedding → level compilation

- Extract text from PDF (reuse existing `pdfjs-dist` logic)
- Chunk text into ~500-token segments with overlap
- Send chunks + system prompt to Gemini for structured JSON level generation
- Store chunks in memory for RAG retrieval during grading

### Step 4: `useGradingController.ts` — RAG-Based Defense Evaluation

**Responsibility:** Take student's defense input → retrieve relevant chunks → grade with Gemini

- Accept defense text + current phase context
- Retrieve top-K relevant chunks from the document (cosine similarity on embeddings)
- Send retrieved context + defense to Gemini for grading
- Return structured `TurnFeedback` with grade, feedback, and stutter penalty
- Fallback to keyword matching if API fails

### Step 5: Refactor `useCombatController.ts`

- Remove inline Ollama `fetch()` calls
- Consume `useDocumentController` for level compilation
- Consume `useGradingController` for defense submission
- Keep all HP/phase/turn state logic intact
- **No changes to what it exposes to the view**

### Step 6: `useEvidenceController.ts`

**Responsibility:** Manage the evidence deck dynamically

- Track which evidence cards are collected/proven/disputed
- Sync evidence from generated `LevelData`
- Expose state for `EvidenceScreen` to consume (replace hardcoded list)

### Step 7: `useProfileController.ts`

**Responsibility:** Student adaptive learning profile

- Track strong/weak areas based on grading history
- Track preferred language style, level, daily streak
- Persist to localStorage (or Supabase later)
- Expose state for `ProfileScreen` to consume (replace hardcoded stats)

### Step 8: `useScheduleController.ts`

**Responsibility:** Level progression map

- Track completed/active/locked levels
- Unlock next level when current is beaten
- Persist progression to localStorage
- Expose state for `ScheduleScreen` to consume (replace hardcoded levels)

### Step 9: Update `models/types.ts`

- Add controller contracts for all new controllers
- Add `DocumentChunk`, `StudentProfile`, `LevelProgress` types

### Step 10: Remove Ollama Proxy from Vite Config

- Remove `/api-ollama` proxy from `vite.config.ts`

## Execution Order

1. **Step 1** → Install + env setup
2. **Step 2** → Gemini client
3. **Step 3** → Document controller
4. **Step 4** → Grading controller
5. **Step 5** → Refactor combat controller
6. **Step 6–8** → Evidence, Profile, Schedule controllers
7. **Step 9** → Types cleanup
8. **Step 10** → Remove Ollama config

> [!IMPORTANT]
> All changes are **implementation-only**. No `.tsx` view files will be modified — controllers expose the exact same interface the views already consume.
