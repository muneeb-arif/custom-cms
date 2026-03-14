import { SectionData } from "@/types/cms"
import TextImageSection from "./TextImageSection"
import ImageSliderSection from "./ImageSliderSection"
import HeadingParagraphSection from "./HeadingParagraphSection"
import CardsSection from "./CardsSection"

interface SectionRendererProps {
  section: SectionData
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case "textImage":
      return <TextImageSection content={section.content as any} />
    case "imageSlider":
      return <ImageSliderSection content={section.content as any} />
    case "headingParagraph":
      return <HeadingParagraphSection content={section.content as any} />
    case "cards":
      return <CardsSection content={section.content as any} />
    default:
      return (
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded">
          <p className="text-sm text-yellow-800">
            Unknown section type: {section.type}
          </p>
        </div>
      )
  }
}
