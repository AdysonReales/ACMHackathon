import React from 'react'
import { Award, Database, Mic, Flame } from 'lucide-react'

export const ProfileScreen: React.FC = () => {
  // Mock contribution stats
  const stats = [
    { label: 'Academic Level', value: 'LVL 5', icon: Award, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { label: 'Dataset Submissions', value: '14 Recordings', icon: Database, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { label: 'Speech Stutter Ratio', value: '12%', icon: Mic, color: 'text-sky-500 bg-sky-50 border-sky-200' },
    { label: 'Daily Win Streak', value: '3 Days', icon: Flame, color: 'text-rose-500 bg-rose-50 border-rose-200' },
  ]

  return (
    <div className="w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-6">
      {/* Profile Header */}
      <div className="bg-[var(--surface)] p-6 rounded-large shadow-custom border border-[var(--border)] flex items-center gap-4">
        <div className="w-16 h-16 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md border-4 border-white">
          S
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Scholar-0418</h1>
          <p className="text-xs text-[var(--muted)]">Student & Speech Data Contributor</p>
          <div className="flex gap-2 mt-1.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
              OPEN SOURCE VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid (Double-Bezel & Soft Nesting) */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-5 border border-[var(--border)] flex flex-col gap-4">
        <h2 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider pl-1">
          Contribution Ledger
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {stats.map((st, i) => {
            const Icon = st.icon
            return (
              <div 
                key={i}
                className="bg-[var(--surface-hi)] border border-[var(--border)] rounded-medium p-4 flex flex-col justify-between hover:border-[var(--primary)] transition-colors duration-200"
              >
                <div className="flex justify-between items-center w-full mb-3">
                  <span className="text-[10px] font-semibold text-[var(--muted)]">{st.label}</span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${st.color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <span className="font-mono text-lg font-bold text-[var(--text)]">{st.value}</span>
              </div>
            )
          })}
        </div>

        {/* Dataset Contribution Progress Info (Theme 1 & 2 target) */}
        <div className="mt-4 p-4 bg-emerald-50/55 border border-emerald-100 rounded-medium flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
            <span>Philippine Languages Dataset Impact</span>
            <span>70%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[70%]"></div>
          </div>
          <p className="text-[10px] text-emerald-700 mt-1 leading-relaxed">
            Your Taglish microphone submissions help researchers train robust ASR (Automatic Speech Recognition) models. Thank you for contributing to Tinig Sa Liwanag!
          </p>
        </div>
      </div>
    </div>
  )
}
