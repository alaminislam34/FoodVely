"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  ListOrdered,
  MapPin,
  Settings,
  UserCog,
} from "lucide-react";

const links = [
  { href: "/account/orders", label: "My Orders", icon: ListOrdered },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  {
    href: "/account/payment-methods",
    label: "Payment Methods",
    icon: CreditCard,
  },
  { href: "/account/settings", label: "Account Settings", icon: Settings },
  { href: "/account/profile", label: "Profile", icon: UserCog },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border border-rose-100 rounded-3xl p-3 shadow-sm">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        {links.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/account/orders" &&
              pathname.startsWith("/account/orders/"));

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-rose-50 text-rose-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
