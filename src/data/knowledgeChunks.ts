/**
 * Fragmentos de contexto del consultorio (notas internas del personal).
 * NO son respuestas listas: se inyectan a Gemini junto a la pregunta del paciente
 * para que arme una respuesta natural y mejorada.
 */
export type KnowledgeChunk = {
  id: string
  topic: string
  keywords: string[]
  context: string
}

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  {
    id: 'horarios',
    topic: 'Horarios y disponibilidad',
    keywords: [
      'horario',
      'horarios',
      'atienden',
      'abierto',
      'sabado',
      'domingo',
      'urgencia',
      'guardia',
    ],
    context: `
Horarios confirmados: lunes y viernes 10–16 hs; martes a jueves 14–19 hs.
Atención de lunes a viernes (no hay agenda de sábado/domingo).
Fuera de ese horario no hay guardia; dentro del horario sí pueden existir turnos de urgencia en el día.
Dirección: Uruguay 1580, Barrio Centro, Salto. Tel. 4733 4971.
Comunicar horarios con tono profesional, sin sonar a rechazo.
`.trim(),
  },
  {
    id: 'turnos',
    topic: 'Turnos y Agenda',
    keywords: [
      'turno',
      'turnos',
      'cita',
      'agendar',
      'agenda',
      'reservar',
      'sacar turno',
      'urgencia',
      'duracion',
      'cuanto dura',
    ],
    context: `
Los turnos se piden por la pestaña Agenda de esta web (nunca WhatsApp).
Datos que piden: nombre, teléfono y motivo.
Ideal: sacar turno con ~1 semana de anticipación para coincidir con el horario deseado.
Si el paciente es flexible con el horario, puede pedir en cualquier momento.
Hay turnos de urgencia en el día (dentro del horario de atención).
Duraciones aproximadas: evaluación ~10 min; ortodoncia 15–30 min según el trabajo; limpieza de sarro ~15 min; resinas mínimo 30 min (depende de cuántas); extracción ~30 min.
La evaluación no tiene costo.
`.trim(),
  },
  {
    id: 'precios-evaluacion',
    topic: 'Precios, evaluación y pagos',
    keywords: [
      'precio',
      'precios',
      'cuanto sale',
      'cuánto sale',
      'costo',
      'vale',
      'evaluacion',
      'evaluación',
      'gratis',
      'pago',
      'pagos',
      'cuotas',
      'cosalco',
      'mercado pago',
      'tarjeta',
      'extraccion',
      'ortodoncia',
    ],
    context: `
Consultas frecuentes: si colocan ortodoncia y cuánto vale; precio de extracción; si la evaluación tiene costo.
Hechos: sí colocan ortodoncia; la evaluación NO tiene costo; los precios de tratamientos no se dan por chat — se definen en el consultorio y la persona debe venir.
Medios de pago: efectivo, transferencia, débito, Cosalco hasta 12 pagos sin recargo, Mercado Pago, tarjetas hasta 12 pagos.
No inventar montos.
`.trim(),
  },
  {
    id: 'servicios',
    topic: 'Servicios',
    keywords: [
      'servicio',
      'servicios',
      'implante',
      'implantes',
      'endodoncia',
      'ninos',
      'niños',
      'blanqueamiento',
      'resina',
      'sarro',
      'limpieza',
      'cirugia',
      'protesis',
    ],
    context: `
Servicios confirmados: ortodoncia, implantes, prótesis, cirugías/extracciones, limpieza de sarro, resinas/caries, blanqueamiento, endodoncia.
El consultorio atiende también a niños.
Dr. Fernando Texeira Núñez: odontólogo, ortodoncista, implantólogo y cirujano.
Nunca digas que no atienden a algún paciente; orientá con profesionalismo a evaluación/Agenda si hace falta.
`.trim(),
  },
  {
    id: 'ortodoncia',
    topic: 'Ortodoncia',
    keywords: [
      'ortodoncia',
      'bracket',
      'brackets',
      'alambre',
      'aparato',
      'cera',
      'control',
      'mate',
      'pegajoso',
      'chicle',
      'palomitas',
      'pochoclo',
      'ibuprofeno',
      'molesta',
      'duele',
    ],
    context: `
Notas del consultorio sobre ortodoncia:
- Tras colocar/ajustar: no necesariamente “duele”; puede molestar. Si molesta mucho, pueden tomar ibuprofeno.
- Alambre suelto: a veces se puede acomodar con pinza de cejas; si no pueden y pincha, deben venir.
- Bracket despegado: pedir turno y venir a recementar, sobre todo si el próximo control está lejos.
- Mate: sí se puede. Evitar dulces pegajosos, chicles, palomitas, nueces, hielo, alimentos duros y bebidas azucaradas.
- Faltar a un control atrasa el tratamiento.
- Higiene: cepillado frecuente alrededor de brackets; ayudan interdental / hilo con enhebrador.
Usá estas notas como base y redactá una respuesta clara y empática; no copies el listado tal cual.
`.trim(),
  },
  {
    id: 'protesis',
    topic: 'Prótesis',
    keywords: [
      'protesis',
      'prótesis',
      'dentadura',
      'adhesivo',
      'floja',
      'lastima',
      'rompio',
      'rompió',
    ],
    context: `
Notas del consultorio sobre prótesis:
- Lavar con jabón neutro y cepillo dental.
- Sacarla para dormir.
- Si lastima: consultar.
- Si queda un poco floja: pueden usar adhesivo para prótesis.
- Si se rompe: sacar turno; se evalúa reparación o prótesis nueva; ambas opciones tienen costo.
Redactá en tono natural; no enumeres como protocolo rígido salvo que el paciente pida el paso a paso.
`.trim(),
  },
  {
    id: 'postextraccion',
    topic: 'Post extracción',
    keywords: [
      'extraccion',
      'extracción',
      'saque',
      'sacar muela',
      'gasa',
      'post',
      'operacion',
      'operación',
      'fumar',
      'buche',
      'succion',
    ],
    context: `
Indicaciones del consultorio post extracción (para que armes una respuesta completa y clara):
- Morder la gasa 2 horas.
- Primera noche: cabeza alta, dos almohadas.
- 48 hs NO: mate, succionar, fumar, buches, ejercicio ni esfuerzo físico.
- Alimentación blanda/líquida, preferentemente fría; masticar del lado contrario mínimo 48 hs.
- Higiene normal sin pasar el cepillo por el lado intervenido.
- Dolor: tomar lo recetado en el momento (no inventar otras medicaciones).
Podés organizar la respuesta de forma amigable (primeras horas / 48 hs / alimentación), sin sonar a lista robótica.
`.trim(),
  },
]

export function retrieveKnowledgeContext(userText: string, limit = 3): string {
  const q = userText
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')

  const scored = KNOWLEDGE_CHUNKS.map((chunk) => {
    let score = 0
    for (const kw of chunk.keywords) {
      const k = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
      if (q.includes(k)) score += k.length > 5 ? 3 : 2
    }
    // boost exact topic words
    if (q.includes(chunk.topic.toLowerCase().normalize('NFD').replace(/\p{M}/gu, ''))) {
      score += 4
    }
    return { chunk, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  if (scored.length === 0) {
    // contexto base mínimo si no matchea nada específico
    return [
      KNOWLEDGE_CHUNKS.find((c) => c.id === 'horarios')!.context,
      KNOWLEDGE_CHUNKS.find((c) => c.id === 'turnos')!.context,
      KNOWLEDGE_CHUNKS.find((c) => c.id === 'precios-evaluacion')!.context,
    ].join('\n\n')
  }

  return scored
    .map((s) => `### ${s.chunk.topic}\n${s.chunk.context}`)
    .join('\n\n')
}
