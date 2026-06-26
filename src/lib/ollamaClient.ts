// ============================================================
// LIB — Ollama AI Provider (local LLM via /api-ollama proxy)
// ============================================================

import type { AIProvider } from './aiProvider'

const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'phi3'

export const ollamaProvider: AIProvider = {
  name: `Ollama (${OLLAMA_MODEL})`,

  async generateJSON<T = unknown>(systemPrompt: string, userPrompt: string): Promise<T> {
    const response = await fetch('/api-ollama/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        format: 'json',
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama server error (status ${response.status}). Is Ollama running?`)
    }

    const data = await response.json()
    const rawJson = data.message?.content
    if (!rawJson) throw new Error('Empty response from Ollama.')

    return JSON.parse(rawJson.trim()) as T
  },

  // Ollama doesn't expose a simple embedding endpoint — return null
  // RAG pipeline falls back to keyword-based retrieval automatically
  async embedText(_text: string): Promise<number[] | null> {
    return null
  },
}
