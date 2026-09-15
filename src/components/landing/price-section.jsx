"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Rocket, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const sellerBenefits = [
  {
    icon: Rocket,
    title: "Easy Onboarding",
    description: "Sign up, get approved, and list your first product in minutes — no complicated setup.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Listings",
    description: "Generate a compelling product description instantly with built-in AI — no copywriting needed.",
  },
  {
    icon: BarChart3,
    title: "Real Insights",
    description: "Track revenue, top products, and customer trends on a real analytics dashboard — not vanity metrics.",
  },
];

export default function SellWithUsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section
      id="sell"
      className="relative w-full py-20 px-6 md:px-12 bg-gradient-to-b from-white via-gray-50 to-gray-100"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary shadow-sm">
            Sell With Us
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900">
            Turn Your Products Into a Business
          </h2>
          <p className="max-w-2xl text-lg text-gray-600 leading-relaxed">
            No subscription fees, no complicated setup — just list your first product and start
            selling.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl gap-8 py-16 lg:grid-cols-3"
        >
          {sellerBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={benefit.title} variants={item} whileHover={{ scale: 1.03 }}>
                <Card className="flex flex-col p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white border border-gray-200 h-full">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-2xl font-bold">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex justify-center">
          <Button size="lg" className="rounded-xl" asChild>
            <Link href="/auth/signup">Become a Seller</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
