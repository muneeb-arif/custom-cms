import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/admin/Sidebar"
import { SessionProvider } from "@/components/providers/SessionProvider"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth check is handled by middleware, but verify here as well
  const session = await auth()

  if (!session) {
    redirect("/admin-login")
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </SessionProvider>
  )
}
