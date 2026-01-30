"use client";

import { useState, useEffect } from "react";
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
  User,
  Package2,
  ShoppingBag,
  UtensilsCrossedIcon,
  MessageCircleCode,
  ZapIcon,
  Wallet,
  BarChart3,
  Settings2,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 768;
      setIsDesktop(isLargeScreen);
      if (isLargeScreen) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/provider",
      submenu: null,
    },

    {
      label: "My Profile",
      icon: User,
      submenu: [
        { label: "Profile Info", href: "/provider/profile" },
        { label: "Business Details", href: "/provider/business" },
        { label: "Verification", href: "/provider/verification" },
      ],
    },

    {
      label: "My Products",
      icon: Package2,
      submenu: [
        { label: "All Products", href: "/provider/products" },
        { label: "Add Product", href: "/provider/products/add" },
        { label: "Categories", href: "/provider/categories" },
        { label: "Out of Stock", href: "/provider/out-of-stock" },
      ],
    },

    {
      label: "Orders",
      icon: ShoppingBag,
      submenu: [
        { label: "All Orders", href: "/provider/orders" },
        { label: "Pending Orders", href: "/provider/orders/pending" },
        { label: "Completed Orders", href: "/provider/orders/completed" },
        { label: "Cancelled Orders", href: "/provider/orders/cancelled" },
      ],
    },

    {
      label: "Restaurant Manage",
      icon: UtensilsCrossedIcon,
      submenu: [
        { label: "My Restaurant", href: "/provider/restaurant" },
        { label: "Opening Hours", href: "/provider/restaurant/hours" },
        { label: "Menu Management", href: "/provider/restaurant/menu" },
      ],
    },

    {
      label: "Reviews & Ratings",
      icon: MessageCircleCode,
      submenu: [
        { label: "Customer Reviews", href: "/provider/reviews" },
        { label: "Reply to Reviews", href: "/provider/reviews/reply" },
      ],
    },

    {
      label: "Promotions",
      icon: ZapIcon,
      submenu: [
        { label: "My Coupons", href: "/provider/coupons" },
        { label: "Discount Offers", href: "/provider/discounts" },
      ],
    },

    {
      label: "Earnings",
      icon: Wallet,
      submenu: [
        { label: "Overview", href: "/provider/earnings" },
        { label: "Withdraw Request", href: "/provider/withdraw" },
        { label: "Transaction History", href: "/provider/transactions" },
      ],
    },

    {
      label: "Reports",
      icon: BarChart3,
      submenu: [
        { label: "Sales Report", href: "/provider/reports/sales" },
        { label: "Order Report", href: "/provider/reports/orders" },
      ],
    },

    {
      label: "Settings",
      icon: Settings2,
      submenu: [
        { label: "Account Settings", href: "/provider/settings" },
        { label: "Security", href: "/provider/security" },
        { label: "Notification Settings", href: "/provider/notifications" },
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
        animate={{
          x: isDesktop ? 0 : sidebarOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed md:sticky left-0 top-0 w-72 h-screen bg-white border-r border-gray-200 overflow-y-auto z-40 md:z-10 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
          transition-none md:transition-all`}
        suppressHydrationWarning
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/provider" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-r from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-xl lg:text-2xl text-white font-bold font-Sofia">
                FV
              </span>
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold font-Sofia text-orange-600">
                FoodVally
              </h2>
              <p className="text-xs text-gray-600">Restaurant Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="font-semibold text-sm">
                        {item.label}
                      </span>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedMenu === item.label ? 180 : 0,
                      }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedMenu === item.label ? "auto" : 0,
                      opacity: expandedMenu === item.label ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 space-y-1 py-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={`block px-4 py-2 text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ${
                            pathName === subitem.href
                              ? "bg-rose-50 text-rose-600 font-bold"
                              : ""
                          }`}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-rose-50 rounded-lg transition-all ${
                    pathName === item.href
                      ? "bg-rose-50 text-rose-600 font-bold"
                      : ""
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
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

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        {" "}
        {/* min-w-0 avoids layout breaking */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <h1 className="font-bold text-gray-800 text-xl hidden sm:block">
              Restaurant Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">Restaurant User</p>
                <p className="text-xs text-gray-600">Super Restaurant</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-r from-rose-500 to-orange-500 rounded-full" />
            </div>
          </div>
        </div>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
