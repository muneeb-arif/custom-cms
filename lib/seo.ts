export function getBaseUrl(): string {
  // Next's metadata expects absolute URLs; keep it stable + no trailing slash.
  const explicit = process.env.NEXT_PUBLIC_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")

  // Vercel sets VERCEL_URL but many projects don't set NEXT_PUBLIC_URL.
  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) {
    const hasProtocol = /^https?:\/\//i.test(vercelUrl)
    const raw = hasProtocol ? vercelUrl : `https://${vercelUrl}`
    return raw.replace(/\/$/, "")
  }

  // As a fallback, use NextAuth URL if present.
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim()
  if (nextAuthUrl) return nextAuthUrl.replace(/\/$/, "")

  return "http://localhost:9000"
}

export function canonicalUrl(pathname: string): string {
  const baseUrl = getBaseUrl()
  const normalized =
    pathname === "/" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`
  return normalized === "/" ? baseUrl + "/" : baseUrl + normalized
}

export function canonicalFromSlug(slugParts: string[]): string {
  return canonicalUrl("/" + slugParts.join("/"))
}

