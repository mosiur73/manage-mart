import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Server-rendered pagination — Prev/Next are plain links carrying the current
 * search params forward, so no client JS is needed just to change pages.
 * @param {{ page: number, totalPages: number, searchParams: Record<string, string> }} props
 */
export default function Pagination({ page, totalPages, searchParams }) {
  function hrefFor(targetPage) {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(targetPage))
    return `?${params.toString()}`
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button variant="outline" disabled={page <= 1} asChild={page > 1}>
        {page > 1 ? <Link href={hrefFor(page - 1)}>Previous</Link> : <span>Previous</span>}
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" disabled={page >= totalPages} asChild={page < totalPages}>
        {page < totalPages ? <Link href={hrefFor(page + 1)}>Next</Link> : <span>Next</span>}
      </Button>
    </div>
  )
}
