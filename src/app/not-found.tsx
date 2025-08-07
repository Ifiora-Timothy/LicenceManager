import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-6 py-12 max-w-md mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            The page might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200">
              Go Back Home
            </Button>
          </Link>
          
          <Link href="/licenses" className="block">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors duration-200">
              Browse Licenses
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team or check our documentation.
          </p>
        </div>
      </div>
    </div>
  )
}
