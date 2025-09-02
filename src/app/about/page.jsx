"use client";
import { motion } from "framer-motion";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[70vh]"
       style={{ 
        backgroundImage: `url('/images/about.jpeg')`

       }}>
        <div className="absolute inset-0 bg-black/40  flex items-center justify-center">
                            
          <div className="text-center text-white px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              About Our Company
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1 }}
              className="text-lg md:text-xl max-w-2xl mx-auto"
            >
              We blend creativity and technology to craft meaningful digital experiences.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-4">🚀 Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to empower businesses with user-centric design, 
            scalable technology, and innovation-driven strategies that leave a mark.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-4">🌍 Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a world where businesses thrive with tech solutions 
            that combine simplicity, efficiency, and creativity.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r bg-[#086ca2] py-16 text-white">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "5+", label: "Years of Experience" },
            { number: "150+", label: "Projects Delivered" },
            { number: "100+", label: "Happy Clients" },
            { number: "20+", label: "Team Experts" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <h3 className="text-5xl font-bold mb-2">{stat.number}</h3>
              <p className="text-gray-200">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey / Timeline Section */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
        <div className="relative border-l-4 border-indigo-600 pl-8 space-y-10">
          {[
            { year: "2019", text: "Company Founded with a vision to innovate." },
            { year: "2020", text: "Delivered our first 20+ successful projects." },
            { year: "2022", text: "Expanded globally with international clients." },
            { year: "2024", text: "Launched AI-powered solutions for enterprises." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#F9F6EE] w-1/3 text-center mx-auto p-6 rounded-xl shadow hover:shadow-lg"
            >
              <span className="text-indigo-600  font-bold">{item.year}</span>
              <p className="text-gray-600  mt-2">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="container mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-6">
          {["John Doe", "Jane Smith", "Michael Lee", "Sophia Brown"].map(
            (name, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-[#E7E7E7] rounded-2xl shadow-lg p-6 text-center"
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${index + 1}`}
                  alt={name}
                  className="w-28 h-28 rounded-full  mx-auto mb-4 border-4 border-indigo-600"
                />
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-gray-500 mb-4">Frontend Developer</p>
                <div className="flex justify-center gap-4 text-indigo-600">
                  <FaFacebook className="cursor-pointer hover:text-indigo-800" />
                  <FaLinkedin className="cursor-pointer hover:text-indigo-800" />
                  <FaTwitter className="cursor-pointer hover:text-indigo-800" />
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 flex items-center justify-center bg-gradient-to-r bg-[#a73c5a]">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Let’s Build the Future Together</h2>
          <p className="mb-6">We’re ready to transform your ideas into digital reality.</p>
          <a
            href="/contact"
            className="px-8 py-3 rounded-full font-semibold text-indigo-600 bg-white/90 shadow-md hover:bg-white transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
