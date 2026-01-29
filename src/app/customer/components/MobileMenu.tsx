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
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/customer/profile', label: 'Profile', icon: User },
  { href: '/customer/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/customer/favorites', label: 'Favorites', icon: Heart },
  { href: '/customer/coupons', label: 'Coupons', icon: Ticket },
  { href: '/customer/notifications', label: 'Notifications', icon: Bell },
  { href: '/customer/settings', label: 'Settings', icon: Settings },
];

/**
 * Mobile bottom navigation bar
 * Visible only on mobile devices
 */
export function MobileMenu() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex items-center justify-around">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-2 flex-1 text-center transition-colors ${
                isActive
                  ? 'text-green-600 border-t-2 border-green-600'
                  : 'text-gray-700'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
