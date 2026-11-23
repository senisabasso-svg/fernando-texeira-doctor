import { useEffect, useState } from 'react'

const STORAGE_KEY = 'febros-dev-notice-seen'

export function DevNoticeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
    } catch {
      // sessionStorage puede fallar en modo privado
    }
    setOpen(true)
  }, [])

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="dev-modal-backdrop" role="presentation" onClick={dismiss}>
      <div
        className="dev-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dev-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src="/febros-logo.png"
          alt="FEBROS Software Development"
          className="dev-modal-logo"
        />
        <h2 id="dev-modal-title">Agente en desarrollo</h2>
        <p>
          Desarrollado por el equipo de <strong>FEBROS</strong>.
        </p>
        <p>Respuestas no oficiales · Ambiente de test.</p>
        <p className="dev-modal-warn">No compartir este link.</p>
        <button type="button" className="dev-modal-btn" onClick={dismiss}>
          Entendido
        </button>
      </div>
    </div>
  )
}
