export type RecCategory =
  | 'ortodoncia'
  | 'protesis'
  | 'postextraccion'
  | 'higiene'
  | 'consultorio'

export type Recommendation = {
  id: string
  category: RecCategory
  title: string
  body: string
  tip?: string
  accent?: 'default' | 'caution'
}

export const CATEGORY_LABELS: Record<RecCategory, string> = {
  ortodoncia: 'Ortodoncia',
  protesis: 'Prótesis',
  postextraccion: 'Post extracción',
  higiene: 'Higiene',
  consultorio: 'Consultorio',
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'orto-molestia',
    category: 'ortodoncia',
    title: 'Molestia después del ajuste',
    body: 'No suele “doler”: puede molestar. Si molesta mucho, podés tomar ibuprofeno.',
  },
  {
    id: 'orto-alambre',
    category: 'ortodoncia',
    title: 'Se soltó el alambre',
    body: 'A veces se puede acomodar con una pinza de cejas. Si no podés y te pincha, venís al consultorio.',
    tip: 'Pedí turno en Agenda si no se acomoda.',
    accent: 'caution',
  },
  {
    id: 'orto-bracket',
    category: 'ortodoncia',
    title: 'Se despegó un bracket',
    body: 'Hay que pedirlo turno y venir a recementar, sobre todo si el próximo control está lejos.',
    tip: 'Usá la pestaña Agenda.',
    accent: 'caution',
  },
  {
    id: 'orto-alimentos',
    category: 'ortodoncia',
    title: 'Alimentos a evitar',
    body: 'Dulces pegajosos, chicles, palomitas, nueces, hielo, alimentos duros y bebidas azucaradas. El mate sí se puede.',
    accent: 'caution',
  },
  {
    id: 'orto-control',
    category: 'ortodoncia',
    title: 'Si faltás a un control',
    body: 'El tratamiento se atrasa. Lo mejor es reprogramar cuanto antes en Agenda.',
  },
  {
    id: 'orto-higiene',
    category: 'ortodoncia',
    title: 'Higiene con brackets',
    body: 'Cepillate después de cada comida con cepillo suave, cuidando alrededor de cada bracket. Ayudan el cepillo interdental o el hilo con enhebrador.',
  },
  {
    id: 'prot-limpieza',
    category: 'protesis',
    title: 'Cómo lavar la prótesis',
    body: 'Con jabón neutro y un cepillo dental.',
  },
  {
    id: 'prot-dormir',
    category: 'protesis',
    title: 'Sacarla para dormir',
    body: 'Sí: deben sacarla para dormir.',
  },
  {
    id: 'prot-lastima',
    category: 'protesis',
    title: 'Si lastima o queda floja',
    body: 'Si lastima, consultá. Si queda un poco floja, podés usar adhesivo para prótesis.',
    tip: 'Para revisión: Agenda.',
  },
  {
    id: 'prot-rota',
    category: 'protesis',
    title: 'Si se rompe',
    body: 'Sacá turno y vení: se evalúa si se puede reparar o hay que hacer una nueva. Ambas opciones tienen costo.',
    accent: 'caution',
  },
  {
    id: 'ext-gasa',
    category: 'postextraccion',
    title: 'Gasa las primeras horas',
    body: 'Mordé la gasa durante 2 horas.',
  },
  {
    id: 'ext-almohadas',
    category: 'postextraccion',
    title: 'Primera noche',
    body: 'Dormí con la cabeza alta, usando dos almohadas.',
  },
  {
    id: 'ext-48h',
    category: 'postextraccion',
    title: 'Evitar 48 horas',
    body: 'No tomar mate, no succionar, no fumar, no hacer buches, no ejercicio ni esfuerzo físico.',
    accent: 'caution',
  },
  {
    id: 'ext-comida',
    category: 'postextraccion',
    title: 'Alimentación',
    body: 'Blanda y líquida, preferentemente cosas frías. Masticá del lado contrario a la intervención mínimo 48 hs.',
  },
  {
    id: 'ext-higiene',
    category: 'postextraccion',
    title: 'Higiene',
    body: 'Higienizate normal, pero sin pasar el cepillo por el lado intervenido.',
  },
  {
    id: 'ext-dolor',
    category: 'postextraccion',
    title: 'Si duele',
    body: 'Tomá lo que te recetaron en el momento de la extracción.',
  },
  {
    id: 'hig-tecnica',
    category: 'higiene',
    title: 'Cepillado',
    body: 'Cepillo blando, pasta con flúor e hilo dental. La calidad del cepillado importa más que la cantidad.',
  },
  {
    id: 'cli-horarios',
    category: 'consultorio',
    title: 'Horarios',
    body: 'Lunes y viernes 10–16 hs. Martes a jueves 14–19 hs. Solo de lunes a viernes. No hay urgencias fuera de horario.',
    tip: 'Sí hay turnos de urgencia en el día, dentro del horario.',
  },
  {
    id: 'cli-evaluacion',
    category: 'consultorio',
    title: 'Evaluación sin costo',
    body: 'La consulta de evaluación no tiene costo. Los precios de tratamientos (ortodoncia, extracción, etc.) se definen en el consultorio.',
    tip: 'Pedí turno en Agenda.',
  },
  {
    id: 'cli-duraciones',
    category: 'consultorio',
    title: 'Duración de los turnos',
    body: 'Evaluación ≈ 10 min · Ortodoncia 15–30 min · Limpieza de sarro ≈ 15 min · Resinas mín. 30 min · Extracción ≈ 30 min.',
  },
  {
    id: 'cli-pagos',
    category: 'consultorio',
    title: 'Medios de pago',
    body: 'Efectivo, transferencia, débito, Cosalco hasta 12 pagos sin recargo, Mercado Pago y tarjetas hasta 12 pagos.',
  },
  {
    id: 'cli-ninos',
    category: 'consultorio',
    title: 'Niños y endodoncia',
    body: 'Atienden niños siempre y cuando se dejen atender. También realizan endodoncia.',
  },
]

export const SUGGESTED_PROMPTS = [
  '¿La evaluación tiene costo?',
  '¿Cuáles son los horarios?',
  'Se me despegó un bracket, ¿qué hago?',
  'Cuidados después de una extracción',
  '¿Cómo limpio mi prótesis?',
] as const
