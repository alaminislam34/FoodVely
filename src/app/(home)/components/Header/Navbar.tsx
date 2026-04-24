"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  Search,
  X,
  LogOut,
  ChefHat,
  ShoppingCart,
  Heart,
  User,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/hooks/useAuth";

const links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Blog", href: "/blog" },
  { name: "Restaurant", href: "/restaurant" },
  { name: "Contact", href: "/contact" },
];

function Navbar() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const pathName: string = usePathname();
  const [sticky, setSticky] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  return (
    <header
      className={`w-full sticky border border-black/10 z-40 transition-all duration-300 ${sticky ? " top-0 bg-[#fffdf7] backdrop-blur-xl shadow-md" : ""}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="nav-content"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <nav className="max-w-360 mx-auto w-11/12 flex items-center justify-between py-4">
            <motion.div
              className="shrink-0"
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2.5 rounded-xl bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <ChefHat size={24} />
                </div>
                <h3 className="text-xl lg:text-2xl font-Sofia font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Food<span className="text-rose-500">Vally</span>
                </h3>
              </Link>
            </motion.div>

            <div className="hidden lg:block">
              <ul className="flex flex-row gap-4 items-center">
                {links.map(({ name, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`px-4 py-1.5 rounded-lg font-Sofia font-semibold transition-all duration-300 relative group ${
                        pathName === href
                          ? "bg-linear-to-r from-rose-500 to-orange-600 text-white shadow-md"
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
                className="flex items-center justify-center"
              >
                <Link
                  href="/account/wishlist"
                  className="p-2 inline-block relative text-rose-600"
                >
                  <Heart />
                  <span className="absolute text-xs -top-1 right-0 bg-rose-600 text-white py-0.5 px-1 rounded-full">
                    0
                  </span>
                </Link>
              </motion.div>
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
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm transition hover:border-rose-200"
                    >
                      <span className="flex py-0.5 px-2 items-center justify-center rounded-full bg-linear-to-br from-rose-500 to-orange-500 text-sm font-semibold text-white">
                        {user?.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <User size={16} />
                        )}
                      </span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]"
                      >
                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600">
                            PRO
                          </span>
                        </div>

                        <div className="mt-4 space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              router.push(
                                `/account/profile/?${encodeURIComponent((user?.name ?? "me").toLowerCase())}`,
                              );
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50"
                          >
                            <User size={16} />
                            Profile
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50"
                          >
                            <Users size={16} />
                            Community
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50"
                          >
                            <span className="flex items-center gap-3">
                              <CreditCard size={16} />
                              Subscription
                            </span>
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                              PRO
                            </span>
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50"
                          >
                            <Settings size={16} />
                            Settings
                          </button>
                        </div>

                        <div className="my-3 h-px bg-gray-100" />

                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              router.push("/contact");
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50"
                          >
                            <HelpCircle size={16} />
                            Help center
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                              router.push("/");
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-50"
                          >
                            <LogOut size={16} />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={"/account/signin"}
                      className="py-1.5 px-6 rounded-xl font-Sofia font-semibold text-rose-600 border-2 border-rose-600 hover:bg-rose-50 hover:border-rose-700 transition-all duration-300"
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
                      className="py-1.5 px-6 rounded-xl font-Sofia font-semibold bg-linear-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
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
                    <Link
                      href="/account/wishlist"
                      onClick={() => setOpenModal(false)}
                      className="px-4 py-3 rounded-lg w-full block font-Sofia font-semibold text-gray-700 hover:bg-orange-100/50 hover:text-rose-600 transition-all duration-300"
                    >
                      Wishlist 0
                    </Link>
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
                          className="py-1.5 px-6 rounded-lg flex items-center justify-center font-Sofia font-semibold text-rose-600 border-2 border-rose-600 hover:bg-rose-50 transition-all w-full"
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
                          className="py-1.5 px-6 rounded-lg flex items-center justify-center font-Sofia font-semibold bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all w-full"
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
                {/* Footer Section */}
                <div className="flex flex-col gap-3 border-t border-gray-200">
                  {isAuthenticated ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        logout();
                        setOpenModal(false);
                        router.push("/");
                      }}
                      className="py-3 px-4 rounded-lg font-Sofia font-semibold bg-linear-to-r from-rose-50 to-orange-50 border-2 border-rose-200 text-rose-600 hover:border-rose-400 hover:bg-linear-to-r hover:from-rose-100 hover:to-orange-100 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Log out
                    </motion.button>
                  ) : (
                    <>
                      <Link
                        href="/account/signin"
                        onClick={() => setOpenModal(false)}
                        className="py-3 px-4 rounded-lg font-Sofia font-semibold text-rose-600 border-2 border-rose-300 text-center"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/account/signup"
                        onClick={() => setOpenModal(false)}
                        className="py-3 px-4 rounded-lg font-Sofia font-semibold bg-linear-to-r from-rose-500 to-orange-500 text-white text-center"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </nav>
        </motion.div>
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
