"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import EditProductDialog from "./EditProductDialog"
import ClientPagination from "./ClientPagination"
import { Trash2, Pencil, Eye, Search, Plus } from "lucide-react"
import { deleteProduct } from "@/app/dashboard/action"

const PAGE_SIZE = 20

/**
 * Renders the product table (+ pagination). When `header` is passed, it also
 * renders the page-level title/description/search/"Add Product" row above the
 * table — used on the dedicated /dashboard/products page. Left out on the
 * Overview page, which already wraps this in its own Card with its own header
 * and doesn't need a second search box for an at-a-glance list.
 * `header.icon` must be a pre-rendered element (e.g. `<Package className="h-5 w-5 text-blue-600" />`),
 * not a component reference — Server Components can't pass component types across the
 * server/client boundary, only rendered elements or plain data.
 * @param {{ products: Array<Object>, header?: { title: string, description: string, icon: import("react").ReactNode, iconBg: string } }} props
 */
export default function ProductList({ products, header }) {
  const searchParams = useSearchParams()
  const [isDeleting, setIsDeleting] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  // Pre-filled when arriving from the dashboard top bar's search (?search=...).
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginatedProducts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Search resets to page 1; a shrinking list (e.g. after a delete) clamps `page`
  // back into range.
  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return
    setIsDeleting(id)
    const result = await deleteProduct(id)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
    setIsDeleting(null)
  }

  const body =
    filtered.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600">
          {products.length === 0 ? "No products yet" : "No matches"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {products.length === 0 ? "Create your first product using the form" : "Try a different search"}
        </p>
      </div>
    ) : (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Name</th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Price</th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden md:table-cell">Stock</th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden lg:table-cell">Status</th>
                <th className="text-right text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-3.5 font-medium text-gray-800 max-w-[180px] truncate">
                    {product.name}
                  </td>
                  <td className="px-3 py-3.5 text-gray-500 text-xs hidden sm:table-cell">
                    {product.category?.name}
                  </td>
                  <td className="px-3 py-3.5 text-gray-800 font-semibold">
                    ${Number(product.sellingPrice).toFixed(2)}
                    {product.regularPrice > product.sellingPrice && (
                      <span className="ml-1.5 text-xs text-gray-400 line-through font-normal">
                        ${Number(product.regularPrice).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-gray-500 hidden md:table-cell">
                    {product.stock}
                  </td>
                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    {product.stock <= 0 ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">Out of Stock</span>
                    ) : product.stock <= (product.lowStockThreshold ?? 5) ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Low Stock</span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">In Stock</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Link href={`/service/${product._id}`} prefetch={false}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting === product._id}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ClientPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </>
    )

  const editDialog = editingProduct && (
    <EditProductDialog
      product={editingProduct}
      isOpen={!!editingProduct}
      onClose={() => setEditingProduct(null)}
    />
  )

  if (!header) {
    return (
      <>
        {body}
        {editDialog}
      </>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg ${header.iconBg} flex items-center justify-center`}>
            {header.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{header.title}</h2>
            <p className="text-sm text-gray-400">{header.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name"
              className="pl-9"
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {body}
      </div>

      {editDialog}
    </div>
  )
}
