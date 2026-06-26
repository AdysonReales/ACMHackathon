// ============================================================
// LIB — Gemini 2.5 Flash AI Provider
// ============================================================

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider } from './aiProvider'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let _genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set in .env')
    _genAI = new GoogleGenerativeAI(API_KEY)
  }
  return _genAI
}

export const geminiProvider: AIProvider = {
  name: 'Gemini 2.5 Flash',

  async generateJSON<T = unknown>(systemPrompt: string, userPrompt: string): Promise<T> {
    const ai = getGenAI()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { role: 'model', parts: [{ text: systemPrompt }] },
    })

    const text = result.response.text()
    return JSON.parse(text) as T
  },

  async embedText(text: string): Promise<number[] | null> {
    try {
      const ai = getGenAI()
      const model = ai.getGenerativeModel({ model: 'text-embedding-004' })
      const result = await model.embedContent(text)
      return result.embedding.values
    } catch (err) {
      console.warn('[Gemini] Embedding failed:', err)
      return null
    }
  },
}
