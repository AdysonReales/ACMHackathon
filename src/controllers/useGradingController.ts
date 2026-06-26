// ============================================================
// CONTROLLER — RAG-based Defense Grading
// ============================================================
// Retrieves relevant document chunks, sends to AI for grading.
// Consumes parameters from centralized gradingConfig.json.
// Used by: useCombatController (internally)

import { useCallback } from 'react'
import { getAIProvider } from '../lib/aiProvider'
import type { CombatPhase, EvidenceCard, LevelData, TurnFeedback } from '../models/types'
import gradingConfig from '../data/gradingConfig.json'

export interface GradeResult {
  feedback: TurnFeedback
  rawGrade: number
  damage: number
}

export function useGradingController(
  retrieveChunks: (query: string, topK?: number) => Promise<string[]>
) {
  const gradeDefense = useCallback(async (
    defenseInput: string,
    currentPhase: CombatPhase,
    currentEvidence: EvidenceCard | undefined,
    levelData: LevelData,
  ): Promise<GradeResult> => {

    // --- RAG: retrieve relevant document chunks ---
    const relevantChunks = await retrieveChunks(
      `${currentPhase.flawed_argument} ${defenseInput}`,
      3
    )
    const ragContext = relevantChunks.length > 0
      ? `\n\nRelevant source material from the student's uploaded document:\n${relevantChunks.map((c, i) => `[${i + 1}] ${c}`).join('\n')}`
      : ''

    const correctInfo = currentEvidence?.description_bilingual || ''

    // Format grading prompt using JSON configuration template
    const gradingPrompt = gradingConfig.prosecutor_system_instruction
      .replace('{professor_name}', levelData.professor_name)
      .replace('{flawed_argument}', currentPhase.flawed_argument)
      .replace('{correct_info}', correctInfo)
      .replace('{rag_context}', ragContext)
      .replace('{defense_input}', defenseInput)

    let finalGrade = 0
    let aiFeedback = ''

    try {
      const provider = await getAIProvider()
      const parsed = await provider.generateJSON<{ grade: number; feedback: string }>(
        gradingPrompt,
        `Grade this defense: "${defenseInput}"`
      )
      finalGrade = parsed.grade ?? 50
      aiFeedback = parsed.feedback ?? 'No feedback.'
    } catch {
      // Fallback: keyword matching using JSON keywords config
      const words = defenseInput.toLowerCase().split(/\s+/)
      const hasKeywords = words.some(w =>
        gradingConfig.fallback_keywords.includes(w)
      )
      finalGrade = hasKeywords ? 75 : 40
      aiFeedback = hasKeywords
        ? gradingConfig.fallback_feedback_success
        : gradingConfig.fallback_feedback_fail
    }

    const damage = finalGrade

    return {
      feedback: {
        type: finalGrade >= gradingConfig.passing_threshold ? 'success' : 'fail',
        grade: finalGrade,
        message: aiFeedback,
      },
      rawGrade: finalGrade,
      damage,
    }
  }, [retrieveChunks])

  return { gradeDefense }
}
