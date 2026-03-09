import Link from "next/link"

export interface NavPage {
  id: string
  slug: string
  title: string
  isHome: boolean
}

interface HeaderProps {
  navPages: NavPage[]
  showServicesLink: boolean
}

export default function Header({ navPages, showServicesLink }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            CMS
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
