// Client-safe wrapper around /api/upload/delete — never import the `cloudinary`
// SDK (or CLOUDINARY_API_SECRET) into client components.
export async function deleteCloudinaryImage(url) {
  try {
    await fetch("/api/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
  } catch (error) {
    // Best-effort cleanup — a failed delete here just leaves an orphaned Cloudinary
    // asset, it must never block the product form flow.
    console.error("Failed to clean up removed image:", error)
  }
}
