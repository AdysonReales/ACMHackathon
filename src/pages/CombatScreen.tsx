// ============================================================
// VIEW — CombatScreen (Retro Pixel Court Aesthetic with Battle Arena)
// ============================================================

import React, { useRef, useState } from 'react'
import { Upload, Send, Loader2, RefreshCw, BookOpen, Lightbulb, Mic, AlertTriangle } from 'lucide-react'
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
      <div className="w-full max-w-lg mx-auto pt-24 px-4 flex flex-col items-center text-center gap-6">
        <Loader2 className="animate-spin text-[#00236f]" size={40} />
        <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#00236f]">Analyzing Case File...</h2>
        <p className="text-sm text-[#545560] font-medium">The digital magistrate is structuring your cross-examination layout.</p>
        
        <div className="w-full max-w-[280px] bg-slate-200 h-2 rounded-full overflow-hidden border border-[#cbd5e1]">
          <div
            className="bg-[#00236f] h-full transition-all duration-500 rounded-full"
            style={{ width: `${c.compileProgress}%` }}
          />
        </div>
        <span className="text-xs font-mono text-[#545560]">{c.compileProgress}%</span>

        {/* Live streaming preview */}
        {c.streamingText && (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00236f] animate-pulse"></span>
              <span className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                Gemini Compilation Feed
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 max-h-[140px] overflow-y-auto">
              <p className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
                {c.streamingText}
                <span className="animate-pulse text-emerald-300">▌</span>
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ============================================================
  // PHASE 3: EVALUATION DEBRIEF (Victory/Defeat)
  // ============================================================
  if (c.screen === 'victory' || c.screen === 'defeat') {
    return (
      <div className="w-full max-w-lg mx-auto pt-8 px-4 flex flex-col gap-6 pb-24">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#00236f] mb-1">Defense Evaluation</h1>
        
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

      {/* Background compilation status bar */}
      {c.isGeneratingBackground && c.currentPhase && (
        <div className="bg-emerald-50 border-2 border-emerald-600 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] animate-pulse shrink-0">
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin text-emerald-700" size={14} />
            <span className="font-['Space_Grotesk'] font-bold">Gemini is preparing next phases in the background...</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700 uppercase font-bold border border-emerald-300">
            Live
          </span>
        </div>
      )}

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

      {/* ========== BATTLE INTERFACE / LOADING INTERFACE ========== */}
      {!c.currentPhase && c.isGeneratingBackground ? (
        <div className="bg-[#f2f4f6] border-2 border-[#757682] rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-center shadow-[2px_2px_0px_0px_rgba(117,118,130,0.4)] mt-2">
          <Loader2 className="animate-spin text-[#00236f]" size={36} />
          <h3 className="font-['Space_Grotesk'] font-bold text-sm text-[#191c1e]">Prosecutor is preparing the next challenge...</h3>
          <p className="text-xs text-[#545560] max-w-xs leading-relaxed font-medium">
            Analyzing document content in the background to build the next argument. Just a moment!
          </p>
          {c.streamingText && (
            <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3.5 mt-2 text-left">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span className="text-[8px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Gemini Compilation Feed
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800 max-h-[85px] overflow-y-auto">
                <p className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
                  {c.streamingText}
                  <span className="animate-pulse text-emerald-300">▌</span>
                </p>
              </div>
            </div>
          )}
        </div>
      ) : c.currentPhase ? (
        <>
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
              {c.currentPhase.flawed_argument}
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

            {c.fillerWarning && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-mono font-bold bg-amber-50 p-2 rounded border border-amber-200">
                <AlertTriangle size={12} />
                Filler words detected — stutter penalty applies!
              </div>
            )}

            {/* Action Button Dock */}
            <div className="flex gap-3">
              <button
                onClick={() => {/* Trigger Hint Logic */}}
                className="px-4 py-3 bg-[#e6e8ea] border-2 border-[#757682] text-[#191c1e] font-bold rounded-lg hover:bg-[#cbd5e1] transition-all flex items-center justify-center gap-2 active:translate-y-[2px]"
              >
                <Lightbulb size={18} className="text-amber-600 animate-pulse" />
                <span className="hidden sm:inline font-['Space_Grotesk'] text-sm">Ask for Hint</span>
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

            {/* Live streaming prosecutor response */}
            {c.isGrading && c.streamingText && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner relative overflow-hidden text-left mt-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                    PROSECUTOR COGNITION STREAM
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-850">
                  <p className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">
                    {c.streamingText}
                    <span className="animate-pulse text-emerald-300 font-bold"> ▌</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-[#f2f4f6] border-2 border-red-600 rounded-lg p-8 flex flex-col items-center justify-center gap-3 text-center shadow-[2px_2px_0px_0px_rgba(239,68,68,0.2)]">
          <h3 className="font-['Space_Grotesk'] font-bold text-sm text-red-800">No Accusation Available</h3>
          <p className="text-xs text-[#545560] font-medium">Could not generate the next cross-examination phase.</p>
          <button onClick={c.resetAll} className="px-4 py-2 bg-[#00236f] hover:bg-[#1a3a8a] text-white text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(25,28,30,1)]">
            New Case File
          </button>
        </div>
      )}

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