// One-off seed script: creates an admin account plus a handful of customer
// accounts so the local DB has real, loginable users to test with.
//
// Usage:
//   node scripts/seed-users.mjs
//
// Requires MONGODB_URI in .env.local, same as the Next.js app.
// Safe to re-run: existing emails are left untouched.

import path from "node:path"
import { fileURLToPath } from "node:url"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../src/models/User.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env.local"))
} catch {
  // .env.local not found — fall back to whatever is already in process.env
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Add it to .env.local before seeding.")
  process.exit(1)
}

const SEED_PASSWORD = "Passw0rd!123"

const USERS = [
  { name: "Sadia Rahman", email: "admin@managemart.local", role: "admin" },
  { name: "Tanvir Ahmed", email: "tanvir.customer@managemart.local", role: "customer" },
  { name: "Nusrat Jahan", email: "nusrat.customer@managemart.local", role: "customer" },
  { name: "Rifat Hossain", email: "rifat.customer@managemart.local", role: "customer" },
  { name: "Mehjabin Islam", email: "mehjabin.customer@managemart.local", role: "customer" },
]

async function main() {
  await mongoose.connect(MONGODB_URI)
  console.log("Connected to MongoDB")

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10)

  let created = 0
  let skipped = 0

  for (const u of USERS) {
    const existing = await User.findOne({ email: u.email })
    if (existing) {
      skipped++
      continue
    }

    await User.create({
      name: u.name,
      email: u.email,
      password: hashedPassword,
      role: u.role,
    })
    created++
  }

  console.log(`Seed complete: ${created} created, ${skipped} already existed (${USERS.length} total).`)
  console.log("")
  console.log("Login credentials (all users share the same password):")
  console.log(`  password: ${SEED_PASSWORD}`)
  for (const u of USERS) {
    console.log(`  [${u.role}] ${u.email}`)
  }

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error("Seed failed:", error)
  process.exit(1)
})
