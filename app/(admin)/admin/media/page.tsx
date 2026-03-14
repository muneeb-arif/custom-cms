import MediaLibrary from "@/components/admin/MediaLibrary"

export default function MediaPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Media</h1>
      <p className="text-gray-600 mb-6">
        Upload, view, and delete media files stored in Vercel Blob.
      </p>
      <MediaLibrary />
    </div>
  )
}
