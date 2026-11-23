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
      'Horarios de atención:',
      ...CLINIC_INFO.hours.map((h) => `• ${h.days}: ${h.time}`),
      '',
      `Dirección: ${CLINIC_INFO.address}.`,
      'Para pedir turno, usá la pestaña Agenda.',
    ].join('\n')
  }

  if (/(turno|cita|agendar|sacar turno|reservar)/.test(q)) {
    return [
      'Podés pedir tu turno desde la pestaña Agenda de esta web.',
      '',
      'Horarios:',
      ...CLINIC_INFO.hours.map((h) => `• ${h.days}: ${h.time}`),
    ].join('\n')
  }

  if (/(ubicacion|direccion|donde queda|telefono|llamar|contacto|instagram|email|correo)/.test(q)) {
    return [
      'Datos del consultorio:',
      `• Dirección: ${CLINIC_INFO.address}`,
      `• Tel.: ${phone}`,
      `• Email: ${CLINIC_INFO.email}`,
      `• Instagram: ${CLINIC_INFO.instagram}`,
      '',
      'Turnos: pestaña Agenda.',
    ].join('\n')
  }

  if (/(precio|cuanto sale|cuánto sale|cuotas|promo|promocion|obra social|mutualista)/.test(q)) {
    return [
      'Los valores y condiciones se definen según cada caso en la consulta; no tengo un listado vigente acá.',
      'Las promociones cambian y se publican en Instagram.',
      '',
      `Para confirmar: Tel. ${phone}. Para turno: pestaña Agenda.`,
    ].join('\n')
  }

  if (/(implante|implantologo)/.test(q)) {
    return [
      'Sí, el Dr. Texeira es implantólogo. Para saber si sos candidato hace falta una evaluación presencial.',
      'Podés pedir turno en la pestaña Agenda.',
    ].join('\n')
  }

  if (/(bracket|brackets|alambre|ortodoncia|aparato|cera|contencion|contención)/.test(q)) {
    if (/(solto|soltó|despego|despegó)/.test(q)) {
      return [
        'Pasa y no es una urgencia. No intentes pegarlo ni sacarlo vos.',
        'Si te molesta el alambre, cubrilo con cera de ortodoncia.',
        'Pedí turno en Agenda para que el doctor lo vuelva a colocar y no se retrase el tratamiento.',
      ].join('\n')
    }
    if (/(duele|dolor|molest)/.test(q)) {
      return [
        'Es normal sentir sensibilidad o presión los primeros 2 a 4 días después de colocar o ajustar.',
        'Ayuda comer blando. Si el dolor es fuerte, aumenta o te impide comer, pedí turno en Agenda.',
      ].join('\n')
    }
    return [
      'Cuidados de ortodoncia:',
      ...tips('ortodoncia', 6),
      '',
      'Si hay bracket suelto, alambre que pincha o dolor intenso: Agenda.',
    ].join('\n')
  }

  if (/(protesis|prótesis|dentadura)/.test(q)) {
    if (/(rompio|rompió|roto|rota)/.test(q)) {
      return [
        'No la pegues con adhesivos caseros. Guardá todas las partes y pedí turno en Agenda.',
      ].join('\n')
    }
    return [
      'Cuidados de tu prótesis:',
      ...tips('protesis', 5),
      '',
      'Si hay llaga, dolor persistente o se mueve: Agenda.',
    ].join('\n')
  }

  if (/(extraccion|extracción|saque|sacar muela|post operator|gasa)/.test(q)) {
    return [
      'Indicaciones post extracción:',
      ...tips('postextraccion'),
      '',
      `Urgencias (sangrado que no cede, fiebre, hinchazón que crece): Tel. ${phone}.`,
    ].join('\n')
  }

  if (/(mate)/.test(q) && /(extraccion|extracción|saque|muela)/.test(q)) {
    return 'Las primeras 48 horas después de una extracción conviene no tomar mate, no fumar, no aspirar ni hacer buches.'
  }

  if (/(cepill|hilo dental|enjuague|pasta|halitosis|mal aliento|bicarbonato|gaseosa|embaraz)/.test(q)) {
    return [
      'Higiene y cuidados:',
      ...tips('higiene'),
    ].join('\n')
  }

  if (/(sarro|dolor|duele|duelen|inflam|encia|encía|caries|sangrado|muela|diente|bruxismo|trismus)/.test(q)) {
    const urgente = /(mucho|intens|hinchaz|fiebre|no puedo dormir|hinchada)/.test(q)
    return [
      'Entiendo la molestia. No puedo diagnosticar por chat, pero sí orientarte:',
      '',
      '• Sarro, caries o dolor suelen necesitar evaluación presencial (limpieza, revisión).',
      '• Mientras tanto: cepillo suave, evitá extremos de temperatura y no automediques antibióticos.',
      urgente
        ? `• Si el dolor es fuerte, hay hinchazón o fiebre, llamá al ${phone} y pedí atención pronto.`
        : '• Si no mejora, pedí turno en la pestaña Agenda.',
      '',
      `Consultorio: ${CLINIC_INFO.address}.`,
    ].join('\n')
  }

  return [
    'En este momento el asistente con IA está saturado.',
    '',
    'Igual te puedo orientar:',
    '• Cuidados: pestaña Recomendaciones (ortodoncia, prótesis, post extracción, higiene).',
    '• Turnos: pestaña Agenda.',
    `• Tel.: ${phone} · ${CLINIC_INFO.address}.`,
  ].join('\n')
}
