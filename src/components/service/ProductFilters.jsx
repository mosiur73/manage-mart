"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const PRICE_RANGES = [
  { label: "All price", value: "" },
  { label: "100 - 200", value: "100-200" },
  { label: "200 - 300", value: "200-300" },
  { label: "300 - 400", value: "300-400" },
]

/**
 * @param {{ categories: Array<{_id: string, name: string}>, brands: Array<{_id: string, name: string}> }} props
 */
export default function ProductFilters({ categories, brands }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const isFirstRender = useRef(true)

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete("page") // any filter change resets pagination
    router.push(`${pathname}?${params.toString()}`)
  }

  // Debounce the search box so we don't push a new URL on every keystroke.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const timer = setTimeout(() => updateParams({ search }), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 flex-wrap">
      <input
        type="text"
        placeholder="Search products..."
        className="border rounded-md px-4 py-2 w-full sm:w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border rounded-md px-4 py-2 w-full sm:w-48"
        value={searchParams.get("category") || ""}
        onChange={(e) => updateParams({ category: e.target.value })}
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        className="border rounded-md px-4 py-2 w-full sm:w-48"
        value={searchParams.get("brand") || ""}
        onChange={(e) => updateParams({ brand: e.target.value })}
      >
        <option value="">All brands</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>

      <select
        className="border rounded-md px-4 py-2 w-full sm:w-48"
        value={searchParams.get("price") || ""}
        onChange={(e) => updateParams({ price: e.target.value })}
      >
        {PRICE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  )
}
