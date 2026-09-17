import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PasswordForm from "@/components/account/PasswordForm"

export const metadata = {
  title: "Settings — Manage Mart",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/settings")
  }

  return (
    <div className="min-h-[70vh] flex items-start justify-center py-12 px-4">
      <PasswordForm />
    </div>
  )
}
