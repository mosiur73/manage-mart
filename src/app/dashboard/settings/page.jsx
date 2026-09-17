import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Settings } from "lucide-react"
import ProfileForm from "@/components/account/ProfileForm"
import PasswordForm from "@/components/account/PasswordForm"

export const metadata = {
  title: "Settings — Dashboard",
}

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/settings")
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-400">Manage your profile and account security</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <ProfileForm user={session.user} hideFooterLink />
        <PasswordForm />
      </div>
    </>
  )
}
