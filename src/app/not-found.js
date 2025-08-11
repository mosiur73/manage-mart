import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-white opacity-20 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            The page you re looking for seems to have vanished into the digital void. Don worry, even the best
            explorers sometimes take a wrong turn!
          </p>

          {/* Floating elements */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-blue-400 rounded-full animate-pulse delay-75"></div>
            <div className="absolute -bottom-4 left-1/2 w-4 h-4 bg-green-400 rounded-full animate-pulse delay-150"></div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Link href="/" className="flex items-center justify-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard" className="flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
          </div>

          {/* Fun fact */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700">
              <span className="font-semibold">Fun fact:</span> The first 404 error was discovered at CERN in 1992.
              You re now part of internet history! 🎉
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-4 opacity-60">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-ping delay-75"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-ping delay-150"></div>
        </div>
      </div>
    </div>
  )
}
