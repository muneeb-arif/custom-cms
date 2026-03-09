import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import PageBanner from "@/components/public/PageBanner"
import type { Metadata } from "next"
import type { SectionData, PageData } from "@/types/cms"

interface DynamicPageProps {
  params: Promise<{ slug: string[] }>
}

export const revalidate = 60

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join("/")

  const page = await prisma.page.findUnique({
    where: { slug: slugString },
  })

  if (!page || !page.isPublished) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const slugString = slug.join("/")

  // Skip if it's a reserved route (services list is at /services)
  const staticRoutes = ["services"]
  if (staticRoutes.includes(slugString)) {
    notFound()
  }

  const page = await prisma.page.findUnique({
    where: { slug: slugString },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!page || !page.isPublished) {
    notFound()
  }

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
