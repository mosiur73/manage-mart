"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

/**
 * @param {{ currentPage: number, totalPages: number }} props
 */
export default function PaginationControls({ currentPage, totalPages }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
        Previous
      </Button>
      {/* You can add more sophisticated page number display here if needed */}
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
        Next
      </Button>
    </div>
  )
}
