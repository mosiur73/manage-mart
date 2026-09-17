"use client"

import { Button } from "@/components/ui/button"

/**
 * Client-side pagination controls for a list already loaded in the browser
 * (dashboard lists here are per-seller/admin scoped and modest in size, so
 * paginating the already-fetched array is simpler than a server round-trip).
 * @param {{ page: number, totalPages: number, onPageChange: (page: number) => void }} props
 */
export default function ClientPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-50">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-xs text-gray-500">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  )
}
