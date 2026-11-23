import { useMemo, useState } from 'react'
import {
  CATEGORY_LABELS,
  RECOMMENDATIONS,
  type RecCategory,
} from '../data/recommendations'
type Props = {
  onOpenAgenda?: () => void
}

const FILTERS: Array<'todas' | RecCategory> = [
  'todas',
  'ortodoncia',
  'protesis',
  'postextraccion',
  'higiene',
  'consultorio',
]

export function Recommendations({ onOpenAgenda }: Props) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('todas')

  const items = useMemo(() => {
    if (filter === 'todas') return RECOMMENDATIONS
    return RECOMMENDATIONS.filter((r) => r.category === filter)
  }, [filter])

  return (
    <section className="recs-panel" aria-label="Recomendaciones del consultorio">
      <div className="recs-intro">
        <h2>Recomendaciones</h2>
        <p>
          Cuidados prácticos del consultorio — ortodoncia, prótesis y post extracción — para
          consultar sin esperar respuesta.
        </p>
      </div>

      <div className="filter-row" role="tablist" aria-label="Filtrar por tema">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`filter-chip ${filter === f ? 'is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'todas' ? 'Todas' : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      <ul className="rec-list">
        {items.map((rec, i) => (
          <li
            key={rec.id}
            className={`rec-card ${rec.accent === 'caution' ? 'is-caution' : ''}`}
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            <span className="rec-cat">{CATEGORY_LABELS[rec.category]}</span>
            <h3>{rec.title}</h3>
            <p>{rec.body}</p>
            {rec.tip && <p className="rec-tip">{rec.tip}</p>}
          </li>
        ))}
      </ul>

      <aside className="recs-cta">
        <p>¿Necesitás un turno?</p>
        <div className="recs-cta-actions">
          <button type="button" className="btn btn-primary" onClick={onOpenAgenda}>
            Ir a Agenda
          </button>
        </div>
      </aside>
    </section>
  )
}
