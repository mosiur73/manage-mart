"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ImagePlus, Loader2, X } from "lucide-react"

/**
 * One-image variant of ImageUpload.jsx — for entities (Category/Brand/Tag) that
 * only ever need a single logo/thumbnail, not a gallery.
 * @param {{ value: string, onChange: (url: string) => void }} props
 */
export default function SingleImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setUploading(true)
    try {
      const signRes = await fetch("/api/upload/sign", { method: "POST" })
      if (!signRes.ok) {
        const data = await signRes.json().catch(() => ({}))
        throw new Error(data.message || "Could not get an upload signature.")
      }
      const { timestamp, signature, folder, apiKey, cloudName } = await signRes.json()

      const body = new FormData()
      body.append("file", file)
      body.append("api_key", apiKey)
      body.append("timestamp", timestamp)
      body.append("signature", signature)
      body.append("folder", folder)

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body,
      })
      const data = await uploadRes.json()
      if (!uploadRes.ok) {
        throw new Error(data.error?.message || "Upload failed.")
      }
      onChange(data.secure_url)
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Image upload failed. Please try again.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="64px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </>
        ) : (
          <ImagePlus className="h-5 w-5 text-gray-300" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
          </>
        ) : value ? (
          "Change Image"
        ) : (
          "Upload Image"
        )}
      </Button>
    </div>
  )
}
