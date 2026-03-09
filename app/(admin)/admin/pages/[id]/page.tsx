import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import PageEditor from "@/components/admin/PageEditor"
import { getOrCreateSettings } from "@/lib/db/settings"
import type { PageData } from "@/types/cms"

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [page, settings] = await Promise.all([
    prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    }),
    getOrCreateSettings(),
  ])

  if (!page) {
    notFound()
  }

  return (
    <PageEditor
      page={page as PageData}
      homePageId={settings.homePageId}
    />
  )
}
