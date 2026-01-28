"use client";

import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
    alert("Message sent successfully!");
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "support@FoodVally.com",
      color: "bg-blue-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      color: "bg-green-500",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "123 Food Street, NY 10001",
      color: "bg-rose-500",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "9 AM - 10 PM Daily",
      color: "bg-purple-500",
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "#" },
    { icon: Twitter, name: "Twitter", url: "#" },
    { icon: Instagram, name: "Instagram", url: "#" },
    { icon: Linkedin, name: "LinkedIn", url: "#" },
  ];

  return (
    <section className="min-h-screen py-16 px-4">
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-360 mx-auto w-11/12"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-Sofia font-bold text-gray-900 mb-4"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 font-Poppins max-w-2xl mx-auto"
          >
            Have questions or feedback? We'd love to hear from you. Reach out to
            us anytime!
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg flex flex-row gap-6"
                >
                  <div
                    className={`${info.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-Sofia font-bold text-gray-900 mb-2">
                      {info.label}
                    </h3>
                    <p className="text-gray-600 font-Poppins">{info.value}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg"
            >
              <h3 className="font-Sofia font-bold text-gray-900 mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={social.url}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-linear-to-r from-rose-500 to-rose-600 flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                      title={social.name}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between">
              {/* Name & Email Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-Sofia font-semibold text-gray-800">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-Sofia font-semibold text-gray-800">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                </motion.div>
              </div>

              {/* Subject */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-Sofia font-semibold text-gray-800">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </motion.div>

              {/* Message */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-Sofia font-semibold text-gray-800">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows={10}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-Sofia font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Map or Additional Info */}
        <motion.div
          variants={itemVariants}
          className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-Sofia font-bold text-gray-900 mb-6">
            Find Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Address Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-Sofia font-bold text-gray-900 mb-2">
                  Main Office
                </h3>
                <p className="text-gray-600 font-Poppins">123 Food Street</p>
                <p className="text-gray-600 font-Poppins">New York, NY 10001</p>
                <p className="text-gray-600 font-Poppins">United States</p>
              </div>
              <div>
                <h3 className="font-Sofia font-bold text-gray-900 mb-2">
                  Business Hours
                </h3>
                <p className="text-gray-600 font-Poppins">
                  Monday - Friday: 9 AM - 6 PM
                </p>
                <p className="text-gray-600 font-Poppins">
                  Saturday: 10 AM - 5 PM
                </p>
                <p className="text-gray-600 font-Poppins">Sunday: Closed</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-linear-to-br from-rose-200/30 to-rose-200/10 rounded-2xl h-64 flex items-center justify-center border border-rose-300/30">
              <div className="text-center">
                <MapPin size={48} className="text-rose-500 mx-auto mb-2" />
                <p className="text-gray-600 font-Poppins">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
