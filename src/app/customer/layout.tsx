import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Dashboard | Foodvely',
  description: 'Manage your orders, favorites, and preferences',
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
