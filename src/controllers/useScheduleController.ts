// ============================================================
// CONTROLLER — Level Progression / Schedule Map
// ============================================================
// Manages level unlock state, star ratings, and progression.
// Persists to localStorage. Ready for ScheduleScreen to consume.

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'proseso_level_progress'

export interface LevelProgress {
  id: number
  title: string
  subject: string
  status: 'completed' | 'active' | 'locked'
  difficulty: 'Basic' | 'Medium' | 'Hard'
  stars: number           // 0-3 based on performance
  bestGrade: number       // highest average grade achieved
  attempts: number
}

const DEFAULT_LEVELS: LevelProgress[] = [
  { id: 1, title: 'Propositional Logic', subject: 'Discrete Math', status: 'active', difficulty: 'Basic', stars: 0, bestGrade: 0, attempts: 0 },
  { id: 2, title: 'Truth Tables & Proofs', subject: 'Discrete Math', status: 'locked', difficulty: 'Basic', stars: 0, bestGrade: 0, attempts: 0 },
  { id: 3, title: 'Sets & Venn Diagrams', subject: 'Discrete Math', status: 'locked', difficulty: 'Medium', stars: 0, bestGrade: 0, attempts: 0 },
  { id: 4, title: 'Functions & Relations', subject: 'Discrete Math', status: 'locked', difficulty: 'Medium', stars: 0, bestGrade: 0, attempts: 0 },
  { id: 5, title: 'Graph Theory Intro', subject: 'Discrete Math', status: 'locked', difficulty: 'Hard', stars: 0, bestGrade: 0, attempts: 0 },
]

function loadLevels(): LevelProgress[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore corrupt data */ }
  return DEFAULT_LEVELS.map(l => ({ ...l }))
}

function saveLevels(levels: LevelProgress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(levels))
}

function gradeToStars(grade: number): number {
  if (grade >= 90) return 3
  if (grade >= 70) return 2
  if (grade >= 50) return 1
  return 0
}

export interface ScheduleController {
  levels: LevelProgress[]
  activeLevel: LevelProgress | undefined
  completeLevelWithGrade: (levelId: number, avgGrade: number) => void
  addCustomLevel: (title: string, subject: string, difficulty: 'Basic' | 'Medium' | 'Hard') => void
  resetProgress: () => void
}

export function useScheduleController(): ScheduleController {
  const [levels, setLevels] = useState<LevelProgress[]>(loadLevels)

  useEffect(() => {
    saveLevels(levels)
  }, [levels])

  const activeLevel = levels.find(l => l.status === 'active')

  const completeLevelWithGrade = useCallback((levelId: number, avgGrade: number) => {
    setLevels(prev => {
      const next = prev.map(l => ({ ...l }))
      const idx = next.findIndex(l => l.id === levelId)
      if (idx === -1) return prev

      // Update completed level
      const level = next[idx]
      level.status = 'completed'
      level.attempts += 1
      level.bestGrade = Math.max(level.bestGrade, avgGrade)
      level.stars = Math.max(level.stars, gradeToStars(avgGrade))

      // Unlock next level
      if (idx + 1 < next.length && next[idx + 1].status === 'locked') {
        next[idx + 1].status = 'active'
      }

      return next
    })
  }, [])

  const addCustomLevel = useCallback((title: string, subject: string, difficulty: 'Basic' | 'Medium' | 'Hard') => {
    setLevels(prev => {
      const maxId = Math.max(...prev.map(l => l.id), 0)
      return [
        ...prev,
        {
          id: maxId + 1,
          title,
          subject,
          status: 'locked' as const,
          difficulty,
          stars: 0,
          bestGrade: 0,
          attempts: 0,
        },
      ]
    })
  }, [])

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setLevels(DEFAULT_LEVELS.map(l => ({ ...l })))
  }, [])

  return {
    levels,
    activeLevel,
    completeLevelWithGrade,
    addCustomLevel,
    resetProgress,
  }
}
