// One-off utility: promotes an existing user to the "admin" role.
// Admin is never self-assignable through /api/register, so this is the bootstrap path.
//
// Usage:
//   node scripts/make-admin.mjs someone@example.com

import path from "node:path"
import { fileURLToPath } from "node:url"
import mongoose from "mongoose"
import User from "../src/models/User.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env.local"))
} catch {
  // .env.local not found — fall back to whatever is already in process.env
}

const email = process.argv[2]?.trim().toLowerCase()
if (!email) {
  console.error("Usage: node scripts/make-admin.mjs <email>")
  process.exit(1)
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Add it to .env.local first.")
  process.exit(1)
}

async function main() {
  await mongoose.connect(MONGODB_URI)

  const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true })
  if (!user) {
    console.error(`No user found with email "${email}". They must sign up first.`)
    process.exit(1)
  }

  console.log(`${user.email} is now an admin.`)
  console.log("They must sign out and back in for the new role to take effect (roles are baked into the JWT at sign-in).")

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error("make-admin failed:", error)
  process.exit(1)
})
