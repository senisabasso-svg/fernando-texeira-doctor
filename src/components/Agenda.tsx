import { useMemo, useState, type FormEvent } from 'react'
import { CLINIC_INFO } from '../data/clinicContext'

/** Lun=1 … Dom=0 — alineado a Date.getDay() */
const HOURS_BY_WEEKDAY: Record<number, { start: number; end: number } | null> = {
  0: null, // domingo
  1: { start: 10, end: 16 }, // lunes
  2: { start: 14, end: 19 }, // martes
  3: { start: 14, end: 19 }, // miércoles
  4: { start: 14, end: 19 }, // jueves
  5: { start: 10, end: 16 }, // viernes
  6: null, // sábado
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toInputDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function slotsForDate(isoDate: string): string[] {
  if (!isoDate) return []
  const [y, m, day] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, day)
  const range = HOURS_BY_WEEKDAY[date.getDay()]
  if (!range) return []

  const slots: string[] = []
  for (let h = range.start; h < range.end; h++) {
    slots.push(`${pad(h)}:00`)
    slots.push(`${pad(h)}:30`)
  }
  return slots
}

function formatDisplayDate(isoDate: string) {
  const [y, m, day] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, day)
  return date.toLocaleDateString('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function nextOpenDay(from = new Date()): string {
  const d = new Date(from)
  d.setHours(12, 0, 0, 0)
  for (let i = 0; i < 14; i++) {
    if (HOURS_BY_WEEKDAY[d.getDay()]) return toInputDate(d)
    d.setDate(d.getDate() + 1)
  }
  return toInputDate(from)
}

type Booking = {
  name: string
  phone: string
  date: string
  time: string
  reason: string
}

export function Agenda() {
  const minDate = toInputDate(new Date())
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(nextOpenDay())
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('evaluación (sin costo)')
  const [confirmed, setConfirmed] = useState<Booking | null>(null)

  const slots = useMemo(() => slotsForDate(date), [date])
  const closedDay = date !== '' && slots.length === 0

  function onDateChange(value: string) {
    setDate(value)
    setTime('')
    setConfirmed(null)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date || !time || closedDay) return
    setConfirmed({
      name: name.trim(),
      phone: phone.trim(),
      date,
      time,
      reason,
    })
  }

  return (
    <section className="agenda-panel" aria-label="Agendar consulta">
      <div className="recs-intro">
        <h2>Agenda</h2>
        <p>
          Nombre, teléfono y motivo. Lo ideal es pedir con una semana de anticipación.
          Hay urgencias del día dentro del horario. Por ahora es una reserva simulada.
        </p>
      </div>

      <div className="agenda-hours">
        {CLINIC_INFO.hours.map((h) => (
          <div key={h.days} className="agenda-hours-item">
            <strong>{h.days}</strong>
            <span>{h.time}</span>
          </div>
        ))}
      </div>
      <p className="agenda-hours-note">{CLINIC_INFO.hoursNote}</p>

      {confirmed ? (
        <div className="agenda-success" role="status">
          <h3>Reserva registrada (demo)</h3>
          <p>
            <strong>{confirmed.name}</strong>
            {confirmed.phone ? ` · ${confirmed.phone}` : ''}
          </p>
          <p>
            {formatDisplayDate(confirmed.date)} · {confirmed.time} hs
          </p>
          <p className="agenda-success-reason">Motivo: {confirmed.reason}</p>
          <p className="agenda-success-note">
            Cuando conectemos el backend, esto llegará al consultorio automáticamente.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setConfirmed(null)
              setTime('')
            }}
          >
            Nueva reserva
          </button>
        </div>
      ) : (
        <form className="agenda-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Nombre</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
              autoComplete="name"
            />
          </label>

          <label className="field">
            <span>Teléfono</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="099…"
              required
              autoComplete="tel"
            />
          </label>

          <label className="field">
            <span>Fecha</span>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => onDateChange(e.target.value)}
              required
            />
          </label>

          {closedDay && (
            <p className="agenda-closed" role="status">
              Ese día no hay agenda disponible. Elegí un día de lunes a viernes.
            </p>
          )}

          <fieldset className="field field-slots" disabled={closedDay || slots.length === 0}>
            <legend>Horario</legend>
            <div className="slot-grid" role="radiogroup" aria-label="Horarios disponibles">
              {slots.map((slot) => (
                <label key={slot} className={`slot ${time === slot ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="time"
                    value={slot}
                    checked={time === slot}
                    onChange={() => setTime(slot)}
                    required
                  />
                  {slot}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span>Motivo</span>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="evaluación (sin costo)">Evaluación — ≈ 10 min (sin costo)</option>
              <option value="control ortodoncia">Ortodoncia — 15 a 30 min</option>
              <option value="limpieza de sarro">Limpieza de sarro — ≈ 15 min</option>
              <option value="resinas">Resinas — mín. 30 min</option>
              <option value="extracción">Extracción — ≈ 30 min</option>
              <option value="urgencia del día">Urgencia del día</option>
              <option value="prótesis">Prótesis / control</option>
              <option value="endodoncia">Endodoncia</option>
              <option value="otro">Otro</option>
            </select>
          </label>

          <button
            type="submit"
            className="btn btn-primary agenda-submit"
            disabled={!name.trim() || !phone.trim() || !time || closedDay}
          >
            Confirmar reserva
          </button>
        </form>
      )}
    </section>
  )
}
