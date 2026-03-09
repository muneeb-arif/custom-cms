import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  content: z.any().optional().nullable(),
  isPublished: z.boolean().optional(),
  order: z.number().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get("slug")

  if (slug) {
    const service = await prisma.service.findUnique({
      where: { slug },
    })
    return NextResponse.json(service)
  }

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  })
  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = serviceSchema.parse(body)

    const service = await prisma.service.create({
      data,
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
