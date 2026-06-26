// ============================================================
// CONTROLLER — Combat gameplay state + all business logic
// ============================================================
// Refactored: delegates AI calls to useDocumentController (RAG) and
// useGradingController. Supports both Gemini 2.5 and Ollama backends.
// Exposes the EXACT SAME interface (CombatState & CombatActions) so
// CombatScreen.tsx needs zero changes.

import { useState, useEffect } from 'react'
import { useDocumentController } from './useDocumentController'
import { useGradingController } from './useGradingController'
import type { LevelData, ScreenState, TurnFeedback, CombatState, CombatActions } from '../models/types'

export const useCombatController = (
  initialCustomData?: LevelData | null
): CombatState & CombatActions => {
  // ---------- Sub-controllers ----------
  const doc = useDocumentController()
  const { gradeDefense } = useGradingController(doc.retrieveChunks)

  // ---------- State ----------
  const [screen, setScreen] = useState<ScreenState>(initialCustomData ? 'battle' : 'upload')
  const [levelData, setLevelData] = useState<LevelData | null>(initialCustomData || null)

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

      // 2. Compile level from document text via AI (Gemini or Ollama)
      const parsed = await doc.compileLevelFromText(text)

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

  const handleSubmitDefense = async () => {
    if (!defenseInput.trim() || isGrading || !currentPhase || !levelData || waitingNextTurn) return

    setIsGrading(true)
    setTurnFeedback(null)

    // --- Delegate grading to useGradingController (RAG-powered) ---
    const result = await gradeDefense(defenseInput, currentPhase, currentEvidence, levelData)

    // Screen shake
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 500)

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
          setScreen('defeat')
          return
        }
        setTurnFeedback(null)
        setWaitingNextTurn(false)
      }, 3000)
    }
  }

  // Mic mock (same as original)
  const handleMicTap = () => {
    if (isRecording) {
      setIsRecording(false)
      const phrases = [
        'Kasi ano, database normalization prevents duplicates parang relational structure.',
        'Prepared statements dynamically sanitize input text parameters.',
        'Mali po ang premise. Propositions are logically parsed using truth tables.',
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
    setPlayerHp(100)
    setOpponentHp(100)
    setCurrentPhaseIndex(0)
    setDefenseInput('')
    setCombatLog([])
    setTurnFeedback(null)
    setWaitingNextTurn(false)
    doc.setError(null)
    doc.setProgress(0)
  }

  // ---------- Derived state ----------
  const FILLER_KEYWORDS = ['ano', 'like', 'you know', 'uh', 'um', 'actually', 'kasi', 'parang']
  const words = defenseInput.toLowerCase().split(/\s+/)
  const fillerWarning = !!(defenseInput.trim() && words.some(w => FILLER_KEYWORDS.includes(w)))

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
    fillerWarning,
    opponentName,
    phaseNumber,
    totalPhases,
    currentPhase,
    // Actions
    handleFileUpload,
    handleSubmitDefense,
    handleMicTap,
    resetAll,
    setDefenseInput,
  }
}