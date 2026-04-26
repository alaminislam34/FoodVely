"use client";

import { useState, useEffect, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const existingAdminRoutes = useMemo(
    () =>
      new Set([
        "/admin",
        "/admin/users",
        "/admin/user-roles",
        "/admin/banned-users",
        "/admin/activity-log",
        "/admin/products",
        "/admin/categories",
        "/admin/stock",
        "/admin/restaurants",
        "/admin/best-sellers",
        "/admin/reviews",
        "/admin/reports",
        "/admin/banners",
        "/admin/blog",
        "/admin/faqs",
        "/admin/coupons",
        "/admin/profile",
        "/admin/analytics",
      ]),
    [],
  );

  const userPermissionSet = useMemo(() => {
    const rawPermissions = (user as any)?.permissions;
    if (!Array.isArray(rawPermissions)) return new Set<string>();

    return new Set(
      rawPermissions
        .map((permission) => {
          if (typeof permission === "string") return permission;
          if (permission && typeof permission === "object") {
            return permission.code ?? permission.name ?? permission.slug ?? "";
          }
          return "";
        })
        .filter(Boolean)
        .map((permission) => String(permission).toUpperCase()),
    );
  }, [user]);

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
      href: "/admin",
      submenu: null,
      permissions: ["ANALYTICS_VIEW", "DASHBOARD_VIEW"],
    },
    {
      label: "Users & Access",
      icon: Users,
      submenu: [
        {
          label: "All Users",
          href: "/admin/users",
          permissions: ["USERS_VIEW"],
        },
        {
          label: "User Roles",
          href: "/admin/user-roles",
          permissions: ["ROLES_VIEW"],
        },
        {
          label: "Banned Users",
          href: "/admin/banned-users",
          permissions: ["USERS_VIEW"],
        },
        {
          label: "Activity Log",
          href: "/admin/activity-log",
          permissions: ["ACTIVITY_LOG_VIEW"],
        },
      ],
    },
    {
      label: "Products",
      icon: Package,
      submenu: [
        {
          label: "All Products",
          href: "/admin/products",
          permissions: ["PRODUCTS_VIEW"],
        },
        {
          label: "Categories",
          href: "/admin/categories",
          permissions: ["CATEGORIES_VIEW"],
        },
        {
          label: "Out of Stock",
          href: "/admin/stock",
          permissions: ["PRODUCTS_VIEW"],
        },
      ],
    },
    {
      label: "Restaurants",
      icon: UtensilsCrossed,
      submenu: [
        {
          label: "All Restaurants",
          href: "/admin/restaurants",
          permissions: ["RESTAURANTS_VIEW"],
        },
        {
          label: "Best Restaurants",
          href: "/admin/best-sellers",
          permissions: ["RESTAURANTS_VIEW"],
        },
      ],
    },
    {
      label: "Reviews & Feedback",
      icon: MessageCircle,
      submenu: [
        {
          label: "Customer Reviews",
          href: "/admin/reviews",
          permissions: ["REVIEWS_VIEW"],
        },
        {
          label: "Report Manage",
          href: "/admin/reports",
          permissions: ["REPORTS_VIEW"],
        },
      ],
    },
    {
      label: "Content Management",
      icon: Images,
      submenu: [
        {
          label: "Banners",
          href: "/admin/banners",
          permissions: ["BANNERS_VIEW"],
        },
        {
          label: "Image Slider",
          href: "/admin/slider",
          permissions: ["BANNERS_VIEW"],
        },
        {
          label: "Blog Management",
          href: "/admin/blog",
          permissions: ["BLOG_VIEW"],
        },
        { label: "FAQs", href: "/admin/faqs", permissions: ["FAQS_VIEW"] },
      ],
    },
    {
      label: "Promotions",
      icon: Zap,
      submenu: [
        {
          label: "Coupons",
          href: "/admin/coupons",
          permissions: ["COUPONS_VIEW"],
        },
        {
          label: "Events",
          href: "/admin/events",
          permissions: ["COUPONS_VIEW"],
        },
        {
          label: "Discounts",
          href: "/admin/discounts",
          permissions: ["COUPONS_VIEW"],
        },
        {
          label: "Active Campaigns",
          href: "/admin/campaigns",
          permissions: ["COUPONS_VIEW"],
        },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      submenu: [
        {
          label: "Profile",
          href: "/admin/profile",
          permissions: ["ADMIN_PROFILE_VIEW"],
        },
        {
          label: "Website Settings",
          href: "/admin/settings",
          permissions: ["SETTINGS_VIEW"],
        },
        {
          label: "Analytics",
          href: "/admin/analytics",
          permissions: ["ANALYTICS_VIEW"],
        },
        {
          label: "Security",
          href: "/admin/security",
          permissions: ["SETTINGS_VIEW"],
        },
      ],
    },
  ];

  const visibleMenuItems = menuItems
    .map((item) => {
      if (item.submenu) {
        const allowedSubmenu = item.submenu.filter((subitem) =>
          existingAdminRoutes.has(subitem.href),
        );
        return {
          ...item,
          submenu: allowedSubmenu,
        };
      }

      const isVisible = !!item.href && existingAdminRoutes.has(item.href);
      return isVisible ? item : null;
    })
    .filter(
      (item): item is NonNullable<typeof item> =>
        item !== null && (!item.submenu || item.submenu.length > 0),
    );

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-2 z-50 lg:hidden bg-white p-2 rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition"
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
        className={`fixed lg:sticky left-0 top-0 w-72 h-screen bg-white border-r border-gray-200 overflow-y-auto z-40 md:z-10 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          transition-none lg:transition-all`}
        suppressHydrationWarning
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-r from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-Sofia text-gray-800">
                FoodVally
              </h2>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {visibleMenuItems.map((item) => (
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
          <button
            onClick={() => {
              logout();
              router.replace("/account/signin");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
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
            <h1 className="font-bold text-gray-800 text-xl hidden sm:block pl-6 lg:pl-0">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-800">
                  {user?.name ?? "Admin User"}
                </p>
                <p className="text-xs text-gray-600">
                  {String(user?.role ?? "ADMIN")}
                </p>
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
