import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Award } from "lucide-react"
import { getBrands, createBrand, deleteBrand } from "@/app/dashboard/taxonomy-actions"
import TaxonomyManager from "@/components/dashboard/TaxonomyManager"

export const metadata = {
  title: "Brands — Dashboard",
}

export default async function BrandsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    redirect("/dashboard")
  }

  const brands = await getBrands()

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center">
            <Award className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Brands</h2>
            <p className="text-sm text-gray-400">Sellers pick from this list when creating a product</p>
          </div>
        </div>
      </div>

      <TaxonomyManager
        label="Brand"
        items={brands}
        createAction={createBrand}
        deleteAction={deleteBrand}
      />
    </>
  )
}
