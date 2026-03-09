import { prisma } from "@/lib/db/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const [pagesCount, servicesCount, sectionsCount] = await Promise.all([
    prisma.page.count(),
    prisma.service.count(),
    prisma.section.count(),
  ])

  const stats = [
    { label: "Total Pages", value: pagesCount, href: "/admin/pages" },
    { label: "Total Services", value: servicesCount, href: "/admin/services" },
    { label: "Total Sections", value: sectionsCount, href: "/admin/sections" },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
