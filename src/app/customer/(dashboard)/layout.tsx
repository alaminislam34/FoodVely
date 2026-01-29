'use client';

import { useState } from 'react';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { CustomerHeader } from '../components/CustomerHeader';
import { MobileMenu } from '../components/MobileMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:pb-0 pb-20">
        {/* Header */}
        <CustomerHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </div>
  );
}
