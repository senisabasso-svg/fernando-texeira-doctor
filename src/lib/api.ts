const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export type SiteAsset = {
  id: string
  key: string
  label: string
  url: string
  sortOrder: number
  updatedAt?: string
}

export type ChatLogItem = {
  id: string
  question: string
  answer: string | null
  sessionId: string | null
  createdAt: string
}

function authHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Error ${res.status}`)
  }
  return data
}

export async function fetchAssets(): Promise<SiteAsset[]> {
  if (!API_BASE) return []
  const res = await fetch(`${API_BASE}/api/assets`)
  const data = await parseJson<{ assets: SiteAsset[] }>(res)
  return data.assets
}

export async function logChatQuestion(input: {
  question: string
  answer?: string
  sessionId?: string
}): Promise<void> {
  if (!API_BASE) return
  try {
    await fetch(`${API_BASE}/api/chat-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  } catch {
    // No bloquear el chat si el backend no está disponible
  }
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return parseJson<{ token: string; email: string }>(res)
}

export async function adminMe(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: authHeaders(token),
  })
  return parseJson<{ email: string }>(res)
}

export async function adminUpdateAssetUrl(token: string, key: string, url: string) {
  const res = await fetch(`${API_BASE}/api/assets/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({ url }),
  })
  return parseJson<{ asset: SiteAsset }>(res)
}

export async function adminUploadAsset(token: string, key: string, file: File) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/api/assets/${encodeURIComponent(key)}/upload`, {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  })
  return parseJson<{ asset: SiteAsset }>(res)
}

export async function adminFetchChatLogs(token: string, page = 1) {
  const res = await fetch(`${API_BASE}/api/chat-logs?page=${page}&pageSize=40`, {
    headers: authHeaders(token),
  })
  return parseJson<{
    total: number
    page: number
    pageSize: number
    items: ChatLogItem[]
  }>(res)
}

export function hasApiUrl() {
  return Boolean(API_BASE)
}

export { API_BASE }
