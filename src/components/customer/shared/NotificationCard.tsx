"use client";

import { Notification } from "@/types/customer-types";
import { ShoppingBag, Gift, Bell, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  order_placed: <ShoppingBag size={16} />,
  order_confirmed: <CheckCircle2 size={16} />,
  order_preparing: <ShoppingBag size={16} />,
  order_ready: <ShoppingBag size={16} />,
  order_out_for_delivery: <ShoppingBag size={16} />,
  order_delivered: <CheckCircle2 size={16} />,
  order_cancelled: <ShoppingBag size={16} />,
  promotion: <Gift size={16} />,
  restaurant_message: <Bell size={16} />,
};

interface NotificationCardProps {
  notification: Notification;
  onRead?: () => void;
  onDelete?: () => void;
  expandable?: boolean;
}

/**
 * Reusable notification card component
 */
export function NotificationCard({
  notification,
  onRead,
  onDelete,
  expandable = false,
}: NotificationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRead = () => {
    if (!notification.isRead && onRead) {
      onRead();
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${
        !notification.isRead ? "bg-blue-50 border-blue-200" : ""
      }`}
      onClick={() => {
        handleRead();
        if (expandable) setIsExpanded(!isExpanded);
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        <div className="text-gray-600 flex-shrink-0 mt-1">
          {NOTIFICATION_ICONS[notification.type] || <Bell size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-700 ml-7">
        {isExpanded ? notification.message : notification.message.slice(0, 100)}
        {!isExpanded && notification.message.length > 100 && "..."}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 ml-7">
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRead();
            }}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Mark as read
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-50 rounded transition-colors ml-auto"
          >
            <Trash2 size={14} className="text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}
