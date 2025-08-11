"use client"

import { useActionState, useEffect } from "react" // Added useEffect
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner" // Updated import to sonner
import { createPost } from "@/app/dashboard/action"
// import { createPost } from "@/app/dashboard/actions"

// Zod schema for client-side validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(60, "Title cannot exceed 60 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
})

export default function CreatePostForm() {
  const [state, formAction] = useActionState(createPost, { success: false, message: "" })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
    },
  })

  // Handle server action response
  useEffect(() => {
    // Changed from useState to useEffect
    if (state.message) {
      if (state.success) {
        toast.success(state.message) // Using sonner's toast.success
        form.reset() // Clear form on success
      } else {
        toast.error(state.message) // Using sonner's toast.error
      }
    }
    // Apply server-side errors to form fields
    if (state.errors) {
      for (const field in state.errors) {
        form.setError(field, {
          type: "server",
          message: state.errors[field][0],
        })
      }
    }
  }, [state, form]) // Dependencies for useEffect

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Product Title" {...field} />
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
                <Input placeholder="product-title-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the product..." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </Form>
  )
}
