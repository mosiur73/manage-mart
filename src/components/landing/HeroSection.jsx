"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Package } from 'lucide-react' // Using Package icon for branding

export default function HeroSection() {
  const { data: session } = useSession()

  return (
    <section className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Package className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-foreground">
          Unlock Your Product's Potential with <span className="text-primary">ProductHub</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          The all-in-one platform designed to streamline product management, enhance team collaboration, and drive
          growth with powerful analytics.
        </p>

        {session ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent text-lg px-8 py-6">
                View Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
