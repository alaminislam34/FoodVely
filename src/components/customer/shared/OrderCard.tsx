'use client';

import Link from 'next/link';
import { ChevronRight, MapPin, Clock, Eye, RotateCcw, Star } from 'lucide-react';
import { Order } from '@/types/customer-types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready_for_pickup: 'bg-green-100 text-green-800',
  out_for_delivery: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  failed: 'bg-red-100 text-red-800',
};

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  onReorder?: () => void;
}

/**
 * Reusable order card component
 */
export function OrderCard({ order, showActions = true, onReorder }: OrderCardProps) {
  const isDelivered = order.status === 'delivered';
  const isCancelled = ['cancelled', 'failed'].includes(order.status);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-sm text-gray-600 font-medium">Order #{order.orderId}</p>
            <p className="text-lg font-semibold text-gray-900">{order.restaurantName}</p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
              STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Items Summary */}
        <div>
          <p className="text-sm text-gray-600 mb-2">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item) => (
              <p key={item.id} className="text-xs text-gray-700">
                {item.quantity}x {item.foodName}
              </p>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-gray-600">
                +{order.items.length - 2} more
              </p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-900">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>

        {/* Delivery Info */}
        {!isCancelled && (
          <div className="space-y-2 text-xs text-gray-600">
            {order.deliveryPartnerName && (
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>{order.deliveryPartnerName}</span>
              </div>
            )}
            {order.estimatedDeliveryTime && (
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Est. {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
          <Link
            href={`/customer/orders/${order.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} />
            View
          </Link>

          {isDelivered && (
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
              <RotateCcw size={16} />
              Reorder
            </button>
          )}

          {isDelivered && !order.rating && (
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
              <Star size={16} />
              Rate
            </button>
          )}
        </div>
      )}
    </div>
  );
}
