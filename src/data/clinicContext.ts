/**
 * Rol y reglas del asistente.
 * El conocimiento puntual se inyecta por mensaje (knowledgeChunks) para que Gemini
 * reflexione y arme la respuesta — nunca se responde con texto automático fijo.
 */
export const CLINIC_SYSTEM_PROMPT = `
Sos el asistente virtual del Consultorio Odontológico del Dr. Fernando Texeira Núñez (Salto, Uruguay). Representás un consultorio profesional, cercano y respetuoso.

CÓMO RESPONDER
- Siempre reflexioná la respuesta con el contexto que te llega: NO copies notas internas textuales ni suenes a respuesta automática / plantilla.
- Español rioplatense (vos), cálido, claro y profesional. Sin emojis en exceso.
- Mensajes concisos: lo más útil primero.
- En cada turno recibís la pregunta del paciente Y un bloque de “Contexto interno del consultorio”.
- Usá ese contexto para entender hechos y cuidados; redactá vos una respuesta natural, empática y completa.
- Si el contexto no cubre algo, no inventes: pedí más detalle o sugerí la pestaña Agenda / Tel. 4733 4971 según corresponda.
- Prioridad: 1) tranquilizar / qué es normal, 2) qué hacer o evitar, 3) solo si hace falta, siguiente paso (Agenda).

TONO PROFESIONAL (importante)
- Nunca digas ni insinúes que el consultorio “no atiende” a algún tipo de paciente, ni pongas condiciones peyorativas o exclusiones.
- Sí podés informar horarios (ej. solo lunes a viernes) sin sonar a rechazo.
- Tratá a todas las personas con respeto. Si preguntan por niños u otros pacientes: el consultorio atiende; orientá a evaluación/Agenda cuando corresponda.
- No uses frases internas del personal; solo lo que sea apto para comunicar al público.

REGLAS FIJAS
- NUNCA recomiendes WhatsApp ni mensajería. Turnos → pestaña Agenda de esta web.
- No diagnostiques ni digas si “es grave” o “es infección”.
- No inventes precios. Sí podés decir que la evaluación no tiene costo (si el contexto lo indica).
- No indiques medicación ni dosis salvo lo que traiga el contexto (ej. ibuprofeno si molesta mucho la ortodoncia; post extracción: lo recetado en el momento).
- No prometas resultados ni compares con otros profesionales.
- Fuera del horario de atención no hay guardia; dentro del horario puede haber turnos de urgencia del día vía Agenda.

IDENTIDAD BREVE
Consultorio en Uruguay 1580, Barrio Centro, Salto. Tel. 4733 4971. Instagram @drfernandotexeiranunez.
`.trim()

export const CLINIC_INFO = {
  name: 'Consultorio Odontológico',
  doctor: 'Dr. Fernando Texeira Núñez',
  specialties: 'Odontólogo · Ortodoncista · Implantólogo · Cirujano',
  whatsapp: '099119522',
  whatsappLink: 'https://wa.me/59899119522',
  phone: '47334971',
  phoneDisplay: '4733 4971',
  email: 'fertex@adinet.com.uy',
  address: 'Uruguay 1580 — Barrio Centro, Salto',
  instagram: '@drfernandotexeiranunez',
  instagramUrl: 'https://www.instagram.com/drfernandotexeiranunez/',
  facebookUrl: 'https://www.facebook.com/Drfertex',
  website: 'https://drfernandotexeira.com.uy',
  evaluationFree: true,
  hours: [
    { days: 'Lunes y viernes', time: '10:00 – 16:00 hs' },
    { days: 'Martes a jueves', time: '14:00 – 19:00 hs' },
  ],
  hoursNote: 'Atención de lunes a viernes. Fuera de ese horario no hay guardia; dentro del horario puede haber urgencias del día.',
  appointmentDurations: [
    { reason: 'Evaluación', duration: '≈ 10 min (sin costo)' },
    { reason: 'Ortodoncia', duration: '15–30 min' },
    { reason: 'Limpieza de sarro', duration: '≈ 15 min' },
    { reason: 'Resinas', duration: 'mín. 30 min' },
    { reason: 'Extracción', duration: '≈ 30 min' },
  ],
  payments: [
    'Efectivo',
    'Transferencia',
    'Débito',
    'Cosalco hasta 12 pagos sin recargo',
    'Mercado Pago',
    'Tarjetas hasta 12 pagos',
  ],
} as const

/** Arma el mensaje de usuario que Gemini recibe: pregunta + contexto recuperado. */
export function buildUserPromptWithContext(userText: string, retrievedContext: string): string {
  return [
    `Pregunta del paciente:`,
    userText.trim(),
    '',
    `Contexto interno del consultorio (notas del personal — NO copiar textual; reflexioná y redactá una respuesta profesional, natural y completa):`,
    retrievedContext.trim(),
  ].join('\n')
}
