"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

const SELLER_ROLES = ["seller", "admin"]

/**
 * Generates a short e-commerce product description with Claude, from whatever
 * the seller has already typed in (name/category are required inputs; keywords
 * is free-form extra detail — bullet points, materials, whatever they have).
 */
export async function generateProductDescription({ name, category, keywords }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return { success: false, message: "Only sellers can use AI generation." }
  }

  if (!name || !name.trim()) {
    return { success: false, message: "Enter a product name first." }
  }

  const rl = checkRateLimit(`ai-description:${session.user.id}`, { limit: 5, windowMs: 60_000 })
  if (!rl.allowed) {
    return {
      success: false,
      message: `Too many AI requests. Try again in ${Math.ceil(rl.retryAfterMs / 1000)}s.`,
    }
  }

  try {
    // Dynamically imported so this action's ANTHROPIC_API_KEY requirement doesn't
    // leak into other actions bundled into the same client chunk (createProduct,
    // getCategories, getBrands, etc. — Next.js groups all server actions a page's
    // components reference into one flight-action bundle, so a static import here
    // would make a missing key break category/brand loading too, not just AI gen).
    const { anthropic } = await import("@/lib/anthropic")
    const response = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 500,
      output_config: { effort: "medium" },
      system:
        "You are an e-commerce copywriter. Write a concise, appealing product description " +
        "for an online store listing: 2-4 sentences, plain prose, no markdown, no headers, " +
        "no bullet points, no quotation marks around the output. Return only the description " +
        "text and nothing else.",
      messages: [
        {
          role: "user",
          content: [
            `Product name: ${name.trim()}`,
            `Category: ${category?.trim() || "General"}`,
            keywords?.trim() ? `Key details to include: ${keywords.trim()}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    if (!textBlock?.text) {
      return { success: false, message: "AI didn't return a description. Please try again." }
    }

    return { success: true, description: textBlock.text.trim() }
  } catch (error) {
    console.error("AI description generation failed:", error)
    return { success: false, message: "AI generation failed. Please try again or write it manually." }
  }
}
