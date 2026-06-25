import React, { useState } from 'react'
import { Mic, AlertCircle, RefreshCw } from 'lucide-react'

export const CombatScreen: React.FC = () => {
  // Combat local state
  const [playerHp, setPlayerHp] = useState(100)
  const [opponentHp, setOpponentHp] = useState(100)
  const [playerTurn, setPlayerTurn] = useState(true)
  const [combatLog, setCombatLog] = useState<string[]>([
    'Academic Showdown initiated!',
    'Professor Luntian challenges your thesis statement.'
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [speechResult, setSpeechResult] = useState<string | null>(null)
  const [stutterCount, setStutterCount] = useState(0)

  // Turn logic
  const handleAttack = (type: 'evidence' | 'logic' | 'rebuttal') => {
    if (!playerTurn || opponentHp <= 0 || playerHp <= 0) return

    let damage = 0
    let message = ''

    if (type === 'evidence') {
      damage = 25
      message = 'You presented Exhibit A: "Historical Taglish Usage Survey". Opponent HP -25!'
    } else if (type === 'logic') {
      damage = 15
      message = 'You pointed out inconsistencies in the peer-review data. Opponent HP -15!'
    } else {
      damage = 35
      message = 'OBJECTION! Rebutted opponent\'s source citation. Opponent HP -35!'
    }

    setOpponentHp(prev => Math.max(0, prev - damage))
    setCombatLog(prev => [message, ...prev])
    setPlayerTurn(false)

    // Trigger opponent turn after a short delay
    setTimeout(() => {
      if (opponentHp - damage <= 0) {
        setCombatLog(prev => ['VICTORY! Professor Luntian admits defeat.', ...prev])
        return
      }
      const oppDamage = Math.floor(Math.random() * 15) + 10
      setPlayerHp(prev => Math.max(0, prev - oppDamage))
      setCombatLog(prev => [
        `Professor Luntian counters with "Alternative Hypothesis". Player HP -${oppDamage}!`,
        ...prev
      ])
      setPlayerTurn(true)
    }, 1500)
  }

  // Speech demo (Theme 1 & 2 integration simulation)
  const handleMicTap = () => {
    if (isRecording) {
      // Stop recording simulation
      setIsRecording(false)
      const mockTranscripts = [
        'Kasi, ano, standard speech should be, like, Taglish, you know.',
        'Ang empirical evidence ay, uh, solid naman talaga.',
        'Actually, hindi po ganyan ang parameters ng database namin.'
      ]
      const result = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]
      const fillerWords = ['ano', 'like', 'you know', 'uh', 'actually']
      const foundFillers = fillerWords.filter(w => result.toLowerCase().includes(w))

      setSpeechResult(result)
      setStutterCount(foundFillers.length)
      
      const stutterPenalty = foundFillers.length * 5
      setPlayerHp(prev => Math.max(0, prev - stutterPenalty))

      setCombatLog(prev => [
        `Transcribed: "${result}"`,
        `Speech feedback: ${foundFillers.length} filler words detected. Stutter penalty -${stutterPenalty} HP.`,
        ...prev
      ])
    } else {
      setIsRecording(true)
      setSpeechResult(null)
      setStutterCount(0)
    }
  }

  const resetGame = () => {
    setPlayerHp(100)
    setOpponentHp(100)
    setPlayerTurn(true)
    setCombatLog([
      'Showdown reset! Choose your argument cards or use the Mic to present oral evidence.',
      'Professor Luntian challenges your thesis statement.'
    ])
    setSpeechResult(null)
    setStutterCount(0)
  }

  return (
    <div className="w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex justify-between items-center bg-[var(--surface)] p-4 rounded-large shadow-custom border border-[var(--border)]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Discrete Math Arena</h1>
          <p className="text-xs text-[var(--muted)]">Level 1: Propositional Logic</p>
        </div>
        <button
          onClick={resetGame}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-[var(--primary)]"
          title="Reset Battle"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Duel Screen Arena (Soft Double-Bezel Card nesting) */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] relative overflow-hidden">
        {/* Battle Arena Viewport (Inner Core) */}
        <div className="bg-[var(--surface-hi)] rounded-medium border border-[var(--border)] p-4 min-h-[220px] flex flex-col justify-between relative">
          
          {/* Opponent Sprite pedestal and HUD */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 max-w-[50%]">
              <span className="font-mono text-xs px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full w-max">
                OPPONENT
              </span>
              <span className="font-bold text-sm text-[var(--text)]">Prof. Luntian</span>
              {/* Opponent HP */}
              <div className="flex items-center gap-2">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all duration-500"
                    style={{ width: `${opponentHp}%` }}
                  ></div>
                </div>
                <span className="font-mono text-xs font-bold w-12 text-right">{opponentHp}/100</span>
              </div>
            </div>

            {/* Pedestal with Opponent Sprite */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm relative">
                <span className="text-3xl pixelated">👨‍🏫</span>
                <div className="absolute -bottom-1 bg-[var(--primary)] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  LVL 12
                </div>
              </div>
            </div>
          </div>

          {/* Player Sprite pedestal and HUD */}
          <div className="flex justify-between items-end mt-4">
            {/* Pedestal with Player Sprite */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center border border-amber-200 shadow-sm relative">
                <span className="text-3xl pixelated">🎓</span>
                <div className="absolute -bottom-1 bg-[var(--accent)] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  LVL 5
                </div>
              </div>
            </div>

            {/* Player HUD */}
            <div className="flex flex-col gap-1 max-w-[50%] w-full items-end">
              <span className="font-mono text-xs px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full w-max">
                DEFENDER
              </span>
              <span className="font-bold text-sm text-[var(--text)] text-right">You (Scholar)</span>
              {/* Player HP */}
              <div className="flex items-center gap-2 w-full justify-end">
                <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${playerHp}%` }}
                  ></div>
                </div>
                <span className="font-mono text-xs font-bold w-12 text-right">{playerHp}/100</span>
              </div>
            </div>
          </div>

          {/* Action indicator overlay */}
          {!playerTurn && opponentHp > 0 && playerHp > 0 && (
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[0.5px]">
              <div className="bg-white/95 px-4 py-2 rounded-full border border-[var(--border)] flex items-center gap-2 shadow-sm animate-pulse">
                <RefreshCw size={14} className="animate-spin text-[var(--muted)]" />
                <span className="text-xs font-semibold text-[var(--text)]">Opponent rebutting...</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Audio Submission Sandbox (Theme 1 & 2 integration) */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-medium flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--text)] flex items-center gap-1">
              <Mic size={14} className="text-[var(--primary)]" />
              Taglish Speech Input (Dataset Collector)
            </span>
            <span className="text-[10px] font-mono text-[var(--muted)]">Deepgram Mode</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMicTap}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                  : 'bg-[var(--primary)] hover:bg-[#208478] text-white'
              }`}
            >
              <Mic size={18} />
            </button>
            <div className="flex-1 text-xs">
              {isRecording ? (
                <span className="text-rose-600 font-semibold animate-pulse">
                  Listening... Click again to process oral speech.
                </span>
              ) : speechResult ? (
                <div className="flex flex-col gap-0.5">
                  <p className="text-[var(--text)] italic">"{speechResult}"</p>
                  <p className="text-[10px] font-mono font-bold text-amber-600 flex items-center gap-0.5 mt-0.5">
                    <AlertCircle size={10} />
                    {stutterCount} stutter/fillers detected (stutter penalty applied).
                  </p>
                </div>
              ) : (
                <span className="text-[var(--muted)]">
                  Tap mic, speak Taglish answer to submit voice data sample.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Argument selection actions */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider pl-1">
          Choose Academic Counter-Card
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAttack('evidence')}
            disabled={!playerTurn || opponentHp <= 0 || playerHp <= 0}
            className="flex flex-col items-center justify-between p-3 bg-white border border-[var(--border)] rounded-medium hover:border-[var(--primary)] active:scale-95 transition-all shadow-sm hover:shadow text-left"
          >
            <span className="text-lg">📜</span>
            <span className="font-bold text-xs text-[var(--text)] mt-2">Exhibit A</span>
            <span className="text-[10px] text-[var(--muted)] text-center mt-1">25 DMG</span>
          </button>
          
          <button
            onClick={() => handleAttack('logic')}
            disabled={!playerTurn || opponentHp <= 0 || playerHp <= 0}
            className="flex flex-col items-center justify-between p-3 bg-white border border-[var(--border)] rounded-medium hover:border-[var(--primary)] active:scale-95 transition-all shadow-sm hover:shadow text-left"
          >
            <span className="text-lg">🔍</span>
            <span className="font-bold text-xs text-[var(--text)] mt-2">Inconsistency</span>
            <span className="text-[10px] text-[var(--muted)] text-center mt-1">15 DMG</span>
          </button>

          <button
            onClick={() => handleAttack('rebuttal')}
            disabled={!playerTurn || opponentHp <= 0 || playerHp <= 0}
            className="flex flex-col items-center justify-between p-3 bg-white border border-[var(--accent)] rounded-medium hover:border-amber-600 active:scale-95 transition-all shadow-sm hover:shadow text-left"
          >
            <span className="text-lg">💥</span>
            <span className="font-bold text-xs text-amber-700 mt-2 font-mono">OBJECTION!</span>
            <span className="text-[10px] text-[var(--muted)] text-center mt-1">35 DMG</span>
          </button>
        </div>
      </div>

      {/* Combat logs */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider pl-1">
          Courtroom Logs
        </span>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-large shadow-custom p-4 max-h-[140px] overflow-y-auto flex flex-col gap-2 font-mono text-xs">
          {combatLog.map((log, index) => (
            <div key={index} className={`flex items-start gap-2 ${index === 0 ? 'text-[var(--text)] font-semibold' : 'text-[var(--muted)]'}`}>
              <span className="text-[var(--primary)] font-bold">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
