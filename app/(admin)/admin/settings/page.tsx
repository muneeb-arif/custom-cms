import FooterSettingsForm from "@/components/admin/FooterSettingsForm"
import { getOrCreateSettings } from "@/lib/db/settings"

export default async function SettingsPage() {
  const settings = await getOrCreateSettings()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Footer visibility
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Choose which sections appear in the site footer. Each section is shown
          in its own column when visible.
        </p>
        <FooterSettingsForm
          initialSettings={{
            footerAboutVisible: settings.footerAboutVisible,
            footerMenuVisible: settings.footerMenuVisible,
            footerSocialVisible: settings.footerSocialVisible,
            footerSubscribeVisible: settings.footerSubscribeVisible,
          }}
        />
      </section>
    </div>
  )
}
