import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { env } from './env.js'
import { authRouter } from './routes/auth.js'
import { assetsRouter } from './routes/assets.js'
import { chatLogsRouter } from './routes/chatLogs.js'
import { ensureSeed } from './seedRuntime.js'

const app = express()

app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((s) => s.trim()),
  }),
)
app.use(express.json({ limit: '1mb' }))

const uploadsPath = path.resolve(env.uploadsDir)
fs.mkdirSync(uploadsPath, { recursive: true })
app.use('/uploads', express.static(uploadsPath))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/assets', assetsRouter)
app.use('/api/chat-logs', chatLogsRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

async function main() {
  await ensureSeed()
  app.listen(env.port, () => {
    console.log(`API listening on :${env.port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
