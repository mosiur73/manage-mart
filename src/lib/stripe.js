import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable. Please set it in your .env.local file.")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
