import {
  CLINIC_SYSTEM_PROMPT,
  buildUserPromptWithContext,
} from '../data/clinicContext'
import { retrieveKnowledgeContext } from '../data/knowledgeChunks'

export type ChatMessage = {
  id: string
  role: 'user' | 'model'
  text: string
}

/** Lite primero: suele responder mejor cuando Flash está saturado. */
const MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
] as const

const REQUEST_TIMEOUT_MS = 18_000
const RETRIES_PER_MODEL = 2

const DEV_ERROR =
  'El agente está en desarrollo — volvé a intentar en unos momentos.'

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  if (!key?.trim()) {
    throw new Error(DEV_ERROR)
  }
  return key.trim()
}

type GeminiPart = { text?: string }
type GeminiContent = { role?: string; parts: GeminiPart[] }

type GeminiResponse = {
  error?: { message?: string }
  candidates?: Array<{ content?: { parts?: GeminiPart[] } }>
}

function isBusy(status: number, message: string): boolean {
  return (
    status === 503 ||
    status === 429 ||
    /high demand|overloaded|try again later|UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(message)
  )
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callModel(
  model: string,
  contents: GeminiContent[],
): Promise<{ ok: true; text: string } | { ok: false; status: number; message: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': getApiKey(),
        },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: CLINIC_SYSTEM_PROMPT }],
          },
          contents,
        }),
      },
    )

    const data = (await response.json()) as GeminiResponse
    const message = data.error?.message || `Error de Gemini (${response.status})`

    if (!response.ok) {
      return { ok: false, status: response.status, message }
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? '')
      .join('')
      .trim()

    if (!text) {
      return {
        ok: false,
        status: 500,
        message: 'Gemini no devolvió una respuesta.',
      }
    }

    return { ok: true, text }
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError'
    return {
      ok: false,
      status: aborted ? 503 : 0,
      message: aborted ? 'Timeout / modelo saturado' : String(err),
    }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Toda respuesta del chat DEBE pasar por Gemini con contexto.
 * No hay respuestas automáticas locales.
 */
export async function sendChatMessage(
  history: ChatMessage[],
  userText: string,
): Promise<string> {
  const contents: GeminiContent[] = history
    .filter((m) => m.text.trim())
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }))

  const retrieved = retrieveKnowledgeContext(userText)
  const enrichedUserMessage = buildUserPromptWithContext(userText, retrieved)

  contents.push({
    role: 'user',
    parts: [{ text: enrichedUserMessage }],
  })

  for (const model of MODELS) {
    for (let attempt = 0; attempt < RETRIES_PER_MODEL; attempt++) {
      const result = await callModel(model, contents)
      if (result.ok) return result.text

      if (isBusy(result.status, result.message) || result.status === 404 || result.status === 0) {
        await sleep(500 * (attempt + 1))
        continue
      }

      break
    }
  }

  throw new Error(DEV_ERROR)
}

export function hasGeminiKey(): boolean {
  return Boolean((import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim())
}
