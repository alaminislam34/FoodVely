'use client';

import { Check } from 'lucide-react';
import { OrderStatus } from '@/types/customer-types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

const STATUS_ORDER: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
];

interface StepperProps {
  currentStatus: OrderStatus;
  compact?: boolean;
}

/**
 * Horizontal stepper component showing order progress
 */
export function Stepper({ currentStatus, compact = false }: StepperProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus as any);

  if (currentStatus === 'cancelled' || currentStatus === 'failed') {
    return (
      <div className="py-4 px-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm font-medium text-red-800">
          {STATUS_LABELS[currentStatus]}
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {STATUS_ORDER.map((status, index) => (
          <div key={status} className="flex-1 flex items-center">
            {/* Step Circle */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                index <= currentIndex
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index < currentIndex ? (
                <Check size={16} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Connecting Line */}
            {index < STATUS_ORDER.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${
                  index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      {!compact && (
        <div className="flex text-xs text-gray-600">
          {STATUS_ORDER.map((status, index) => (
            <div key={status} className="flex-1 text-center">
              <p className={index === currentIndex ? 'font-semibold text-gray-900' : ''}>
                {STATUS_LABELS[status]}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Current Status */}
      <div className="text-sm font-medium text-center text-gray-900">
        Current: <span className="text-green-600">{STATUS_LABELS[currentStatus]}</span>
      </div>
    </div>
  );
}
