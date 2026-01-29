'use client';

import { ShoppingBag, Heart, Bell, Ticket, MapPin, LogOut } from 'lucide-react';

interface EmptyStateProps {
  type:
    | 'orders'
    | 'favorites'
    | 'notifications'
    | 'coupons'
    | 'addresses'
    | 'generic';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EMPTY_STATES = {
  orders: {
    icon: ShoppingBag,
    defaultTitle: 'No Orders Yet',
    defaultDescription: 'Start ordering from your favorite restaurants!',
  },
  favorites: {
    icon: Heart,
    defaultTitle: 'No Favorites Yet',
    defaultDescription: 'Add restaurants and foods to your favorites.',
  },
  notifications: {
    icon: Bell,
    defaultTitle: 'No Notifications',
    defaultDescription: 'You\'re all caught up!',
  },
  coupons: {
    icon: Ticket,
    defaultTitle: 'No Coupons Available',
    defaultDescription: 'Check back later for new offers.',
  },
  addresses: {
    icon: MapPin,
    defaultTitle: 'No Addresses Yet',
    defaultDescription: 'Add a delivery address to get started.',
  },
  generic: {
    icon: ShoppingBag,
    defaultTitle: 'Nothing Here',
    defaultDescription: 'It looks empty.',
  },
};

/**
 * Empty state component for various sections
 */
export function EmptyState({
  type,
  title,
  description,
  action,
}: EmptyStateProps) {
  const config = EMPTY_STATES[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        {description || config.defaultDescription}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
