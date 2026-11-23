import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  adminFetchChatLogs,
  adminMe,
  adminUpdateAssetUrl,
  adminUploadAsset,
  fetchAssets,
  hasApiUrl,
  type ChatLogItem,
  type SiteAsset,
} from '../lib/api'
import { getAdminToken, setAdminToken } from './AdminLogin'

type Tab = 'images' | 'chats'

const TOPICS = [
  { id: 'todos', label: 'Todos' },
  { id: 'turnos', label: 'Turnos' },
  { id: 'ortodoncia', label: 'Ortodoncia' },
  { id: 'implantes', label: 'Implantes' },
  { id: 'pagos', label: 'Pagos / precios' },
  { id: 'horarios', label: 'Horarios' },
  { id: 'urgencia', label: 'Dolor / urgencia' },
  { id: 'errores', label: 'Errores del bot' },
] as const

function detectTopic(question: string, answer: string | null): string {
  const text = `${question} ${answer ?? ''}`.toLowerCase()
  if ((answer ?? '').startsWith('[error]')) return 'Error'
  if (/turno|agenda|cita|reserv/.test(text)) return 'Turnos'
  if (/ortodoncia|bracket|alineador|frenos/.test(text)) return 'Ortodoncia'
  if (/implante/.test(text)) return 'Implantes'
  if (/pago|precio|costo|cosalco|mercado pago|tarjeta/.test(text)) return 'Pagos'
  if (/horario|abre|cierr/.test(text)) return 'Horarios'
  if (/dolor|hinchaz|sangr|urgencia|infección|molesta/.test(text)) return 'Urgencia'
  return 'General'
}

export function AdminApp() {
  const navigate = useNavigate()
  const token = getAdminToken()
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [tab, setTab] = useState<Tab>('images')
  const [assets, setAssets] = useState<SiteAsset[]>([])
  const [logs, setLogs] = useState<ChatLogItem[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [topicStats, setTopicStats] = useState<Record<string, number>>({})
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState('todos')
  const [appliedQ, setAppliedQ] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({})
  const [savedKey, setSavedKey] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !hasApiUrl()) {
      setReady(true)
      setAuthed(false)
      return
    }
    adminMe(token)
      .then((me) => {
        setEmail(me.email)
        setAuthed(true)
      })
      .catch(() => {
        setAdminToken(null)
        setAuthed(false)
      })
      .finally(() => setReady(true))
  }, [token])

  useEffect(() => {
    if (!authed || !token) return
    if (tab === 'images') {
      fetchAssets()
        .then((list) => {
          setAssets(list)
          setUrlDrafts(Object.fromEntries(list.map((a) => [a.key, a.url])))
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar imágenes'))
    }
  }, [authed, token, tab])

  useEffect(() => {
    if (!authed || !token || tab !== 'chats') return
    setError(null)
    adminFetchChatLogs(token, {
      page,
      from: from || undefined,
      to: to || undefined,
      q: appliedQ || undefined,
      topic,
    })
      .then((data) => {
        setLogs(data.items)
        setTotalLogs(data.total)
        setTopicStats(data.topicStats ?? {})
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar chats'))
  }, [authed, token, tab, page, from, to, appliedQ, topic])

  const pageCount = useMemo(() => Math.max(1, Math.ceil(totalLogs / 40)), [totalLogs])

  if (!ready) {
    return (
      <main className="admin-shell">
        <div className="admin-loading">Cargando panel…</div>
      </main>
    )
  }

  if (!authed || !token) {
    return <Navigate to="/admin/login" replace />
  }

  async function saveUrl(key: string) {
    setBusyKey(key)
    setError(null)
    try {
      const { asset } = await adminUpdateAssetUrl(token!, key, urlDrafts[key])
      setAssets((prev) => prev.map((a) => (a.key === key ? asset : a)))
      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 1600)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setBusyKey(null)
    }
  }

  async function onUpload(key: string, file: File | undefined) {
    if (!file) return
    setBusyKey(key)
    setError(null)
    try {
      const { asset } = await adminUploadAsset(token!, key, file)
      setAssets((prev) => prev.map((a) => (a.key === key ? asset : a)))
      setUrlDrafts((prev) => ({ ...prev, [key]: asset.url }))
      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 1600)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir')
    } finally {
      setBusyKey(null)
    }
  }

  function logout() {
    setAdminToken(null)
    navigate('/admin/login')
  }

  function applySearch() {
    setPage(1)
    setAppliedQ(q)
  }

  function clearFilters() {
    setFrom('')
    setTo('')
    setQ('')
    setAppliedQ('')
    setTopic('todos')
    setPage(1)
  }

  return (
    <main className="admin-shell">
      <div className="admin-frame">
        <header className="admin-top">
          <div>
            <p className="admin-eyebrow">Consultorio · panel interno</p>
            <h1>Administración</h1>
            <p className="admin-email">{email}</p>
          </div>
          <div className="admin-top-actions">
            <Link className="admin-link-btn" to="/web">
              Ver web
            </Link>
            <button type="button" className="admin-ghost-btn" onClick={logout}>
              Salir
            </button>
          </div>
        </header>

        <nav className="admin-tabs" aria-label="Secciones">
          <button
            type="button"
            className={tab === 'images' ? 'is-active' : ''}
            onClick={() => setTab('images')}
          >
            Imágenes de la web
          </button>
          <button
            type="button"
            className={tab === 'chats' ? 'is-active' : ''}
            onClick={() => {
              setTab('chats')
              setPage(1)
            }}
          >
            Historial del chat
          </button>
        </nav>

        {error && <p className="admin-error">{error}</p>}

        {tab === 'images' && (
          <section className="admin-section">
            <div className="admin-section-head">
              <h2>Medios del sitio</h2>
              <p>Actualizá URLs o subí archivos. Los cambios se reflejan en `/web`.</p>
            </div>
            <div className="admin-asset-grid">
              {assets.map((asset) => (
                <article key={asset.key} className="admin-asset">
                  <div className="admin-asset-preview">
                    <img src={asset.url} alt={asset.label} />
                  </div>
                  <div className="admin-asset-body">
                    <div className="admin-asset-title-row">
                      <h3>{asset.label}</h3>
                      <code>{asset.key}</code>
                    </div>
                    <label className="admin-field">
                      <span>URL de la imagen</span>
                      <input
                        value={urlDrafts[asset.key] ?? ''}
                        onChange={(e) =>
                          setUrlDrafts((prev) => ({ ...prev, [asset.key]: e.target.value }))
                        }
                      />
                    </label>
                    <div className="admin-asset-actions">
                      <button
                        type="button"
                        className="admin-primary-btn"
                        disabled={busyKey === asset.key}
                        onClick={() => void saveUrl(asset.key)}
                      >
                        {busyKey === asset.key ? 'Guardando…' : 'Guardar URL'}
                      </button>
                      <label className="admin-upload">
                        Subir archivo
                        <input
                          type="file"
                          accept="image/*"
                          disabled={busyKey === asset.key}
                          onChange={(e) => void onUpload(asset.key, e.target.files?.[0])}
                        />
                      </label>
                      {savedKey === asset.key && <span className="admin-saved">Guardado</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'chats' && (
          <section className="admin-section">
            <div className="admin-section-head">
              <h2>Preguntas al asistente</h2>
              <p>
                Filtrá por fecha y por tema para ver qué consultan los pacientes (turnos, precios,
                urgencias, etc.).
              </p>
            </div>

            <div className="admin-stats">
              <div className="admin-stat">
                <strong>{totalLogs}</strong>
                <span>Resultados</span>
              </div>
              {(['turnos', 'pagos', 'urgencia', 'errores'] as const).map((key) => (
                <div key={key} className="admin-stat">
                  <strong>{topicStats[key] ?? 0}</strong>
                  <span>{TOPICS.find((t) => t.id === key)?.label ?? key}</span>
                </div>
              ))}
            </div>

            <div className="admin-filters">
              <label className="admin-field">
                <span>Desde</span>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value)
                    setPage(1)
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Hasta</span>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value)
                    setPage(1)
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Tema (análisis)</span>
                <select
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value)
                    setPage(1)
                  }}
                >
                  {TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field admin-field-grow">
                <span>Buscar texto</span>
                <div className="admin-search-row">
                  <input
                    value={q}
                    placeholder="Ej: evaluación, Cosalco, brackets…"
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applySearch()
                    }}
                  />
                  <button type="button" className="admin-primary-btn" onClick={applySearch}>
                    Buscar
                  </button>
                </div>
              </label>
              <button type="button" className="admin-ghost-btn admin-clear" onClick={clearFilters}>
                Limpiar
              </button>
            </div>

            <div className="admin-chat-list">
              {logs.map((log) => {
                const tag = detectTopic(log.question, log.answer)
                const isError = (log.answer ?? '').startsWith('[error]')
                return (
                  <article key={log.id} className={`admin-chat-item${isError ? ' is-error' : ''}`}>
                    <div className="admin-chat-meta">
                      <time dateTime={log.createdAt}>
                        {new Date(log.createdAt).toLocaleString('es-UY')}
                      </time>
                      <span className="admin-tag">{tag}</span>
                    </div>
                    <h3>Pregunta</h3>
                    <p>{log.question}</p>
                    {log.answer && (
                      <>
                        <h3>Respuesta</h3>
                        <p className="admin-answer">{log.answer}</p>
                      </>
                    )}
                  </article>
                )
              })}
              {logs.length === 0 && (
                <div className="admin-empty">No hay preguntas con estos filtros.</div>
              )}
            </div>

            <div className="admin-pager">
              <button
                type="button"
                className="admin-ghost-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
              <span>
                Página {page} de {pageCount}
              </span>
              <button
                type="button"
                className="admin-ghost-btn"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
