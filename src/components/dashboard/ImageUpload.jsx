"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"

/**
 * @param {{ value: string[], onChange: (urls: string[]) => void }} props
 */
export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function uploadOne(file) {
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
    return data.secure_url
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList)
    if (files.length === 0) return

    setUploading(true)
    try {
      const urls = await Promise.all(files.map(uploadOne))
      onChange([...value, ...urls])
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Image upload failed. Please try again.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeImage(url) {
    onChange(value.filter((u) => u !== url))
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url) => (
            <div key={url} className="relative h-20 w-20 rounded-md overflow-hidden border border-gray-200 group">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
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
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" /> Upload Image(s)
          </>
        )}
      </Button>
    </div>
  )
}
