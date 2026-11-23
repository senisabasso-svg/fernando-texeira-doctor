import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogin, hasApiUrl } from '../lib/api'

const TOKEN_KEY = 'ft_admin_token'

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@consultorio.local')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!hasApiUrl()) {
      setError('Falta VITE_API_URL en el frontend.')
      return
    }
    setLoading(true)
    try {
      const { token } = await adminLogin(email.trim(), password)
      setAdminToken(token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-shell">
      <form className="admin-card" onSubmit={onSubmit}>
        <h1>Admin consultorio</h1>
        <p>Editá imágenes de la web y revisá preguntas del chat.</p>
        {!hasApiUrl() && (
          <p className="admin-error">Configurá <code>VITE_API_URL</code> apuntando al backend.</p>
        )}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <Link to="/web" className="admin-back">
          Volver a la web
        </Link>
      </form>
    </main>
  )
}
