"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function updateProfile(prevState, formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in." }
  }

  const name = formData.get("name")?.trim()
  if (!name) {
    return { success: false, message: "Name is required." }
  }
  if (name.length > 80) {
    return { success: false, message: "Name cannot exceed 80 characters." }
  }

  try {
    await dbConnect()
    await User.findByIdAndUpdate(session.user.id, { name })
    revalidatePath("/profile")
    return { success: true, message: "Profile updated.", name }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return { success: false, message: "Failed to update profile. Please try again." }
  }
}
