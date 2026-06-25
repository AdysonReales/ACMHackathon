// ============================================================
// VIEW — CombatScreen (Retro Pixel Court Aesthetic)
// ============================================================

import React, { useRef, useState } from 'react'
import { Upload, Send, Loader2, RefreshCw, BookOpen, Lightbulb } from 'lucide-react'
import { useCombatController } from '../controllers/useCombatController'
import type { LevelData } from '../models/types'

import reyes from "../assets/reyes.png";
import santos from "../assets/santos.png";
import byte from "../assets/byte.png";
import luna from '../assets/luna.png'


// Extend LevelData locally if it doesn't strictly have 'subject' in its definition
interface ExtendedLevelData extends LevelData {
  subject?: string;
}

interface CombatScreenProps {
  customLevelData?: LevelData | null
}

interface ProfessorConfig {
  id: string;
  name: string;
  style: string;
  diff: string;
  desc: string;
  image?: string; // Declared optional property to fix Error Line 77
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ customLevelData }) => {
  // Cast safely to let type checks read the subject property if available
  const c = useCombatController(customLevelData) as any
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Local state for Professor Selection UX
  const [selectedProf, setSelectedProf] = useState<string>('reyes')

const professors: ProfessorConfig[] = [
  {
    id: 'reyes',
    name: 'Prof. Reyes',
    style: 'Strict Examiner',
    diff: '★★★★★',
    desc: 'Challenges assumptions, thesis defense style.',
    image: reyes
  },
  {
    id: 'santos',
    name: 'Prof. Santos',
    style: 'Filipino Mentor',
    diff: '★★☆☆☆',
    desc: 'Uses relatable Taglish examples. Beginner friendly.',
    image: santos
  },
  {
    id: 'byte',
    name: 'Prof. Byte',
    style: 'Technical Debugger',
    diff: '★★★★☆',
    desc: 'Focuses on pure logical reasoning and edge cases.',
    image: byte
  },
  {
    id: 'luna',
    name: 'Prof. Luna',
    style: 'Learning Companion',
    diff: '★★☆☆☆',
    desc: 'Highly supportive and adapts to your pace.',
    image: luna
  }
]

  // ============================================================
  // PHASE 1: SETUP (Upload & Select Professor)
  // ============================================================
  if (c.screen === 'upload') {
    return (
      <div className="w-full max-w-2xl mx-auto pt-8 px-4 flex flex-col gap-8 pb-12">
        
        {/* Document Upload Area */}
        <div className="flex flex-col gap-3">
          <h2 className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest text-[#757682] pl-1">
            1. Study Material
          </h2>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#e6e8ea] border-2 border-[#00236f] rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,35,111,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,35,111,1)]"
          >
            <Upload size={28} className="text-[#00236f] mb-2" />
            <span className="font-['Space_Grotesk'] text-lg font-bold text-[#00236f]">Upload Document to Start</span>
            <span className="text-xs text-[#545560] font-medium">PDF, Notes, or Screenshots</span>
          </div>
          <input type="file" ref={fileInputRef} onChange={c.handleFileUpload} className="hidden" accept=".pdf,.txt,.json,.md" />
        </div>

        {/* Professor Selection */}
        <div className="flex flex-col gap-3">
          <h2 className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest text-[#757682] pl-1">
            2. Choose Your Examiner
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {professors.map(prof => {
              const isSelected = selectedProf === prof.id

              return (
                <div
                  key={prof.id}
                  onClick={() => setSelectedProf(prof.id)}
                  className={`flex gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all items-start ${
                    isSelected
                      ? 'bg-[#b6c4ff] border-[#00236f] shadow-[4px_4px_0px_0px_rgba(0,35,111,1)]'
                      : 'bg-[#f2f4f6] border-[#757682] hover:border-[#00236f] shadow-[2px_2px_0px_0px_rgba(117,118,130,0.5)]'
                  }`}
                >

                  {/* ======================================================
                      PROF PORTRAIT SLOT (PIXEL SPRITE PLACEHOLDER)
                  ====================================================== */}
                  <div className="w-14 h-14 flex-shrink-0 border-2 border-[#00236f] rounded-md bg-[#e6e8ea] shadow-[2px_2px_0px_0px_rgba(0,35,111,0.4)] overflow-hidden flex items-center justify-center">
                    <img
                      src={prof.image || '/placeholder-prof.png'}
                      alt={prof.name}
                      className="w-full h-full object-cover pixelated"
                    />
                  </div>

                  {/* ======================================================
                      PROF INFO
                  ====================================================== */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-['Space_Grotesk'] font-bold text-base ${
                        isSelected ? 'text-[#00236f]' : 'text-[#191c1e]'
                      }`}>
                        {prof.name}
                      </h3>

                      <span className="text-xs text-amber-600 tracking-widest">
                        {prof.diff}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#44474e] mb-2 uppercase tracking-wide">
                      {prof.style}
                    </p>

                    <p className="text-xs text-[#545560] leading-relaxed font-medium">
                      {prof.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    )
  }

  // ============================================================
  // PHASE 2: COMPILING
  // ============================================================
  if (c.screen === 'compiling') {
    return (
      <div className="w-full max-w-lg mx-auto pt-24 px-4 flex flex-col items-center text-center gap-4">
        <Loader2 className="animate-spin text-[#00236f]" size={40} />
        <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#00236f]">Analyzing Case File...</h2>
        <p className="text-sm text-[#545560] font-medium">The digital magistrate is structuring your cross-examination layout.</p>
      </div>
    )
  }

  // ============================================================
  // PHASE 3: EVALUATION DEBRIEF (Replaces Victory/Defeat)
  // ============================================================
  if (c.screen === 'victory' || c.screen === 'defeat') {
    return (
      <div className="w-full max-w-lg mx-auto pt-8 px-4 flex flex-col gap-6 pb-12">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#00236f] mb-1">Defense Evaluation</h1>
        
        {/* Retro Pixel Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-4 rounded-lg flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,35,111,1)]">
            <span className="text-[10px] uppercase font-bold text-[#545560] mb-1 tracking-wider text-center">Logic</span>
            <span className="text-2xl font-mono font-bold text-[#00236f]">92%</span>
          </div>
          <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-4 rounded-lg flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,35,111,1)]">
            <span className="text-[10px] uppercase font-bold text-[#545560] mb-1 tracking-wider text-center">Clarity</span>
            <span className="text-2xl font-mono font-bold text-sky-700">88%</span>
          </div>
          <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-4 rounded-lg flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,35,111,1)]">
            <span className="text-[10px] uppercase font-bold text-[#545560] mb-1 tracking-wider text-center">Poise</span>
            <span className="text-2xl font-mono font-bold text-amber-600">80%</span>
          </div>
        </div>

        {/* Text-First Professor Feedback Layout */}
        <div className="bg-[#e6e8ea] border-2 border-[#00236f] p-5 rounded-lg flex flex-col gap-3 shadow-[4px_4px_0px_0px_rgba(0,35,111,1)]">
          <div className="flex items-center gap-2 border-b border-[#757682] pb-2">
            <BookOpen size={18} className="text-[#00236f]" />
            <span className="font-['Space_Grotesk'] font-bold text-sm text-[#00236f] uppercase tracking-wider">
              Professor's Bench Notes
            </span>
          </div>
          <p className="text-sm text-[#191c1e] leading-relaxed font-medium italic">
            "Your understanding of normalization is solid, but you struggled to explain the concept of partial dependencies. Review 2NF again before moving on."
          </p>
        </div>

        <button
          onClick={c.resetAll}
          className="w-full py-4 bg-[#00236f] hover:bg-[#1a3a8a] text-white font-['Space_Grotesk'] font-bold text-base rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(25,28,30,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(25,28,30,1)]"
        >
          Next Challenge
        </button>
      </div>
    )
  }

  // ============================================================
  // PHASE 4: THE ACADEMIC BATTLE (Focus Mode)
  // ============================================================
  return (
    <div className="w-full max-w-2xl mx-auto pt-6 px-4 flex flex-col h-[calc(100vh-160px)] justify-between pb-8">
      
      {/* Top Meta Bar */}
      <div className="flex justify-between items-center mb-4 border-b border-[#cbd5e1] pb-2">
        <span className="font-['Space_Grotesk'] text-xs font-bold text-[#545560] uppercase tracking-wider">
          Topic: {(c.levelData as ExtendedLevelData)?.subject || 'Learning Phase'}
        </span>
        <button 
          onClick={c.resetAll} 
          className="text-xs text-[#757682] hover:text-[#00236f] font-bold flex items-center gap-1 transition-colors"
        >
          <RefreshCw size={12} /> Restart Case
        </button>
      </div>

      {/* The Professor's Prompt Container */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4 pr-1">
        <div className="flex flex-col gap-2 bg-[#f2f4f6] border-2 border-[#757682] p-5 rounded-lg shadow-[2px_2px_0px_0px_rgba(117,118,130,0.4)]">
          <span className="font-['Space_Grotesk'] text-xs font-bold text-[#00236f] uppercase tracking-widest">
            {c.opponentName || 'Examiner'} Cross-Examines:
          </span>
          <h2 className="text-lg md:text-xl font-bold text-[#191c1e] leading-relaxed font-['Space_Grotesk']">
            {c.currentPhase?.flawed_argument || "Primary keys prevent SQL injection attacks. True or False? Explain your reasoning."}
          </h2>
        </div>
      </div>

      {/* Retro Defense Input & Actions Area */}
      <div className="flex flex-col gap-4 shrink-0 mt-2">
        <div className="relative">
          <textarea
            value={c.defenseInput}
            onChange={(e) => c.setDefenseInput(e.target.value)}
            disabled={c.isGrading}
            placeholder="Construct your defense here... (Taglish is accepted)"
            className="w-full text-base p-4 bg-white border-2 border-[#00236f] rounded-lg focus:ring-0 focus:outline-none min-h-[120px] max-h-[160px] resize-none text-[#191c1e] font-medium leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,35,111,0.15)] placeholder-[#757682]"
          />
        </div>

        {/* Action Button Dock */}
        <div className="flex gap-3">
          <button
            onClick={() => {/* Trigger Hint Logic */}}
            className="px-4 py-3 bg-[#e6e8ea] border-2 border-[#757682] text-[#191c1e] font-bold rounded-lg hover:bg-[#cbd5e1] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Lightbulb size={18} className="text-amber-600 animate-pulse" />
            <span className="hidden sm:inline font-['Space_Grotesk'] text-sm">Ask for Hint</span>
          </button>
          
          <button
            onClick={c.handleSubmitDefense}
            disabled={c.isGrading || !c.defenseInput.trim()}
            className="flex-1 py-3 bg-[#00236f] hover:bg-[#1a3a8a] text-white font-['Space_Grotesk'] font-bold text-base rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(25,28,30,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(25,28,30,1)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {c.isGrading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>Present Defense</span>
                <Send size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}