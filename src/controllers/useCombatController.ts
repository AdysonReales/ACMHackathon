// ============================================================
// CONTROLLER — Combat gameplay state + all business logic
// ============================================================

import { useState, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { LevelData, ScreenState, TurnFeedback, CombatState, CombatActions } from '../models/types'

// Configure PDF.js worker (local, no CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const FILLER_KEYWORDS = ['ano', 'like', 'you know', 'uh', 'um', 'actually', 'kasi', 'parang']

export const useCombatController = (
  initialCustomData?: LevelData | null
): CombatState & CombatActions => {
  // ---------- State ----------
  const [screen, setScreen] = useState<ScreenState>(initialCustomData ? 'battle' : 'upload')
  const [levelData, setLevelData] = useState<LevelData | null>(initialCustomData || null)
  const [compileProgress, setCompileProgress] = useState(0)
  const [compileError, setCompileError] = useState<string | null>(null)

  const [playerHp, setPlayerHp] = useState(100)
  const [opponentHp, setOpponentHp] = useState(100)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [defenseInput, setDefenseInput] = useState('')
  const [isGrading, setIsGrading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [turnFeedback, setTurnFeedback] = useState<TurnFeedback | null>(null)
  const [screenShake, setScreenShake] = useState(false)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [waitingNextTurn, setWaitingNextTurn] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false)
  const [backgroundCompileError, setBackgroundCompileError] = useState<string | null>(null)

  // ---------- Sync from prop ----------
  useEffect(() => {
    if (initialCustomData) {
      setLevelData(initialCustomData)
      startBattle(initialCustomData)
    }
  }, [initialCustomData])

  // Reset phase index back to 0 if background generation finishes and doesn't yield new phases while waiting
  useEffect(() => {
    if (!isGeneratingBackground && levelData) {
      if (currentPhaseIndex >= levelData.combat_phases.length) {
        setCurrentPhaseIndex(0)
      }
    }
  }, [isGeneratingBackground, levelData, currentPhaseIndex])

  // ---------- Internal helpers ----------

  // Stream tokens from Ollama and update streamingText in real-time
  const streamOllamaChat = async (
    messages: { role: string; content: string }[],
    options: { num_predict?: number; num_ctx?: number; temperature?: number } = {}
  ): Promise<string> => {
    const response = await fetch('/api-ollama/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3',
        messages,
        format: 'json',
        stream: true,
        options: {
          num_predict: options.num_predict ?? 800,
          num_ctx: options.num_ctx ?? 2048,
          temperature: options.temperature ?? 0,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama server error (status ${response.status}). Is Ollama running?`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response stream available')

    const decoder = new TextDecoder()
    let accumulated = ''
    let buffer = ''
    setStreamingText('')

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        // Parse any remaining content in the buffer
        if (buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer)
            const token = parsed.message?.content || ''
            accumulated += token
            setStreamingText(accumulated)
          } catch {
            // ignore
          }
        }
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      // Retrieve the last element which represents a potentially partial line
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const parsed = JSON.parse(line)
          const token = parsed.message?.content || ''
          accumulated += token
          setStreamingText(accumulated)
        } catch {
          // ignore partial or malformed lines in the middle
        }
      }
    }

    setStreamingText('')
    return accumulated
  }

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

  const compileRemainingPhases = async (text: string, stage1Data: LevelData) => {
    setIsGeneratingBackground(true)
    setBackgroundCompileError(null)

    const systemPrompt = `You are a curriculum compiler for the game "Proseso: Academic Showdown".
We have already compiled Phase 1 and its evidence card for the professor: "${stage1Data.professor_name}".
Phase 1 flawed argument: "${stage1Data.combat_phases[0]?.flawed_argument}"
Phase 1 evidence card: "${stage1Data.evidence_deck[0]?.title}"

Analyze the user text and generate exactly 2 additional subsequent phases (Phase 2 and Phase 3) and their corresponding evidence cards to complete the learning map.
Do NOT repeat Phase 1. Start from Phase 2.
You MUST output ONLY a valid JSON object. No other prose, no markdown.

JSON structure:
{
  "combat_phases": [
    {
      "phase_id": 2,
      "flawed_argument": "A second flawed statement BASED ON the document content that the student must refute.",
      "contradictory_evidence_id": "ev_phase2_id",
      "follow_up_prompt": "A follow up question in Taglish asking the student to explain the correct concept."
    },
    {
      "phase_id": 3,
      "flawed_argument": "A third flawed statement BASED ON the document content that the student must refute.",
      "contradictory_evidence_id": "ev_phase3_id",
      "follow_up_prompt": "A final question in Taglish checking their understanding."
    }
  ],
  "evidence_deck": [
    {
      "id": "ev_phase2_id",
      "title": "Title of Phase 2 evidence card",
      "description_bilingual": "Correct explanation starting with 'Mali! (Objection!) ...' in bilingual Taglish."
    },
    {
      "id": "ev_phase3_id",
      "title": "Title of Phase 3 evidence card",
      "description_bilingual": "Correct explanation starting with 'Mali! (Objection!) ...' in bilingual Taglish."
    }
  ]
}`

    try {
      const rawJson = await streamOllamaChat(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Compile subsequent phases from this academic text:\n\n${text.substring(0, 6000)}` }
        ],
        { num_predict: 800, num_ctx: 2048, temperature: 0 }
      )

      if (!rawJson) throw new Error('Empty response from background Ollama.')

      const parsed = JSON.parse(rawJson.trim())

      if (!parsed.combat_phases?.length || !parsed.evidence_deck?.length) {
        throw new Error('AI returned incomplete background level data.')
      }

      setLevelData(prev => {
        if (!prev) return null
        return {
          ...prev,
          combat_phases: [...prev.combat_phases, ...parsed.combat_phases],
          evidence_deck: [...prev.evidence_deck, ...parsed.evidence_deck]
        }
      })
    } catch (err: any) {
      console.error('Background compilation failed:', err)
      setBackgroundCompileError(err.message || 'Background level compilation failed.')
    } finally {
      setIsGeneratingBackground(false)
    }
  }

  const compileLevelFromText = async (text: string, _fileName: string) => {
    setCompileProgress(25)

    const systemPrompt = `You are a curriculum compiler for the game "Proseso: Academic Showdown".
Analyze the user text and create a level.
You MUST output ONLY a valid JSON object. No other prose, no markdown.
Generate ONLY Phase 1 of the battle (the first flawed academic argument, correct evidence id, follow-up prompt) and its corresponding evidence card, along with level details.

JSON structure:
{
  "level_id": 105,
  "professor_name": "Dr. Arboleda",
  "professor_sprite": "prof_strict_01",
  "combat_phases": [
    {
      "phase_id": 1,
      "flawed_argument": "A flawed statement BASED ON the document content that the student must refute.",
      "contradictory_evidence_id": "ev_phase1_id",
      "follow_up_prompt": "A follow up question in Taglish asking the student to explain the correct concept."
    }
  ],
  "evidence_deck": [
    {
      "id": "ev_phase1_id",
      "title": "Title of the evidence card",
      "description_bilingual": "Correct explanation starting with 'Mali! (Objection!) ...' in bilingual Taglish."
    }
  ]
}`

    try {
      setCompileProgress(40)
      const rawJson = await streamOllamaChat(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Compile this academic text into a showdown level:\n\n${text.substring(0, 6000)}` }
        ],
        { num_predict: 600, num_ctx: 2048, temperature: 0 }
      )

      setCompileProgress(90)
      if (!rawJson) throw new Error('Empty response from Ollama.')

      const parsed: LevelData = JSON.parse(rawJson.trim())

      if (!parsed.combat_phases?.length || !parsed.evidence_deck?.length) {
        throw new Error('AI returned incomplete level data. Try again.')
      }

      setCompileProgress(100)
      startBattle(parsed)
      // Kick off background compilation for Phase 2 and 3 without blocking
      compileRemainingPhases(text, parsed)
    } catch (err: any) {
      console.error(err)
      const friendlyMsg = err instanceof SyntaxError
        ? `Failed to parse AI level data: ${err.message}. The response may have been truncated. Please try uploading the document again.`
        : err.message
      setCompileError(friendlyMsg)
      setScreen('upload')
    }
  }

  // ---------- Public actions ----------

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScreen('compiling')
    setCompileProgress(10)
    setCompileError(null)

    try {
      let text = ''

      if (file.name.toLowerCase().endsWith('.pdf')) {
        setCompileProgress(15)
        text = await extractTextFromPdf(file)
        if (!text.trim()) {
          throw new Error('PDF has no extractable text (might be scanned images). Use a text-based PDF.')
        }
      } else {
        text = await file.text()
      }

      await compileLevelFromText(text, file.name)
    } catch (err: any) {
      console.error(err)
      setCompileError(err.message)
      setScreen('upload')
    }
  }

  const currentPhase = levelData?.combat_phases?.[currentPhaseIndex]
  const currentEvidence = levelData?.evidence_deck?.find(
    ev => ev.id === currentPhase?.contradictory_evidence_id
  )

  const handleSubmitDefense = async () => {
    if (!defenseInput.trim() || isGrading || !currentPhase || !levelData || waitingNextTurn) return

    setIsGrading(true)
    setTurnFeedback(null)

    const words = defenseInput.toLowerCase().split(/\s+/)
    const foundFillers = words.filter(w => FILLER_KEYWORDS.includes(w))
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
      const rawJson = await streamOllamaChat(
        [
          { role: 'system', content: gradingPrompt },
          { role: 'user', content: `Grade: "${defenseInput}"` }
        ],
        { num_predict: 150, num_ctx: 1024, temperature: 0 }
      )

      const parsed = JSON.parse(rawJson.trim())
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
        } else if (isGeneratingBackground) {
          setCurrentPhaseIndex(nextIdx)
          setCombatLog(prev => [
            `⏳ Prosecutor is preparing the next challenge...`,
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
    setStreamingText('')
    setIsGeneratingBackground(false)
    setBackgroundCompileError(null)
  }

  // ---------- Derived state ----------
  const words = defenseInput.toLowerCase().split(/\s+/)
  const fillerWarning = !!(defenseInput.trim() && words.some(w => FILLER_KEYWORDS.includes(w)))

  const opponentName = levelData?.professor_name || 'Prosecutor'
  const phaseNumber = currentPhaseIndex + 1
  const totalPhases = levelData?.combat_phases?.length || 0

  return {
    // State
    screen,
    levelData,
    compileProgress,
    compileError,
    playerHp,
    opponentHp,
    currentPhaseIndex,
    defenseInput,
    isGrading,
    isRecording,
    turnFeedback,
    screenShake,
    combatLog,
    waitingNextTurn,
    fillerWarning,
    opponentName,
    phaseNumber,
    totalPhases,
    currentPhase,
    streamingText,
    isGeneratingBackground,
    backgroundCompileError,
    // Actions
    handleFileUpload,
    handleSubmitDefense,
    handleMicTap,
    resetAll,
    setDefenseInput,
  }
}
