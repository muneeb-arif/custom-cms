interface HeadingParagraphSectionProps {
  content: {
    heading?: string
    paragraphs?: string[]
  }
}

export default function HeadingParagraphSection({
  content,
}: HeadingParagraphSectionProps) {
  const { heading = "", paragraphs = [] } = content

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 mx-auto">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-brand-header mb-6">{heading}</h2>
          )}
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
