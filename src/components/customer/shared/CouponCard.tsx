'use client';

import { Copy, Check } from 'lucide-react';
import { Coupon } from '@/types/customer-types';
import { useState } from 'react';

interface CouponCardProps {
  coupon: Coupon;
  showDetails?: boolean;
}

/**
 * Reusable coupon card component
 */
export function CouponCard({ coupon, showDetails = true }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const discountDisplay =
    coupon.discountType === 'percentage'
      ? `${coupon.discountValue}% OFF`
      : `$${coupon.discountValue} OFF`;

  const isExpired = new Date(coupon.validUntil) < new Date();
  const isUsed = coupon.status === 'used';

  return (
    <div
      className={`bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200 overflow-hidden hover:shadow-lg transition-shadow ${
        isExpired || isUsed ? 'opacity-50' : ''
      }`}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-green-700">{discountDisplay}</h3>
            <p className="text-sm font-semibold text-gray-700 mt-1">{coupon.title}</p>
          </div>
          {isExpired && (
            <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded">
              Expired
            </span>
          )}
          {isUsed && (
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
              Used
            </span>
          )}
        </div>

        {/* Code */}
        <div className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
          <code className="text-sm font-bold text-gray-900 flex-1">
            {coupon.code}
          </code>
          <button
            onClick={handleCopy}
            disabled={isExpired || isUsed}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            {copied ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="text-xs text-gray-700 space-y-1">
            <p>{coupon.description}</p>
            {coupon.minOrderAmount > 0 && (
              <p>
                Min order: <span className="font-semibold">${coupon.minOrderAmount}</span>
              </p>
            )}
            {coupon.maxDiscount && coupon.maxDiscount > 0 && (
              <p>
                Max discount: <span className="font-semibold">${coupon.maxDiscount}</span>
              </p>
            )}
            <p>
              Valid until:{' '}
              <span className="font-semibold">
                {new Date(coupon.validUntil).toLocaleDateString()}
              </span>
            </p>
            {coupon.usageLimit > 0 && (
              <p>
                Uses: <span className="font-semibold">{coupon.usageCount}/{coupon.usageLimit}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
