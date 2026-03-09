import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { getOrCreateSettings } from "@/lib/db/settings"
import { z } from "zod"

const settingsUpdateSchema = z.object({
  homePageId: z.string().nullable().optional(),
  footerAboutVisible: z.boolean().optional(),
  footerMenuVisible: z.boolean().optional(),
  footerSocialVisible: z.boolean().optional(),
  footerSubscribeVisible: z.boolean().optional(),
})

const SITE_SETTINGS_ID = "default"

export async function GET() {
  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = settingsUpdateSchema.parse(body)

    await getOrCreateSettings()
    const settings = await prisma.siteSettings.update({
      where: { id: SITE_SETTINGS_ID },
      data: {
        ...(data.homePageId !== undefined && { homePageId: data.homePageId }),
        ...(data.footerAboutVisible !== undefined && {
          footerAboutVisible: data.footerAboutVisible,
        }),
        ...(data.footerMenuVisible !== undefined && {
          footerMenuVisible: data.footerMenuVisible,
        }),
        ...(data.footerSocialVisible !== undefined && {
          footerSocialVisible: data.footerSocialVisible,
        }),
        ...(data.footerSubscribeVisible !== undefined && {
          footerSubscribeVisible: data.footerSubscribeVisible,
        }),
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Failed to update settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
