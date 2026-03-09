"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/pages", label: "Pages", icon: "📄" },
  { href: "/admin/services", label: "Services", icon: "🛠️" },
  { href: "/admin/sections", label: "Sections", icon: "🧩" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">CMS Admin</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 pt-8 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/admin-login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
