import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { CLINIC_INFO } from '../data/clinicContext'
import { SUGGESTED_PROMPTS } from '../data/recommendations'
import { hasGeminiKey, sendChatMessage, type ChatMessage } from '../lib/gemini'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: `¡Hola! Soy el asistente del consultorio del ${CLINIC_INFO.doctor}. Puedo orientarte sobre cuidados, horarios y servicios. La evaluación no tiene costo; los turnos se piden en Agenda. ¿En qué te ayudo?`,
}

type Props = {
  onOpenAgenda?: () => void
}

export function Chat({ onOpenAgenda }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const keyReady = hasGeminiKey()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  async function handleSend(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setError(null)
    setInput('')
    const userMsg: ChatMessage = { id: uid(), role: 'user', text: trimmed }
    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    setLoading(true)

    try {
      const reply = await sendChatMessage(
        nextHistory.filter((m) => m.id !== 'welcome'),
        trimmed,
      )
      setMessages((prev) => [...prev, { id: uid(), role: 'model', text: reply }])
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'No se pudo obtener respuesta. Intentá de nuevo.'
      setError(msg)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void handleSend(input)
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend(input)
    }
  }

  return (
    <section className="chat-panel" aria-label="Chat con el asistente">
      {!keyReady && (
        <div className="banner banner-warn" role="status">
          Configurá <code>VITE_GEMINI_API_KEY</code> en un archivo <code>.env</code> para activar
          las respuestas de IA.
        </div>
      )}

      <div className="messages" role="log" aria-live="polite">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}
          >
            {m.role === 'model' && (
              <img src="/logo.png" alt="" className="bubble-avatar" width={28} height={28} />
            )}
            <div className="bubble-body">
              <p>{m.text}</p>
            </div>
          </article>
        ))}

        {loading && (
          <article className="bubble bubble-bot">
            <img src="/logo.png" alt="" className="bubble-avatar" width={28} height={28} />
            <div className="bubble-body typing" aria-label="Escribiendo">
              <span />
              <span />
              <span />
            </div>
          </article>
        )}

        {error && (
          <div className="banner banner-error" role="alert">
            {error}
          </div>
        )}

        {messages.length <= 1 && !loading && (
          <div className="suggestions">
            <p className="suggestions-label">Preguntas frecuentes</p>
            <div className="suggestion-chips">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="chip"
                  onClick={() => void handleSend(prompt)}
                  disabled={!keyReady || loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="chat-input">
          Escribí tu consulta
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escribí tu consulta…"
          disabled={loading || !keyReady}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={loading || !keyReady || !input.trim()}
          aria-label="Enviar"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3.4 20.6 21 12 3.4 3.4l-.1 6.8L14 12 3.3 13.8z"
            />
          </svg>
        </button>
      </form>

      <p className="chat-footnote">
        Orientación general · Turnos en{' '}
        <button type="button" className="linkish" onClick={onOpenAgenda}>
          Agenda
        </button>
      </p>
    </section>
  )
}
