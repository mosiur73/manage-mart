import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Tag } from "lucide-react"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/app/dashboard/taxonomy-actions"
import TaxonomyManager from "@/components/dashboard/TaxonomyManager"

export const metadata = {
  title: "Categories — Dashboard",
}

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    redirect("/dashboard")
  }

  const categories = await getCategories()

  return (
    <TaxonomyManager
      label="Category"
      items={categories}
      createAction={createCategory}
      updateAction={updateCategory}
      deleteAction={deleteCategory}
      toggleStatusAction={toggleCategoryStatus}
      title="Categories"
      description="Sellers pick from this list when creating a product"
      icon={<Tag className="h-5 w-5 text-blue-600" />}
      iconBg="bg-blue-50"
    />
  )
}
