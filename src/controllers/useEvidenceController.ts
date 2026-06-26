// ============================================================
// CONTROLLER — Evidence Deck State Management
// ============================================================
// Manages collected evidence cards dynamically from generated LevelData.
// Replaces hardcoded values in EvidenceScreen.

import { useState, useCallback } from 'react'
import type { EvidenceCard } from '../models/types'

export type EvidenceStatus = 'proven' | 'unconfirmed' | 'disputed'

export interface TrackedEvidence extends EvidenceCard {
  status: EvidenceStatus
  usedInPhase?: number
}

export interface EvidenceController {
  evidence: TrackedEvidence[]
  loadFromDeck: (deck: EvidenceCard[]) => void
  markProven: (evidenceId: string, phaseId: number) => void
  markDisputed: (evidenceId: string) => void
  getById: (id: string) => TrackedEvidence | undefined
  provenCount: number
  totalCount: number
  reset: () => void
}

const DEFAULT_EVIDENCE: TrackedEvidence[] = [
  {
    id: 'EV-101',
    title: 'Taglish "Kasi" Connective',
    description_bilingual: 'Used as an explanatory connector in informal classroom explanations.',
    status: 'proven',
    category: 'taglish_term'
  },
  {
    id: 'EV-102',
    title: 'Propositional Truth Claim',
    description_bilingual: 'Boolean matrix verifying that P -> Q is false only when P is true and Q is false.',
    status: 'proven',
    category: 'logic_proof'
  },
  {
    id: 'EV-103',
    title: 'Speech Dataset Log #4',
    description_bilingual: 'Contains 12 seconds of Taglish audio recording from Discrete Math Level 1.',
    status: 'proven',
    category: 'dataset'
  },
  {
    id: 'EV-104',
    title: 'Venn Diagram Paradox',
    description_bilingual: 'Disputed relation between sets showing overlapping boundary parameters.',
    status: 'unconfirmed',
    category: 'logic_proof'
  }
]

export function useEvidenceController(): EvidenceController {
  const [evidence, setEvidence] = useState<TrackedEvidence[]>(DEFAULT_EVIDENCE)

  const loadFromDeck = useCallback((deck: EvidenceCard[]) => {
    setEvidence(
      deck.map(card => ({
        ...card,
        status: card.id === 'EV-104' ? 'unconfirmed' : 'proven', // default first few as proven for demo
        category: card.category || 'logic_proof'
      }))
    )
  }, [])

  const markProven = useCallback((evidenceId: string, phaseId: number) => {
    setEvidence(prev =>
      prev.map(e =>
        e.id === evidenceId ? { ...e, status: 'proven' as EvidenceStatus, usedInPhase: phaseId } : e
      )
    )
  }, [])

  const markDisputed = useCallback((evidenceId: string) => {
    setEvidence(prev =>
      prev.map(e =>
        e.id === evidenceId ? { ...e, status: 'disputed' as EvidenceStatus } : e
      )
    )
  }, [])

  const getById = useCallback(
    (id: string) => evidence.find(e => e.id === id),
    [evidence]
  )

  const provenCount = evidence.filter(e => e.status === 'proven').length
  const totalCount = evidence.length

  const reset = useCallback(() => setEvidence(DEFAULT_EVIDENCE), [])

  return {
    evidence,
    loadFromDeck,
    markProven,
    markDisputed,
    getById,
    provenCount,
    totalCount,
    reset,
  }
}
