export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} CMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
