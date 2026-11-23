import { CLINIC_INFO } from '../data/clinicContext'
import { RECOMMENDATIONS } from '../data/recommendations'

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function tips(category: (typeof RECOMMENDATIONS)[number]['category'], n = 5) {
  return RECOMMENDATIONS.filter((r) => r.category === category)
    .slice(0, n)
    .map((t) => `• ${t.title}: ${t.body}`)
}

/** Respuesta local cuando Gemini está caído o saturado. */
export function localClinicReply(userText: string): string {
  const q = norm(userText)
  const phone = CLINIC_INFO.phoneDisplay

  if (/(horario|atienden|abierto|cuando atienden|dias? de atencion)/.test(q)) {
    return [
      'Horarios (lunes a viernes):',
      ...CLINIC_INFO.hours.map((h) => `• ${h.days}: ${h.time}`),
      '',
      CLINIC_INFO.hoursNote,
      `Dirección: ${CLINIC_INFO.address}.`,
      'Turnos: pestaña Agenda. Hay urgencias del día dentro del horario.',
    ].join('\n')
  }

  if (/(turno|cita|agendar|sacar turno|reservar|urgencia)/.test(q)) {
    return [
      'Pedí turno en la pestaña Agenda (nombre, teléfono y motivo).',
      'Lo ideal es sacar turno con una semana de anticipación. Si sos flexible con el horario, en cualquier momento.',
      'Hay turnos de urgencia en el día, dentro del horario de atención.',
      '',
      'Duraciones aproximadas:',
      ...CLINIC_INFO.appointmentDurations.map((d) => `• ${d.reason}: ${d.duration}`),
    ].join('\n')
  }

  if (/(evaluacion|evaluación|tiene costo|es gratis|sin costo|cobra la consulta)/.test(q)) {
    return [
      'La evaluación no tiene costo.',
      'Los precios de tratamientos (ortodoncia, extracción, etc.) se definen en el consultorio: hay que venir a evaluación.',
      'Pedí turno en la pestaña Agenda.',
    ].join('\n')
  }

  if (/(precio|cuanto sale|cuánto sale|cuotas|pago|pagos|cosalco|mercado pago)/.test(q)) {
    return [
      'No publico montos acá: se confirman en el consultorio (la evaluación es sin costo).',
      '',
      'Medios de pago:',
      ...CLINIC_INFO.payments.map((p) => `• ${p}`),
      '',
      'Para evaluación u otros turnos: pestaña Agenda.',
    ].join('\n')
  }

  if (/(ubicacion|direccion|donde queda|telefono|contacto|instagram)/.test(q)) {
    return [
      `• Dirección: ${CLINIC_INFO.address}`,
      `• Tel.: ${phone}`,
      `• Instagram: ${CLINIC_INFO.instagram}`,
      '',
      'Turnos: pestaña Agenda.',
    ].join('\n')
  }

  if (/(implante|endodoncia|ninos|niños|blanqueamiento|servicios)/.test(q)) {
    return [
      'Servicios: ortodoncia, implantes, prótesis, extracciones/cirugías, limpieza de sarro, resinas, blanqueamiento y endodoncia.',
      'Atienden niños siempre y cuando se dejen atender.',
      'Para evaluación (sin costo): pestaña Agenda.',
    ].join('\n')
  }

  if (/(bracket|brackets|alambre|ortodoncia|aparato)/.test(q)) {
    if (/(solto|soltó|despego|despegó|despegue)/.test(q) && /(bracket|brackets)/.test(q)) {
      return [
        'Si se despegó un bracket, pedí turno en Agenda y vení a recementar, sobre todo si el próximo control está lejos.',
      ].join('\n')
    }
    if (/(alambre|pincha)/.test(q)) {
      return [
        'Si se soltó el alambre, a veces se puede acomodar con una pinza de cejas.',
        'Si no podés y te pincha, venís al consultorio: pedí turno en Agenda.',
      ].join('\n')
    }
    if (/(duele|dolor|molest)/.test(q)) {
      return [
        'Después del ajuste puede molestar (no suele “doler”).',
        'Si molesta mucho, podés tomar ibuprofeno.',
      ].join('\n')
    }
    return ['Cuidados de ortodoncia:', ...tips('ortodoncia', 6)].join('\n')
  }

  if (/(protesis|prótesis|dentadura)/.test(q)) {
    if (/(rompio|rompió|roto|rota)/.test(q)) {
      return 'Sacá turno en Agenda: se evalúa si se puede reparar o hay que hacer una nueva (ambas opciones tienen costo).'
    }
    return ['Cuidados de prótesis:', ...tips('protesis')].join('\n')
  }

  if (/(extraccion|extracción|saque|sacar muela|post operator|gasa)/.test(q)) {
    return [
      'Indicaciones post extracción del consultorio:',
      ...tips('postextraccion'),
    ].join('\n')
  }

  if (/(sarro|dolor|duele|duelen|caries|muela|diente|resina)/.test(q)) {
    return [
      'Para evaluar sarro, caries o dolor hace falta venir al consultorio.',
      'La evaluación no tiene costo. Pedí turno en la pestaña Agenda.',
      'Hay urgencias del día dentro del horario de atención.',
    ].join('\n')
  }

  return [
    'En este momento el asistente con IA está saturado.',
    '',
    '• Recomendaciones: pestaña Recomendaciones',
    '• Turnos: pestaña Agenda (evaluación sin costo)',
    `• Tel.: ${phone} · ${CLINIC_INFO.address}`,
  ].join('\n')
}
