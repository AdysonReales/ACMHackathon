// ============================================================
// CONTROLLER — RAG-based Defense Grading
// ============================================================
// Retrieves relevant document chunks, sends to AI for grading.
// Used by: useCombatController (internally)

import { useCallback } from 'react'
import { getAIProvider } from '../lib/aiProvider'
import type { CombatPhase, EvidenceCard, LevelData, TurnFeedback } from '../models/types'

const FILLER_KEYWORDS = ['ano', 'like', 'you know', 'uh', 'um', 'actually', 'kasi', 'parang']

export interface GradeResult {
  feedback: TurnFeedback
  stutterPenalty: number
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
    // --- Stutter penalty ---
    const words = defenseInput.toLowerCase().split(/\s+/)
    const foundFillers = words.filter(w => FILLER_KEYWORDS.includes(w))
    const stutterPenalty = foundFillers.length * 4

    // --- RAG: retrieve relevant document chunks ---
    const relevantChunks = await retrieveChunks(
      `${currentPhase.flawed_argument} ${defenseInput}`,
      3
    )
    const ragContext = relevantChunks.length > 0
      ? `\n\nRelevant source material from the student's uploaded document:\n${relevantChunks.map((c, i) => `[${i + 1}] ${c}`).join('\n')}`
      : ''

    const correctInfo = currentEvidence?.description_bilingual || ''

    const gradingPrompt = `You are the strict academic prosecutor ${levelData.professor_name} in "Proseso: Academic Showdown".
The flawed argument presented: "${currentPhase.flawed_argument}"
The correct rebuttal info: "${correctInfo}"${ragContext}
The student's defense: "${defenseInput}"

Grade the student's explanation 0-100.
Below 50 if nonsense/vague/wrong. 70-100 if they address the core error correctly (even in Taglish).
You MUST output ONLY valid JSON:
{
  "grade": 85,
  "feedback": "Courtroom response in bilingual Taglish."
}`

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
      // Fallback: keyword matching
      const hasKeywords = words.some(w =>
        ['normal', 'logic', 'sql', 'index', 'secure', 'query', 'parameterized',
         'sanitize', 'prepared', 'database', 'inject', 'validate', 'error'].includes(w)
      )
      finalGrade = hasKeywords ? 75 : 40
      aiFeedback = hasKeywords
        ? 'Medyo tama ang reasoning mo, pero kulang pa.'
        : 'Walang kinalaman ang sagot mo sa issue. Objection!'
    }

    const damage = Math.max(0, finalGrade - stutterPenalty)

    return {
      feedback: {
        type: finalGrade >= 60 ? 'success' : 'fail',
        grade: finalGrade,
        message: aiFeedback,
      },
      stutterPenalty,
      rawGrade: finalGrade,
      damage,
    }
  }, [retrieveChunks])

  return { gradeDefense }
}
