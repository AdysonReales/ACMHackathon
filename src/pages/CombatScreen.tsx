// ============================================================
// VIEW — CombatScreen (pure rendering, all logic in controller)
// ============================================================

import React, { useRef } from 'react'
import { Mic, RefreshCw, Upload, Sparkles, Send, AlertTriangle, Loader2, ChevronRight, Trophy, XCircle, Swords } from 'lucide-react'
import { useCombatController } from '../controllers/useCombatController'
import type { LevelData } from '../models/types'

interface CombatScreenProps {
  customLevelData?: LevelData | null
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ customLevelData }) => {
  const c = useCombatController(customLevelData)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ============================================================
  // RENDER: Upload Screen
  // ============================================================
  if (c.screen === 'upload') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-8 px-4 flex flex-col gap-6 items-center">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-8 border border-[var(--border)] w-full flex flex-col items-center gap-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-emerald-400 flex items-center justify-center shadow-lg">
              <Swords size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Academic Showdown</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Upload a document. The AI prosecutor will challenge you on it.
            </p>
          </div>

          {/* Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[var(--surface-hi)] border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-medium p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:shadow-md group"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
              <Upload size={24} className="text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors" />
            </div>
            <span className="text-sm font-bold text-[var(--text)]">
              Upload your document
            </span>
            <span className="text-xs text-[var(--muted)] text-center">
              .pdf, .txt, .json, or .md — Syllabus, lecture notes, quizzes
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={c.handleFileUpload}
            className="hidden"
            accept=".pdf,.txt,.json,.md"
          />

          {/* Error */}
          {c.compileError && (
            <div className="w-full bg-rose-50 border border-rose-200 rounded-medium p-3 text-rose-700 text-xs flex gap-2 items-start">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Compilation Failed</p>
                <p className="mt-1">{c.compileError}</p>
                <p className="mt-1 text-[10px] text-rose-500">Make sure Ollama is running: <code className="bg-rose-100 px-1 rounded">ollama serve</code></p>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)]">
            <Sparkles size={12} className="text-[var(--primary)]" />
            Powered by local Phi-3 via Ollama
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Compiling Screen
  // ============================================================
  if (c.screen === 'compiling') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-16 px-4 flex flex-col items-center gap-6">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-10 border border-[var(--border)] w-full flex flex-col items-center gap-5">
          <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
          <h2 className="text-lg font-bold text-[var(--text)]">Compiling Battle Level...</h2>
          <p className="text-xs text-[var(--muted)] text-center">
            AI is reading your document and generating combat phases.
          </p>
          <div className="w-full max-w-[280px] bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[var(--primary)] h-full transition-all duration-500 rounded-full"
              style={{ width: `${c.compileProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[var(--muted)]">{c.compileProgress}%</span>

          {/* Live streaming preview */}
          {c.streamingText && (
            <div className="w-full bg-slate-900 border border-slate-800 rounded-medium p-4 shadow-inner text-left">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
                <span className="text-[9px] font-mono font-bold text-[var(--primary)] uppercase tracking-wider">
                  Ollama Compilation Feed
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
      </div>
    )
  }

  // ============================================================
  // RENDER: Victory Screen
  // ============================================================
  if (c.screen === 'victory') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-12 px-4 flex flex-col items-center gap-6">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-10 border border-[var(--border)] w-full flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg animate-bounce">
            <Trophy size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)]">CASE WON!</h2>
          <p className="text-sm text-[var(--muted)] text-center">
            {c.opponentName} has been defeated. Your academic arguments prevailed!
          </p>
          <button
            onClick={c.resetAll}
            className="mt-4 px-8 py-3 bg-[var(--primary)] hover:bg-[#208478] text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Upload size={16} />
            New Document Battle
          </button>
        </div>

        {/* Final log */}
        <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-large shadow-custom p-4 max-h-[200px] overflow-y-auto flex flex-col gap-2 font-mono text-xs">
          {c.combatLog.map((log, i) => (
            <div key={i} className="flex items-start gap-2 text-[var(--muted)]">
              <span className="text-[var(--primary)] font-bold">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Defeat Screen
  // ============================================================
  if (c.screen === 'defeat') {
    return (
      <div className="w-full max-w-lg mx-auto pb-clearance pt-12 px-4 flex flex-col items-center gap-6">
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-10 border border-[var(--border)] w-full flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg">
            <XCircle size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text)]">CASE LOST</h2>
          <p className="text-sm text-[var(--muted)] text-center">
            {c.opponentName} overruled your arguments. Review and try again!
          </p>
          <button
            onClick={c.resetAll}
            className="mt-4 px-8 py-3 bg-[var(--accent)] hover:bg-amber-600 text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER: Battle Screen
  // ============================================================
  return (
    <div className={`w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-4 ${c.screenShake ? 'animate-bounce' : ''}`}>

      {/* Top Bar: Phase + Reset */}
      <div className="flex justify-between items-center bg-[var(--surface)] p-3 rounded-large shadow-custom border border-[var(--border)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text)]">
            ⚖️ vs. {c.opponentName}
          </h1>
          <p className="text-[10px] font-mono text-[var(--muted)]">
            Phase {c.phaseNumber}/{c.totalPhases} • Level {c.levelData?.level_id}
          </p>
        </div>
        <button
          onClick={c.resetAll}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-[var(--muted)] hover:text-[var(--primary)]"
          title="Quit & Upload New"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* HP Bars */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] flex flex-col gap-3">
        {/* Opponent HP */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-lg flex-shrink-0">
            {c.levelData?.professor_sprite === 'prof_strict_01' ? '👨‍🏫' : '👩‍🏫'}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">Prosecutor</span>
              <span className="text-[10px] font-mono font-bold text-[var(--text)]">{c.opponentHp}/100</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full transition-all duration-700 rounded-full" style={{ width: `${c.opponentHp}%` }} />
            </div>
          </div>
        </div>

        {/* Player HP */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-lg flex-shrink-0">
            🎓
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Defender (You)</span>
              <span className="text-[10px] font-mono font-bold text-[var(--text)]">{c.playerHp}/100</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-700 rounded-full" style={{ width: `${c.playerHp}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Background compilation status bar */}
      {c.isGeneratingBackground && c.currentPhase && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-medium p-2.5 flex items-center justify-between text-xs text-emerald-800 shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin text-emerald-600" size={14} />
            <span className="font-medium">Ollama is preparing next phases in the background...</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700 uppercase font-bold">
            Live
          </span>
        </div>
      )}

      {/* ========== BATTLE INTERFACE / LOADING INTERFACE ========== */}
      {!c.currentPhase && c.isGeneratingBackground ? (
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-8 border border-[var(--border)] flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="animate-spin text-[var(--primary)]" size={36} />
          <h3 className="font-bold text-sm text-[var(--text)]">Prosecutor is preparing the next challenge...</h3>
          <p className="text-xs text-[var(--muted)] max-w-xs leading-relaxed">
            Analyzing document content in the background to build the next argument. Just a moment!
          </p>
          {c.streamingText && (
            <div className="w-full bg-slate-900 border border-slate-800 rounded-medium p-3.5 mt-2 text-left">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
                <span className="text-[8px] font-mono font-bold text-[var(--primary)] uppercase tracking-wider">
                  Ollama Compilation Feed
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
          {/* ========== PROSECUTOR'S QUESTION / ACCUSATION ========== */}
          <div className="bg-[var(--surface)] rounded-large shadow-custom border border-[var(--border)] overflow-hidden">
            {/* Accusation header */}
            <div className="bg-rose-50 border-b border-rose-100 px-4 py-2 flex items-center gap-2">
              <span className="text-rose-500 text-sm">⚠️</span>
              <span className="text-[10px] font-mono font-bold text-rose-600 uppercase tracking-wider">
                {c.opponentName}'s Accusation — Phase {c.phaseNumber}
              </span>
            </div>

            {/* The actual flawed argument — BIG and visible */}
            <div className="p-5">
              <p className="text-sm text-[var(--text)] font-semibold leading-relaxed italic">
                "{c.currentPhase.flawed_argument}"
              </p>
            </div>

            {/* Follow-up prompt */}
            {c.currentPhase.follow_up_prompt && (
              <div className="bg-amber-50 border-t border-amber-100 px-4 py-3 flex items-start gap-2">
                <ChevronRight size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  {c.currentPhase.follow_up_prompt}
                </p>
              </div>
            )}
          </div>

          {/* ========== TURN FEEDBACK BANNER ========== */}
          {c.turnFeedback && (
            <div className={`rounded-medium border p-3 text-center font-bold text-sm shadow-sm animate-pulse ${
              c.turnFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {c.turnFeedback.type === 'success' ? '✅ OBJECTION ACCEPTED!' : '❌ OBJECTION OVERRULED!'}
              <p className="text-xs font-normal mt-1 opacity-80">{c.turnFeedback.message}</p>
              <span className="text-[10px] font-mono mt-1 block">Grade: {c.turnFeedback.grade}%</span>
            </div>
          )}

          {/* ========== DEFENSE INPUT ========== */}
          <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[var(--text)]">Your Defense (Taglish OK)</span>
              <span className="text-[9px] font-mono text-[var(--muted)]">Graded by Phi-3</span>
            </div>

            <div className="relative">
              <textarea
                value={c.defenseInput}
                onChange={(e) => c.setDefenseInput(e.target.value)}
                disabled={c.isGrading || c.waitingNextTurn || c.opponentHp <= 0 || c.playerHp <= 0}
                placeholder="Type your rebuttal here... Explain why the prosecutor's claim is wrong."
                className="w-full text-sm p-3 bg-[var(--surface-hi)] border border-[var(--border)] rounded-medium focus:border-[var(--primary)] outline-none min-h-[100px] pr-12 leading-relaxed resize-none text-[var(--text)]"
              />
              <button
                onClick={c.handleMicTap}
                disabled={c.isGrading || c.waitingNextTurn}
                className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
                  c.isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-[var(--muted)]'
                }`}
                title="Speech Input"
              >
                <Mic size={16} />
              </button>
            </div>

            {/* Filler warning */}
            {c.fillerWarning && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-mono font-bold">
                <AlertTriangle size={10} />
                Filler words detected — stutter penalty applies!
              </div>
            )}

            <button
              onClick={c.handleSubmitDefense}
              disabled={c.isGrading || c.waitingNextTurn || !c.defenseInput.trim() || c.opponentHp <= 0 || c.playerHp <= 0}
              className="w-full rounded-full py-3 bg-[var(--primary)] hover:bg-[#208478] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              {c.isGrading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Prosecutor is judging...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>SUBMIT DEFENSE — OBJECTION!</span>
                </>
              )}
            </button>

            {/* Live streaming prosecutor response */}
            {c.isGrading && c.streamingText && (
              <div className="bg-slate-900 border border-slate-800 rounded-medium p-4 shadow-inner relative overflow-hidden text-left">
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
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-8 border border-[var(--border)] flex flex-col items-center justify-center gap-3 text-center">
          <h3 className="font-bold text-sm text-[var(--text)]">No Phase Data Available</h3>
          <p className="text-xs text-[var(--muted)]">Could not generate subsequent phases.</p>
          <button onClick={c.resetAll} className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-full hover:bg-[#208478]">
            Upload New Document
          </button>
        </div>
      )}

      {/* ========== COMBAT LOG ========== */}
      {c.combatLog.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider pl-1">
            Courtroom Transcripts
          </span>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-large shadow-custom p-4 max-h-[140px] overflow-y-auto flex flex-col gap-2 font-mono text-[11px]">
            {c.combatLog.map((log, i) => (
              <div key={i} className={`flex items-start gap-2 ${i === 0 ? 'text-[var(--text)] font-semibold' : 'text-[var(--muted)]'}`}>
                <span className="text-[var(--primary)] font-bold">&gt;&gt;</span>
                <span className="leading-relaxed">{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
