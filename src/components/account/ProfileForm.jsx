"use client"

import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Mail, ShieldCheck, Loader2, Camera } from "lucide-react"

import { updateProfile } from "@/app/(site)/profile/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  )
}

export default function ProfileForm({ user, hideFooterLink = false }) {
  const { update } = useSession()
  const [name, setName] = useState(user.name || "")
  const [image, setImage] = useState(user.image || "")
  const [isPending, setIsPending] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.set("file", file)
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Upload failed.")
      }

      setImage(data.url)
      await update({ image: data.url })
      toast.success("Profile picture updated.")
    } catch (error) {
      toast.error(error.message || "Failed to upload image.")
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData()
    formData.set("name", name)

    const result = await updateProfile(null, formData)
    if (result.success) {
      toast.success(result.message)
      await update({ name: result.name })
    } else {
      toast.error(result.message)
    }
    setIsPending(false)
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={image || "/placeholder.svg"} alt={name} />
              <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:opacity-90 disabled:opacity-60"
              aria-label="Change profile picture"
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
            />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <Badge variant="secondary" className="mt-1 gap-1">
              <ShieldCheck className="h-3 w-3" />
              {user.role}
            </Badge>
            <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WEBP or GIF, up to 3MB.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" value={user.email} disabled className="pl-10" />
            </div>
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </CardContent>
      {!hideFooterLink && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Need to change your password? Head to{" "}
            <a href="/settings" className="font-medium text-primary hover:underline">
              Settings
            </a>
            .
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
