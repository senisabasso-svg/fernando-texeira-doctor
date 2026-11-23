import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { env } from '../env.js'

export const assetsRouter = Router()

const uploadRoot = path.resolve(env.uploadsDir)
fs.mkdirSync(uploadRoot, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}-${safe}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten imágenes'))
      return
    }
    cb(null, true)
  },
})

function absoluteUploadUrl(filename: string, reqHost?: string): string {
  if (env.publicBaseUrl) {
    return `${env.publicBaseUrl.replace(/\/$/, '')}/uploads/${filename}`
  }
  if (reqHost) return `${reqHost}/uploads/${filename}`
  return `/uploads/${filename}`
}

assetsRouter.get('/', async (_req, res) => {
  const assets = await prisma.siteAsset.findMany({ orderBy: { sortOrder: 'asc' } })
  res.json({ assets })
})

assetsRouter.put('/:key', requireAuth, async (req, res) => {
  const body = z.object({ url: z.string().url() }).safeParse(req.body)
  if (!body.success) {
    res.status(400).json({ error: 'URL inválida' })
    return
  }

  const key = String(req.params.key)
  try {
    const asset = await prisma.siteAsset.update({
      where: { key },
      data: { url: body.data.url },
    })
    res.json({ asset })
  } catch {
    res.status(404).json({ error: 'Asset no encontrado' })
  }
})

assetsRouter.post('/:key/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err.message || 'Error al subir archivo' })
      return
    }
    if (!req.file) {
      res.status(400).json({ error: 'Falta el archivo' })
      return
    }

    const key = String(req.params.key)
    const host = `${req.protocol}://${req.get('host')}`
    const url = absoluteUploadUrl(req.file.filename, host)

    try {
      const asset = await prisma.siteAsset.update({
        where: { key },
        data: { url },
      })
      res.json({ asset })
    } catch {
      res.status(404).json({ error: 'Asset no encontrado' })
    }
  })
})
