// ============================================================
// CONTROLLER — Document Processing + RAG Pipeline
// ============================================================
// Handles: file upload → text extraction → chunking → embedding → level compilation
// Used by: useCombatController (internally)

import { useState, useRef, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { getAIProvider } from '../lib/aiProvider'
import type { LevelData, DocumentChunk } from '../models/types'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// ---------- Utility: chunking ----------

function chunkText(text: string, chunkSize = 500, overlap = 75): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    chunks.push(text.slice(start, Math.min(start + chunkSize, text.length)))
    start += chunkSize - overlap
  }
  return chunks
}

// ---------- Utility: keyword retrieval fallback ----------

function keywordRetrieve(chunks: DocumentChunk[], query: string, topK: number): DocumentChunk[] {
  const qWords = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 2))
  return [...chunks]
    .map(c => ({
      c,
      score: c.text.toLowerCase().split(/\s+/).filter(w => qWords.has(w)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(x => x.c)
}

// ---------- Utility: cosine similarity ----------

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, mA = 0, mB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    mA += a[i] * a[i]
    mB += b[i] * b[i]
  }
  return dot / (Math.sqrt(mA) * Math.sqrt(mB) || 1)
}

// ---------- Hook ----------

export function useDocumentController() {
  const [rawText, setRawText] = useState('')
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const chunksRef = useRef<DocumentChunk[]>([])

  // --- PDF extraction (reused from original) ---

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const buf = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise
    const pages: string[] = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      pages.push(
        content.items
          .filter((item: any) => 'str' in item)
          .map((item: any) => item.str)
          .join(' ')
      )
    }
    return pages.join('\n\n')
  }

  // --- Process document: extract → chunk → embed ---

  const processDocument = useCallback(async (file: File) => {
    setIsProcessing(true)
    setProgress(10)
    setError(null)

    try {
      // 1. Extract text
      let text = ''
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setProgress(15)
        text = await extractTextFromPdf(file)
        if (!text.trim()) throw new Error('PDF has no extractable text. Use a text-based PDF.')
      } else {
        text = await file.text()
      }

      setRawText(text)
      setFileName(file.name)
      setProgress(30)

      // 2. Chunk
      const textChunks = chunkText(text)
      const chunks: DocumentChunk[] = textChunks.map((t, i) => ({ text: t, index: i }))

      // 3. Embed (Gemini only — Ollama skips this)
      const provider = await getAIProvider()
      setProgress(40)
      for (let i = 0; i < chunks.length; i++) {
        const emb = await provider.embedText(chunks[i].text)
        if (emb) chunks[i].embedding = emb
        setProgress(40 + Math.floor((i / chunks.length) * 20))
      }

      chunksRef.current = chunks
      setProgress(65)
      return { text, chunks }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [])

  // --- Compile level JSON from text via AI ---

  const compileLevelFromText = useCallback(async (text: string, professorId?: string): Promise<LevelData> => {
    setProgress(70)
    const provider = await getAIProvider()

    const systemPrompt = `You are a curriculum compiler for "Proseso: Academic Showdown".
Analyze the user text and create exactly 2 to 3 turn-based combat phases based on the ACTUAL CONTENT of the document.
Each phase contains a flawed academic argument derived from the document's topics, the correct evidence id, and a follow-up prompt.
${professorId ? `Adapt tone for professor personality: ${professorId}.` : ''}
Output ONLY valid JSON matching this structure:
{
  "level_id": 105,
  "professor_name": "Dr. Arboleda",
  "professor_sprite": "prof_strict_01",
  "subject": "Topic from the document",
  "combat_phases": [
    {
      "phase_id": 1,
      "flawed_argument": "A flawed statement BASED ON document content the student must refute.",
      "contradictory_evidence_id": "ev_unique_id",
      "follow_up_prompt": "Follow-up question in Taglish."
    }
  ],
  "evidence_deck": [
    {
      "id": "ev_unique_id",
      "title": "Evidence card title",
      "description_bilingual": "Correct explanation in bilingual Taglish starting with 'Mali! (Objection!)...'"
    }
  ]
}`

    setProgress(80)
    const parsed = await provider.generateJSON<LevelData>(
      systemPrompt,
      `Compile this academic text into a showdown level:\n\n${text.substring(0, 6000)}`
    )

    if (!parsed.combat_phases?.length || !parsed.evidence_deck?.length) {
      throw new Error('AI returned incomplete level data. Try again.')
    }

    setProgress(100)
    return parsed
  }, [])

  // --- RAG retrieval: find top-K relevant chunks for a query ---

  const retrieveChunks = useCallback(async (query: string, topK = 3): Promise<string[]> => {
    const chunks = chunksRef.current
    if (!chunks.length) return []

    // Vector similarity path (Gemini with embeddings)
    if (chunks[0]?.embedding) {
      try {
        const provider = await getAIProvider()
        const qEmb = await provider.embedText(query)
        if (qEmb) {
          return [...chunks]
            .filter(c => c.embedding)
            .map(c => ({ c, score: cosineSim(c.embedding!, qEmb) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
            .map(x => x.c.text)
        }
      } catch { /* fall through */ }
    }

    // Keyword fallback (Ollama or if embedding fails)
    return keywordRetrieve(chunks, query, topK).map(c => c.text)
  }, [])

  return {
    rawText,
    fileName,
    isProcessing,
    progress,
    error,
    processDocument,
    compileLevelFromText,
    retrieveChunks,
    setProgress,
    setError,
  }
}
