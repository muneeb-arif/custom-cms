import { prisma } from "@/lib/db/prisma"

export default async function SectionsPage() {
  const sections = await prisma.section.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      page: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    take: 50,
  })

  const sectionTypes = Array.from(
    new Set(sections.map((s) => s.type))
  ).sort()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Section Types</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Available Section Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sectionTypes.map((type) => (
            <div key={type} className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold capitalize text-gray-900">{type}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {sections.filter((s) => s.type === type).length} sections
              </p>
            </div>
          ))}
        </div>
        {sectionTypes.length === 0 && (
          <p className="text-gray-500">No sections created yet.</p>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Sections</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Visible
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sections.map((section) => (
                <tr key={section.id}>
                  <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-900">
                    {section.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {section.page.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {section.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        section.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {section.isVisible ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sections.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No sections found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
