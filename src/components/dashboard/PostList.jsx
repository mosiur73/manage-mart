"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import EditPostDialog from "./EditPostDialog"
import Link from "next/link"
import { Trash2, Pencil, Eye } from "lucide-react"
import { deletePost } from "@/app/dashboard/action"

export default function PostList({ posts }) {
  const [isDeleting, setIsDeleting] = useState(null)
  const [editingPost, setEditingPost] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return
    setIsDeleting(id)
    const result = await deletePost(id)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
    setIsDeleting(null)
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600">No products yet</p>
        <p className="text-xs text-gray-400 mt-1">Create your first product using the form</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Title</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Slug</th>
              <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden sm:table-cell">Created</th>
              <th className="text-right text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-3.5 font-medium text-gray-800 max-w-[180px] truncate">
                  {post.title}
                </td>
                <td className="px-3 py-3.5 text-gray-500 font-mono text-xs max-w-[120px] truncate">
                  {post.slug}
                </td>
                <td className="px-3 py-3.5 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Link href={`/post/${post.slug}`} prefetch={false}>
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                      onClick={() => setEditingPost(post)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(post._id)}
                      disabled={isDeleting === post._id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingPost && (
        <EditPostDialog
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </>
  )
}