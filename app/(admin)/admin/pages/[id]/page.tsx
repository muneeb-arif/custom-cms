import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import PageEditor from "@/components/admin/PageEditor"

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!page) {
    notFound()
  }

  return <PageEditor page={page} />
}
