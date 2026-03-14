// Type definitions for CMS entities

export interface PageData {
  id: string
  slug: string
  title: string
  metaTitle?: string | null
  metaDescription?: string | null
  isPublished: boolean
  bannerBackgroundImage?: string | null
  bannerOverlayColor?: string | null
  bannerOverlayOpacity?: number | null
  bannerTitle?: string | null
  bannerText?: string | null
  bannerButtonText?: string | null
  bannerButtonLink?: string | null
  bannerButtonVisible?: boolean | null
  bannerImage?: string | null
  bannerHeightPercent?: number | null
  sections: SectionData[]
  createdAt: Date
  updatedAt: Date
}

export interface SectionData {
  id: string
  pageId: string
  type: SectionType
  order: number
  content: SectionContent
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

export type SectionType =
  | "textImage"
  | "imageSlider"
  | "headingParagraph"
  | "cards"
  | string // Allow for future dynamic types

export interface CardServiceItem {
  title: string
  description: string
}

export interface CardItem {
  image?: string
  heading: string
  description?: string
  overview?: string
  services?: CardServiceItem[]
  liveDemoUrl?: string
  sourceCodeUrl?: string
}

export interface SectionContent {
  // TextImage section
  text?: string
  image?: string
  alignment?: "left" | "right"

  // ImageSlider section
  images?: string[]
  autoplay?: boolean

  // HeadingParagraph section
  heading?: string
  paragraphs?: string[]

  // Cards section
  title?: string
  subText?: string
  cardsPerRow?: number
  cards?: CardItem[]

  // Generic for future types
  [key: string]: any
}

export interface ServiceData {
  id: string
  slug: string
  title: string
  description?: string | null
  shortDescription?: string | null
  image?: string | null
  content?: any
  isPublished: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface SiteSettingsData {
  id: string
  homePageId: string | null
  footerAboutVisible: boolean
  footerAboutText: string | null
  footerMenuVisible: boolean
  footerSocialVisible: boolean
  footerSubscribeVisible: boolean
  footerSocialJson: FooterSocialData | null
  footerContactJson: FooterContactData | null
  updatedAt: Date
}

export interface FooterSocialData {
  fb?: { url?: string; text?: string }
  insta?: { url?: string; text?: string }
  twitter?: { url?: string; text?: string }
  linkedin?: { url?: string; text?: string }
  website?: { url?: string; text?: string }
}

export interface FooterContactData {
  name?: string
  email?: string
  phone1?: string
  phone2?: string
  address?: string
}
