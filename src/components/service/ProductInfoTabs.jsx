"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * @param {{ description: string, reviewsCount: number, children: import("react").ReactNode }} props
 */
export default function ProductInfoTabs({ description, reviewsCount, children }) {
  const [tab, setTab] = useState("description")

  return (
    <div className="mt-12">
      <div className="flex gap-6 border-b">
        <button
          type="button"
          onClick={() => setTab("description")}
          className={cn(
            "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors",
            tab === "description"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => setTab("reviews")}
          className={cn(
            "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors",
            tab === "reviews"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Reviews{reviewsCount > 0 && ` (${reviewsCount})`}
        </button>
      </div>

      <div className="py-6">
        {tab === "description" ? (
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {description || "No description provided."}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
