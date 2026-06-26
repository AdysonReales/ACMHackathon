// ============================================================
// CONTROLLER — Hint & Prompt Persona Generator
// ============================================================
// Generates custom hints and open-ended styled prompts based
// on the active professor's personality (mean vs kind, etc.)

import { useState, useCallback } from 'react'
import { getAIProvider } from '../lib/aiProvider'
import type { CombatPhase, EvidenceCard } from '../models/types'

export interface HintController {
  hint: string | null
  isGeneratingHint: boolean
  hintError: string | null
  getStyledPrompt: (professorId: string, phase: CombatPhase | undefined) => string
  generateHint: (
    professorId: string,
    phase: CombatPhase | undefined,
    evidence: EvidenceCard | undefined,
    ragChunks: string[]
  ) => Promise<string>
  clearHint: () => void
}

export function useHintController(): HintController {
  const [hint, setHint] = useState<string | null>(null)
  const [isGeneratingHint, setIsGeneratingHint] = useState(false)
  const [hintError, setHintError] = useState<string | null>(null)

  // --- Dynamic local templates for instant, offline prompt styling ---
  const getStyledPrompt = useCallback((professorId: string, phase: CombatPhase | undefined): string => {
    if (!phase) return 'No question active.'
    const raw = phase.flawed_argument

    switch (professorId) {
      case 'reyes': // Strict Examiner (mean)
        return `Objection! It is asserted that: "${raw}" Prove why this is incorrect. Challenge this assumption and defend your reasoning exactly!`
      
      case 'santos': // Filipino Mentor (kind/relatable)
        return `Teka muna, isipin natin ito: "${raw}" Parang cabinet na magulo, di ba? Paki-paliwanag nga sa Taglish kung bakit ito mali.`
      
      case 'byte': // Technical Debugger (logical/technical)
        return `Logical bug detected in statement: "${raw}" Trace the logical flow, locate the error, and explain why this assertion is technically incorrect.`
      
      case 'luna': // Learning Companion (supportive)
        return `Let's break this down together! Here is the claim: "${raw}" Let's simplify this: why is it not correct? I'm listening!`
      
      default:
        return raw
    }
  }, [])

  // --- AI-driven hint generation based on RAG context and professor personality ---
  const generateHint = useCallback(async (
    professorId: string,
    phase: CombatPhase | undefined,
    evidence: EvidenceCard | undefined,
    ragChunks: string[]
  ): Promise<string> => {
    if (!phase) return 'No active phase.'
    setIsGeneratingHint(true)
    setHintError(null)

    const correctInfo = evidence?.description_bilingual || ''
    const ragContext = ragChunks.length > 0
      ? `\n\nReference Material from document:\n${ragChunks.map((c, i) => `[${i + 1}] ${c}`).join('\n')}`
      : ''

    const systemPrompt = `You are a helpful hint generator for "Proseso: Academic Showdown".
The student is trying to refute this flawed argument: "${phase.flawed_argument}"
The correct rebuttal information: "${correctInfo}"${ragContext}

Generate a short, helpful hint (1-2 sentences) in Taglish or English that guides them towards the correct logic WITHOUT giving the answer away directly.
Format the hint strictly according to the professor personality ID: "${professorId}".

Personalities:
- "reyes": Strict, critical, mean examiner. Demand clear reasoning. "You should know this. Focus on the core mechanism of..."
- "santos": Warm, kind mentor. Use a simple everyday Taglish cabinet/drawer/jeepney analogy if relevant.
- "byte": Dry, logical debugger. Code-like or logical checklist hint.
- "luna": Very supportive, encouraging, motivational learning companion.

Output ONLY JSON format:
{
  "hint": "The hint text here."
}`

    try {
      const provider = await getAIProvider()
      const result = await provider.generateJSON<{ hint: string }>(
        systemPrompt,
        `Generate a hint for professor "${professorId}"`
      )
      
      const hintText = result.hint || 'Subukan mong isa-isahin ang mga ebidensya sa iyong deck.'
      setHint(hintText)
      return hintText
    } catch (err: any) {
      console.error('[Hint AI error]:', err)
      // Fallback hint based on evidence title
      const fallback = evidence 
        ? `Isipin mo kung paano makakatulong ang card na "${evidence.title}".`
        : 'Suriin ang iyong mga ebidensya para mahanap ang sagot.'
      setHint(fallback)
      return fallback
    } finally {
      setIsGeneratingHint(false)
    }
  }, [])

  const clearHint = useCallback(() => {
    setHint(null)
    setHintError(null)
  }, [])

  return {
    hint,
    isGeneratingHint,
    hintError,
    getStyledPrompt,
    generateHint,
    clearHint
  }
}
