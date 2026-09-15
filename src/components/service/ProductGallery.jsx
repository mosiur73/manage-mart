"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

/**
 * @param {{ images: string[], alt: string }} props
 */
export default function ProductGallery({ images, alt }) {
  const gallery = images?.length ? images : ["/placeholder.svg"]
  const [selected, setSelected] = useState(0)

  return (
    <div className="space-y-3">
      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <Image
          src={gallery[selected] || "/placeholder.svg"}
          alt={alt}
          width={600}
          height={600}
          className="max-w-full h-auto object-contain"
          priority
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-3 justify-center flex-wrap">
          {gallery.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "relative h-16 w-16 rounded-md overflow-hidden border-2 transition-colors",
                index === selected ? "border-primary" : "border-transparent hover:border-gray-300"
              )}
            >
              <Image src={url} alt={`${alt} thumbnail ${index + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
