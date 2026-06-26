// ============================================================
// VIEW — CombatScreen (Retro Pixel Court Aesthetic with Battle Arena)
// ============================================================

import React, { useRef } from 'react'
import { Upload, Send, Loader2, RefreshCw, BookOpen, Lightbulb, Mic } from 'lucide-react'
import { useCombatController } from '../controllers/useCombatController'
import type { LevelData } from '../models/types'

// Professor Assets
import reyes from "../assets/reyes.png";
import santos from "../assets/santos.png";
import byte from "../assets/byte.png";
import luna from '../assets/luna.png';

// Battle Arena Assets
import you from '../assets/you.png';
import background from '../assets/background.png';

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
  image?: string; 
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ customLevelData }) => {
  // Cast safely to let type checks read the subject property if available
  const c = useCombatController(customLevelData) as any
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // State bound to controller
  const selectedProf = c.selectedProf
  const setSelectedProf = c.setSelectedProf

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
      <div className="w-full max-w-2xl mx-auto pt-8 px-4 flex flex-col gap-8 pb-24">
        
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
                  <div className="w-14 h-14 flex-shrink-0 border-2 border-[#00236f] rounded-md bg-[#e6e8ea] shadow-[2px_2px_0px_0px_rgba(0,35,111,0.4)] overflow-hidden flex items-center justify-center">
                    <img
                      src={prof.image || '/placeholder-prof.png'}
                      alt={prof.name}
                      style={{ imageRendering: 'pixelated' }}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
  // PHASE 3: EVALUATION DEBRIEF (Victory/Defeat)
  // ============================================================
  if (c.screen === 'defeat') {
    return (
      <div className="w-full max-w-lg mx-auto pt-12 px-4 flex flex-col gap-6 pb-24 font-['Space_Grotesk']">
        <div className="bg-red-600 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-white my-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase animate-pulse">
            GISADO KA!
          </h1>
          <p className="text-sm font-bold uppercase tracking-wider mt-4 text-red-100">
            You failed to defend your thesis.
          </p>
        </div>

        <div className="bg-white border-2 border-black p-5 flex flex-col gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="font-bold text-xs uppercase text-gray-500">Case Evaluation Result</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed font-bold">
            The panel was not convinced by your defense. The professor grilled your arguments until they crumbled.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => c.changeOpponent(c.selectedProf)}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            RETRY CHALLENGE
          </button>
          <button
            onClick={c.resetAll}
            className="w-full py-3 bg-white hover:bg-gray-100 text-[#191c1e] font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all active:translate-y-0.5"
          >
            Change Topic / Upload New File
          </button>
        </div>

        {/* Challenge Another Professor */}
        <div className="border-t border-gray-300 pt-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Or Challenge Another Professor:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {professors.map(p => {
              const isCurrent = c.selectedProf === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => c.changeOpponent(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    isCurrent
                      ? 'bg-red-100 border-red-400 shadow-[2px_2px_0px_0px_rgba(220,38,38,0.4)] pointer-events-none'
                      : 'bg-white border-[#757682] hover:border-[#00236f] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5'
                  }`}
                >
                  <div className="w-10 h-10 border border-[#00236f] rounded overflow-hidden bg-[#e6e8ea] shrink-0">
                    <img src={p.image} alt={p.name} style={{ imageRendering: 'pixelated' }} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#191c1e]">{p.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest text-[#545560]">{p.diff}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (c.screen === 'victory') {
    const logicScore = c.evaluation?.logic ?? 0
    const clarityScore = c.evaluation?.clarity ?? 0
    const poiseScore = c.evaluation?.poise ?? 0
    const benchNotes = c.evaluation?.notes ?? 'Evaluating your defense...'

    return (
      <div className="w-full max-w-lg mx-auto pt-8 px-4 flex flex-col gap-6 pb-24">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#00236f] mb-1">Defense Evaluation</h1>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-4 rounded-lg flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,35,111,1)]">
            <span className="text-[10px] uppercase font-bold text-[#545560] mb-1 tracking-wider text-center">Logic</span>
            <span className="text-2xl font-mono font-bold text-[#00236f]">{logicScore}%</span>
          </div>
          <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-4 rounded-lg flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,35,111,1)]">
            <span className="text-[10px] uppercase font-bold text-[#545560] mb-1 tracking-wider text-center">Clarity</span>
            <span className="text-2xl font-mono font-bold text-sky-700">{clarityScore}%</span>
          </div>
          <div className="bg-[#f2f4f6] border-2 border-[#00236f] p-4 rounded-lg flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,35,111,1)]">
            <span className="text-[10px] uppercase font-bold text-[#545560] mb-1 tracking-wider text-center">Poise</span>
            <span className="text-2xl font-mono font-bold text-amber-600">{poiseScore}%</span>
          </div>
        </div>

        <div className="bg-[#e6e8ea] border-2 border-[#00236f] p-5 rounded-lg flex flex-col gap-3 shadow-[4px_4px_0px_0px_rgba(0,35,111,1)]">
          <div className="flex items-center gap-2 border-b border-[#757682] pb-2">
            <BookOpen size={18} className="text-[#00236f]" />
            <span className="font-['Space_Grotesk'] font-bold text-sm text-[#00236f] uppercase tracking-wider">
              Professor's Bench Notes
            </span>
          </div>
          <p className="text-sm text-[#191c1e] leading-relaxed font-medium italic">
            "{benchNotes}"
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => c.changeOpponent(c.selectedProf)}
            className="w-full py-4 bg-[#00236f] hover:bg-[#1a3a8a] text-white font-['Space_Grotesk'] font-bold text-base rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(25,28,30,1)] transition-all active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(25,28,30,1)]"
          >
            Replay Defense
          </button>
          <button
            onClick={c.resetAll}
            className="w-full py-3 bg-white hover:bg-gray-100 text-[#191c1e] font-['Space_Grotesk'] font-bold text-sm rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(25,28,30,0.2)] transition-all active:translate-y-0.5"
          >
            Change Topic / Upload New File
          </button>
        </div>

        {/* Challenge Another Professor */}
        <div className="border-t border-[#cbd5e1] pt-5">
          <h3 className="font-['Space_Grotesk'] text-xs font-bold text-[#545560] uppercase tracking-wider mb-3">
            Or Challenge Another Professor on this Topic:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {professors.map(p => {
              const isCurrent = c.selectedProf === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => c.changeOpponent(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    isCurrent
                      ? 'bg-[#b6c4ff] border-[#00236f] shadow-[2px_2px_0px_0px_rgba(0,35,111,1)] pointer-events-none'
                      : 'bg-white border-[#757682] hover:border-[#00236f] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5'
                  }`}
                >
                  <div className="w-10 h-10 border border-[#00236f] rounded overflow-hidden bg-[#e6e8ea] shrink-0">
                    <img src={p.image} alt={p.name} style={{ imageRendering: 'pixelated' }} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#191c1e]">{p.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest text-[#545560]">{p.diff}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // PHASE 4: THE ACADEMIC BATTLE (Focus Mode)
  // ============================================================
  
  // Find the selected professor data for the battle UI
  const activeProf = professors.find(p => p.id === selectedProf) || professors[0];

  return (
    // Changed layout to standard scrollable flex column with extra padding (pb-28) at the bottom to clear navbars
    <div className={`w-full max-w-2xl mx-auto pt-6 px-4 flex flex-col gap-4 pb-28 ${c.screenShake ? 'animate-bounce' : ''}`}>
      
      {/* Top Meta Bar */}
      <div className="flex justify-between items-center border-b border-[#cbd5e1] pb-2 shrink-0">
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

      {/* ==========================================================
          THE POKÉMON-STYLE BATTLE ARENA (SWAPPED POSITIONS)
      ========================================================== */}
      <div 
        className="relative w-full h-56 sm:h-64 rounded-lg border-4 border-[#00236f] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,35,111,1)] shrink-0"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* PLAYER STATS (Top Left - Above Player) */}
        <div className="absolute top-3 left-3 bg-[#f2f4f6] border-2 border-[#00236f] p-2 rounded shadow-sm w-36 sm:w-48 z-10">
          <div className="flex justify-between items-center mb-1">
            <span className="font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold uppercase text-emerald-700">Defender (You)</span>
            <span className="font-mono text-[10px] font-bold">{c.playerHp}/100</span>
          </div>
          <div className="w-full bg-slate-300 h-2 sm:h-3 border border-[#757682]">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${c.playerHp}%` }} />
          </div>
        </div>

        {/* PLAYER SPRITE (Bottom Left) */}
        <div className="absolute bottom-2 left-4 sm:left-8 flex flex-col items-center">
          <img 
            src={you} 
            alt="You (Defender)" 
            style={{ imageRendering: 'pixelated' }}
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain" 
          />
        </div>

        {/* PROFESSOR SPRITE (Top Right) */}
        <div className="absolute top-2 right-4 sm:right-8 flex flex-col items-center">
          <img 
            src={activeProf.image} 
            alt={activeProf.name} 
            style={{ imageRendering: 'pixelated' }}
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain" 
          />
        </div>

        {/* PROFESSOR STATS (Bottom Right - Below Professor) */}
        <div className="absolute bottom-3 right-3 bg-[#f2f4f6] border-2 border-[#00236f] p-2 rounded shadow-sm w-36 sm:w-48 z-10">
          <div className="flex justify-between items-center mb-1">
            <span className="font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold uppercase text-[#00236f]">{activeProf.name}</span>
            <span className="font-mono text-[10px] font-bold">{c.opponentHp}/100</span>
          </div>
          <div className="w-full bg-slate-300 h-2 sm:h-3 border border-[#757682]">
            <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${c.opponentHp}%` }} />
          </div>
        </div>
      </div>

      {/* ========== TURN FEEDBACK BANNER ========== */}
      {c.turnFeedback && (
        <div className={`rounded-lg border-2 p-3 text-center font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] animate-pulse shrink-0 ${
          c.turnFeedback.type === 'success'
            ? 'bg-[#d1fae5] border-emerald-600 text-emerald-900'
            : 'bg-[#ffe4e6] border-rose-600 text-rose-900'
        }`}>
          {c.turnFeedback.type === 'success' ? '✅ OBJECTION ACCEPTED!' : '❌ OBJECTION OVERRULED!'}
          <p className="text-xs font-normal mt-1 opacity-90">{c.turnFeedback.message}</p>
          <span className="text-[10px] font-mono mt-1 block">Grade: {c.turnFeedback.grade}%</span>
        </div>
      )}

      {/* The Professor's Prompt Container */}
      <div className="flex flex-col gap-2 bg-[#f2f4f6] border-2 border-[#757682] p-5 rounded-lg shadow-[2px_2px_0px_0px_rgba(117,118,130,0.4)]">
        <span className="font-['Space_Grotesk'] text-xs font-bold text-[#00236f] uppercase tracking-widest">
          {c.opponentName || activeProf.name} Cross-Examines:
        </span>
        <h2 className="text-base sm:text-lg font-bold text-[#191c1e] leading-relaxed font-['Space_Grotesk']">
          {c.styledPrompt || "Primary keys prevent SQL injection attacks. True or False? Explain your reasoning."}
        </h2>
      </div>

      {/* Retro Defense Input & Actions Area */}
      <div className="flex flex-col gap-4 shrink-0 mt-2">
        <div className="relative">
          <textarea
            value={c.defenseInput}
            onChange={(e) => c.setDefenseInput(e.target.value)}
            disabled={c.isGrading || c.waitingNextTurn || c.opponentHp <= 0 || c.playerHp <= 0}
            placeholder="Construct your defense here... (Taglish is accepted)"
            className="w-full text-sm sm:text-base p-4 pr-12 bg-white border-2 border-[#00236f] rounded-lg focus:ring-0 focus:outline-none min-h-[100px] resize-y text-[#191c1e] font-medium leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,35,111,0.15)] placeholder-[#757682]"
          />
          {c.handleMicTap && (
            <button
              onClick={c.handleMicTap}
              disabled={c.isGrading || c.waitingNextTurn}
              className={`absolute right-3 bottom-4 p-2 rounded-lg transition-all border-2 border-transparent ${
                c.isRecording
                  ? 'bg-rose-500 text-white animate-pulse border-rose-700'
                  : 'bg-[#f2f4f6] hover:bg-[#cbd5e1] text-[#545560] hover:border-[#757682]'
              }`}
              title="Speech Input"
            >
              <Mic size={18} />
            </button>
          )}
        </div>



        {/* Action Button Dock */}
        <div className="flex gap-3">
          <button
            onClick={c.handleAskForHint}
            disabled={c.isGeneratingHint || c.isGrading || c.waitingNextTurn || c.opponentHp <= 0 || c.playerHp <= 0}
            className="px-4 py-3 bg-[#e6e8ea] border-2 border-[#757682] text-[#191c1e] font-bold rounded-lg hover:bg-[#cbd5e1] transition-all flex items-center justify-center gap-2 active:translate-y-[2px] disabled:opacity-50"
          >
            {c.isGeneratingHint ? (
              <Loader2 className="animate-spin text-[#00236f]" size={18} />
            ) : (
              <Lightbulb size={18} className="text-amber-600 animate-pulse" />
            )}
            <span className="hidden sm:inline font-['Space_Grotesk'] text-sm">
              {c.isGeneratingHint ? 'Thinking...' : 'Ask for Hint'}
            </span>
          </button>
          
          <button
            onClick={c.handleSubmitDefense}
            disabled={c.isGrading || c.waitingNextTurn || !c.defenseInput.trim() || c.opponentHp <= 0 || c.playerHp <= 0}
            className="flex-1 py-3 bg-[#00236f] hover:bg-[#1a3a8a] text-white font-['Space_Grotesk'] font-bold text-sm sm:text-base rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(25,28,30,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(25,28,30,1)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(25,28,30,1)]"
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

      {/* ========== COMBAT LOG (Restored from pre-modified) ========== */}
      {c.combatLog && c.combatLog.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          <span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#757682] uppercase tracking-wider pl-1">
            Courtroom Transcripts
          </span>
          <div className="bg-[#f2f4f6] border-2 border-[#757682] rounded-lg shadow-[2px_2px_0px_0px_rgba(117,118,130,0.4)] p-4 max-h-[140px] overflow-y-auto flex flex-col gap-2 font-mono text-[11px]">
            {c.combatLog.map((log: string, i: number) => (
              <div key={i} className={`flex items-start gap-2 ${i === 0 ? 'text-[#191c1e] font-semibold' : 'text-[#757682]'}`}>
                <span className="text-[#00236f] font-bold">&gt;&gt;</span>
                <span className="leading-relaxed">{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}