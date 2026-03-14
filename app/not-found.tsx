import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-brand-header">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-brand-header">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-hover transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
