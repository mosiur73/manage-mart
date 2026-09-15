"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function FAQSection() {
  return (
    <section id="faq" className="w-full bg-background">
      <div className="container px-4 md:px-6">
        {/* Title with fade + slide animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to the most common questions about Manage Mart.
            </p>
          </div>
        </motion.div>

        {/* Accordion with staggered animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.15 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl py-12"
        >
          {[
            {
              q: "What is Manage Mart?",
              a: "Manage Mart is a multi-vendor marketplace — anyone can shop, and approved sellers can list and manage their own products from a dedicated dashboard.",
            },
            {
              q: "How do I become a seller?",
              a: "Check \"I want to sell products\" when you sign up. You'll get access to a full seller dashboard to list products, manage orders, and view analytics.",
            },
            {
              q: "Is checkout secure?",
              a: "Yes — all payments are processed through Stripe. Manage Mart never sees or stores your card details.",
            },
            {
              q: "Can I trust the product reviews?",
              a: "Yes — only customers who actually purchased a product can leave a review, so every rating is verified.",
            },
            {
              q: "What if I need to cancel or return an order?",
              a: "You can request a cancellation from your order history any time before it ships. Sellers process refunds directly through Stripe.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${idx + 1}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
