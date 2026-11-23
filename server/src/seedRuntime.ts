import bcrypt from 'bcryptjs'
import { prisma } from './prisma.js'
import { env } from './env.js'
import { DEFAULT_ASSETS } from './defaultAssets.js'

/** Idempotent bootstrap for Railway: admin + default web assets. */
export async function ensureSeed() {
  const email = env.adminEmail.toLowerCase()
  const existing = await prisma.admin.findUnique({ where: { email } })
  if (!existing) {
    const passwordHash = await bcrypt.hash(env.adminPassword, 10)
    await prisma.admin.create({
      data: { email, passwordHash },
    })
    console.log(`Admin created: ${email}`)
  }

  for (const asset of DEFAULT_ASSETS) {
    await prisma.siteAsset.upsert({
      where: { key: asset.key },
      create: asset,
      update: {
        label: asset.label,
        sortOrder: asset.sortOrder,
      },
    })
  }
}
