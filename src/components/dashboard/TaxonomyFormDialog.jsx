"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import SingleImageUpload from "./SingleImageUpload"
import StatusSwitch from "./StatusSwitch"

/**
 * Shared Add/Edit modal for Category/Brand/Tag — the three entities are
 * structurally identical, so one dialog covers all three (see TaxonomyManager).
 * @param {{
 *   label: string,
 *   item: Object | null,
 *   open: boolean,
 *   onClose: () => void,
 *   createAction: Function,
 *   updateAction: Function,
 * }} props
 */
export default function TaxonomyFormDialog({ label, item, open, onClose, createAction, updateAction }) {
  const isEditing = !!item
  const action = isEditing ? updateAction.bind(null, item._id) : createAction
  const [state, formAction] = useActionState(action, { success: false, message: "" })
  const [image, setImage] = useState(item?.image || "")
  const [status, setStatus] = useState(item?.status !== false)

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        onClose()
      } else {
        toast.error(state.message)
      }
    }
  }, [state, onClose])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit ${label}` : `Add ${label}`}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update this ${label.toLowerCase()}.` : `Create a new ${label.toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Image</Label>
            <SingleImageUpload value={image} onChange={setImage} />
            <input type="hidden" name="image" value={image} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taxonomy-name">Name</Label>
            <Input id="taxonomy-name" name="name" defaultValue={item?.name || ""} placeholder={`${label} name`} required />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2">
            <div>
              <p className="text-sm font-medium text-gray-800">Active</p>
              <p className="text-xs text-gray-400">Inactive {label.toLowerCase()}s are hidden from the storefront.</p>
            </div>
            <StatusSwitch checked={status} onChange={setStatus} name="status" />
          </div>

          <Button type="submit" className="w-full">
            {isEditing ? "Save Changes" : `Add ${label}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
