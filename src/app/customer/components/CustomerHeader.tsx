'use client';

import Link from 'next/link';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface CustomerHeaderProps {
  onMenuClick?: () => void;
}

/**
 * Customer dashboard top header
 * Includes notifications, user menu, mobile menu toggle
 */
export function CustomerHeader({ onMenuClick }: CustomerHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Menu Button (Mobile) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Center: Logo (Mobile Only) */}
        <Link href="/" className="md:hidden flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <Link
            href="/customer/notifications"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User size={20} />
              <span className="text-sm font-medium hidden md:inline">Sarah</span>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <Link
                  href="/customer/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg"
                >
                  My Profile
                </Link>
                <Link
                  href="/customer/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg flex items-center gap-2">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
