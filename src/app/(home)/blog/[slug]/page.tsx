"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Clock, User, Tag, ArrowLeft, Share2, Heart } from "lucide-react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    role: string;
  };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  relatedRestaurants: any[];
  relatedFoods: any[];
  status: string;
  videoUrl?: string;
  blog_video?: string;
}

export default function BlogDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string>("");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    fetch("/blogs.json")
      .then((res) => res.json())
      .then((data) => {
        const foundBlog = data.find((b: Blog) => b.slug === slug);
        setBlog(foundBlog || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <section className="min-h-screen py-8">
        <div className="max-w-360 mx-auto w-11/12 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full"
          />
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="min-h-screen py-8">
        <div className="max-w-360 mx-auto w-11/12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-4">
              Blog Not Found
            </h1>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-Sofia font-semibold hover:shadow-lg transition-shadow"
            >
              <ArrowLeft size={18} />
              Back to Blogs
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto w-11/12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Category Badge */}
          <div className="mb-4">
            <span className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-Sofia font-semibold">
              {blog.category.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold font-Sofia text-gray-800 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-6">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{blog.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{blog.readingTime}</span>
            </div>
            <div className="text-gray-500">
              📅{" "}
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 italic border-l-4 border-rose-500 pl-4">
            {blog.excerpt}
          </p>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-3xl overflow-hidden shadow-lg h-96"
        >
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Video Section - Sample with iframe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg"
        >
          <h2 className="text-2xl font-Sofia font-bold text-gray-800 mb-4 flex items-center gap-2">
            📹 Video Recipe & Demonstration
          </h2>
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
            {/* Dynamic Video from blog data */}
            <iframe
              width="100%"
              height="100%"
              src={blog.blog_video || blog.videoUrl || "https://www.youtube.com/embed/9bZkp7q19f0"}
              title={blog.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Watch this video to see step-by-step instructions and expert tips for {blog.title.toLowerCase()}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-lg"
        >
          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              {blog.content}
            </p>

            {/* Additional Content Sections */}
            <div className="space-y-6 mt-8">
              <div>
                <h3 className="text-2xl font-Sofia font-bold text-gray-800 mb-3">
                  Why This Recipe Matters
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {blog.excerpt} This traditional recipe has been passed down
                  through generations and remains a favorite on FoodVely. Our
                  partner restaurants serve authentic versions you can order
                  online.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-Sofia font-bold text-gray-800 mb-3">
                  Tips from Our Chefs
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Use fresh, quality ingredients for best results</li>
                  <li>Follow the timing carefully for perfect cooking</li>
                  <li>Don't hesitate to add your personal touch</li>
                  <li>Order from verified restaurants for taste comparison</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-Sofia font-bold text-gray-800 mb-3">
                  Where to Order Online
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you don't have time to cook, our partner restaurants serve
                  excellent versions of this dish. Check out related restaurants
                  to place your order on FoodVely.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h3 className="text-lg font-Sofia font-bold text-gray-800 mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-rose-200 transition-colors cursor-pointer"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Share & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12 bg-linear-to-r from-rose-100 to-orange-100 rounded-3xl p-6 border border-rose-200 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-800 font-semibold">Found this useful?</p>
            <p className="text-sm text-gray-600">Share with your friends!</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors shadow-md">
            <Share2 size={18} />
            Share
          </button>
        </motion.div>

        {/* Related Restaurants */}
        {blog.relatedRestaurants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-Sofia font-bold text-gray-800 mb-6">
              Restaurants Serving This Dish
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blog.relatedRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.slug}`}
                  className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="font-Sofia font-bold text-gray-800 hover:text-rose-600 transition-colors">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Click to view menu →
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Blogs CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center pt-8 border-t border-gray-200"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-xl font-Sofia font-semibold hover:shadow-lg transition-shadow"
          >
            <ArrowLeft size={18} />
            Back to All Blogs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
