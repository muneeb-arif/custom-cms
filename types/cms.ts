// Type definitions for CMS entities

export interface PageData {
  id: string
  slug: string
  title: string
  metaTitle?: string | null
  metaDescription?: string | null
  isPublished: boolean
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
  | 'textImage' 
  | 'imageSlider' 
  | 'headingParagraph'
  | string // Allow for future dynamic types

export interface SectionContent {
  // TextImage section
  text?: string
  image?: string
  alignment?: 'left' | 'right'
  
  // ImageSlider section
  images?: string[]
  autoplay?: boolean
  
  // HeadingParagraph section
  heading?: string
  paragraphs?: string[]
  
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
