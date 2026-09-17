import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Tags } from "lucide-react"
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  toggleTagStatus,
} from "@/app/dashboard/taxonomy-actions"
import TaxonomyManager from "@/components/dashboard/TaxonomyManager"

export const metadata = {
  title: "Tags — Dashboard",
}

export default async function TagsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    redirect("/dashboard")
  }

  const tags = await getTags()

  return (
    <TaxonomyManager
      label="Tag"
      items={tags}
      createAction={createTag}
      updateAction={updateTag}
      deleteAction={deleteTag}
      toggleStatusAction={toggleTagStatus}
      title="Tags"
      description="Manage the tag list"
      icon={<Tags className="h-5 w-5 text-emerald-600" />}
      iconBg="bg-emerald-50"
    />
  )
}
