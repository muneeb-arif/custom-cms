import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import ServiceEditor from "@/components/admin/ServiceEditor"

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const service = await prisma.service.findUnique({
    where: { id },
  })

  if (!service) {
    notFound()
  }

  return <ServiceEditor service={service} />
}
