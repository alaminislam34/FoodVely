'use client';

import { useFetch } from '@/hooks/useFetch';
import { TabbedLayout } from '@/components/customer/shared/TabbedLayout';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { EmptyState } from '@/components/customer/shared/EmptyState';
import { OrderCard } from '@/components/customer/shared/OrderCard';
import { Order } from '@/types/customer-types';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface OrdersResponse {
  orders: Order[];
}

export default function OrdersPage() {
  const { data: ordersData, loading } = useFetch<OrdersResponse>(
    '/data/customer/my-orders.json'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  if (loading) return <LoadingState type="list" />;
  if (!ordersData?.orders) return <EmptyState type="orders" />;

  const allOrders = ordersData.orders;
  const activeStatuses = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'];
  const activeOrders = allOrders.filter((o) => activeStatuses.includes(o.status));
  const pastOrders = allOrders.filter((o) => !activeStatuses.includes(o.status));

  const filterOrders = (orders: Order[]) => {
    return orders.filter((order) => {
      const matchesSearch =
        order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  };

  const tabs = [
    {
      id: 'active',
      label: `Active Orders (${activeOrders.length})`,
      content: (
        <div className="space-y-4">
          {filterOrders(activeOrders).length === 0 ? (
            <EmptyState type="orders" />
          ) : (
            filterOrders(activeOrders).map((order) => (
              <OrderCard key={order.id} order={order} showActions />
            ))
          )}
        </div>
      ),
    },
    {
      id: 'past',
      label: `Past Orders (${pastOrders.length})`,
      content: (
        <div className="space-y-4">
          {filterOrders(pastOrders).length === 0 ? (
            <EmptyState type="orders" />
          ) : (
            filterOrders(pastOrders).map((order) => (
              <OrderCard key={order.id} order={order} showActions />
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by restaurant or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready_for_pickup">Ready</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabbedLayout tabs={tabs} defaultTab="active" />
    </div>
  );
}
