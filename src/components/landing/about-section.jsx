"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import img from "../../../public/images/hero2.jpg";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 via-white to-gray-100"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary shadow-sm"
              >
                About Us
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
              >
                Empowering Product Teams <br />{" "}
                <span className="text-primary">Worldwide</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="max-w-xl text-lg text-gray-600 leading-relaxed"
              >
                At{" "}
                <span className="font-semibold text-primary">ProductFlow</span>
                , we believe that great products are built by empowered teams.
                Our platform removes friction from product management, so you
                can focus on innovation and delivering value. We’re committed to
                building intuitive, powerful, and scalable solutions for teams
                of all sizes.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-2xl bg-primary px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transition"
              >
                Learn More
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-2xl border border-primary px-6 py-3 text-primary font-medium hover:bg-primary/5 transition"
              >
                Contact Us
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={img}
                width={600}
                height={400}
                alt="Team Collaboration"
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
            {/* Decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-2xl"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
