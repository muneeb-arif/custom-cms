import Link from "next/link"

export interface NavPage {
  id: string
  slug: string
  title: string
  isHome: boolean
}

export type HeaderBrand =
  | { type: "text"; text: string }
  | { type: "logo"; logoUrl: string }

interface HeaderProps {
  brand: HeaderBrand
  navPages: NavPage[]
  showServicesLink: boolean
}

export default function Header({
  brand,
  navPages,
  showServicesLink,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900"
          >
            {brand.type === "logo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt="Logo"
                className="h-12 w-auto max-w-[500px] object-contain"
              />
            ) : (
              brand.text
            )}
          </Link>
          <div className="flex gap-6">
            {navPages.map((page) => (
              <Link
                key={page.id}
                href={page.isHome ? "/" : `/${page.slug}`}
                className="text-gray-700 hover:text-gray-900"
              >
                {page.title}
              </Link>
            ))}
            {showServicesLink && (
              <Link
                href="/services"
                className="text-gray-700 hover:text-gray-900"
              >
                Services
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
