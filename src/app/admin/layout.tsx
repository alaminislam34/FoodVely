"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Package,
  UtensilsCrossed,
  MessageCircle,
  Images,
  Zap,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathName = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      submenu: null,
    },
    {
      label: "Users & Access",
      icon: Users,
      submenu: [
        { label: "All Users", href: "/admin/users" },
        { label: "User Roles", href: "/admin/user-roles" },
        { label: "Banned Users", href: "/admin/banned-users" },
        { label: "Activity Log", href: "/admin/activity-log" },
      ],
    },
    {
      label: "Products",
      icon: Package,
      submenu: [
        { label: "All Products", href: "/admin/products" },
        { label: "Categories", href: "/admin/categories" },
        { label: "Out of Stock", href: "/admin/stock" },
      ],
    },
    {
      label: "Restaurants",
      icon: UtensilsCrossed,
      submenu: [
        { label: "All Restaurants", href: "/admin/restaurants" },
        { label: "Best Restaurants", href: "/admin/best-sellers" },
      ],
    },
    {
      label: "Reviews & Feedback",
      icon: MessageCircle,
      submenu: [
        { label: "Customer Reviews", href: "/admin/reviews" },
        { label: "Contact Messages", href: "/admin/contacts" },
        { label: "Reported Content", href: "/admin/reported" },
      ],
    },
    {
      label: "Content Management",
      icon: Images,
      submenu: [
        { label: "Banners", href: "/admin/banners" },
        { label: "Image Slider", href: "/admin/slider" },
        { label: "Blog Management", href: "/admin/blog" },
        { label: "FAQs", href: "/admin/faqs" },
      ],
    },
    {
      label: "Promotions",
      icon: Zap,
      submenu: [
        { label: "Coupons", href: "/admin/coupons" },
        { label: "Events", href: "/admin/events" },
        { label: "Discounts", href: "/admin/discounts" },
        { label: "Active Campaigns", href: "/admin/campaigns" },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      submenu: [
        { label: "Profile", href: "/admin/profile" },
        { label: "Website Settings", href: "/admin/settings" },
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Security", href: "/admin/security" },
      ],
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed md:sticky left-0 top-0 w-72 h-screen bg-white border-r border-gray-200 overflow-y-auto z-40 md:z-10 md:translate-x-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-r from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-Sofia font-bold">F</span>
            </div>
            <div>
              <h2 className=" text-xl md:text-2xl font-Sofia font-bold text-gray-800">
                FoodVally
              </h2>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="font-semibold truncate overflow-hidden text-sm">
                        {item.label}
                      </span>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedMenu === item.label ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  {/* Submenu */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedMenu === item.label ? "auto" : 0,
                      opacity: expandedMenu === item.label ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 space-y-1 py-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={`block px-4 py-2 text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ${pathName === subitem.href ? "bg-rose-50 text-rose-600 font-bold" : ""}`}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all ${pathName === item.href ? "bg-rose-50 text-rose-600 font-bold" : ""}`}
                >
                  <item.icon size={18} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <h1 className="font-Sofia font-bold text-gray-800 text-xl hidden sm:block">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-600">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-r from-rose-500 to-orange-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
