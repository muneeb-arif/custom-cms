"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface SetHomePageButtonProps {
  pageId: string
  isCurrentHome: boolean
  variant?: "button" | "link"
}

export default function SetHomePageButton({
  pageId,
  isCurrentHome,
  variant = "button",
}: SetHomePageButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSetHome = async () => {
    if (isCurrentHome) return
    setLoading(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homePageId: pageId }),
      })
      if (!res.ok) throw new Error("Failed to set home page")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to set home page")
    } finally {
      setLoading(false)
    }
  }

  if (isCurrentHome) {
    return (
      <span className="text-amber-600 font-medium text-sm">Home page</span>
    )
  }

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={handleSetHome}
        disabled={loading}
        className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
      >
        {loading ? "Setting..." : "Set as home page"}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleSetHome}
      disabled={loading}
      className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-sm hover:bg-amber-200 transition disabled:opacity-50"
    >
      {loading ? "Setting..." : "Set as home page"}
    </button>
  )
}
