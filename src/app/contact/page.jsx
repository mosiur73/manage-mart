"use client";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[50vh]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold text-white text-center"
          >
            Contact Us
          </motion.h1>
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <MapPin className="w-8 h-8" />, title: "Our Office", desc: "Dhaka, Bangladesh" },
          { icon: <Phone className="w-8 h-8" />, title: "Call Us", desc: "+880 1234-567890" },
          { icon: <Mail className="w-8 h-8" />, title: "Email Us", desc: "info@company.com" },
          { icon: <Clock className="w-8 h-8" />, title: "Working Hours", desc: "Sat - Thu, 9am - 6pm" },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition"
          >
            <div className="flex justify-center mb-4 text-indigo-600">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="max-w-5xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-8">
        {/* Left Side - Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or ideas? Fill out the form and we’ll get back to you as soon as
            possible.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>Banani, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-indigo-600" />
              <span>+880 1234-567890</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-indigo-600" />
              <span>support@company.com</span>
            </li>
          </ul>
        </motion.div>

        {/* Right Side - Form */}
        <motion.form
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-lg rounded-2xl p-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              placeholder="Subject"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              rows="4"
              placeholder="Write your message..."
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </motion.form>
      </section>
    </div>
  );
}
