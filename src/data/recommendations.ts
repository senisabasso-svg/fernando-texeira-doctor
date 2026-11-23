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
  // —— Ortodoncia ——
  {
    id: 'orto-dolor',
    category: 'ortodoncia',
    title: 'Dolor tras colocar o ajustar brackets',
    body: 'Es normal sentir sensibilidad o presión los primeros 2 a 4 días. Ayuda comer blando y evitar lo muy duro o muy caliente.',
    tip: 'Si el dolor es fuerte, aumenta o te impide comer, pedí turno en Agenda.',
  },
  {
    id: 'orto-bracket-suelto',
    category: 'ortodoncia',
    title: 'Se soltó un bracket',
    body: 'No intentes pegarlo ni sacarlo. Si te molesta el alambre, cubrilo con cera de ortodoncia.',
    tip: 'Sacá turno en Agenda para que lo vuelvan a colocar.',
    accent: 'caution',
  },
  {
    id: 'orto-alambre',
    category: 'ortodoncia',
    title: 'Alambre que pincha',
    body: 'Pasale un poco de cera de ortodoncia. No lo cortes en casa.',
    tip: 'Si no se acomoda, pedí ajuste en Agenda.',
  },
  {
    id: 'orto-higiene',
    category: 'ortodoncia',
    title: 'Higiene con brackets',
    body: 'Cepillate después de cada comida y antes de dormir, con cepillo suave, arriba y abajo de cada bracket y en la línea de encía. Usá cepillo interdental o hilo con enhebrador.',
  },
  {
    id: 'orto-alimentos',
    category: 'ortodoncia',
    title: 'Qué no comer con brackets',
    body: 'Evitá lo muy duro (turrón, caramelos, hielo), lo pegajoso (chicles) y morder directo manzana, zanahoria o pan crocante: cortalos en trozos. No muerdas lapiceras ni uñas.',
    accent: 'caution',
  },
  {
    id: 'orto-mate',
    category: 'ortodoncia',
    title: '¿Puedo tomar mate?',
    body: 'Sí. Mejor sin azúcar y cepillándote después, para que no se acumule alrededor de los brackets.',
  },
  {
    id: 'orto-controles',
    category: 'ortodoncia',
    title: 'Controles y contención',
    body: 'Los controles son clave para que el tratamiento avance. La placa o contención fija se usa como indicó el doctor.',
    tip: 'Si faltaste a un control o se te salió la contención, reprogramá en Agenda.',
  },
  {
    id: 'orto-fono',
    category: 'ortodoncia',
    title: 'Ejercicios de labios y lengua',
    body: 'Complementan la ortodoncia. Lo ideal es hacerlos con un licenciado en fonoaudiología.',
  },
  // —— Prótesis ——
  {
    id: 'prot-limpieza',
    category: 'protesis',
    title: 'Cómo limpiar la prótesis',
    body: 'Cepillala todos los días con cepillo suave y jabón neutro o pasta no abrasiva, sobre agua o una toalla para que no se rompa si se cae. Evitá agua muy caliente.',
  },
  {
    id: 'prot-descanso',
    category: 'protesis',
    title: '¿Sacarla para dormir?',
    body: 'En general sí, para que la encía descanse. Guardala en agua limpia o en la solución que te indicaron, salvo otra indicación del doctor.',
  },
  {
    id: 'prot-prohibido',
    category: 'protesis',
    title: 'Qué no hacer',
    body: 'No la limés, no la pegues con adhesivos caseros, no uses lavandina ni pastas abrasivas, no la dejes seca por horas.',
    accent: 'caution',
  },
  {
    id: 'prot-adaptacion',
    category: 'protesis',
    title: 'Adaptación',
    body: 'Es habitual molestia o dificultad para hablar/comer al principio. Probá comidas blandas en trozos chicos y leé en voz alta.',
    tip: 'Si hay llaga, dolor que no cede o se mueve, pedí ajuste en Agenda.',
  },
  {
    id: 'prot-rota',
    category: 'protesis',
    title: 'Prótesis rota',
    body: 'No la pegues en casa. Guardá todas las partes y pedí turno en Agenda.',
    accent: 'caution',
  },
  // —— Post extracción ——
  {
    id: 'ext-primeras',
    category: 'postextraccion',
    title: 'Primeras horas',
    body: 'Mordé la gasa con firmeza (30–60 min o según indicación). No escupas, no te enjuagues fuerte, no uses pajita ni fumes. Frío por fuera; comida blanda y tibia/fría. No comas mientras dure la anestesia.',
  },
  {
    id: 'ext-48h',
    category: 'postextraccion',
    title: 'Evitar 48 horas',
    body: 'No fumes, no tomes mate, no aspiles ni hagas buches, y no hagas esfuerzos físicos. Masticá del lado contrario.',
    tip: 'Así la zona cicatriza correctamente.',
    accent: 'caution',
  },
  {
    id: 'ext-higiene',
    category: 'postextraccion',
    title: 'Higiene post extracción',
    body: 'Podés cepillarte evitando la herida el primer día. Después, con suavidad alrededor. Desde ~24 hs, enjuagues suaves con agua tibia y sal si corresponde.',
  },
  {
    id: 'ext-sangrado',
    category: 'postextraccion',
    title: 'Sangrado',
    body: 'Un poco de sangre con saliva el primer día es normal. Mordé gasa limpia 30–60 min. Si sigue abundante, llamá al 4733 4971; si es mucho, urgencia médica.',
    accent: 'caution',
  },
  {
    id: 'ext-alarma',
    category: 'postextraccion',
    title: 'Señales de alarma',
    body: 'Dolor que aumenta después del 2.º–3.º día, fiebre, pus, mal sabor intenso o hinchazón que crece: llamá al 4733 4971. Dificultad para respirar o tragar: emergencia inmediata.',
    accent: 'caution',
  },
  // —— Higiene ——
  {
    id: 'hig-tecnica',
    category: 'higiene',
    title: 'Técnica de cepillado',
    body: 'Más que la cantidad, importa la calidad: cepillo a 45° sobre encía y diente, movimientos suaves y circulares en todas las superficies. Ideal después de cada comida.',
  },
  {
    id: 'hig-cepillo',
    category: 'higiene',
    title: 'Cepillo blando y poca pasta',
    body: 'Preferí cepillo blando (el duro desgasta y lastima). Poca pasta con flúor alcanza; el enjuague no reemplaza al cepillado. Usá hilo dental.',
  },
  {
    id: 'hig-mitos',
    category: 'higiene',
    title: 'Mitos frecuentes',
    body: 'El bicarbonato casero no se recomienda para blanquear (es abrasivo). Las gaseosas erosionan el esmalte. Fumar daña dientes y encías. En el embarazo no se “caen dientes por el calcio”: sí conviene reforzar higiene y controles.',
  },
  {
    id: 'hig-halitosis',
    category: 'higiene',
    title: 'Mal aliento',
    body: 'No siempre son los dientes: puede venir de encías u otras causas. Si persiste, conviene evaluación.',
    tip: 'Pedí turno en Agenda si no mejora.',
  },
  // —— Consultorio ——
  {
    id: 'cli-horarios',
    category: 'consultorio',
    title: 'Horarios de atención',
    body: 'Lunes y viernes 10:00–16:00 hs. Martes a jueves 14:00–19:00 hs.',
    tip: 'Pedí tu turno en la pestaña Agenda.',
  },
  {
    id: 'cli-ubicacion',
    category: 'consultorio',
    title: 'Ubicación y contacto',
    body: 'Uruguay 1580, Barrio Centro, Salto. Tel. 4733 4971. Instagram @drfernandotexeiranunez.',
  },
  {
    id: 'cli-servicios',
    category: 'consultorio',
    title: 'Servicios',
    body: 'Ortodoncia, implantes, prótesis, cirugías y extracciones, limpieza de sarro, caries, blanqueamiento y asesoramiento. El Dr. Texeira es odontólogo, ortodoncista, implantólogo y cirujano.',
  },
  {
    id: 'cli-precios',
    category: 'consultorio',
    title: 'Precios y promos',
    body: 'Los valores se definen según cada caso en la consulta. Las promociones cambian y se publican en Instagram; no hay un listado fijo en este chat.',
    tip: 'Para turnos: pestaña Agenda. Dudas de valores: Tel. 4733 4971.',
  },
]

export const SUGGESTED_PROMPTS = [
  '¿Cuáles son los horarios de atención?',
  'Se me soltó un bracket, ¿qué hago?',
  '¿Cómo limpio mi prótesis?',
  'Me sacaron una muela, ¿qué cuidados tengo?',
  'Tengo sarro y me duelen los dientes',
] as const
