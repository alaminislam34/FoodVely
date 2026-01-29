'use client';

import { useFetch } from '@/hooks/useFetch';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { EmptyState } from '@/components/customer/shared/EmptyState';
import { NotificationCard } from '@/components/customer/shared/NotificationCard';
import { Notification } from '@/types/customer-types';
import { Search, Filter, Trash2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface NotificationsResponse {
  notifications: Notification[];
}

export default function NotificationsPage() {
  const { data: notificationsData, loading } = useFetch<NotificationsResponse>(
    '/data/customer/my-notifications.json'
  );
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <LoadingState type="list" />;
  if (!notificationsData?.notifications) return <EmptyState type="notifications" />;

  const allNotifications = notificationsData.notifications || [];
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const filteredNotifications = allNotifications.filter((notification) => {
    const matchesSearch = notification.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = !typeFilter || notification.type === typeFilter;
    return matchesSearch && matchesFilter;
  });

  const notificationTypes = [
    ...new Set(allNotifications.map((n) => n.type)),
  ] as string[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">
          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex-1 w-full relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={typeFilter || ''}
              onChange={(e) => setTypeFilter(e.target.value || null)}
              className="flex-1 md:flex-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Types</option>
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 size={16} />
              Mark all
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <EmptyState type="notifications" />
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              expandable
            />
          ))
        )}
      </div>

      {/* Bulk Actions */}
      {filteredNotifications.some((n) => !n.isRead) && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredNotifications.filter((n) => !n.isRead).length} unread in this view
          </p>
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
            Delete unread
          </button>
        </div>
      )}
    </div>
  );
}
