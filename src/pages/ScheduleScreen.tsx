import React, { useState } from 'react'
import { Play, CheckCircle2, Lock, Star } from 'lucide-react'

interface LevelNode {
  id: number
  title: string
  subject: string
  status: 'completed' | 'active' | 'locked'
  difficulty: 'Basic' | 'Medium' | 'Hard'
  stars: number
}

export const ScheduleScreen: React.FC = () => {
  const [levels] = useState<LevelNode[]>([
    { id: 1, title: 'Propositional Logic', subject: 'Discrete Math', status: 'completed', difficulty: 'Basic', stars: 3 },
    { id: 2, title: 'Truth Tables & Proofs', subject: 'Discrete Math', status: 'active', difficulty: 'Basic', stars: 0 },
    { id: 3, title: 'Sets & Venn Diagrams', subject: 'Discrete Math', status: 'locked', difficulty: 'Medium', stars: 0 },
    { id: 4, title: 'Functions & Relations', subject: 'Discrete Math', status: 'locked', difficulty: 'Medium', stars: 0 },
    { id: 5, title: 'Graph Theory Intro', subject: 'Discrete Math', status: 'locked', difficulty: 'Hard', stars: 0 },
  ])

  return (
    <div className="w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-[var(--surface)] p-4 rounded-large shadow-custom border border-[var(--border)]">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Academic Learning Map</h1>
        <p className="text-xs text-[var(--muted)]">Defeat academic rivals to unlock milestones. Upload docs in Battle tab!</p>
      </div>

      {/* Map Nodes */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-6 border border-[var(--border)] relative overflow-hidden flex flex-col gap-6">
        <div className="relative flex flex-col items-center gap-12 py-4">
          {/* Vertical pathway line */}
          <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1.5 bg-slate-200 rounded-full z-0">
            <div className="h-[40%] bg-[var(--primary)] rounded-full"></div>
          </div>

          {levels.map((lvl, index) => {
            const isCompleted = lvl.status === 'completed'
            const isActive = lvl.status === 'active'
            const isLeft = index % 2 === 0

            return (
              <div
                key={lvl.id}
                className={`relative flex items-center w-full z-10 ${
                  isLeft ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Node bubble */}
                <div className="w-[40%] flex justify-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-md transition-all ${
                      isCompleted
                        ? 'bg-[var(--primary)] border-emerald-200 text-white scale-105'
                        : isActive
                        ? 'bg-[var(--accent)] border-amber-200 text-white animate-bounce scale-110'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} />
                    ) : isActive ? (
                      <Play size={24} className="fill-white pl-0.5" />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>
                </div>

                <div className="w-[10%]"></div>

                {/* Level card */}
                <div className="w-[50%]">
                  <div
                    className={`p-3 rounded-medium border transition-all ${
                      isCompleted
                        ? 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'
                        : isActive
                        ? 'bg-[var(--surface-hi)] border-[var(--primary)] shadow-md'
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[9px] font-mono font-bold tracking-wider text-[var(--muted)] uppercase">
                        LEVEL {lvl.id}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          lvl.difficulty === 'Basic'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : lvl.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}
                      >
                        {lvl.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-[var(--text)] mt-1">{lvl.title}</h3>
                    <p className="text-[10px] text-[var(--muted)]">{lvl.subject}</p>

                    {isCompleted && (
                      <div className="flex items-center gap-0.5 mt-2 text-amber-500">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} size={10} className="fill-amber-500" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
