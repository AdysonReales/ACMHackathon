// ============================================================
// CONTROLLER — Evidence Deck State Management
// ============================================================
// Manages collected evidence cards dynamically from generated LevelData.
// Ready for EvidenceScreen to consume (replaces hardcoded list).

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

export function useEvidenceController(): EvidenceController {
  const [evidence, setEvidence] = useState<TrackedEvidence[]>([])

  const loadFromDeck = useCallback((deck: EvidenceCard[]) => {
    setEvidence(
      deck.map(card => ({
        ...card,
        status: 'unconfirmed' as EvidenceStatus,
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

  const reset = useCallback(() => setEvidence([]), [])

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
