import CreateProductForm from "@/components/dashboard/CreateProductForm"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster } from "sonner"
import { PlusCircle } from "lucide-react"

export const metadata = {
  title: "Create Product — Dashboard",
}

export default function CreateProductPage() {
  return (
    <>
      <Toaster richColors position="top-right" />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <PlusCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Product</h2>
            <p className="text-sm text-gray-400">Add a new product to your store</p>
          </div>
        </div>
      </div>

      <Card className="border border-gray-100 shadow-none">
        <CardContent className="pt-5">
          <CreateProductForm />
        </CardContent>
      </Card>
    </>
  )
}