'use client';

import { useFetch } from '@/hooks/useFetch';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { Stepper } from '@/components/customer/shared/Stepper';
import { EmptyState } from '@/components/customer/shared/EmptyState';
import { Order } from '@/types/customer-types';
import {
  MapPin,
  Clock,
  User,
  Phone,
  Star,
  X,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';

interface OrdersResponse {
  orders: Order[];
}

export default function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { data: ordersData, loading } = useFetch<OrdersResponse>(
    '/data/customer/my-orders.json'
  );
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (loading) return <LoadingState />;
  if (!ordersData?.orders) return <EmptyState type="orders" />;

  const order = ordersData.orders.find((o) => o.id === parseInt(params.orderId));
  if (!order) return <EmptyState type="generic" title="Order Not Found" />;

  const isDelivered = order.status === 'delivered';
  const isCancelled = ['cancelled', 'failed'].includes(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderId}</h1>
        <p className="text-gray-600">
          {new Date(order.createdAt).toLocaleDateString()} at{' '}
          {new Date(order.createdAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Status Stepper */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Stepper currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.foodName}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity}x ${item.price.toFixed(2)}
                    </p>
                    {item.specialInstructions && (
                      <p className="text-xs text-gray-500 mt-1">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5" />
                    {index < order.timeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-green-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-gray-900">
                      {event.status.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Restaurant Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Restaurant</h3>
            <p className="text-lg font-bold text-gray-900">{order.restaurantName}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span>4.7 (289 reviews)</span>
            </div>
          </div>

          {/* Delivery Info */}
          {!isCancelled && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Info</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <User size={16} className="flex-shrink-0 text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {order.deliveryPartnerName}
                    </p>
                    <p className="text-gray-600">{order.deliveryPartnerPhone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Clock size={16} className="flex-shrink-0 text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-600">
                      {order.estimatedDeliveryTime
                        ? `Est. ${new Date(order.estimatedDeliveryTime).toLocaleTimeString()}`
                        : 'Estimated time pending'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MapPin size={16} className="flex-shrink-0 text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-600">{order.deliveryAddress.street}</p>
                    <p className="text-gray-600">
                      {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                      {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-900">${order.deliveryFee.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {isDelivered && !order.rating && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Star size={16} />
                Rate Order
              </button>
            )}
            {!['delivered', 'cancelled', 'failed'].includes(order.status) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                <X size={16} />
                Cancel Order
              </button>
            )}
            {isDelivered && (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                <RotateCcw size={16} />
                Reorder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
