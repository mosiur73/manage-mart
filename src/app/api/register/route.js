import bcrypt from "bcryptjs" // Import bcryptjs
import connectDB from "../../../lib/mongodb" // Import MongoDB connection
import User from "../../../models/User" // Import User model

export async function POST(request) {
  try {
    await connectDB() // Connect to MongoDB

    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Name, email, and password are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Re-validate server-side — client-side checks (SignUpForm) are trivially bypassable
    // by anyone calling this endpoint directly.
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Normalize so "User@x.com" and "user@x.com" resolve to the same account —
    // the schema's `lowercase: true` only applies on save, not on query filters below.
    const normalizedEmail = email.trim().toLowerCase()

    // Public registration can only self-select "customer" or "seller" — "admin" is
    // granted out-of-band (see scripts/make-admin.mjs), never through this endpoint.
    const allowedRoles = ["customer", "seller"]
    const safeRole = allowedRoles.includes(role) ? role : "customer"

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User with this email already exists." }), {
        status: 409, // Conflict
        headers: { "Content-Type": "application/json" },
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10) // 10 is the salt rounds

    // Create new user in MongoDB
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: safeRole,
    })

    return new Response(JSON.stringify({ success: true, user: { id: newUser._id.toString(), name: newUser.name, email: newUser.email } }), {
      status: 201, // Created
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Registration API error:", error)
    return new Response(JSON.stringify({ error: "Failed to register user. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
