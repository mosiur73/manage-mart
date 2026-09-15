import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable. Please set it in your .env.local file.")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Resend's shared sandbox address — works without verifying your own domain, but
// (per Resend's own restriction) only actually delivers to the email the
// RESEND_API_KEY's account was signed up with. Swap in a verified domain address
// via EMAIL_FROM once you have one.
export const EMAIL_FROM = process.env.EMAIL_FROM || "Manage Mart <onboarding@resend.dev>"
