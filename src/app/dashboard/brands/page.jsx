import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Award } from "lucide-react"
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
} from "@/app/dashboard/taxonomy-actions"
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
    <TaxonomyManager
      label="Brand"
      items={brands}
      createAction={createBrand}
      updateAction={updateBrand}
      deleteAction={deleteBrand}
      toggleStatusAction={toggleBrandStatus}
      title="Brands"
      description="Sellers pick from this list when creating a product"
      icon={<Award className="h-5 w-5 text-violet-600" />}
      iconBg="bg-violet-50"
    />
  )
}
