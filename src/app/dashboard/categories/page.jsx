import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Tag } from "lucide-react"
import { getCategories, createCategory, deleteCategory } from "@/app/dashboard/taxonomy-actions"
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
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Tag className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Categories</h2>
            <p className="text-sm text-gray-400">Sellers pick from this list when creating a product</p>
          </div>
        </div>
      </div>

      <TaxonomyManager
        label="Category"
        items={categories}
        createAction={createCategory}
        deleteAction={deleteCategory}
      />
    </>
  )
}
