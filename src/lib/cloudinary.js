import { v2 as cloudinary } from "cloudinary"

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET environment variables. Please set them in your .env.local file."
  )
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

/**
 * Recovers a Cloudinary `public_id` from a `secure_url` we stored on `Product.images`,
 * since that field only stores the URL — not the id — to avoid a schema migration.
 * URL shape: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
 * (the folder, e.g. "manage-mart/products", is part of the public_id itself).
 */
export function extractCloudinaryPublicId(url) {
  if (typeof url !== "string") return null
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+(?:$|\?)/)
  return match ? match[1] : null
}
