import { prisma } from "@/lib/db/prisma"

const SITE_SETTINGS_ID = "default"

export async function getOrCreateSettings() {
  const existing = await prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
  })
  if (existing) return existing
  return prisma.siteSettings.create({
    data: { id: SITE_SETTINGS_ID },
  })
}
