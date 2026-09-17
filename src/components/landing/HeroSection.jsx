"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const images = [
  "https://i.ibb.co.com/3HnKDYg/hero1.jpg",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
]

export default function HeroSection() {
  const { data: session } = useSession()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[60vh] min-h-[480px] max-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {images.map((img) => (
          <div
            key={img}
            className="h-full w-full flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl text-left">

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
            Shop More. <br />
            <span className="text-blue-500">Sell</span> Smarter.
          </h1>

          <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed mb-6">
            Manage Mart is a multi-vendor marketplace — browse thousands of products from
            independent sellers, or list your own in minutes with secure checkout, verified
            reviews, and real order tracking built in.
          </p>

          <div className="flex flex-wrap gap-4">
            {!session && (
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-12 px-8 text-md bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all hover:translate-y-[-2px] shadow-lg shadow-blue-600/20"
                >
                  Get Started Free
                </Button>
              </Link>
            )}
            <Link href="/service">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-md bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-full transition-all group"
              >
                View Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-6 flex space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-1 transition-all duration-500 rounded-full ${
              index === currentImageIndex ? "bg-blue-500 w-12" : "bg-white/30 w-6"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}