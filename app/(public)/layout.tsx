import Header from "@/components/public/layout/Header"
import Footer from "@/components/public/layout/Footer"
import { prisma } from "@/lib/db/prisma"
import { getOrCreateSettings } from "@/lib/db/settings"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, publishedPages, publishedServicesCount] = await Promise.all([
    getOrCreateSettings(),
    prisma.page.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "asc" },
      select: { id: true, slug: true, title: true },
    }),
    prisma.service.count({ where: { isPublished: true } }),
  ])

  const homePageId = settings.homePageId ?? null
  const navPages = publishedPages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    isHome: p.id === homePageId,
  }))

  const footerSettings = {
    footerAboutVisible: settings.footerAboutVisible,
    footerAboutText: settings.footerAboutText ?? null,
    footerMenuVisible: settings.footerMenuVisible,
    footerSocialVisible: settings.footerSocialVisible,
    footerSubscribeVisible: settings.footerSubscribeVisible,
    footerSocialJson: (settings.footerSocialJson ?? null) as {
      fb?: { url?: string; text?: string }
      insta?: { url?: string }
      twitter?: { url?: string }
      linkedin?: { url?: string }
      website?: { url?: string }
    } | null,
    footerContactJson: (settings.footerContactJson ?? null) as {
      name?: string
      email?: string
      phone1?: string
      phone2?: string
      address?: string
    } | null,
  }

  const footerNavPages = publishedPages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    isHome: p.id === homePageId,
  }))

  const headerBrand =
    settings.headerBrandType === "logo" && settings.headerLogoUrl
      ? { type: "logo" as const, logoUrl: settings.headerLogoUrl }
      : {
          type: "text" as const,
          text: settings.headerBrandText?.trim() || "InforMityx",
        }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        brand={headerBrand}
        navPages={navPages}
        showServicesLink={publishedServicesCount > 0}
      />
      <main className="flex-grow">{children}</main>
      <Footer
        footerSettings={footerSettings}
        menuPages={footerNavPages}
        showServicesInMenu={publishedServicesCount > 0}
      />
    </div>
  )
}
