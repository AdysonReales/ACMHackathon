// ============================================================
// CONTROLLER — Student Adaptive Profile
// ============================================================
// Tracks learning performance, weak/strong areas, preferred style.
// Persists to localStorage. Ready for ProfileScreen to consume.

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'proseso_student_profile'

export interface TopicScore {
  topic: string
  correct: number
  total: number
  avgGrade: number
}

export interface StudentProfile {
  displayName: string
  level: number
  xp: number
  xpToNext: number
  totalBattles: number
  totalWins: number
  totalLosses: number
  dailyStreak: number
  lastPlayedDate: string | null
  preferredStyle: 'filipino' | 'english' | 'taglish'
  topicScores: TopicScore[]
  stutterRatio: number
  totalFillers: number
  totalWords: number
}

const DEFAULT_PROFILE: StudentProfile = {
  displayName: 'Scholar',
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalBattles: 0,
  totalWins: 0,
  totalLosses: 0,
  dailyStreak: 0,
  lastPlayedDate: null,
  preferredStyle: 'taglish',
  topicScores: [],
  stutterRatio: 0,
  totalFillers: 0,
  totalWords: 0,
}

function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
  } catch { /* ignore corrupt data */ }
  return { ...DEFAULT_PROFILE }
}

function saveProfile(profile: StudentProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export interface ProfileController {
  profile: StudentProfile
  recordBattleResult: (won: boolean, topic: string, grade: number, fillerCount: number, wordCount: number) => void
  getStrongTopics: () => TopicScore[]
  getWeakTopics: () => TopicScore[]
  resetProfile: () => void
}

export function useProfileController(): ProfileController {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile)

  // Persist on every change
  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  const recordBattleResult = useCallback((
    won: boolean,
    topic: string,
    grade: number,
    fillerCount: number,
    wordCount: number,
  ) => {
    setProfile(prev => {
      const next = { ...prev }

      // Battle stats
      next.totalBattles += 1
      if (won) next.totalWins += 1
      else next.totalLosses += 1

      // XP + leveling
      const xpGain = won ? Math.round(grade * 1.5) : Math.round(grade * 0.5)
      next.xp += xpGain
      while (next.xp >= next.xpToNext) {
        next.xp -= next.xpToNext
        next.level += 1
        next.xpToNext = Math.round(next.xpToNext * 1.3)
      }

      // Daily streak
      const today = new Date().toISOString().slice(0, 10)
      if (prev.lastPlayedDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        next.dailyStreak = prev.lastPlayedDate === yesterday ? prev.dailyStreak + 1 : 1
        next.lastPlayedDate = today
      }

      // Stutter tracking
      next.totalFillers += fillerCount
      next.totalWords += wordCount
      next.stutterRatio = next.totalWords > 0
        ? Math.round((next.totalFillers / next.totalWords) * 100)
        : 0

      // Topic scores
      const topicScores = [...prev.topicScores]
      const existing = topicScores.find(t => t.topic === topic)
      if (existing) {
        existing.total += 1
        if (grade >= 60) existing.correct += 1
        existing.avgGrade = Math.round(
          (existing.avgGrade * (existing.total - 1) + grade) / existing.total
        )
      } else {
        topicScores.push({
          topic,
          correct: grade >= 60 ? 1 : 0,
          total: 1,
          avgGrade: grade,
        })
      }
      next.topicScores = topicScores

      return next
    })
  }, [])

  const getStrongTopics = useCallback(
    () => profile.topicScores.filter(t => t.avgGrade >= 70).sort((a, b) => b.avgGrade - a.avgGrade),
    [profile.topicScores]
  )

  const getWeakTopics = useCallback(
    () => profile.topicScores.filter(t => t.avgGrade < 70).sort((a, b) => a.avgGrade - b.avgGrade),
    [profile.topicScores]
  )

  const resetProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfile({ ...DEFAULT_PROFILE })
  }, [])

  return {
    profile,
    recordBattleResult,
    getStrongTopics,
    getWeakTopics,
    resetProfile,
  }
}
