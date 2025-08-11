import bcrypt from "bcryptjs" // Import bcryptjs
import connectDB from "../../../lib/mongodb" // Import MongoDB connection
import User from "../../../models/User" // Import User model

export async function POST(request) {
  try {
    await connectDB() // Connect to MongoDB

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Name, email, and password are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
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
      email,
      password: hashedPassword,
      role: "User", // Default role
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
