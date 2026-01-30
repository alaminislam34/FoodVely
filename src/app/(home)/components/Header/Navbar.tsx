"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import NavbarSkeleton from "../Skeletons/NavbarSkeleton";
import { Menu, Search, X, LogOut, ChefHat, ShoppingCart } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Blog", href: "/blog" },
  { name: "Restaurant", href: "/restaurant" },
  { name: "Contact", href: "/contact" },
];

function Navbar() {
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const pathName: string = usePathname();
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleSticky = () => {
      if (window.scrollY > 100) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleSticky);
    return () => window.removeEventListener("scroll", handleSticky);
  }, []);

  return (
    <header
      className={`w-full sticky z-40 transition-all duration-300 ${sticky ? " top-0 bg-[#fffdf7] backdrop-blur-xl shadow-xl" : ""}`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NavbarSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="nav-content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <nav className="max-w-360 mx-auto w-11/12 flex items-center justify-between py-4 lg:py-6">
              <motion.div
                className="shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                    <ChefHat size={24} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-Sofia font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent hidden sm:block">
                    Food<span className="text-rose-500">Vally</span>
                  </h3>
                  <h3 className="text-2xl font-Sofia font-bold text-gray-900 sm:hidden">
                    FV
                  </h3>
                </Link>
              </motion.div>

              <div className="hidden lg:block">
                <ul className="flex flex-row gap-4 items-center">
                  {links.map(({ name, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`px-4 py-2.5 rounded-lg font-Sofia font-semibold transition-all duration-300 relative group ${
                          pathName === href
                            ? "bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-md"
                            : "text-gray-700 hover:text-rose-600"
                        }`}
                      >
                        {name}
                        {pathName !== href && (
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-rose-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center ml-6"
                >
                  <Link
                    href={"/account/cart"}
                    className="p-2 inline-block relative text-rose-600"
                  >
                    <ShoppingCart />{" "}
                    <span className="absolute text-xs -top-1 right-0 bg-rose-600 text-white py-0.5 px-1 rounded-full">
                      0
                    </span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={"/account/signin"}
                    className="py-2.5 px-6 rounded-xl font-Sofia font-semibold text-rose-600 border-2 border-rose-600 hover:bg-rose-50 hover:border-rose-700 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={"/account/signup"}
                    className="py-2.5 px-6 rounded-xl font-Sofia font-semibold bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
              <div className="lg:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2.5 px-3.5 rounded-xl border-2 border-rose-500 text-white bg-linear-to-r from-rose-500 to-orange-500 shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => setOpenModal(!openModal)}
                >
                  <Menu size={24} />
                </motion.button>
              </div>
              <AnimatePresence>
                {openModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpenModal(false)}
                    className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                  />
                )}
              </AnimatePresence>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: openModal ? "0%" : "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed h-screen inset-y-0 left-0 max-w-xs bg-linear-to-b from-white/95 via-white/90 to-white/95 backdrop-blur-2xl border-r border-white/40 shadow-2xl z-50 overflow-y-auto"
              >
                <div className="flex flex-col justify-between h-screen p-6 relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenModal(false)}
                    className="p-2 rounded-xl absolute top-4 right-4 bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <X size={20} />
                  </motion.button>
                  <div className="flex flex-col gap-8">
                    {/* Mobile Logo */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link
                        href="/"
                        onClick={() => setOpenModal(false)}
                        className="flex items-center gap-3"
                      >
                        <div className="p-2 rounded-lg bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-lg">
                          <ChefHat size={20} />
                        </div>
                        <h3 className="text-2xl font-Sofia font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          Food<span className="text-rose-500">Vally</span>
                        </h3>
                      </Link>
                    </motion.div>
                    {/* Navigation Links */}
                    <div className="border-b border-gray-200 pb-6 mt-6">
                      <ul className="flex flex-col gap-2">
                        {links.map(({ name, href }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              onClick={() => setOpenModal(false)}
                              className={`px-4 py-3 rounded-lg w-full block font-Sofia font-semibold transition-all duration-300 ${
                                pathName === href
                                  ? "bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-md"
                                  : "text-gray-700 hover:bg-orange-100/50 hover:text-rose-600"
                              }`}
                            >
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Search and Auth */}
                    <div className="flex flex-col gap-4">
                      {/* Search Bar */}
                      <div className="flex flex-wrap gap-2 justify-end">
                        <div className="w-full">
                          <input
                            type="text"
                            placeholder="Search menu..."
                            className="flex-1 text-sm border-2 border-gray-200 bg-white/50 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all w-full"
                          />
                        </div>
                        <div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="py-2.5 px-3 bg-linear-to-r from-rose-500 to-orange-500 text-white hover:shadow-lg transition-shadow rounded-lg"
                          >
                            <Search size={20} />
                          </motion.button>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="hidden flex-col gap-3 w-full">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={"/account/signin"}
                            onClick={() => setOpenModal(false)}
                            className="py-3 px-6 rounded-lg flex items-center justify-center font-Sofia font-semibold text-rose-600 border-2 border-rose-600 hover:bg-rose-50 transition-all w-full"
                          >
                            Sign In
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={"/account/signup"}
                            onClick={() => setOpenModal(false)}
                            className="py-3 px-6 rounded-lg flex items-center justify-center font-Sofia font-semibold bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all w-full"
                          >
                            Sign Up
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  {/* Footer Section */}
                  <div className="flex flex-col gap-3 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="py-3 px-4 rounded-lg font-Sofia font-semibold bg-linear-to-r from-rose-50 to-orange-50 border-2 border-rose-200 text-rose-600 hover:border-rose-400 hover:bg-linear-to-r hover:from-rose-100 hover:to-orange-100 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Log out
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
