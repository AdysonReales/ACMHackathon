import React from 'react'
import { Award, Database, Mic, Flame } from 'lucide-react'

import { useProfileController } from '../controllers/useProfileController'

export const ProfileScreen: React.FC = () => {
  const { profile } = useProfileController()

  const winRate = profile.totalBattles > 0
    ? Math.round((profile.totalWins / profile.totalBattles) * 100)
    : 0

  const stats = [
    { label: 'Academic Level', value: `LVL ${profile.level}`, icon: Award },
    { label: 'Dataset Submissions', value: `${profile.totalWins} Wins`, icon: Database },
    { label: 'Win Rate', value: `${winRate}%`, icon: Mic },
    { label: 'Daily Streak', value: `${profile.dailyStreak} Days`, icon: Flame },
  ]

  return (
    <div className="w-full max-w-lg mx-auto pt-8 px-4 flex flex-col gap-6 pb-12 font-['Space_Grotesk']">
      
      {/* Profile Header */}
      <div className="bg-[#e6e8ea] border-2 border-[#00236f] p-6 shadow-[4px_4px_0px_0px_rgba(0,35,111,1)] flex items-center gap-5">
        <div className="w-16 h-16 bg-[#00236f] text-white flex items-center justify-center font-bold text-2xl border-2 border-[#00236f] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
          {profile.displayName ? profile.displayName[0].toUpperCase() : 'S'}
        </div>
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-[#00236f]">
            {profile.displayName}
          </h1>
          <p className="text-xs font-bold text-[#545560] uppercase">Speech Data Contributor</p>
          <div className="mt-2">
            <span className="text-[9px] font-bold px-2 py-1 bg-[#b6c4ff] text-[#00236f] border border-[#00236f]">
              VERIFIED CONTRIBUTOR
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-5 shadow-[4px_4px_0px_0px_rgba(0,35,111,1)] flex flex-col gap-4">
        <h2 className="text-xs font-bold text-[#00236f] uppercase tracking-widest pl-1 border-b-2 border-[#cbd5e1] pb-2">
          Contribution Ledger
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {stats.map((st, i) => {
            const Icon = st.icon
            return (
              <div 
                key={i}
                className="bg-white border-2 border-[#757682] p-4 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(117,118,130,0.5)]"
              >
                <div className="flex justify-between items-center w-full mb-3">
                  <span className="text-[9px] font-bold text-[#545560] uppercase tracking-wider">{st.label}</span>
                  <Icon size={16} className="text-[#00236f]" />
                </div>
                <span className="font-mono text-lg font-bold text-[#00236f]">{st.value}</span>
              </div>
            )
          })}
        </div>

        {/* Impact Box */}
        <div className="mt-2 p-4 bg-[#e6e8ea] border-2 border-[#00236f] flex flex-col gap-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-[#00236f] uppercase">
            <span>XP Progress to Level Up</span>
            <span>{Math.round((profile.xp / profile.xpToNext) * 100)}%</span>
          </div>
          <div className="w-full bg-[#cbd5e1] h-4 border-2 border-[#00236f] relative">
            <div 
              className="bg-[#00236f] h-full transition-all duration-300"
              style={{ width: `${Math.round((profile.xp / profile.xpToNext) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] font-medium text-[#191c1e] leading-relaxed">
            Your Taglish submissions improve ASR model accuracy. Thank you for contributing to <strong>Tinig Sa Liwanag</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}