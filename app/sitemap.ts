import { MetadataRoute } from "next"
import { prisma } from "@/lib/db/prisma"
import { getOrCreateSettings } from "@/lib/db/settings"
import { getBaseUrl } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const RESERVED_FIRST_SEGMENTS = [
    "services",
    "admin",
    "admin-login",
    "api",
    "media",
  ] as const

  const [pages, services, customTypes] = await Promise.all([
    prisma.page.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.customType.findMany({
      where: { isPublished: true },
      include: {
        sections: {
          where: { type: "cards", isVisible: true },
          select: { content: true, updatedAt: true },
        },
      },
    }),
  ])

  const settings = await getOrCreateSettings()
  const homePage = settings.homePageId
    ? await prisma.page.findUnique({
        where: { id: settings.homePageId },
        select: { slug: true, updatedAt: true, isPublished: true },
      })
    : null

  const servicesLastModified =
    services.length > 0
      ? services.reduce((max, s) =>
          s.updatedAt > max ? s.updatedAt : max,
        services[0].updatedAt)
      : new Date()

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: homePage?.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: servicesLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ]

  const dynamicPages = pages
    .filter((page) => {
      const first = page.slug.split("/")[0]
      if (RESERVED_FIRST_SEGMENTS.includes(first as any)) return false
      if (homePage?.slug && page.slug === homePage.slug) return false
      return true
    })
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  const servicePages = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const customTypeEntries: MetadataRoute.Sitemap = []
  for (const ct of customTypes) {
    if (RESERVED_FIRST_SEGMENTS.includes(ct.slug as any)) continue
    customTypeEntries.push({
      url: `${baseUrl}/${ct.slug}`,
      lastModified: ct.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
    for (const section of ct.sections) {
      const content = section.content as { cards?: Array<{ openInModal?: boolean; cardSlug?: string }> }
      const cards = content?.cards ?? []
      for (const card of cards) {
        if (card.openInModal === false && card.cardSlug) {
          customTypeEntries.push({
            url: `${baseUrl}/${ct.slug}/${card.cardSlug}`,
            lastModified: section.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.5,
          })
        }
      }
    }
  }

  return [...staticRoutes, ...dynamicPages, ...servicePages, ...customTypeEntries]
}
