"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function PricingSection() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25, // delay between children animations
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section
      id="pricing"
      className="relative w-full py-20 px-6 md:px-12 bg-gradient-to-b from-white via-gray-50 to-gray-100"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary shadow-sm">
            Pricing
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="max-w-2xl text-lg text-gray-600 leading-relaxed">
            Choose the plan that best fits your team's needs. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl gap-8 py-16 lg:grid-cols-3"
        >
          {/* Starter Plan */}
          <motion.div variants={item} whileHover={{ scale: 1.03 }}>
            <Card className="relative flex flex-col justify-between p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                <CardDescription className="text-gray-600">
                  Perfect for small teams getting started with product management.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-extrabold text-gray-900">
                  $19
                  <span className="text-base font-medium text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Up to 5 Users</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Basic Dashboards</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Task Management</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Email Support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-xl" asChild>
                  <Link href="#cta" prefetch={false}>Choose Starter</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Pro Plan (Featured) */}
          <motion.div variants={item} whileHover={{ scale: 1.05 }}>
            <Card className="relative flex flex-col justify-between p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-primary bg-gradient-to-b from-primary/5 to-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <CardDescription className="text-gray-600">
                  Ideal for growing teams needing advanced features and collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-extrabold text-gray-900">
                  $49
                  <span className="text-base font-medium text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Up to 20 Users</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Advanced Dashboards</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Analytics & Reporting</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Priority Support</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Seamless Collaboration</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-xl bg-primary hover:bg-primary/90" asChild>
                  <Link href="#cta" prefetch={false}>Choose Pro</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div variants={item} whileHover={{ scale: 1.03 }}>
            <Card className="relative flex flex-col justify-between p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <CardDescription className="text-gray-600">
                  Custom solutions for large organizations with specific needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-extrabold text-gray-900">Custom</div>
                <ul className="space-y-3 text-gray-600">
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Unlimited Users</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Dedicated Account Manager</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> On-premise Deployment</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> Custom Integrations</li>
                  <li><Check className="mr-2 inline-block h-5 w-5 text-primary" /> 24/7 Premium Support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-xl" variant="outline" asChild>
                  <Link href="#cta" prefetch={false}>Contact Sales</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
