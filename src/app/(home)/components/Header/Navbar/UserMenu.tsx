"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Package2,
  Wallet,
  Folder,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserMenu({
  user,
  logout,
  userMenuOpen,
  setUserMenuOpen,
}: any) {
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement | null>(null);

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
  }, [userMenuOpen, setUserMenuOpen]);

  const isProvider = user?.role === "PROVIDER";

  return (
    <div className="relative" ref={userMenuRef}>
      {/* Trigger Button */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setUserMenuOpen((prev: boolean) => !prev)}
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
            {/* User Info */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600">
                {isProvider
                  ? "PROVIDER"
                  : user.role === "ADMIN"
                    ? "ADMIN"
                    : "USER"}
              </span>
            </div>

            {/* Provider CTA */}
            {isProvider && (
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  router.push("/dashboard/provider");
                }}
                className="mt-4 w-full rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Go to Dashboard
              </button>
            )}
            {user?.role === "ADMIN" && (
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  router.push("/dashboard/admin");
                }}
                className="mt-4 w-full rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Go to Admin Panel
              </button>
            )}

            {/* Menu Items */}
            <div className="mt-4 space-y-1">
              {user?.role === "ADMIN" ? (
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/dashboard/admin/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-rose-50"
                >
                  <User size={16} />
                  Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/account/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-rose-50"
                >
                  <User size={16} />
                  Profile
                </button>
              )}

              {/* Provider Menu */}
              {isProvider ? (
                <>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/dashboard/provider/orders");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                  >
                    <ShoppingBag size={16} />
                    Orders
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/dashboard/provider/products");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                  >
                    <Package2 size={16} />
                    My Products
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/dashboard/provider/overview");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                  >
                    <Wallet size={16} />
                    Earnings
                  </button>
                </>
              ) : user?.role === "ADMIN" ? (
                <>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/dashboard/admin/users");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                  >
                    <User size={16} />
                    Manage Users
                  </button>
                  <button
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/dashboard/admin/products");
                    }}
                  >
                    <Package2 size={16} />
                    Manage Products
                  </button>
                  <button
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/dashboard/admin/categories");
                    }}
                  >
                    <Folder size={16} />
                    Manage Categories
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push("/account/orders");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                  >
                    <ShoppingBag size={16} />
                    My Orders
                  </button>
                </>
              )}
              {user?.role === "ADMIN" ? (
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/dashboard/admin/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                >
                  <Settings size={16} />
                  Admin Settings
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                >
                  <Settings size={16} />
                  Settings
                </button>
              )}
            </div>

            {/* Bottom */}
            <div className="my-3 h-px bg-gray-100" />

            <div className="space-y-1">
              {user?.role !== "ADMIN" && (
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/contact");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-gray-700 hover:bg-rose-50"
                >
                  <HelpCircle size={16} />
                  Help center
                </button>
              )}

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                  router.push("/");
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
