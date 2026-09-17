"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Pencil, Trash2, Search, Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StatusSwitch from "./StatusSwitch"
import TaxonomyFormDialog from "./TaxonomyFormDialog"
import ClientPagination from "./ClientPagination"

const PAGE_SIZE = 20

/**
 * Shared admin list for a {name, image, status, productCount} taxonomy entity —
 * reused by /dashboard/categories, /dashboard/brands, and /dashboard/tags (see
 * taxonomy-actions.js for the identical CRUD shape behind each).
 * @param {{
 *   label: string,
 *   items: Array<Object>,
 *   createAction: Function,
 *   updateAction: Function,
 *   deleteAction: (id: string) => Promise<Object>,
 *   toggleStatusAction: (id: string) => Promise<Object>,
 *   title: string,
 *   description: string,
 *   icon: import("react").ReactNode,
 *   iconBg: string,
 * }} props
 *
 * `icon` must be a pre-rendered element (e.g. `<Tag className="h-5 w-5 text-blue-600" />`),
 * not a component reference — Server Components can't pass component types across the
 * server/client boundary, only rendered elements or plain data.
 */
export default function TaxonomyManager({
  label,
  items,
  createAction,
  updateAction,
  deleteAction,
  toggleStatusAction,
  title,
  description,
  icon,
  iconBg,
}) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => item.name.toLowerCase().includes(q))
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Jump back to page 1 whenever the search narrows the list, and keep `page`
  // in range if the list shrinks (e.g. a delete empties out the last page).
  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  function openCreate() {
    setEditingItem(null)
    setDialogOpen(true)
  }

  function openEdit(item) {
    setEditingItem(item)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    router.refresh()
  }

  function handleToggleStatus(id) {
    setBusyId(id)
    startTransition(async () => {
      const result = await toggleStatusAction(id)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
      setBusyId(null)
    })
  }

  function handleDelete(id) {
    if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return
    setBusyId(id)
    startTransition(async () => {
      const result = await deleteAction(id)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
      setBusyId(null)
    })
  }

  return (
    <div>
      {/* Page header + toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by ${label.toLowerCase()} name`}
              className="pl-9"
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add {label}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-gray-600">
            {items.length === 0 ? `No ${label.toLowerCase()}s yet` : "No matches"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {items.length === 0 ? `Add your first ${label.toLowerCase()} to get started` : "Try a different search"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">#</th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Image</th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Title</th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden sm:table-cell">
                  Total Products
                </th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden md:table-cell">
                  Created Date
                </th>
                <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Status</th>
                <th className="text-right text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((item, index) => {
                const isBusy = isPending && busyId === item._id
                return (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-3 py-3">
                      <div className="relative h-10 w-10 rounded-md overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                        {item.image ? (
                          <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                        ) : (
                          <Package className="h-4 w-4 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-3 py-3 text-gray-600 hidden sm:table-cell">{item.productCount}</td>
                    <td className="px-3 py-3 text-xs text-gray-400 hidden md:table-cell">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <StatusSwitch
                        checked={item.status !== false}
                        disabled={isBusy}
                        onChange={() => handleToggleStatus(item._id)}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isBusy}
                          className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ClientPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {dialogOpen && (
        <TaxonomyFormDialog
          key={editingItem?._id ?? "new"}
          label={label}
          item={editingItem}
          open={dialogOpen}
          onClose={closeDialog}
          createAction={createAction}
          updateAction={updateAction}
        />
      )}
    </div>
  )
}
