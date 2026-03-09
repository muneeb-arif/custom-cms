import Link from "next/link"

export interface FooterNavPage {
  id: string
  slug: string
  title: string
  isHome: boolean
}

interface FooterSettings {
  footerAboutVisible: boolean
  footerMenuVisible: boolean
  footerSocialVisible: boolean
  footerSubscribeVisible: boolean
}

interface FooterProps {
  footerSettings: FooterSettings
  menuPages: FooterNavPage[]
  showServicesInMenu: boolean
}

export default function Footer({
  footerSettings,
  menuPages,
  showServicesInMenu,
}: FooterProps) {
  const {
    footerAboutVisible,
    footerMenuVisible,
    footerSocialVisible,
    footerSubscribeVisible,
  } = footerSettings

  const hasAnySection =
    footerAboutVisible ||
    footerMenuVisible ||
    footerSocialVisible ||
    footerSubscribeVisible

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {hasAnySection && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {footerAboutVisible && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">About us</h3>
                <p className="text-gray-600 text-sm">
                  Your trusted partner for quality content and services.
                </p>
              </div>
            )}
            {footerMenuVisible && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Our menu</h3>
                <ul className="space-y-2">
                  {menuPages.map((page) => (
                    <li key={page.id}>
                      <Link
                        href={page.isHome ? "/" : `/${page.slug}`}
                        className="text-gray-600 hover:text-gray-900 text-sm"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                  {showServicesInMenu && (
                    <li>
                      <Link
                        href="/services"
                        className="text-gray-600 hover:text-gray-900 text-sm"
                      >
                        Services
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {footerSocialVisible && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Social media
                </h3>
                <p className="text-gray-600 text-sm">
                  Follow us on social media for updates.
                </p>
              </div>
            )}
            {footerSubscribeVisible && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Subscribe to newsletter
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Get the latest news and updates.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  disabled
                  aria-label="Newsletter email (coming soon)"
                />
              </div>
            )}
          </div>
        )}
        <div className="text-center text-gray-600 border-t pt-6">
          <p>&copy; {new Date().getFullYear()} CMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
