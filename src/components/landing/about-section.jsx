"use client"

import Image from "next/image"
import img from "../../../public/images/images (1).jpeg"

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 via-white to-gray-100"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary shadow-sm">
                About Us
              </span>

              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Empowering Product Teams <br /> <span className="text-primary">Worldwide</span>
              </h2>

              <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
                At <span className="font-semibold text-primary">ProductFlow</span>, we believe that great products
                are built by empowered teams. Our platform removes friction from product management, so you can focus
                on innovation and delivering value. We’re committed to building intuitive, powerful, and scalable
                solutions for teams of all sizes.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="rounded-2xl bg-primary px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transition">
                Learn More
              </button>
              <button className="rounded-2xl border border-primary px-6 py-3 text-primary font-medium hover:bg-primary/5 transition">
                Contact Us
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500">
              <Image
                src={img}
                width={600}
                height={400}
                alt="Team Collaboration"
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
