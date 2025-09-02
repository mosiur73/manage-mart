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
              Find answers to the most common questions about ProductFlow.
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
              q: "What is ProductFlow?",
              a: "ProductFlow is a comprehensive product management platform designed to help teams plan, track, and launch products more efficiently.",
            },
            {
              q: "Is there a free trial available?",
              a: "Yes, we offer a 14-day free trial for all new users. No credit card required to get started.",
            },
            {
              q: "Can I integrate ProductFlow with other tools?",
              a: "ProductFlow offers integrations with popular tools like Jira, Slack, and GitHub. More integrations are coming soon!",
            },
            {
              q: "What kind of support do you offer?",
              a: "We offer email support for all plans, with priority and dedicated support options available for Pro and Enterprise plans.",
            },
            {
              q: "Is my data secure with ProductFlow?",
              a: "Yes, we take data security very seriously. ProductFlow uses industry-standard encryption and security protocols to protect your data.",
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
