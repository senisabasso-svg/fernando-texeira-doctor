import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'

export const chatLogsRouter = Router()

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

chatLogsRouter.get('/', requireAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 30) || 30))
  const skip = (page - 1) * pageSize

  const [total, items] = await Promise.all([
    prisma.chatLog.count(),
    prisma.chatLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
  ])

  res.json({
    total,
    page,
    pageSize,
    items,
  })
})
