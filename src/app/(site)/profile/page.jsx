import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ProfileForm from "@/components/account/ProfileForm"

export const metadata = {
  title: "Profile — Manage Mart",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/profile")
  }

  return (
    <div className="min-h-[70vh] flex items-start justify-center py-12 px-4">
      <ProfileForm user={session.user} />
    </div>
  )
}
