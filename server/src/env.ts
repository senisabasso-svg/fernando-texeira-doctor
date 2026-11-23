import 'dotenv/config'

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: required('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/fernando_texeira'),
  jwtSecret: required('JWT_SECRET', 'dev-change-me-in-production'),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? '',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@consultorio.local',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin123!',
  uploadsDir: process.env.UPLOADS_DIR ?? 'uploads',
}
