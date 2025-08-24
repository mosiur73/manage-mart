"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Package } from 'lucide-react'

export default function HeroSection() {
  const { data: session } = useSession()

  return (
    <section 
      className="relative min-h-[calc(80vh-64px)] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://i.ibb.co.com/3HnKDYg/hero1.jpg')`
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30"></div>

      <div className="container mx-auto px-4 py-12 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Icon Container */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl transform hover:scale-110 transition-transform duration-300">
              <Package className="h-10 w-10" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Empower Your Product Management
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            The all-in-one platform designed to streamline product management, enhance team collaboration, and drive
            growth with powerful analytics.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/products">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:border-white rounded-lg font-semibold transition-all duration-300"
                  >
                    View Products
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:border-white rounded-lg font-semibold transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}