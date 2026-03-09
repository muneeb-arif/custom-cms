import Image from "next/image"

interface TextImageSectionProps {
  content: {
    text?: string
    image?: string
    alignment?: "left" | "right"
  }
}

export default function TextImageSection({ content }: TextImageSectionProps) {
  const { text = "", image, alignment = "left" } = content

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col ${
            alignment === "right" ? "md:flex-row-reverse" : "md:flex-row"
          } gap-8 items-center`}
        >
          <div className="flex-1">
            {image && (
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
