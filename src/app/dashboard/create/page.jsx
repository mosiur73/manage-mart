import CreatePostForm from "@/components/dashboard/CreatePostForm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Toaster } from "sonner"
import { PlusCircle, Lightbulb } from "lucide-react"

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-100 shadow-none">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-base font-semibold text-gray-900">Product Details</CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Fill in the information below to create a new product
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <CreatePostForm />
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <div>
          <Card className="border border-amber-100 bg-amber-50/50 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-sm font-semibold text-amber-800">Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <p className="text-xs font-medium text-amber-800">Title</p>
                <p className="text-xs text-amber-700 mt-0.5">Keep it short and descriptive. Max 60 characters.</p>
              </div>
              <div>
                <p className="text-xs font-medium text-amber-800">Slug</p>
                <p className="text-xs text-amber-700 mt-0.5">Use lowercase letters, numbers, and hyphens only. E.g. <span className="font-mono bg-amber-100 px-1 rounded">my-product</span></p>
              </div>
              <div>
                <p className="text-xs font-medium text-amber-800">Content</p>
                <p className="text-xs text-amber-700 mt-0.5">Provide a clear description of the product for customers.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}