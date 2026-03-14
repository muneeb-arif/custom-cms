import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import PageBanner from "@/components/public/PageBanner"
import type { Metadata } from "next"
import { getOrCreateSettings } from "@/lib/db/settings"
import type { SectionData, PageData } from "@/types/cms"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getOrCreateSettings()
  if (!settings.homePageId) {
    return {
      title: "Home",
      description: "Welcome to our CMS",
    }
  }
  const page = await prisma.page.findUnique({
    where: { id: settings.homePageId },
  })
  if (page && page.isPublished) {
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
    }
  }
  return {
    title: "Home",
    description: "Welcome to our CMS",
  }
}

export default async function HomePage() {
  const settings = await getOrCreateSettings()
  const homePageId = settings.homePageId

  if (homePageId) {
    const page = await prisma.page.findUnique({
      where: { id: homePageId },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (page && page.isPublished) {
      const p = page as PageData
      const showBanner =
        p.bannerTitle ||
        p.bannerText ||
        p.bannerBackgroundImage ||
        p.bannerImage ||
        (p.bannerButtonVisible && p.bannerButtonText)
      return (
        <>
          <PageBanner
            bannerBackgroundImage={p.bannerBackgroundImage}
            bannerOverlayColor={p.bannerOverlayColor}
            bannerOverlayOpacity={p.bannerOverlayOpacity}
            bannerTitle={p.bannerTitle}
            bannerText={p.bannerText}
            bannerButtonText={p.bannerButtonText}
            bannerButtonLink={p.bannerButtonLink}
            bannerButtonVisible={p.bannerButtonVisible}
            bannerImage={p.bannerImage}
            bannerHeightPercent={p.bannerHeightPercent}
          />
          <div className="container mx-auto px-4 py-8">
            {!showBanner && (
              <h1 className="text-4xl font-bold mb-8">{p.title}</h1>
            )}
            <div className="space-y-12">
              {page.sections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section as SectionData}
                />
              ))}
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-brand-header">
          Nothing is created
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Let&apos;s start building your site. Create your first page and set it
          as the home page from the admin.
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-hover transition-colors"
        >
          Let&apos;s start building
        </Link>
      </div>
    </div>
  )
}
