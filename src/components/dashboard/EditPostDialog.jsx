"use client"

import { useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { updatePost } from "@/app/dashboard/action"
// import { updatePost } from "@/app/dashboard/actions"

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

/**
 * @typedef {Object} Post
 * @property {string} _id
 * @property {string} title
 * @property {string} slug
 * @property {string} content
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @param {{ post: Post, isOpen: boolean, onClose: () => void }} props
 */
export default function EditPostDialog({ post, isOpen, onClose }) {
  const [state, formAction] = useActionState(updatePost.bind(null, post._id), { success: false, message: "" })

  const form = useForm({
    resolver: zodResolver(formSchema),
    // Ensure default values are always strings, even if post properties are unexpectedly null/undefined
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
    },
  })

  // Reset form with new post data when post prop changes
  useEffect(() => {
    if (post) {
      form.reset({
        title: post?.title || "", // Also update here for reset
        slug: post?.slug || "", // Also update here for reset
        content: post?.content || "", // Also update here for reset
      })
    }
  }, [post, form])

  // Handle server action response
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        onClose() // Close dialog on successful update
      } else {
        toast.error(state.message)
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
  }, [state, toast, form, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>Make changes to your post here. Click save when you're done.</DialogDescription>
        </DialogHeader>
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
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
