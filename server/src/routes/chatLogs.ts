import { Router } from 'express'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'

export const chatLogsRouter = Router()

const TOPICS = {
  turnos: ['turno', 'agenda', 'cita', 'reserv', 'horario de atención'],
  ortodoncia: ['ortodoncia', 'bracket', 'brackets', 'alineador', 'frenos'],
  implantes: ['implante', 'implantes'],
  pagos: ['pago', 'pagos', 'precio', 'costo', 'cosalco', 'mercado pago', 'tarjeta'],
  horarios: ['horario', 'abre', 'cierr', 'lunes', 'martes', 'viernes'],
  urgencia: ['dolor', 'hinchaz', 'sangr', 'urgencia', 'infección', 'molesta'],
} as const

export type TopicKey = keyof typeof TOPICS | 'errores' | 'todos'

const createSchema = z.object({
  question: z.string().trim().min(1).max(4000),
  answer: z.string().trim().max(8000).optional(),
  sessionId: z.string().trim().max(120).optional(),
})

chatLogsRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Pregunta inválida' })
    return
  }

  const log = await prisma.chatLog.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      sessionId: parsed.data.sessionId,
    },
  })

  res.status(201).json({ id: log.id })
})

function topicWhere(topic: string): Prisma.ChatLogWhereInput | null {
  if (!topic || topic === 'todos') return null
  if (topic === 'errores') {
    return { answer: { startsWith: '[error]' } }
  }
  const words = TOPICS[topic as keyof typeof TOPICS]
  if (!words) return null
  return {
    OR: words.flatMap((w) => [
      { question: { contains: w, mode: 'insensitive' as const } },
      { answer: { contains: w, mode: 'insensitive' as const } },
    ]),
  }
}

chatLogsRouter.get('/', requireAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 30) || 30))
  const skip = (page - 1) * pageSize
  const q = String(req.query.q ?? '').trim()
  const topic = String(req.query.topic ?? 'todos').trim()
  const from = String(req.query.from ?? '').trim()
  const to = String(req.query.to ?? '').trim()

  const where: Prisma.ChatLogWhereInput = { AND: [] }
  const and = where.AND as Prisma.ChatLogWhereInput[]

  if (from) {
    const d = new Date(`${from}T00:00:00`)
    if (!Number.isNaN(d.getTime())) and.push({ createdAt: { gte: d } })
  }
  if (to) {
    const d = new Date(`${to}T23:59:59.999`)
    if (!Number.isNaN(d.getTime())) and.push({ createdAt: { lte: d } })
  }
  if (q) {
    and.push({
      OR: [
        { question: { contains: q, mode: 'insensitive' } },
        { answer: { contains: q, mode: 'insensitive' } },
      ],
    })
  }
  const tw = topicWhere(topic)
  if (tw) and.push(tw)

  const finalWhere = and.length ? where : {}

  const [total, items, allForStats] = await Promise.all([
    prisma.chatLog.count({ where: finalWhere }),
    prisma.chatLog.findMany({
      where: finalWhere,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.chatLog.findMany({
      where: finalWhere,
      select: { question: true, answer: true },
      take: 2000,
    }),
  ])

  const topicStats: Record<string, number> = {
    turnos: 0,
    ortodoncia: 0,
    implantes: 0,
    pagos: 0,
    horarios: 0,
    urgencia: 0,
    errores: 0,
  }

  for (const row of allForStats) {
    const text = `${row.question} ${row.answer ?? ''}`.toLowerCase()
    if ((row.answer ?? '').startsWith('[error]')) topicStats.errores += 1
    for (const [key, words] of Object.entries(TOPICS)) {
      if (words.some((w) => text.includes(w))) topicStats[key] += 1
    }
  }

  res.json({
    total,
    page,
    pageSize,
    items,
    topicStats,
  })
})
