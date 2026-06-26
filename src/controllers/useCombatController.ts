// ============================================================
// CONTROLLER — Combat gameplay state + all business logic
// ============================================================
// Delegates AI calls to useDocumentController (RAG),
// useGradingController, and useHintController.
// Also synchronizes results with useScheduleController and useProfileController.

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useDocumentController } from './useDocumentController'
import { useGradingController } from './useGradingController'
import { useHintController } from './useHintController'
import { useScheduleController } from './useScheduleController'
import { useProfileController } from './useProfileController'
import { getAIProvider } from '../lib/aiProvider'
import type { LevelData, ScreenState, TurnFeedback, CombatState, CombatActions, EvaluationResult } from '../models/types'

export const useCombatController = (
  initialCustomData?: LevelData | null
): CombatState & CombatActions => {
  // ---------- Sub-controllers ----------
  const doc = useDocumentController()
  const { gradeDefense } = useGradingController(doc.retrieveChunks)
  const hintCtrl = useHintController()
  const scheduleCtrl = useScheduleController()
  const profileCtrl = useProfileController()

  // ---------- State ----------
  const [screen, setScreen] = useState<ScreenState>(initialCustomData ? 'battle' : 'upload')
  const [levelData, setLevelData] = useState<LevelData | null>(initialCustomData || null)
  const [selectedProf, setSelectedProf] = useState<string>('reyes')

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
  const [turnGrades, setTurnGrades] = useState<number[]>([])
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)

  // ---------- Sync from prop ----------
  useEffect(() => {
    if (initialCustomData) {
      setLevelData(initialCustomData)
      startBattle(initialCustomData)
    }
  }, [initialCustomData])

  // ---------- Internal helpers ----------

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
    setTurnGrades([])
    setEvaluation(null)
    hintCtrl.clearHint()
    setCombatLog([
      `⚖️ Court is in session! ${data.professor_name} challenges your understanding.`,
    ])
    setScreen('battle')
  }

  // ---------- Public actions ----------

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScreen('compiling')
    doc.setError(null)

    try {
      // 1. Process document (extract + chunk + embed)
      const { text } = await doc.processDocument(file)

      // 2. Compile level from document text via AI (Gemini or Ollama) passing selected personality style
      const parsed = await doc.compileLevelFromText(text, selectedProf)

      // 3. Start the battle
      startBattle(parsed)
    } catch (err: any) {
      console.error(err)
      setScreen('upload')
    }
  }

  const currentPhase = levelData?.combat_phases?.[currentPhaseIndex]
  const currentEvidence = levelData?.evidence_deck?.find(
    ev => ev.id === currentPhase?.contradictory_evidence_id
  )

  // Derived styled open-ended prompt matching active professor
  const styledPrompt = useMemo(() => {
    return hintCtrl.getStyledPrompt(selectedProf, currentPhase)
  }, [selectedProf, currentPhase, hintCtrl])

  const handleSubmitDefense = async () => {
    if (!defenseInput.trim() || isGrading || !currentPhase || !levelData || waitingNextTurn) return

    setIsGrading(true)
    setTurnFeedback(null)

    // --- Delegate grading to useGradingController (RAG-powered) ---
    const result = await gradeDefense(defenseInput, currentPhase, currentEvidence, levelData)

    // Screen shake
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 500)

    // Track grades
    const updatedGrades = [...turnGrades, result.rawGrade]
    setTurnGrades(updatedGrades)

    if (result.feedback.type === 'success') {
      // --- SUCCESS ---
      const nextOppHp = Math.max(0, opponentHp - result.damage)
      setOpponentHp(nextOppHp)
      setTurnFeedback(result.feedback)

      setCombatLog(prev => [
        `✅ Grade: ${result.rawGrade}% | Damage: ${result.damage} | ${result.feedback.message}`,
        ...prev,
      ])

      setWaitingNextTurn(true)
      setIsGrading(false)
      hintCtrl.clearHint() // clear hint for next turn

      setTimeout(async () => {
        if (nextOppHp <= 0) {
          const avgGrade = updatedGrades.reduce((a, b) => a + b, 0) / updatedGrades.length

          // Sync progression in schedule map and user profile
          scheduleCtrl.completeLevelWithGrade(levelData.level_id, avgGrade)
          profileCtrl.recordBattleResult(
            true,
            levelData.subject || 'Discrete Math',
            avgGrade,
            0,
            defenseInput.split(/\s+/).length
          )

          // Personalized stats calculation
          const logic = Math.round(avgGrade)
          const clarity = Math.max(50, Math.min(100, Math.round(logic + (Math.random() * 8 - 4))))
          const hintCount = combatLog.filter(log => log.includes('💡 Hint requested')).length
          const poise = Math.max(40, 100 - (hintCount * 15))

          setEvaluation({
            logic,
            clarity,
            poise,
            notes: "Writing bench notes..."
          })
          setScreen('victory')

          // Ask AI provider to generate personalized bench notes summary based on logs
          try {
            const provider = await getAIProvider()
            const summaryPrompt = `You are the academic opponent ${levelData.professor_name} evaluating the student's performance.
Subject: ${levelData.subject}
Final Grade: ${logic}%
Courtroom feed logs from the match:
${combatLog.filter(l => l.startsWith('✅') || l.startsWith('❌')).join('\n')}

Summarize the student's performance in exactly two short sentences of Taglish. Highlight their logical clarity and suggest what specific topic they should review next.`
            
            const parsed = await provider.generateJSON<{ notes: string }>(
              summaryPrompt,
              "Generate personalized evaluation bench notes."
            )
            setEvaluation({
              logic,
              clarity,
              poise,
              notes: parsed.notes || "Thesis accepted. Good overall reasoning."
            })
          } catch {
            setEvaluation({
              logic,
              clarity,
              poise,
              notes: `Magandang gilas ang ipinakita mo sa ${levelData.subject}. Nakakuha ka ng average grade na ${logic}%. Pag-aralan pa ang mga key points ng lecture.`
            })
          }
          return
        }

        // Next phase
        const nextIdx = currentPhaseIndex + 1
        if (nextIdx < levelData.combat_phases.length) {
          setCurrentPhaseIndex(nextIdx)
          setCombatLog(prev => [
            `📋 Phase ${nextIdx + 1}: New accusation incoming...`,
            ...prev,
          ])
        } else {
          // All phases done, opponent still alive — loop
          setCurrentPhaseIndex(0)
          setCombatLog(prev => [
            `🔄 Prosecutor circles back with more arguments...`,
            ...prev,
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
      setTurnFeedback(result.feedback)

      setCombatLog(prev => [
        `❌ Grade: ${result.rawGrade}% | You took ${playerDmg} damage | ${result.feedback.message}`,
        ...prev,
      ])

      setWaitingNextTurn(true)
      setIsGrading(false)

      setTimeout(() => {
        if (nextPlayerHp <= 0) {
          // Sync loss in user profile
          profileCtrl.recordBattleResult(
            false,
            levelData.subject || 'Discrete Math',
            0,
            0,
            defenseInput.split(/\s+/).length
          )

          setScreen('defeat')
          return
        }
        setTurnFeedback(null)
        setWaitingNextTurn(false)
      }, 3000)
    }
  }

  // ---------- Real Speech-to-Text via Web Speech API ----------
  const recognitionRef = useRef<any>(null)
  const isRecordingRef = useRef(false)

  const handleMicTap = useCallback(() => {
    // Already recording → stop
    if (isRecordingRef.current) {
      isRecordingRef.current = false
      setIsRecording(false)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      return
    }

    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('[Mic] SpeechRecognition not supported in this browser.')
      setDefenseInput(prev => prev + ' [Voice input not supported — use Chrome or Edge.]')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false  // only fire when a phrase is finalized
    recognition.lang = 'en-PH'         // English (Philippines) — handles Taglish well

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' '
        }
      }
      if (transcript.trim()) {
        setDefenseInput(prev => (prev ? prev + ' ' : '') + transcript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      // "no-speech" and "aborted" are non-fatal — don't kill the session
      if (event.error === 'no-speech' || event.error === 'aborted') return
      console.error('[Mic] Speech recognition error:', event.error)
      isRecordingRef.current = false
      setIsRecording(false)
      recognitionRef.current = null
    }

    recognition.onend = () => {
      // Chrome kills continuous recognition after ~60s of silence; auto-restart if still recording
      if (isRecordingRef.current) {
        try { recognition.start() } catch { /* already running */ }
      } else {
        recognitionRef.current = null
      }
    }

    recognitionRef.current = recognition
    isRecordingRef.current = true
    setIsRecording(true)
    recognition.start()
  }, [])

  const handleAskForHint = async () => {
    if (isGrading || waitingNextTurn || !currentPhase) return

    // Retrieve relevant doc chunks to build accurate hint guidance
    const chunks = await doc.retrieveChunks(`${currentPhase.flawed_argument}`, 2)

    // Call hint controller to generate persona-styled hint
    const hintText = await hintCtrl.generateHint(
      selectedProf,
      currentPhase,
      currentEvidence,
      chunks
    )

    // Append hint event to combat transcript log
    setCombatLog(prev => [
      `💡 Hint requested from ${opponentName}: "${hintText}"`,
      ...prev,
    ])
  }

  const changeOpponent = async (profId: string) => {
    if (!doc.rawText) {
      setSelectedProf(profId)
      setScreen('upload')
      return
    }

    setSelectedProf(profId)
    setScreen('compiling')
    try {
      const parsed = await doc.compileLevelFromText(doc.rawText, profId)
      startBattle(parsed)
    } catch (err) {
      console.error(err)
      setScreen('upload')
    }
  }

  const resetAll = () => {
    setScreen('upload')
    setLevelData(null)
    setPlayerHp(100)
    setOpponentHp(100)
    setCurrentPhaseIndex(0)
    setDefenseInput('')
    setCombatLog([])
    setTurnFeedback(null)
    setWaitingNextTurn(false)
    setTurnGrades([])
    setEvaluation(null)
    doc.setError(null)
    doc.setProgress(0)
    hintCtrl.clearHint()
  }

  const opponentName = levelData?.professor_name || 'Prosecutor'
  const phaseNumber = currentPhaseIndex + 1
  const totalPhases = levelData?.combat_phases?.length || 0

  return {
    // State
    screen,
    levelData,
    compileProgress: doc.progress,
    compileError: doc.error,
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
    opponentName,
    phaseNumber,
    totalPhases,
    currentPhase,
    selectedProf,
    hint: hintCtrl.hint,
    isGeneratingHint: hintCtrl.isGeneratingHint,
    styledPrompt,
    evaluation,
    // Actions
    handleFileUpload,
    handleSubmitDefense,
    handleMicTap,
    resetAll,
    setDefenseInput,
    setSelectedProf,
    handleAskForHint,
    changeOpponent,
  }
}