// ============================================================
// LIB — AI Provider abstraction (Gemini / Ollama dual-mode)
// ============================================================

export interface AIProvider {
  /** Generate a structured JSON response from system + user prompts */
  generateJSON<T = unknown>(systemPrompt: string, userPrompt: string): Promise<T>
  /** Generate text embeddings (returns null if unsupported) */
  embedText(text: string): Promise<number[] | null>
  /** Provider display name */
  readonly name: string
}

export type ProviderType = 'gemini' | 'ollama'

export function getProviderType(): ProviderType {
  const env = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase()
  if (env === 'ollama') return 'ollama'
  return 'gemini'
}

// Lazy singleton — resolved on first call
let _provider: AIProvider | null = null

export async function getAIProvider(): Promise<AIProvider> {
  if (_provider) return _provider

  const type = getProviderType()

  if (type === 'gemini') {
    const { geminiProvider } = await import('./geminiClient')
    _provider = geminiProvider
  } else {
    const { ollamaProvider } = await import('./ollamaClient')
    _provider = ollamaProvider
  }

  console.log(`[AI] Provider loaded: ${_provider.name}`)
  return _provider
}
