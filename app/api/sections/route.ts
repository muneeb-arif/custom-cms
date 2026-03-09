import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const sectionSchema = z.object({
  pageId: z.string(),
  type: z.string().min(1),
  order: z.number().optional(),
  content: z.any(),
  isVisible: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const pageId = searchParams.get("pageId")

  if (pageId) {
    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(sections)
  }

  const sections = await prisma.section.findMany({
    orderBy: { updatedAt: "desc" },
  })
  return NextResponse.json(sections)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = sectionSchema.parse(body)

    const section = await prisma.section.create({
      data: {
        ...data,
        content: (data.content ?? {}) as object,
      },
    })

    return NextResponse.json(section, { status: 201 })
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
