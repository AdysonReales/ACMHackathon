import React from 'react'
import { Play, CheckCircle2, Lock } from 'lucide-react'

import { useScheduleController } from '../controllers/useScheduleController'

export const ScheduleScreen: React.FC = () => {
  const { levels } = useScheduleController()

  return (
    <div className="w-full max-w-lg mx-auto pt-8 px-4 flex flex-col gap-6 pb-12 font-['Space_Grotesk']">
      
      {/* Header Panel */}
      <div className="bg-[#e6e8ea] border-2 border-[#00236f] p-5 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,35,111,1)]">
        <h1 className="text-xl font-bold uppercase tracking-widest text-[#00236f]">Academic Map</h1>
        <p className="text-xs font-bold text-[#545560] mt-1">Defeat examiners to unlock new case files.</p>
      </div>

      {/* Map Nodes Container */}
      <div className="bg-[#f2f4f6] border-2 border-[#00236f] rounded-lg p-6 relative">
        <div className="relative flex flex-col items-center gap-8 py-2">
          
          {/* Pathway Line */}
          <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-3 bg-[#cbd5e1] border-2 border-[#757682] z-0"></div>

          {levels.map((lvl) => {
            const isCompleted = lvl.status === 'completed'
            const isActive = lvl.status === 'active'

            return (
              <div key={lvl.id} className="relative flex items-center justify-between w-full z-10 gap-4">
                
                {/* Node Bubble */}
                <div className={`w-14 h-14 border-2 border-[#00236f] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,35,111,1)] ${
                  isCompleted ? 'bg-emerald-400' : isActive ? 'bg-amber-400 animate-pulse' : 'bg-[#e6e8ea]'
                }`}>
                  {isCompleted ? <CheckCircle2 size={24} className="text-[#00236f]" /> : 
                   isActive ? <Play size={24} className="text-[#00236f] fill-[#00236f]" /> : 
                   <Lock size={20} className="text-[#757682]" />}
                </div>

                {/* Level Card */}
                <div className={`flex-1 p-4 border-2 rounded-lg ${
                  isActive 
                    ? 'bg-[#b6c4ff] border-[#00236f] shadow-[4px_4px_0px_0px_rgba(0,35,111,1)]' 
                    : 'bg-white border-[#757682] shadow-[2px_2px_0px_0px_rgba(117,118,130,0.5)]'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-[#757682] uppercase">Lv.{lvl.id}</span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase">{lvl.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-[#191c1e] text-sm">{lvl.title}</h3>
                  <p className="text-[10px] font-bold text-[#545560] uppercase">{lvl.subject}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}