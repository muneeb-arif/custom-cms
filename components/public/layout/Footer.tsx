import Link from "next/link"

export interface FooterNavPage {
  id: string
  slug: string
  title: string
  isHome: boolean
}

interface FooterSocialData {
  fb?: { url?: string; text?: string }
  insta?: { url?: string; text?: string }
  twitter?: { url?: string; text?: string }
  linkedin?: { url?: string; text?: string }
  website?: { url?: string; text?: string }
}

interface FooterContactData {
  name?: string
  email?: string
  phone1?: string
  phone2?: string
  address?: string
}

interface FooterSettings {
  footerAboutVisible: boolean
  footerAboutText: string | null
  footerMenuVisible: boolean
  footerSocialVisible: boolean
  footerSubscribeVisible: boolean
  footerSocialJson: FooterSocialData | null
  footerContactJson: FooterContactData | null
}

interface FooterProps {
  footerSettings: FooterSettings
  menuPages: FooterNavPage[]
  showServicesInMenu: boolean
}

function googleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/* SVG icons use currentColor so you can change color via Tailwind (e.g. text-gray-600) */
const IconFacebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
const IconInstagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)
const IconTwitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const IconLinkedIn = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const IconGlobe = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
)
const IconUser = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconEnvelope = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
)
const IconPhone = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconMapPin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export default function Footer({
  footerSettings,
  menuPages,
  showServicesInMenu,
}: FooterProps) {
  const {
    footerAboutVisible,
    footerAboutText,
    footerMenuVisible,
    footerSocialVisible,
    footerSubscribeVisible,
    footerSocialJson,
    footerContactJson,
  } = footerSettings

  const hasAnySection =
    footerAboutVisible ||
    footerMenuVisible ||
    footerSocialVisible ||
    footerSubscribeVisible

  return (
    <footer className="border-t bg-brand-primary mt-auto">
      <div className="container mx-auto px-4 py-10">
        {hasAnySection && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {footerAboutVisible && (
              <div>
                <h3 className="font-semibold text-white mb-5">About us</h3>
                <p className="text-white/90 text-sm whitespace-pre-line">
                  {footerAboutText?.trim() ||
                    "Your trusted partner for quality content and services."}
                </p>
              </div>
            )}
            {footerMenuVisible && (
              <div>
                <h3 className="font-semibold text-white mb-5">Our menu</h3>
                <ul className="space-y-2">
                  {menuPages.map((page) => (
                    <li key={page.id}>
                      <Link
                        href={page.isHome ? "/" : `/${page.slug}`}
                        className="text-white/90 hover:text-brand-hover text-sm transition-colors"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                  {showServicesInMenu && (
                    <li>
                      <Link
                        href="/services"
                        className="text-white/90 hover:text-brand-hover text-sm transition-colors"
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
                <h3 className="font-semibold text-white mb-5">
                  Social media
                </h3>
                <ul className="space-y-2 text-sm">
                  {footerSocialJson?.fb?.url && (
                    <li>
                      <a
                        href={footerSocialJson.fb.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/90 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconFacebook className="h-5 w-5 shrink-0" />
                        <span>{footerSocialJson.fb.text || "Facebook"}</span>
                      </a>
                    </li>
                  )}
                  {footerSocialJson?.insta?.url && (
                    <li>
                      <a
                        href={footerSocialJson.insta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/90 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconInstagram className="h-5 w-5 shrink-0" />
                        <span>{footerSocialJson.insta.text || "Instagram"}</span>
                      </a>
                    </li>
                  )}
                  {footerSocialJson?.twitter?.url && (
                    <li>
                      <a
                        href={footerSocialJson.twitter.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/90 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconTwitter className="h-5 w-5 shrink-0" />
                        <span>{footerSocialJson.twitter.text || "Twitter"}</span>
                      </a>
                    </li>
                  )}
                  {footerSocialJson?.linkedin?.url && (
                    <li>
                      <a
                        href={footerSocialJson.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/90 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconLinkedIn className="h-5 w-5 shrink-0" />
                        <span>{footerSocialJson.linkedin.text || "LinkedIn"}</span>
                      </a>
                    </li>
                  )}
                  {footerSocialJson?.website?.url && (
                    <li>
                      <a
                        href={footerSocialJson.website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/90 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconGlobe className="h-5 w-5 shrink-0" />
                        <span>{footerSocialJson.website.text || "Website"}</span>
                      </a>
                    </li>
                  )}
                  {(!footerSocialJson ||
                    (!footerSocialJson.fb?.url &&
                      !footerSocialJson.insta?.url &&
                      !footerSocialJson.twitter?.url &&
                      !footerSocialJson.linkedin?.url &&
                      !footerSocialJson.website?.url)) && (
                    <li className="text-white/70">No links added yet.</li>
                  )}
                </ul>
              </div>
            )}
            {footerSubscribeVisible && (
              <div>
                <h3 className="font-semibold text-white mb-5">
                  Contact info
                </h3>
                <ul className="space-y-2 text-sm text-white/90">
                  {footerContactJson?.name && (
                    <li className="flex items-center gap-2 text-white font-medium pb-2">
                      <IconUser className="h-5 w-5 shrink-0" />
                      <span>{footerContactJson.name}</span>
                    </li>
                  )}
                  {footerContactJson?.email && (
                    <li>
                      <a
                        href={`mailto:${footerContactJson.email}`}
                        className="flex items-center gap-2 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconEnvelope className="h-5 w-5 shrink-0" />
                        <span>{footerContactJson.email}</span>
                      </a>
                    </li>
                  )}
                  {footerContactJson?.phone1 && (
                    <li>
                      <a
                        href={`tel:${footerContactJson.phone1.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconPhone className="h-5 w-5 shrink-0" />
                        <span>{footerContactJson.phone1}</span>
                      </a>
                    </li>
                  )}
                  {footerContactJson?.phone2 && (
                    <li>
                      <a
                        href={`tel:${footerContactJson.phone2.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconPhone className="h-5 w-5 shrink-0" />
                        <span>{footerContactJson.phone2}</span>
                      </a>
                    </li>
                  )}
                  {footerContactJson?.address && (
                    <li>
                      <a
                        href={googleMapsUrl(footerContactJson.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-brand-hover transition-colors pb-2"
                      >
                        <IconMapPin className="h-5 w-5 shrink-0" />
                        <span>{footerContactJson.address}</span>
                      </a>
                    </li>
                  )}
                  {(!footerContactJson ||
                    (!footerContactJson.name &&
                      !footerContactJson.email &&
                      !footerContactJson.phone1 &&
                      !footerContactJson.phone2 &&
                      !footerContactJson.address)) && (
                    <li className="text-white/70">No contact info added yet.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="text-center text-white/90 border-white/20 border-t py-6">
          <p>&copy; {new Date().getFullYear()} InforMityx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
