import { useEffect, useState } from 'react'
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
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({})

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
    } else {
      adminFetchChatLogs(token, page)
        .then((data) => {
          setLogs(data.items)
          setTotalLogs(data.total)
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar chats'))
    }
  }, [authed, token, tab, page])

  if (!ready) {
    return (
      <main className="admin-shell">
        <p className="admin-card">Cargando…</p>
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

  return (
    <main className="admin-shell admin-shell-wide">
      <header className="admin-top">
        <div>
          <h1>Panel admin</h1>
          <p>{email}</p>
        </div>
        <div className="admin-top-actions">
          <Link to="/web">Ver web</Link>
          <button type="button" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        <button type="button" className={tab === 'images' ? 'is-active' : ''} onClick={() => setTab('images')}>
          Imágenes
        </button>
        <button type="button" className={tab === 'chats' ? 'is-active' : ''} onClick={() => setTab('chats')}>
          Preguntas del chat
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {tab === 'images' && (
        <div className="admin-asset-list">
          {assets.map((asset) => (
            <article key={asset.key} className="admin-asset">
              <div className="admin-asset-preview">
                <img src={asset.url} alt={asset.label} />
              </div>
              <div className="admin-asset-body">
                <h2>{asset.label}</h2>
                <code>{asset.key}</code>
                <label>
                  URL
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
                    disabled={busyKey === asset.key}
                    onClick={() => void saveUrl(asset.key)}
                  >
                    Guardar URL
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
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'chats' && (
        <div className="admin-chats">
          <p className="admin-meta">{totalLogs} preguntas registradas</p>
          <div className="admin-chat-list">
            {logs.map((log) => (
              <article key={log.id} className="admin-chat-item">
                <time dateTime={log.createdAt}>
                  {new Date(log.createdAt).toLocaleString('es-UY')}
                </time>
                <h3>Pregunta</h3>
                <p>{log.question}</p>
                {log.answer && (
                  <>
                    <h3>Respuesta</h3>
                    <p className="admin-answer">{log.answer}</p>
                  </>
                )}
              </article>
            ))}
            {logs.length === 0 && <p>Todavía no hay preguntas registradas.</p>}
          </div>
          <div className="admin-pager">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              type="button"
              disabled={page * 40 >= totalLogs}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
