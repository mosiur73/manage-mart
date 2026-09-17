"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function changePassword(prevState, formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in." }
  }

  const currentPassword = formData.get("currentPassword")
  const newPassword = formData.get("newPassword")
  const confirmPassword = formData.get("confirmPassword")

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All fields are required." }
  }
  if (newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters." }
  }
  if (newPassword !== confirmPassword) {
    return { success: false, message: "New password and confirmation do not match." }
  }

  try {
    await dbConnect()
    const user = await User.findById(session.user.id)
    if (!user) {
      return { success: false, message: "User not found." }
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentValid) {
      return { success: false, message: "Current password is incorrect." }
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return { success: true, message: "Password changed successfully." }
  } catch (error) {
    console.error("Failed to change password:", error)
    return { success: false, message: "Failed to change password. Please try again." }
  }
}
