"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

/**
 * Generic admin CRUD list for a simple {name, slug} taxonomy entity — reused by
 * both /dashboard/categories and /dashboard/brands since the two are structurally
 * identical (see taxonomy-actions.js).
 * @param {{ label: string, items: Array<Object>, createAction: Function, deleteAction: (id: string) => Promise<Object> }} props
 */
export default function TaxonomyManager({ label, items, createAction, deleteAction }) {
  const [state, formAction] = useActionState(createAction, { success: false, message: "" })
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  function handleDelete(id) {
    if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteAction(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      setDeletingId(null)
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border border-gray-100 shadow-none">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-base font-semibold text-gray-900">All {label}s</CardTitle>
            <CardDescription className="text-xs text-gray-400">
              {items.length} {label.toLowerCase()}{items.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-12">
                No {label.toLowerCase()}s yet — add the first one.
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{item.slug}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending && deletingId === item._id}
                      onClick={() => handleDelete(item._id)}
                      className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="border border-gray-100 shadow-none">
          <CardHeader className="pb-3 border-b border-gray-50">
            <CardTitle className="text-base font-semibold text-gray-900">Add {label}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form action={formAction} className="space-y-3">
              <Input name="name" placeholder={`${label} name`} required />
              <Button type="submit" className="w-full">
                Add {label}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
