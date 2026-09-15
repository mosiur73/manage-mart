"use client"

import { useActionState, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { createProduct } from "@/app/dashboard/action"
import { generateProductDescription } from "@/app/dashboard/ai-actions"
import { getCategories, getBrands } from "@/app/dashboard/taxonomy-actions"
import { deleteCloudinaryImage } from "@/lib/cloudinary-client"
import ImageUpload from "./ImageUpload"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name cannot exceed 120 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(160, "Slug cannot exceed 160 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  shipping: z.coerce.number().min(0, "Shipping cost cannot be negative").optional(),
})

export default function CreateProductForm() {
  const [state, formAction] = useActionState(createProduct, { success: false, message: "" })
  const [images, setImages] = useState([])
  const [keywords, setKeywords] = useState("")
  const [generating, setGenerating] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      stock: "",
      shipping: "",
    },
  })

  useEffect(() => {
    getCategories().then(setCategories)
    getBrands().then(setBrands)
  }, [])

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        form.reset()
        setImages([])
      } else {
        toast.error(state.message)
      }
    }
    if (state.errors) {
      for (const field in state.errors) {
        form.setError(field, {
          type: "server",
          message: state.errors[field][0],
        })
      }
    }
  }, [state, form])

  async function handleGenerateDescription() {
    setGenerating(true)
    try {
      const categoryName = categories.find((c) => c._id === form.getValues("category"))?.name
      const result = await generateProductDescription({
        name: form.getValues("name"),
        category: categoryName,
        keywords,
      })
      if (result.success) {
        form.setValue("description", result.description, { shouldValidate: true, shouldDirty: true })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("AI generation failed. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  // Nothing in the DB references these images yet (product hasn't been created), so
  // it's safe to delete a removed image from Cloudinary immediately.
  function handleImagesChange(nextImages) {
    const removed = images.filter((url) => !nextImages.includes(url))
    removed.forEach(deleteCloudinaryImage)
    setImages(nextImages)
  }

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Ultraboost 22 Shoes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="ultraboost-22-shoes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="99.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Select a brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="shipping"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Cost ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Product Images</FormLabel>
          <ImageUpload value={images} onChange={handleImagesChange} />
          {images.map((url) => (
            <input key={url} type="hidden" name="images" value={url} />
          ))}
          {state.errors?.images && (
            <p className="text-sm font-medium text-destructive">{state.errors.images[0]}</p>
          )}
        </FormItem>
        <div className="space-y-1.5">
          <FormLabel>AI Keywords <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
          <Input
            placeholder="e.g. waterproof, lightweight, recycled materials"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={generating}
                  onClick={handleGenerateDescription}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  {generating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <FormControl>
                <Textarea placeholder="Detailed description of the product..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Form>
  )
}
