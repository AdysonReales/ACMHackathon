import React, { useState, useEffect } from 'react'
import { Mic, RefreshCw, Upload, Sparkles, Send, AlertTriangle } from 'lucide-react'

interface CombatScreenProps {
  customLevelData?: {
    level_id: number
    professor_name: string
    professor_sprite: string
    combat_phases: {
      phase_id: number
      flawed_argument: string
      contradictory_evidence_id: string
      follow_up_prompt: string
    }[]
    evidence_deck: {
      id: string
      title: string
      description_bilingual: string
    }[]
  } | null
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ customLevelData: initialCustomData }) => {
  const [levelData, setLevelData] = useState<any>(initialCustomData)
  
  // Custom upload states inside battle screen
  const [isCompiling, setIsCompiling] = useState(false)
  const [compileProgress, setCompileProgress] = useState(0)
  const [compileError, setCompileError] = useState<string | null>(null)
  
  // Game states
  const [playerHp, setPlayerHp] = useState(100)
  const [opponentHp, setOpponentHp] = useState(100)
  const [playerTurn, setPlayerTurn] = useState(true)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [combatLog, setCombatLog] = useState<string[]>([])
  
  // User input states
  const [defenseInput, setDefenseInput] = useState('')
  const [isGrading, setIsGrading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [objectionAlert, setObjectionAlert] = useState<{ show: boolean; grade: number; message: string } | null>(null)
  const [screenShake, setScreenShake] = useState(false)

  // Filler words for Taglish stutter checks
  const fillerKeywords = ['ano', 'like', 'you know', 'uh', 'um', 'actually', 'kasi', 'parang']

  const opponentName = levelData?.professor_name || 'Prof. Luntian'
  const opponentSprite = levelData?.professor_sprite === 'prof_strict_01' ? '👨‍🏫' : '👩‍🏫'
  const isCustomActive = !!levelData && levelData.combat_phases?.length > 0

  useEffect(() => {
    setLevelData(initialCustomData)
  }, [initialCustomData])

  useEffect(() => {
    resetGame()
  }, [levelData])

  const resetGame = () => {
    setPlayerHp(100)
    setOpponentHp(100)
    setPlayerTurn(true)
    setCurrentPhaseIndex(0)
    setDefenseInput('')
    setIsGrading(false)
    setObjectionAlert(null)
    setScreenShake(false)

    if (isCustomActive) {
      setCombatLog([
        `Court is in session! Challenge ${opponentName} to validate your thesis.`,
        `${opponentName} accuses: "${levelData.combat_phases[0].flawed_argument}"`
      ])
    } else {
      // Default Discrete Math level
      setCombatLog([
        'Showdown initiated! Upload a syllabus document at the top to compile a custom level, or select local map milestones.',
        'Professor Luntian: "Discrete math has no real-world application. Why waste resources on propositions?"'
      ])
    }
  }

  // Phase 1 Direct Upload & Compile inside Battle Screen
  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompiling(true)
    setCompileProgress(20)
    setCompileError(null)

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string || ''
      setCompileProgress(50)

      const systemPrompt = `You are a curriculum compiler for the game "Proseso: Academic Showdown".
Analyze the user text and create exactly 1 to 3 turn-based combat phases.
Each phase contains a flawed academic argument or question, plus the correct evidence id and follow-up prompt.
You MUST output ONLY a valid JSON object matching the following structure. No other prose text.

JSON structure:
{
  "level_id": 105,
  "professor_name": "Dr. Arboleda",
  "professor_sprite": "prof_strict_01",
  "combat_phases": [
    {
      "phase_id": 1,
      "flawed_argument": "A flawed logical statement or academic argument based on the text.",
      "contradictory_evidence_id": "ev_unique_id",
      "follow_up_prompt": "A follow up question or prompt in Taglish (Filipino/English code-switched) asking the student to explain further."
    }
  ],
  "evidence_deck": [
    {
      "id": "ev_unique_id",
      "title": "Title of the evidence card",
      "description_bilingual": "Explanatory rebuttal note in bilingual Taglish starting with 'Mali! (Objection!) ...'"
    }
  ]
}`

      try {
        const response = await fetch('/api-ollama/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'phi3',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Compile this text into a level:\n\n${text.substring(0, 4000)}` }
            ],
            format: 'json',
            stream: false
          })
        })

        if (!response.ok) {
          throw new Error('Local Ollama server connection failed. Ensure Ollama app is open.')
        }

        setCompileProgress(85)
        const data = await response.json()
        const rawJson = data.message?.content
        if (!rawJson) {
          throw new Error('Empty response from Ollama.')
        }

        const parsed = JSON.parse(rawJson.trim())
        setLevelData(parsed)
        setCompileProgress(100)
        setIsCompiling(false)
      } catch (err: any) {
        console.error(err)
        setCompileError(`Failed to compile: ${err.message}`)
        setIsCompiling(false)
      }
    }

    if (file.name.endsWith('.txt') || file.name.endsWith('.json')) {
      reader.readAsText(file)
    } else {
      // Simulate raw layout text isolation for binary files
      setTimeout(() => {
        const simulatedText = `SYLLABUS EXTRACT: Universal quantifiers and logical propositions. SQL injection vulnerability explanation. Sanitization is not unique key index filters. Dr. Arboleda Strict DB rules.`
        reader.onload({ target: { result: simulatedText } } as any)
      }, 1000)
    }
  }

  // Local AI grading of student's own explanation words
  const handleSubmitDefense = async () => {
    if (!playerTurn || !defenseInput.trim() || opponentHp <= 0 || playerHp <= 0) return

    setIsGrading(true)
    setObjectionAlert(null)

    // Calculate stutter count/penalties locally
    const words = defenseInput.toLowerCase().split(/\s+/)
    const foundFillers = words.filter(w => fillerKeywords.includes(w))
    const stutterPenalty = foundFillers.length * 4

    let finalGrade = 0
    let aiFeedback = ''

    // Define correct answers to judge against
    const currentPhase = isCustomActive 
      ? levelData.combat_phases[currentPhaseIndex] 
      : { flawed_argument: 'Discrete math has no application.', contradictory_evidence_id: 'exhibit_a', follow_up_prompt: 'Paano ito magagamit?' }
    
    const correctDeckInfo = isCustomActive
      ? levelData.evidence_deck.find((ev: any) => ev.id === currentPhase.contradictory_evidence_id)?.description_bilingual || ''
      : 'Discrete math forms the foundation of database normalization, relational algebra, and computer logic parsing.'

    const gradingSystemPrompt = `You are the strict academic prosecutor ${opponentName} in "Proseso: Academic Showdown".
The flawed argument being discussed: "${currentPhase.flawed_argument}"
The correct academic rebuttal keys: "${correctDeckInfo}"
The student's explanation in their own words: "${defenseInput}"

Strictly grade the student's explanation out of 100.
If they do not address the core logical error, or give a nonsense/vague reply, grade it below 50.
If they correctly address the logical error or mention the key rebuttal concepts (even if short or in Taglish/bilingual), grade it between 70 and 100.
Output ONLY a single JSON object. No other text.

JSON format:
{
  "grade": 85,
  "feedback": " Courtroom response in bilingual Taglish: Objected or accepted with commentary."
}`

    try {
      const response = await fetch('/api-ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3',
          messages: [
            { role: 'system', content: gradingSystemPrompt },
            { role: 'user', content: `Grade this student explanation: "${defenseInput}"` }
          ],
          format: 'json',
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error('Ollama failed to grade.')
      }

      const data = await response.json()
      const parsedGrading = JSON.parse(data.message?.content.trim())
      finalGrade = parsedGrading.grade
      aiFeedback = parsedGrading.feedback
    } catch (err) {
      console.error(err)
      // Fallback grade logic if local Ollama is offline or fails
      const hasKeywords = words.some(w => ['normal', 'normalisasyon', 'logic', 'db', 'sql', 'index', 'secure', 'query', 'parameterized', 'sanitize', 'prepared'].includes(w))
      finalGrade = hasKeywords ? 80 : 45
      aiFeedback = hasKeywords 
        ? "Medyo tama ang reasoning mo, although need pa natin dugtungan." 
        : "Walang kinalaman ang sagot mo sa propositional evidence. Objection!"
    }

    // Apply grade and stutter penalty state updates
    const damage = Math.max(0, finalGrade - stutterPenalty)
    
    // UI Effects
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 500)

    if (finalGrade >= 70) {
      // Objection Success!
      const nextOppHp = Math.max(0, opponentHp - damage)
      setOpponentHp(nextOppHp)
      setObjectionAlert({ show: true, grade: damage, message: `OBJECTION ACCEPTED! ${aiFeedback}` })
      
      setCombatLog(prev => [
        `SUCCESS: Your defense grade: ${finalGrade}% (Stutter penalty: -${stutterPenalty} HP). Net damage: ${damage}!`,
        `${opponentName}: "${aiFeedback}"`,
        ...prev
      ])

      setPlayerTurn(false)
      setTimeout(() => {
        if (nextOppHp <= 0) {
          setCombatLog(prev => [`VICTORY! ${opponentName} admits defeat. Level complete!`, ...prev])
          return
        }

        // Move to next phase
        const nextPhaseIndex = currentPhaseIndex + 1
        if (isCustomActive && nextPhaseIndex < levelData.combat_phases.length) {
          setCurrentPhaseIndex(nextPhaseIndex)
          const nextPhase = levelData.combat_phases[nextPhaseIndex]
          setCombatLog(prev => [
            `${opponentName} counters: "${nextPhase.flawed_argument}"`,
            `Follow-up prompt: "${currentPhase.follow_up_prompt || 'Explain your reasoning.'}"`,
            ...prev
          ])
        } else {
          setCombatLog(prev => [
            `${opponentName}: "${currentPhase.follow_up_prompt || 'Explain your proof further.'}"`,
            ...prev
          ])
        }
        setDefenseInput('')
        setPlayerTurn(true)
      }, 3500)

    } else {
      // Objection Failed
      const playerDamage = 25
      const nextPlayerHp = Math.max(0, playerHp - playerDamage)
      setPlayerHp(nextPlayerHp)
      setObjectionAlert({ show: true, grade: 0, message: `OBJECTION OVERRULED! ${aiFeedback}` })

      setCombatLog(prev => [
        `FAILED: Your defense grade: ${finalGrade}% (Stutter penalty: -${stutterPenalty} HP). Accusation stands!`,
        `${opponentName}: "Objection! ${aiFeedback}"`,
        ...prev
      ])

      setPlayerTurn(false)
      setTimeout(() => {
        if (nextPlayerHp <= 0) {
          setCombatLog(prev => [`DEFEAT! ${opponentName} overruled your arguments. Try compiling another case!`, ...prev])
          return
        }
        setPlayerTurn(true)
      }, 3500)
    }

    setIsGrading(false)
  }

  // Micro-recording transcription simulator (Theme 1 & 2 integration)
  const handleMicTap = () => {
    if (isRecording) {
      setIsRecording(false)
      const mockSpeechPhrases = [
        'Kasi ano, database normalization prevents duplicates parang relational structure.',
        'Prepared statements dynamically sanitizes input text parameters raw queries.',
        'Mali po ang premise. Propositions are logically parsed using truth tables truth assertions.'
      ]
      const transcript = mockSpeechPhrases[Math.floor(Math.random() * mockSpeechPhrases.length)]
      setDefenseInput(transcript)
    } else {
      setIsRecording(true)
      setDefenseInput('')
    }
  }

  return (
    <div className={`w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-6 ${screenShake ? 'animate-bounce' : ''}`}>
      
      {/* Level compiler directly inside Combat Screen */}
      {!isCustomActive && (
        <div className="bg-[var(--surface)] rounded-large shadow-custom p-5 border border-[var(--border)] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-1.5">
              <Sparkles size={16} className="text-[var(--primary)]" />
              Compile Case for Showdown
            </h2>
            <span className="text-[10px] font-mono text-[var(--muted)]">Phi-3 Active</span>
          </div>

          <div className="bg-[var(--surface-hi)] border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-medium p-4 flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
            {isCompiling ? (
              <div className="flex flex-col items-center gap-1.5 py-2">
                <RefreshCw className="animate-spin text-[var(--primary)]" size={24} />
                <span className="text-xs font-semibold">Generating Level JSON ({compileProgress}%)</span>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
                <Upload size={20} className="text-[var(--muted)] text-[var(--primary)]" />
                <span className="text-xs font-bold text-[var(--text)]">Upload custom .txt document to compile case</span>
                <span className="text-[9px] text-[var(--muted)]">Plain text (.txt) files are parsed directly by local AI</span>
                <input type="file" onChange={handleDirectUpload} className="hidden" accept=".txt,.json" />
              </label>
            )}
          </div>
          {compileError && <span className="text-[10px] text-rose-600 font-semibold">{compileError}</span>}
        </div>
      )}

      {/* Arena Display Header */}
      <div className="flex justify-between items-center bg-[var(--surface)] p-4 rounded-large shadow-custom border border-[var(--border)]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
            {isCustomActive ? `Ollama Battle: Case ${levelData.level_id}` : 'Academic Courtroom'}
          </h1>
          <p className="text-xs text-[var(--muted)]">
            {isCustomActive ? `Topic: ${levelData.professor_name}` : 'Discrete Math Oral Thesis Rebuttal'}
          </p>
        </div>
        <button
          onClick={resetGame}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-[var(--primary)]"
          title="Reset Showdown"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Courtroom View (Double-Bezel & Soft Nesting) */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] relative overflow-hidden">
        
        {/* Objection banner alert */}
        {objectionAlert?.show && (
          <div className="absolute inset-x-4 top-4 z-20 animate-pulse">
            <div className={`p-3 rounded-medium border text-center font-bold text-sm shadow-md ${
              objectionAlert.grade > 0 
                ? 'bg-amber-100 border-amber-300 text-amber-800' 
                : 'bg-rose-100 border-rose-300 text-rose-800'
            }`}>
              {objectionAlert.message}
            </div>
          </div>
        )}

        <div className="bg-[var(--surface-hi)] rounded-medium border border-[var(--border)] p-4 min-h-[220px] flex flex-col justify-between relative">
          {/* Opponent (Prosecutor) Pedestal and HUD */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 max-w-[55%]">
              <span className="font-mono text-[9px] px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full w-max">
                ACADEMIC PROSECUTOR
              </span>
              <span className="font-bold text-sm text-[var(--text)]">{opponentName}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${opponentHp}%` }}></div>
                </div>
                <span className="font-mono text-[10px] font-bold">{opponentHp}/100</span>
              </div>
            </div>

            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm relative">
              <span className="text-2xl pixelated">{opponentSprite}</span>
              <span className="absolute -bottom-1 bg-[var(--primary)] text-white text-[8px] px-1 py-0.5 rounded-full font-bold">LVL 15</span>
            </div>
          </div>

          {/* Active Accusation Speech Bubble */}
          <div className="my-3 p-3 bg-white border border-[var(--border)] rounded-medium shadow-sm relative before:content-[''] before:absolute before:top-[-8px] before:right-6 before:w-4 before:h-4 before:bg-white before:border-l before:border-t before:border-[var(--border)] before:rotate-45 z-10">
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider block mb-1">
              {opponentName} Accuses:
            </span>
            <p className="text-xs text-[var(--text)] italic font-semibold leading-relaxed">
              "{isCustomActive 
                ? levelData.combat_phases[currentPhaseIndex]?.flawed_argument
                : 'Discrete math has no real-world application. Why waste resources on propositions?'}"
            </p>
          </div>

          {/* Student (Defender) Pedestal and HUD */}
          <div className="flex justify-between items-end mt-4">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200 shadow-sm relative">
              <span className="text-2xl pixelated">🎓</span>
              <span className="absolute -bottom-1 bg-[var(--accent)] text-white text-[8px] px-1 py-0.5 rounded-full font-bold">LVL 5</span>
            </div>

            <div className="flex flex-col gap-1 max-w-[55%] w-full items-end">
              <span className="font-mono text-[9px] px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full w-max">
                DEFENDER
              </span>
              <span className="font-bold text-sm text-[var(--text)]">You (Scholar)</span>
              <div className="flex items-center gap-2 w-full justify-end">
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${playerHp}%` }}></div>
                </div>
                <span className="font-mono text-[10px] font-bold">{playerHp}/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Defense Input - Explain in own words */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-4 border border-[var(--border)] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[var(--text)]">Present Your Verbal Rebuttal (Taglish Allowed)</span>
          <span className="text-[9px] font-mono text-[var(--muted)]">Checked by Local Phi-3 AI</span>
        </div>

        <div className="relative">
          <textarea
            value={defenseInput}
            onChange={(e) => setDefenseInput(e.target.value)}
            disabled={!playerTurn || isGrading || opponentHp <= 0 || playerHp <= 0}
            placeholder="Type or record your academic rebuttal. Refute the prosecutor's flawed claim..."
            className="w-full text-xs p-3 bg-[var(--surface-hi)] border border-[var(--border)] rounded-medium focus:border-[var(--primary)] outline-none min-h-[90px] pr-12 leading-relaxed resize-none text-[var(--text)]"
          />
          <button
            onClick={handleMicTap}
            disabled={!playerTurn || isGrading || opponentHp <= 0 || playerHp <= 0}
            className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-[var(--muted)]'
            }`}
            title="Speech Input (Dataset Collector)"
          >
            <Mic size={16} />
          </button>
        </div>

        {/* Dynamic filler word count warning */}
        {defenseInput.trim() && (
          <div className="flex flex-wrap gap-1 px-1">
            {defenseInput.toLowerCase().split(/\s+/).filter(w => fillerKeywords.includes(w)).length > 0 && (
              <span className="text-[10px] text-amber-600 font-mono font-bold flex items-center gap-1">
                <AlertTriangle size={10} />
                Filler words detected. Stutter penalty applies!
              </span>
            )}
          </div>
        )}

        <button
          onClick={handleSubmitDefense}
          disabled={!playerTurn || isGrading || !defenseInput.trim() || opponentHp <= 0 || playerHp <= 0}
          className="w-full rounded-full py-2.5 bg-[var(--primary)] hover:bg-[#208478] text-white font-bold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {isGrading ? (
            <>
              <RefreshCw className="animate-spin" size={14} />
              <span>Prosecutor judging your argument...</span>
            </>
          ) : (
            <>
              <Send size={14} />
              <span>SUBMIT DEFENSE (OBJECTION!)</span>
            </>
          )}
        </button>
      </div>

      {/* Courtroom Log */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider pl-1">
          Courtroom Transcripts
        </span>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-large shadow-custom p-4 max-h-[160px] overflow-y-auto flex flex-col gap-2.5 font-mono text-xs">
          {combatLog.map((log, index) => (
            <div key={index} className={`flex items-start gap-2 ${index === 0 ? 'text-[var(--text)] font-semibold border-b border-slate-100 pb-1.5' : 'text-[var(--muted)]'}`}>
              <span className="text-[var(--primary)] font-bold">&gt;&gt;</span>
              <span className="leading-relaxed">{log}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
