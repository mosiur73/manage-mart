"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner" // Updated import to sonner
// import { deletePost } from "@/app/dashboard/actions"
import EditPostDialog from "./EditPostDialog"
import Link from "next/link"
import { Trash2, Edit, Eye } from "lucide-react"
import { deletePost } from "@/app/dashboard/action"

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
 * @param {{ posts: Post[] }} props
 */
export default function PostList({ posts }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingPost, setEditingPost] = useState(null) // State to hold post being edited

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return
    }
    setIsDeleting(true)
    const result = await deletePost(id)
    if (result.success) {
      toast.success(result.message) // Using sonner's toast.success
    } else {
      toast.error(result.message) // Using sonner's toast.error
    }
    setIsDeleting(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No posts found. Create one above!
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.slug}</TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button asChild variant="outline" size="icon">
                    <Link href={`/post/${post.slug}`} prefetch={false}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setEditingPost(post)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(post._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editingPost && <EditPostDialog post={editingPost} isOpen={!!editingPost} onClose={() => setEditingPost(null)} />}
    </>
  )
}
