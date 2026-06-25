import React from 'react'
import { Briefcase, FileText, Check, Music, HelpCircle } from 'lucide-react'

interface EvidenceItem {
  id: string
  title: string
  description: string
  status: 'proven' | 'unconfirmed' | 'disputed'
  category: 'taglish_term' | 'logic_proof' | 'dataset'
}

export const EvidenceScreen: React.FC = () => {
  const evidenceList: EvidenceItem[] = [
    {
      id: 'EV-101',
      title: 'Taglish "Kasi" Connective',
      description: 'Used as an explanatory connector in informal classroom explanations. Proves high speech filler density.',
      status: 'proven',
      category: 'taglish_term'
    },
    {
      id: 'EV-102',
      title: 'Propositional Truth Claim',
      description: 'Boolean matrix verifying that P -> Q is false only when P is true and Q is false. Peer reviewed.',
      status: 'proven',
      category: 'logic_proof'
    },
    {
      id: 'EV-103',
      title: 'Speech Dataset Log #4',
      description: 'Contains 12 seconds of Taglish audio recording from Discrete Math Level 1 with 8 filler annotations.',
      status: 'proven',
      category: 'dataset'
    },
    {
      id: 'EV-104',
      title: 'Venn Diagram Paradox',
      description: 'Disputed relation between sets showing overlapping boundary parameters. Requires oral rebuttal to unlock.',
      status: 'unconfirmed',
      category: 'logic_proof'
    }
  ]

  return (
    <div className="w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-6">
      {/* Header Info */}
      <div className="bg-[var(--surface)] p-4 rounded-large shadow-custom border border-[var(--border)]">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Evidence Bag</h1>
        <p className="text-xs text-[var(--muted)]">Inspect collected speech annotations and logical evidence</p>
      </div>

      {/* Grid of Evidence Cards (Double-Bezel Nesting) */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] flex flex-col gap-4">
        {evidenceList.map((item) => {
          const isProven = item.status === 'proven'
          return (
            <div 
              key={item.id}
              className="bg-[var(--surface-hi)] border border-[var(--border)] rounded-medium p-4 flex gap-3 hover:border-[var(--primary)] transition-colors duration-200"
            >
              {/* Category Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-medium bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  {item.category === 'taglish_term' && <Music size={18} />}
                  {item.category === 'logic_proof' && <FileText size={18} />}
                  {item.category === 'dataset' && <Briefcase size={18} />}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-[var(--muted)] px-1.5 py-0.5 bg-slate-100 rounded">
                    {item.id}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                    isProven 
                      ? 'bg-emerald-150 text-emerald-700 bg-emerald-50' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isProven ? <Check size={10} /> : <HelpCircle size={10} />}
                    {item.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[var(--text)]">{item.title}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{item.description}</p>
                
                {/* Category tag */}
                <div className="flex gap-2 mt-2">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    item.category === 'taglish_term' 
                      ? 'bg-sky-50 text-sky-700' 
                      : item.category === 'logic_proof' 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'bg-teal-50 text-teal-700'
                  }`}>
                    {item.category.replace('_', ' ').toUpperCase()}
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
