import React from 'react'
import { Briefcase, FileText, Check, Music, HelpCircle } from 'lucide-react'



import { useEvidenceController } from '../controllers/useEvidenceController'

export const EvidenceScreen: React.FC = () => {
  const { evidence } = useEvidenceController()

  return (
    <div className="w-full max-w-lg mx-auto pt-8 px-4 flex flex-col gap-6 pb-12 font-['Space_Grotesk']">
      {/* Header Info */}
      <div className="bg-[#e6e8ea] p-5 border-2 border-[#00236f] shadow-[4px_4px_0px_0px_rgba(0,35,111,1)]">
        <h1 className="text-xl font-bold uppercase tracking-widest text-[#00236f]">Evidence Bag</h1>
        <p className="text-xs font-bold text-[#545560] mt-1">Inspecting collected court exhibits.</p>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-5 flex flex-col gap-4">
        {evidence.map((item) => {
          const isProven = item.status === 'proven'
          const category = item.category || 'logic_proof'
          return (
            <div 
              key={item.id}
              className="bg-white border-2 border-[#757682] p-4 flex gap-4 shadow-[2px_2px_0px_0px_rgba(117,118,130,0.5)]"
            >
              {/* Category Icon */}
              <div className="w-12 h-12 border-2 border-[#00236f] bg-[#e6e8ea] flex-shrink-0 flex items-center justify-center text-[#00236f]">
                {category === 'taglish_term' && <Music size={20} />}
                {category === 'logic_proof' && <FileText size={20} />}
                {category === 'dataset' && <Briefcase size={20} />}
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] font-bold text-[#545560] bg-[#cbd5e1] px-1">
                    {item.id}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`text-[8px] font-bold px-2 py-0.5 border flex items-center gap-1 ${
                    isProven 
                      ? 'bg-emerald-400 border-[#00236f] text-[#00236f]' 
                      : 'bg-amber-400 border-[#00236f] text-[#00236f]'
                  }`}>
                    {isProven ? <Check size={10} /> : <HelpCircle size={10} />}
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-[#191c1e] text-sm">{item.title}</h3>
                <p className="text-[10px] text-[#545560] leading-relaxed font-bold">{item.description_bilingual}</p>
                
                {/* Category tag */}
                <div className="mt-1">
                  <span className="text-[8px] font-bold text-[#00236f] uppercase underline decoration-2 underline-offset-2">
                    {category.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}