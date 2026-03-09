"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface FooterSettings {
  footerAboutVisible: boolean
  footerMenuVisible: boolean
  footerSocialVisible: boolean
  footerSubscribeVisible: boolean
}

interface FooterSettingsFormProps {
  initialSettings: FooterSettings
}

const SECTIONS: { key: keyof FooterSettings; label: string }[] = [
  { key: "footerAboutVisible", label: "About us" },
  { key: "footerMenuVisible", label: "Our menu (custom menu)" },
  { key: "footerSocialVisible", label: "Social media" },
  { key: "footerSubscribeVisible", label: "Subscribe to newsletter" },
]

export default function FooterSettingsForm({
  initialSettings,
}: FooterSettingsFormProps) {
  const router = useRouter()
  const [settings, setSettings] = useState<FooterSettings>(initialSettings)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (key: keyof FooterSettings, value: boolean) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    setLoading(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      })
      if (!res.ok) throw new Error("Failed to update settings")
      router.refresh()
    } catch (err) {
      console.error(err)
      setSettings(settings)
      alert("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md space-y-4">
      {SECTIONS.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between">
          <label htmlFor={key} className="text-gray-700 font-medium">
            {label}
          </label>
          <input
            id={key}
            type="checkbox"
            checked={settings[key]}
            onChange={(e) => handleToggle(key, e.target.checked)}
            disabled={loading}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      ))}
      {loading && (
        <p className="text-sm text-gray-500">Saving...</p>
      )}
    </div>
  )
}
