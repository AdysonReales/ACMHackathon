// ============================================================
// MODEL LAYER — Domain types, state shapes, controller contracts
// ============================================================

// ---------- Navigation ----------
export type PageId = 'combat' | 'schedule' | 'evidence' | 'profile'

// ---------- Combat Domain ----------
export interface CombatPhase {
  phase_id: number
  flawed_argument: string
  contradictory_evidence_id: string
  follow_up_prompt: string
}

export interface EvidenceCard {
  id: string
  title: string
  description_bilingual: string
  category?: 'taglish_term' | 'logic_proof' | 'dataset'
}

export interface LevelData {
  level_id: number
  professor_name: string
  professor_sprite: string
  subject?: string
  combat_phases: CombatPhase[]
  evidence_deck: EvidenceCard[]
}

// ---------- RAG Pipeline ----------
export interface DocumentChunk {
  text: string
  index: number
  embedding?: number[]
}

export type ScreenState = 'upload' | 'compiling' | 'battle' | 'victory' | 'defeat'

export interface TurnFeedback {
  type: 'success' | 'fail'
  grade: number
  message: string
}

export interface EvaluationResult {
  logic: number
  clarity: number
  poise: number
  notes: string
}

// ---------- Controller Contracts ----------

export interface AppController {
  activePage: PageId
  setActivePage: (page: PageId) => void
}

export interface CombatState {
  screen: ScreenState
  levelData: LevelData | null
  compileProgress: number
  compileError: string | null
  playerHp: number
  opponentHp: number
  currentPhaseIndex: number
  defenseInput: string
  isGrading: boolean
  isRecording: boolean
  turnFeedback: TurnFeedback | null
  screenShake: boolean
  combatLog: string[]
  waitingNextTurn: boolean
  opponentName: string
  phaseNumber: number
  totalPhases: number
  currentPhase: CombatPhase | undefined
  selectedProf: string
  hint: string | null
  isGeneratingHint: boolean
  styledPrompt: string
  evaluation: EvaluationResult | null
}

export interface CombatActions {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleSubmitDefense: () => Promise<void>
  handleMicTap: () => void
  resetAll: () => void
  setDefenseInput: (value: string) => void
  setSelectedProf: (profId: string) => void
  handleAskForHint: () => Promise<void>
  changeOpponent: (profId: string) => Promise<void>
}
