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
    footerMenuVisible: settings.footerMenuVisible,
    footerSocialVisible: settings.footerSocialVisible,
    footerSubscribeVisible: settings.footerSubscribeVisible,
  }

  const footerNavPages = publishedPages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    isHome: p.id === homePageId,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <Header
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
