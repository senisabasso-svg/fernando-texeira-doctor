import { CLINIC_INFO } from '../data/clinicContext'

export type Tab = 'chat' | 'recomendaciones' | 'agenda'

type Props = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'chat', label: 'Consultas' },
  { id: 'recomendaciones', label: 'Recomendaciones' },
  { id: 'agenda', label: 'Agenda' },
]

export function Header({ activeTab, onTabChange }: Props) {
  return (
    <header className="site-header">
      <div className="brand">
        <img src="/logo.png" alt="" className="brand-logo" width={48} height={48} />
        <div className="brand-text">
          <span className="brand-eyebrow">{CLINIC_INFO.name}</span>
          <h1 className="brand-name">{CLINIC_INFO.doctor}</h1>
        </div>
      </div>

      <nav className="tabs" aria-label="Secciones">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
