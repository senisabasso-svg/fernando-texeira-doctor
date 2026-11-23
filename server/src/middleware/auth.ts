import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'

export type AuthPayload = { sub: string; email: string }

declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }

  try {
    const token = header.slice(7)
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
