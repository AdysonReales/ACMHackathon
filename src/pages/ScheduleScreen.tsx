import React, { useState, useRef } from 'react'
import { Play, CheckCircle2, Lock, Star, Upload, Loader2, Sparkles, Check, AlertCircle } from 'lucide-react'

interface LevelNode {
  id: number
  title: string
  subject: string
  status: 'completed' | 'active' | 'locked'
  difficulty: 'Basic' | 'Medium' | 'Hard'
  stars: number
}

interface ScheduleScreenProps {
  setCustomLevelData: (data: any) => void
  navigateToPage: (page: 'combat' | 'schedule' | 'evidence' | 'profile') => void
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ setCustomLevelData, navigateToPage }) => {
  const [levels, setLevels] = useState<LevelNode[]>([
    { id: 1, title: 'Propositional Logic', subject: 'Discrete Math', status: 'completed', difficulty: 'Basic', stars: 3 },
    { id: 2, title: 'Truth Tables & Proofs', subject: 'Discrete Math', status: 'active', difficulty: 'Basic', stars: 0 },
    { id: 3, title: 'Sets & Venn Diagrams', subject: 'Discrete Math', status: 'locked', difficulty: 'Medium', stars: 0 },
    { id: 4, title: 'Functions & Relations', subject: 'Discrete Math', status: 'locked', difficulty: 'Medium', stars: 0 },
    { id: 5, title: 'Graph Theory Intro', subject: 'Discrete Math', status: 'locked', difficulty: 'Hard', stars: 0 },
  ])

  // Upload/Extraction states
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compileLevelWithOllama = async (text: string, fileName: string) => {
    setIsUploading(true)
    setUploadProgress(30)
    setErrorMessage(null)

    const modelName = 'phi3'
    const cleanTitle = fileName.substring(0, fileName.lastIndexOf('.')) || fileName

    const systemPrompt = `You are a curriculum compiler for the game "Proseso: Academic Showdown".
Analyze the text provided by the user (which could be a syllabus, notes, or quiz questions). 
Extract key academic points and structure them into logically flawed arguments, and determine the exact evidence from the text that disproves them.
Generate exactly 1 to 3 combat phases.
You MUST output ONLY a valid JSON object matching the following structure. Do not output markdown codeblocks, preambles, or explanations.

Expected JSON structure:
{
  "level_id": 102,
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
      setUploadProgress(50)
      const response = await fetch('/api-ollama/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Compile this academic text into a showdown level:\n\n${text}` }
          ],
          format: 'json',
          stream: false
        })
      })

      setUploadProgress(80)
      if (!response.ok) {
        throw new Error(`Local Ollama server responded with status: ${response.status}. Make sure the Ollama desktop app is open and running.`)
      }

      const data = await response.json()
      const rawJson = data.message?.content
      if (!rawJson) {
        throw new Error('No content returned from local Ollama model.')
      }

      setUploadProgress(95)
      const parsedLevel = JSON.parse(rawJson.trim())
      setCustomLevelData(parsedLevel)

      // Add custom node to learning map
      const newId = levels.length + 1
      const newLevel: LevelNode = {
        id: newId,
        title: parsedLevel.professor_name ? `Battle: ${parsedLevel.professor_name}` : `Custom: ${cleanTitle}`,
        subject: 'Local AI Generated',
        status: 'active',
        difficulty: 'Medium',
        stars: 0
      }

      // De-activate old active levels, add the custom level
      setLevels(prevLevels =>
        prevLevels.map(lvl =>
          lvl.status === 'active' ? { ...lvl, status: 'completed' as const } : lvl
        ).concat(newLevel)
      )

      setUploadProgress(100)
      setExtractedText(`Successfully compiled level using ${modelName}.\nLevel Title: "${newLevel.title}". Click Play below to enter the arena!`)
      setIsUploading(false)
    } catch (err: any) {
      console.error(err)
      setErrorMessage(`Ollama integration error: ${err.message}. (Did you run "ollama run ${modelName}" in terminal first?)`)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(10)
    setUploadedFileName(file.name)
    setExtractedText(null)
    setErrorMessage(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      compileLevelWithOllama(text || `Extracted text from ${file.name}`, file.name)
    }

    if (file.name.endsWith('.txt') || file.name.endsWith('.json')) {
      reader.readAsText(file)
    } else {
      // Simulate raw layout text isolation for binary files, then compile
      setTimeout(() => {
        const simulatedText = `SYLLABUS EXTRACT: Universal quantifiers and logical propositions. SQL injection vulnerability explanation. Sanitization is not unique key index filters. Dr. Arboleda Strict DB rules.`
        compileLevelWithOllama(simulatedText, file.name)
      }, 1000)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleLevelClick = (lvl: LevelNode) => {
    if (lvl.status === 'locked') return

    if (lvl.subject === 'Local AI Generated') {
      // Custom Ollama level loaded in state
      navigateToPage('combat')
    } else {
      // Default Discrete Math level
      setCustomLevelData(null)
      navigateToPage('combat')
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto pb-clearance pt-4 px-4 flex flex-col gap-6">
      {/* Header Info */}
      <div className="bg-[var(--surface)] p-4 rounded-large shadow-custom border border-[var(--border)]">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Academic Learning Map</h1>
        <p className="text-xs text-[var(--muted)]">Defeat academic rivals to unlock next discrete math milestones</p>
      </div>

      {/* Phase 1: Case Compilation - Document Upload Zone */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-5 border border-[var(--border)] flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-1.5">
              <Sparkles size={16} className="text-[var(--primary)]" />
              Local AI Case Compiler (Phase 1)
            </h2>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">
              Uses local Llama 3 background engine to build logic levels from notes.
            </p>
          </div>
        </div>


        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.json"
        />

        {/* Double-Bezel content nesting for Upload Panel */}
        <div
          onClick={triggerFileInput}
          className="bg-[var(--surface-hi)] border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-medium p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
              <span className="text-xs font-semibold text-[var(--text)]">Compiling JSON Level ({uploadProgress}%)</span>
              <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[var(--primary)] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          ) : extractedText ? (
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-1">
                <Check size={20} />
              </div>
              <span className="text-xs font-bold text-[var(--text)]">Compilation Success!</span>
              <span className="text-[10px] text-[var(--muted)] max-w-[200px] truncate">{uploadedFileName}</span>
              <p className="text-[10px] bg-white border border-[var(--border)] rounded p-2 mt-2 max-h-[70px] overflow-y-auto font-mono text-left w-full text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                {extractedText}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); setExtractedText(null); setUploadedFileName(null); }}
                className="text-[9px] text-[var(--primary)] hover:underline mt-2 font-semibold"
              >
                Upload another file
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[var(--muted)] hover:scale-105 transition-transform duration-200">
                <Upload size={24} />
              </div>
              <span className="text-xs font-bold text-[var(--text)]">Select .txt Document to Compile Level</span>
              <span className="text-[10px] text-[var(--muted)]">Uses local Llama 3/Phi-3 background engine</span>
            </>
          )}
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded p-3 text-rose-700 text-xs flex gap-2 items-start">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Connection Failed</p>
              <p className="mt-1 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Nodes (Double-Bezel & Pathway style) */}
      <div className="bg-[var(--surface)] rounded-large shadow-custom p-6 border border-[var(--border)] relative overflow-hidden flex flex-col gap-6">
        {/* Dungeon Pathway Graph visualization */}
        <div className="relative flex flex-col items-center gap-12 py-4">
          {/* Vertical pathway connector line */}
          <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1.5 bg-slate-200 rounded-full z-0">
            <div className="h-[40%] bg-[var(--primary)] rounded-full"></div>
          </div>

          {levels.map((lvl, index) => {
            const isCompleted = lvl.status === 'completed'
            const isActive = lvl.status === 'active'

            // Alternating node alignments to simulate an overlapping path
            const isLeft = index % 2 === 0

            return (
              <div
                key={lvl.id}
                onClick={() => handleLevelClick(lvl)}
                className={`relative flex items-center w-full z-10 cursor-pointer ${
                  isLeft ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Node bubble */}
                <div className="w-[40%] flex justify-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-md transition-all ${
                      isCompleted
                        ? 'bg-[var(--primary)] border-emerald-200 text-white scale-105 hover:bg-[#208478]'
                        : isActive
                        ? 'bg-[var(--accent)] border-amber-200 text-white animate-bounce scale-110 hover:bg-amber-600'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} />
                    ) : isActive ? (
                      <Play size={24} className="fill-white pl-0.5" />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>
                </div>

                {/* Overlapping connector label spacer */}
                <div className="w-[10%]"></div>

                {/* Node Level card */}
                <div className="w-[50%]">
                  <div
                    className={`p-3 rounded-medium border transition-all ${
                      isCompleted
                        ? 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100 hover:border-[var(--primary)]'
                        : isActive
                        ? 'bg-[var(--surface-hi)] border-[var(--primary)] shadow-md hover:shadow-lg'
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[9px] font-mono font-bold tracking-wider text-[var(--muted)] uppercase">
                        LEVEL {lvl.id}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          lvl.difficulty === 'Basic'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : lvl.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}
                      >
                        {lvl.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-[var(--text)] mt-1">{lvl.title}</h3>
                    <p className="text-[10px] text-[var(--muted)]">{lvl.subject}</p>

                    {/* Stars achieved */}
                    {isCompleted && (
                      <div className="flex items-center gap-0.5 mt-2 text-amber-500">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} size={10} className="fill-amber-500" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
