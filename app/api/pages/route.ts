import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().optional(),
  bannerBackgroundImage: z.string().optional().nullable(),
  bannerOverlayColor: z.string().optional().nullable(),
  bannerOverlayOpacity: z.number().min(0).max(1).optional().nullable(),
  bannerTitle: z.string().optional().nullable(),
  bannerText: z.string().optional().nullable(),
  bannerButtonText: z.string().optional().nullable(),
  bannerButtonLink: z.string().optional().nullable(),
  bannerButtonVisible: z.boolean().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  bannerHeightPercent: z.number().min(0).max(100).optional().nullable(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get("slug")

  if (slug) {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    })
    return NextResponse.json(page)
  }

  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { sections: true },
      },
    },
  })
  return NextResponse.json(pages)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = pageSchema.parse(body)

    const page = await prisma.page.create({
      data,
    })

    return NextResponse.json(page, { status: 201 })
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
