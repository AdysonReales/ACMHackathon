import React, { useState, useRef, useEffect } from 'react'
import { Mic, RefreshCw, Upload, Sparkles, Send, AlertTriangle, Loader2, ChevronRight, Trophy, XCircle, Swords } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Configure PDF.js worker (local, no CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// ---------- Types ----------
interface CombatPhase {
  phase_id: number
  flawed_argument: string
  contradictory_evidence_id: string
  follow_up_prompt: string
}

interface EvidenceCard {
  id: string
  title: string
  description_bilingual: string
}

interface LevelData {
  level_id: number
  professor_name: string
  professor_sprite: string
  combat_phases: CombatPhase[]
  evidence_deck: EvidenceCard[]
}

type ScreenState = 'upload' | 'compiling' | 'battle' | 'victory' | 'defeat'

interface CombatScreenProps {
  customLevelData?: LevelData | null
}

// ---------- Component ----------
export const CombatScreen: React.FC<CombatScreenProps> = ({ customLevelData: initialCustomData }) => {
  // Screen flow
  const [screen, setScreen] = useState<ScreenState>(initialCustomData ? 'battle' : 'upload')
  const [levelData, setLevelData] = useState<LevelData | null>(initialCustomData || null)

  // Compile
  const [compileProgress, setCompileProgress] = useState(0)
  const [compileError, setCompileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Battle
  const [playerHp, setPlayerHp] = useState(100)
  const [opponentHp, setOpponentHp] = useState(100)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [defenseInput, setDefenseInput] = useState('')
  const [isGrading, setIsGrading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [turnFeedback, setTurnFeedback] = useState<{ type: 'success' | 'fail'; grade: number; message: string } | null>(null)
  const [screenShake, setScreenShake] = useState(false)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [waitingNextTurn, setWaitingNextTurn] = useState(false)

  const fillerKeywords = ['ano', 'like', 'you know', 'uh', 'um', 'actually', 'kasi', 'parang']

  // Sync from prop
  useEffect(() => {
    if (initialCustomData) {
      setLevelData(initialCustomData)
      startBattle(initialCustomData)
    }
  }, [initialCustomData])

  const startBattle = (data: LevelData) => {
    setLevelData(data)
    setPlayerHp(100)
    setOpponentHp(100)
    setCurrentPhaseIndex(0)
    setDefenseInput('')
    setIsGrading(false)
    setTurnFeedback(null)
    setScreenShake(false)
    setWaitingNextTurn(false)
    setCombatLog([
      `⚖️ Court is in session! ${data.professor_name} challenges your understanding.`,
    ])
    setScreen('battle')
  }

  // ---------- PDF Text Extraction ----------
  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pages: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const strings = content.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str)
      pages.push(strings.join(' '))
    }

    return pages.join('\n\n')
  }

  // ---------- Phase 1: Upload & Compile ----------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScreen('compiling')
    setCompileProgress(10)
    setCompileError(null)

    try {
      let text = ''

      if (file.name.toLowerCase().endsWith('.pdf')) {
        // Extract text from PDF client-side
        setCompileProgress(15)
        text = await extractTextFromPdf(file)
        if (!text.trim()) {
          throw new Error('PDF has no extractable text (might be scanned images). Use a text-based PDF.')
        }
      } else {
        // Read as plain text
        text = await file.text()
      }

      await compileLevelFromText(text, file.name)
    } catch (err: any) {
      console.error(err)
      setCompileError(err.message)
      setScreen('upload')
    }
  }

  const compileLevelFromText = async (text: string, fileName: string) => {
    setCompileProgress(25)

    const systemPrompt = `You are a curriculum compiler for the game "Proseso: Academic Showdown".
Analyze the user text and create exactly 2 to 3 turn-based combat phases based on the ACTUAL CONTENT of the document.
Each phase contains a flawed academic argument derived from the document's topics, the correct evidence id, and a follow-up prompt.
You MUST output ONLY a valid JSON object. No other prose, no markdown.

JSON structure:
{
  "level_id": 105,
  "professor_name": "Dr. Arboleda",
  "professor_sprite": "prof_strict_01",
  "combat_phases": [
    {
      "phase_id": 1,
      "flawed_argument": "A flawed statement BASED ON the document content that the student must refute.",
      "contradictory_evidence_id": "ev_unique_id",
      "follow_up_prompt": "A follow up question in Taglish asking the student to explain the correct concept."
    }
  ],
  "evidence_deck": [
    {
      "id": "ev_unique_id",
      "title": "Title of the evidence card",
      "description_bilingual": "Correct explanation starting with 'Mali! (Objection!) ...' in bilingual Taglish."
    }
  ]
}`

    try {
      setCompileProgress(40)
      const response = await fetch('/api-ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Compile this academic text into a showdown level:\n\n${text.substring(0, 6000)}` }
          ],
          format: 'json',
          stream: false
        })
      })

      setCompileProgress(70)
      if (!response.ok) {
        throw new Error(`Ollama server error (status ${response.status}). Is Ollama running?`)
      }

      const data = await response.json()
      const rawJson = data.message?.content
      if (!rawJson) throw new Error('Empty response from Ollama.')

      setCompileProgress(90)
      const parsed: LevelData = JSON.parse(rawJson.trim())

      // Validate structure
      if (!parsed.combat_phases?.length || !parsed.evidence_deck?.length) {
        throw new Error('AI returned incomplete level data. Try again.')
      }

      setCompileProgress(100)
      startBattle(parsed)
    } catch (err: any) {
      console.error(err)
      setCompileError(err.message)
      setScreen('upload')
    }
  }

  // ---------- Phase 2: Battle - Grade Defense ----------
  const currentPhase = levelData?.combat_phases?.[currentPhaseIndex]
  const currentEvidence = levelData?.evidence_deck?.find(
    ev => ev.id === currentPhase?.contradictory_evidence_id
  )

  const handleSubmitDefense = async () => {
    if (!defenseInput.trim() || isGrading || !currentPhase || !levelData || waitingNextTurn) return

    setIsGrading(true)
    setTurnFeedback(null)

    const words = defenseInput.toLowerCase().split(/\s+/)
    const foundFillers = words.filter(w => fillerKeywords.includes(w))
    const stutterPenalty = foundFillers.length * 4

    const correctInfo = currentEvidence?.description_bilingual || ''

    const gradingPrompt = `You are the strict academic prosecutor ${levelData.professor_name} in "Proseso: Academic Showdown".
The flawed argument: "${currentPhase.flawed_argument}"
The correct rebuttal info: "${correctInfo}"
The student's defense: "${defenseInput}"

Grade the student's explanation 0-100.
Below 50 if nonsense/vague/wrong. 70-100 if they address the core error correctly (even in Taglish).
Output ONLY JSON:
{
  "grade": 85,
  "feedback": "Courtroom response in bilingual Taglish."
}`

    let finalGrade = 0
    let aiFeedback = ''

    try {
      const response = await fetch('/api-ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3',
          messages: [
            { role: 'system', content: gradingPrompt },
            { role: 'user', content: `Grade: "${defenseInput}"` }
          ],
          format: 'json',
          stream: false
        })
      })

      if (!response.ok) throw new Error('Grading failed')

      const data = await response.json()
      const parsed = JSON.parse(data.message?.content.trim())
      finalGrade = parsed.grade ?? 50
      aiFeedback = parsed.feedback ?? 'No feedback.'
    } catch {
      // Fallback keyword matching
      const hasKeywords = words.some(w =>
        ['normal', 'logic', 'sql', 'index', 'secure', 'query', 'parameterized',
         'sanitize', 'prepared', 'database', 'inject', 'validate', 'error'].includes(w)
      )
      finalGrade = hasKeywords ? 75 : 40
      aiFeedback = hasKeywords
        ? "Medyo tama ang reasoning mo, pero kulang pa."
        : "Walang kinalaman ang sagot mo sa issue. Objection!"
    }

    const damage = Math.max(0, finalGrade - stutterPenalty)

    // Screen shake
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 500)

    if (finalGrade >= 60) {
      // --- SUCCESS ---
      const nextOppHp = Math.max(0, opponentHp - damage)
      setOpponentHp(nextOppHp)
      setTurnFeedback({ type: 'success', grade: damage, message: aiFeedback })

      setCombatLog(prev => [
        `✅ Grade: ${finalGrade}% | Damage: ${damage} | ${aiFeedback}`,
        ...prev
      ])

      setWaitingNextTurn(true)
      setIsGrading(false)

      setTimeout(() => {
        if (nextOppHp <= 0) {
          setScreen('victory')
          return
        }

        // Next phase
        const nextIdx = currentPhaseIndex + 1
        if (nextIdx < levelData.combat_phases.length) {
          setCurrentPhaseIndex(nextIdx)
          setCombatLog(prev => [
            `📋 Phase ${nextIdx + 1}: New accusation incoming...`,
            ...prev
          ])
        } else {
          // All phases done, opponent still alive — loop back
          setCurrentPhaseIndex(0)
          setCombatLog(prev => [
            `🔄 Prosecutor circles back with more arguments...`,
            ...prev
          ])
        }
        setDefenseInput('')
        setTurnFeedback(null)
        setWaitingNextTurn(false)
      }, 3000)

    } else {
      // --- FAIL ---
      const playerDmg = 30
      const nextPlayerHp = Math.max(0, playerHp - playerDmg)
      setPlayerHp(nextPlayerHp)
      setTurnFeedback({ type: 'fail', grade: finalGrade, message: aiFeedback })

      setCombatLog(prev => [
        `❌ Grade: ${finalGrade}% | You took ${playerDmg} damage | ${aiFeedback}`,
        ...prev
      ])

      setWaitingNextTurn(true)
      setIsGrading(false)

      setTimeout(() => {
        if (nextPlayerHp <= 0) {
          setScreen('defeat')
          return
        }
        setTurnFeedback(null)
        setWaitingNextTurn(false)
      }, 3000)
    }
  }

  // Mic mock
  const handleMicTap = () => {
    if (isRecording) {
      setIsRecording(false)
      const phrases = [
        'Kasi ano, database normalization prevents duplicates parang relational structure.',
        'Prepared statements dynamically sanitize input text parameters.',
        'Mali po ang premise. Propositions are logically parsed using truth tables.'
      ]
      setDefenseInput(phrases[Math.floor(Math.random() * phrases.length)])
    } else {
      setIsRecording(true)
      setDefenseInput('')
    }
  }

  const resetAll = () => {
    setScreen('upload')
    setLevelData(null)
    setCompileError(null)
    setCompileProgress(0)
    setPlayerHp(100)
    setOpponentHp(100)
    setCurrentPhaseIndex(0)
    setDefenseInput('')
    setCombatLog([])
    setTurnFeedback(null)
    setWaitingNextTurn(false)
  }

  const opponentName = levelData?.professor_name || 'Prosecutor'
  const phaseNumber = currentPhaseIndex + 1
  const totalPhases = levelData?.combat_phases?.length || 0

  // ============================================================
  // RENDER: Upload Screen
  // ============================================================
  if (screen === 'upload') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-8 px-4 flex flex-col gap-6 items-center">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-8 border border-[var(--border)] w-full flex flex-col items-center gap-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-emerald-400 flex items-center justify-center shadow-lg">
              <Swords size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Academic Showdown</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Upload a document. The AI prosecutor will challenge you on it.
            </p>
          </div>

          {/* Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[var(--surface-hi)] border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-medium p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
              <Upload size={24} className="text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors" />
            </div>
            <span className="text-sm font-bold text-[var(--text)]">
              Upload your document
            </span>
            <span className="text-xs text-[var(--muted)] text-center">
              .pdf, .txt, .json, or .md — Syllabus, lecture notes, quizzes
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.txt,.json,.md"
          />

          {/* Error */}
          {compileError && (
            <div className="w-full bg-rose-50 border border-rose-200 rounded-medium p-3 text-rose-700 text-xs flex gap-2 items-start">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Compilation Failed</p>
                <p className="mt-1">{compileError}</p>
                <p className="mt-1 text-[10px] text-rose-500">Make sure Ollama is running: <code className="bg-rose-100 px-1 rounded">ollama serve</code></p>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)]">
            <Sparkles size={12} className="text-[var(--primary)]" />
            Powered by local Phi-3 via Ollama
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Compiling Screen
  // ============================================================
  if (screen === 'compiling') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-16 px-4 flex flex-col items-center gap-6">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-10 border border-[var(--border)] w-full flex flex-col items-center gap-5">
          <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
          <h2 className="text-lg font-bold text-[var(--text)]">Compiling Battle Level...</h2>
          <p className="text-xs text-[var(--muted)] text-center">
            AI is reading your document and generating combat phases.
          </p>
          <div className="w-full max-w-[280px] bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[var(--primary)] h-full transition-all duration-500 rounded-full"
              style={{ width: `${compileProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[var(--muted)]">{compileProgress}%</span>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Victory Screen
  // ============================================================
  if (screen === 'victory') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-12 px-4 flex flex-col items-center gap-6">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-10 border border-[var(--border)] w-full flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg animate-bounce">
            <Trophy size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)]">CASE WON!</h2>
          <p className="text-sm text-[var(--muted)] text-center">
            {opponentName} has been defeated. Your academic arguments prevailed!
          </p>
          <button
            onClick={resetAll}
            className="mt-4 px-8 py-3 bg-[var(--primary)] hover:bg-[#208478] text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Upload size={16} />
            New Document Battle
          </button>
        </div>

        {/* Final log */}
        <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-large shadow-custom p-4 max-h-[200px] overflow-y-auto flex flex-col gap-2 font-mono text-xs">
          {combatLog.map((log, i) => (
            <div key={i} className="flex items-start gap-2 text-[var(--muted)]">
              <span className="text-[var(--primary)] font-bold">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Defeat Screen
  // ============================================================
  if (screen === 'defeat') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-12 px-4 flex flex-col items-center gap-6">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-10 border border-[var(--border)] w-full flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg">
            <XCircle size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)]">CASE LOST</h2>
          <p className="text-sm text-[var(--muted)] text-center">
            {opponentName} overruled your arguments. Review and try again!
          </p>
          <button
            onClick={resetAll}
            className="mt-4 px-8 py-3 bg-[var(--accent)] hover:bg-amber-600 text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Battle Screen
  // ============================================================
  return (
    <div className={`w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-4 ${screenShake ? 'animate-bounce' : ''}`}>

      {/* Top Bar: Phase + Reset */}
      <div className="flex justify-between items-center bg-[var(--surface)] p-3 rounded-large shadow-custom border border-[var(--border)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">
            ⚖️ vs. {opponentName}
          </h1>
          <p className="text-[10px] font-mono text-[var(--muted)]">
            Phase {phaseNumber}/{totalPhases} • Level {levelData?.level_id}
          </p>
        </div>
        <button
          onClick={resetAll}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-[var(--muted)] hover:text-[var(--primary)]"
          title="Quit & Upload New"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* HP Bars */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] flex flex-col gap-3">
        {/* Opponent HP */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-lg flex-shrink-0">
            {levelData?.professor_sprite === 'prof_strict_01' ? '👨‍🏫' : '👩‍🏫'}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">Prosecutor</span>
              <span className="text-[10px] font-mono font-bold text-[var(--text)]">{opponentHp}/100</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full transition-all duration-700 rounded-full" style={{ width: `${opponentHp}%` }} />
            </div>
          </div>
        </div>

        {/* Player HP */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-lg flex-shrink-0">
            🎓
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Defender (You)</span>
              <span className="text-[10px] font-mono font-bold text-[var(--text)]">{playerHp}/100</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-700 rounded-full" style={{ width: `${playerHp}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ========== PROSECUTOR'S QUESTION / ACCUSATION ========== */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom border border-[var(--border)] overflow-hidden">
        {/* Accusation header */}
        <div className="bg-rose-50 border-b border-rose-100 px-4 py-2 flex items-center gap-2">
          <span className="text-rose-500 text-sm">⚠️</span>
          <span className="text-[10px] font-mono font-bold text-rose-600 uppercase tracking-wider">
            {opponentName}'s Accusation — Phase {phaseNumber}
          </span>
        </div>

        {/* The actual flawed argument — BIG and visible */}
        <div className="p-5">
          <p className="text-sm text-[var(--text)] font-semibold leading-relaxed italic">
            "{currentPhase?.flawed_argument || 'Loading...'}"
          </p>
        </div>

        {/* Follow-up prompt */}
        {currentPhase?.follow_up_prompt && (
          <div className="bg-amber-50 border-t border-amber-100 px-4 py-3 flex items-start gap-2">
            <ChevronRight size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              {currentPhase.follow_up_prompt}
            </p>
          </div>
        )}
      </div>

      {/* ========== TURN FEEDBACK BANNER ========== */}
      {turnFeedback && (
        <div className={`rounded-medium border p-3 text-center font-bold text-sm shadow-sm animate-pulse ${
          turnFeedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {turnFeedback.type === 'success' ? '✅ OBJECTION ACCEPTED!' : '❌ OBJECTION OVERRULED!'}
          <p className="text-xs font-normal mt-1 opacity-80">{turnFeedback.message}</p>
          <span className="text-[10px] font-mono mt-1 block">Grade: {turnFeedback.grade}%</span>
        </div>
      )}

      {/* ========== DEFENSE INPUT ========== */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[var(--text)]">Your Defense (Taglish OK)</span>
          <span className="text-[9px] font-mono text-[var(--muted)]">Graded by Phi-3</span>
        </div>

        <div className="relative">
          <textarea
            value={defenseInput}
            onChange={(e) => setDefenseInput(e.target.value)}
            disabled={isGrading || waitingNextTurn || opponentHp <= 0 || playerHp <= 0}
            placeholder="Type your rebuttal here... Explain why the prosecutor's claim is wrong."
            className="w-full text-sm p-3 bg-[var(--surface-hi)] border border-[var(--border)] rounded-medium focus:border-[var(--primary)] outline-none min-h-[100px] pr-12 leading-relaxed resize-none text-[var(--text)]"
          />
          <button
            onClick={handleMicTap}
            disabled={isGrading || waitingNextTurn}
            className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-[var(--muted)]'
            }`}
            title="Speech Input"
          >
            <Mic size={16} />
          </button>
        </div>

        {/* Filler warning */}
        {defenseInput.trim() && defenseInput.toLowerCase().split(/\s+/).filter(w => fillerKeywords.includes(w)).length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-mono font-bold">
            <AlertTriangle size={10} />
            Filler words detected — stutter penalty applies!
          </div>
        )}

        <button
          onClick={handleSubmitDefense}
          disabled={isGrading || waitingNextTurn || !defenseInput.trim() || opponentHp <= 0 || playerHp <= 0}
          className="w-full rounded-full py-3 bg-[var(--primary)] hover:bg-[#208478] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {isGrading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Prosecutor is judging...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>SUBMIT DEFENSE — OBJECTION!</span>
            </>
          )}
        </button>
      </div>

      {/* ========== COMBAT LOG ========== */}
      {combatLog.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider pl-1">
            Courtroom Transcripts
          </span>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-large shadow-custom p-4 max-h-[140px] overflow-y-auto flex flex-col gap-2 font-mono text-[11px]">
            {combatLog.map((log, i) => (
              <div key={i} className={`flex items-start gap-2 ${i === 0 ? 'text-[var(--text)] font-semibold' : 'text-[var(--muted)]'}`}>
                <span className="text-[var(--primary)] font-bold">&gt;&gt;</span>
                <span className="leading-relaxed">{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
