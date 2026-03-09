import Link from "next/link"

export interface PageBannerProps {
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
}

function hexToRgba(hex: string, alpha: number): string {
  const match = hex.replace(/^#/, "").match(/.{2}/g)
  if (!match) return `rgba(255, 255, 255, ${alpha})`
  const [r, g, b] = match.map((x) => parseInt(x, 16))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function PageBanner({
  bannerBackgroundImage,
  bannerOverlayColor,
  bannerOverlayOpacity,
  bannerTitle,
  bannerText,
  bannerButtonText,
  bannerButtonLink,
  bannerButtonVisible,
  bannerImage,
  bannerHeightPercent,
}: PageBannerProps) {
  const hasOverlayContent =
    bannerTitle ||
    bannerText ||
    (bannerButtonVisible && bannerButtonText)
  const hasContent = hasOverlayContent || bannerImage
  const hasBackground = bannerBackgroundImage

  if (!hasContent && !hasBackground) return null

  const overlayColor = bannerOverlayColor || "#ffffff"
  const overlayOpacity = bannerOverlayOpacity ?? 0.8
  const overlayStyle = {
    backgroundColor: hexToRgba(overlayColor, overlayOpacity),
  }
  const heightPercent = bannerHeightPercent ?? 60
  const sectionStyle: React.CSSProperties = {
    minHeight: `${heightPercent}vh`,
    ...(bannerBackgroundImage
      ? { backgroundImage: `url(${bannerBackgroundImage})` }
      : {}),
  }

  return (
    <section
      className="relative w-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-200"
      style={sectionStyle}
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {hasOverlayContent && (
            <div
              className="rounded-2xl p-8 md:p-10 max-w-xl w-full backdrop-blur-sm"
              style={overlayStyle}
            >
              {bannerTitle && (
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-sm">
                  {bannerTitle}
                </h1>
              )}
              {bannerText && (
                <p className="text-lg md:text-xl text-white mb-6 drop-shadow-sm">
                  {bannerText}
                </p>
              )}
              {bannerButtonVisible && bannerButtonText && (
                <Link
                  href={bannerButtonLink || "#"}
                  className="inline-block px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                >
                  {bannerButtonText}
                </Link>
              )}
            </div>
          )}
          {bannerImage && (
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/50 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
