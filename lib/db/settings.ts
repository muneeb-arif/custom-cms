// lib/db/settings.ts
import { prisma } from "@/lib/db/prisma"

const SITE_SETTINGS_ID = "default"

export async function getOrCreateSettings() {
  return prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: { id: SITE_SETTINGS_ID },
    update: {},
  })
}