'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Heart,
  Ticket,
  Bell,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/customer/profile', label: 'Profile', icon: User },
  { href: '/customer/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/customer/favorites', label: 'Favorites', icon: Heart },
  { href: '/customer/coupons', label: 'Coupons', icon: Ticket },
  { href: '/customer/notifications', label: 'Notifications', icon: Bell },
  { href: '/customer/settings', label: 'Settings', icon: Settings },
];

interface CustomerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Customer dashboard sidebar navigation
 * Desktop: Fixed left sidebar
 * Mobile: Collapsible drawer
 */
export function CustomerSidebar({ isOpen = true, onClose }: CustomerSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transition-transform md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-bold text-gray-900">Foodvely</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
