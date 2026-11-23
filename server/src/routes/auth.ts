import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { env } from '../env.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Email o contraseña inválidos' })
    return
  }

  const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  if (!admin) {
    res.status(401).json({ error: 'Credenciales incorrectas' })
    return
  }

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash)
  if (!ok) {
    res.status(401).json({ error: 'Credenciales incorrectas' })
    return
  }

  const token = jwt.sign({ sub: admin.id, email: admin.email }, env.jwtSecret, { expiresIn: '7d' })
  res.json({ token, email: admin.email })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  res.json({ email: req.admin!.email })
})
