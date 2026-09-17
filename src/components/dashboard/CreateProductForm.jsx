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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(120, "Name cannot exceed 120 characters"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(160, "Slug cannot exceed 160 characters")
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    sku: z.string().max(60, "SKU cannot exceed 60 characters").optional(),
    shortDescription: z.string().max(200, "Short description cannot exceed 200 characters").optional(),
    description: z.string().min(1, "Description is required"),
    tags: z.string().optional(),
    purchasePrice: z.coerce.number().min(0, "Purchase price cannot be negative").optional(),
    regularPrice: z.coerce.number().min(0, "Regular price cannot be negative"),
    sellingPrice: z.coerce.number().min(0, "Selling price cannot be negative"),
    category: z.string().min(1, "Category is required"),
    brand: z.string().min(1, "Brand is required"),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    lowStockThreshold: z.coerce.number().min(0, "Low stock threshold cannot be negative").optional(),
    shipping: z.coerce.number().min(0, "Shipping cost cannot be negative").optional(),
  })
  .refine((data) => data.sellingPrice <= data.regularPrice, {
    message: "Selling price cannot exceed the regular price.",
    path: ["sellingPrice"],
  })

export default function CreateProductForm() {
  const [state, formAction] = useActionState(createProduct, { success: false, message: "" })
  const [images, setImages] = useState([])
  const [keywords, setKeywords] = useState("")
  const [generating, setGenerating] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  // Auto-fill slug from the name until the seller edits the slug field directly —
  // then their edit wins and we stop overwriting it.
  const [slugEdited, setSlugEdited] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      shortDescription: "",
      description: "",
      tags: "",
      purchasePrice: "",
      regularPrice: "",
      sellingPrice: "",
      category: "",
      brand: "",
      stock: "",
      lowStockThreshold: "5",
      shipping: "",
    },
  })

  const stock = form.watch("stock")
  const lowStockThreshold = form.watch("lowStockThreshold")
  const stockNum = Number(stock)
  const isOutOfStock = stock !== "" && stockNum <= 0
  const isLowStock = !isOutOfStock && stock !== "" && stockNum <= Number(lowStockThreshold || 0)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => {
        console.error("Failed to load categories:", error)
        toast.error("Could not load categories. Please refresh the page.")
      })
    getBrands()
      .then(setBrands)
      .catch((error) => {
        console.error("Failed to load brands:", error)
        toast.error("Could not load brands. Please refresh the page.")
      })
  }, [])

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        form.reset()
        setImages([])
        setSlugEdited(false)
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ultraboost 22 Shoes"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      if (!slugEdited) {
                        form.setValue("slug", slugify(e.target.value), { shouldValidate: true })
                      }
                    }}
                  />
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
                  <Input
                    placeholder="ultraboost-22-shoes"
                    {...field}
                    onChange={(e) => {
                      setSlugEdited(true)
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  SKU / Product Code <span className="text-muted-foreground font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="ULB-22-BLK" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tags <span className="text-muted-foreground font-normal">(comma separated, optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="running, lightweight, summer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Purchase Price ($) <span className="text-muted-foreground font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="60.00" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">Your cost — never shown to customers.</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regularPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regular Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="99.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="79.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lowStockThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Low Stock Alert</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Stock status:</span>
          {isOutOfStock ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Low Stock</span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">In Stock</span>
          )}
          <span className="text-xs text-muted-foreground">(calculated automatically from stock quantity)</span>
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
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Short Description <span className="text-muted-foreground font-normal">(optional, shown on product cards)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="One-line summary for listing cards" maxLength={200} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <FormLabel>Long Description</FormLabel>
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
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
