import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs" 

import connectDB from "./mongodb" 
import User from "../models/User" 

// Check for required environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID environment variable. Please set it in your .env.local file.")
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable. Please set it in your .env.local file.")
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable. Please set it in your .env.local file.")
}
if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable. Please set it in your .env.local file.")
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await connectDB() // Connect to MongoDB

        // Normalize — the schema's `lowercase: true` only applies on save, not on
        // query filters, so "User@x.com" wouldn't otherwise match a stored "user@x.com".
        const normalizedEmail = credentials.email.trim().toLowerCase()
        const user = await User.findOne({ email: normalizedEmail })

        if (!user) {
          return null // User not found
        }

        // Compare provided password with hashed password in DB
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null // Invalid password
        }

        // If user and password are valid
        return {
          id: user._id.toString(), // Convert ObjectId to string
          email: user.email,
          name: user.name,
          image: user.image || "",
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Client called useSession().update({ name, image }) after a profile edit —
      // merge the new values into the token so they show up without a full re-login.
      if (trigger === "update") {
        if (session?.name) token.name = session.name
        if (session?.image !== undefined) token.picture = session.image
      }

      // Google sign-in has no `adapter` configured, so NextAuth never persists a User
      // document for it — `user` here is just the raw Google profile (no `role`/`id`
      // that map to our DB). Find-or-create the matching User so Google-authenticated
      // sessions get a real role; without this every Google user would fail the
      // dashboard's role check in src/middleware.js.
      if (account?.provider === "google") {
        await connectDB()
        const normalizedEmail = token.email?.trim().toLowerCase()
        let dbUser = await User.findOne({ email: normalizedEmail })
        if (!dbUser) {
          const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10)
          dbUser = await User.create({
            name: token.name,
            email: normalizedEmail,
            password: randomPassword,
            role: "customer",
          })
        }
        token.role = dbUser.role
        token.id = dbUser._id.toString()
        if (dbUser.image) token.picture = dbUser.image
      } else if (user) {
        token.role = user.role
        token.id = user.id // Store user ID in token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id // Use id from token
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
