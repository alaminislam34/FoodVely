'use client';

import Image from 'next/image';
import { Star, MapPin, Clock, Heart, Trash2 } from 'lucide-react';
import { Restaurant } from '@/types/customer-types';
import { useState } from 'react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showActions?: boolean;
  onRemove?: () => void;
}

/**
 * Reusable restaurant card component
 */
export function RestaurantCard({
  restaurant,
  showActions = false,
  onRemove,
}: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <Image
          src={restaurant.coverImage || '/images/placeholder.jpg'}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        {restaurant.isOpen === false && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Closed</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Name & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {restaurant.name}
          </h3>
          {showActions && (
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Heart
                size={18}
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{restaurant.rating}</span>
          <span className="text-gray-600">({restaurant.reviewCount})</span>
        </div>

        {/* Cuisines */}
        <p className="text-xs text-gray-600 line-clamp-1">
          {restaurant.cuisineTypes?.join(', ') || 'Multi-cuisine'}
        </p>

        {/* Info */}
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>{restaurant.deliveryTime} mins</span>
            <span>•</span>
            <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
          </div>
          <div className="text-gray-500">Min. ${restaurant.minOrder.toFixed(2)}</div>
        </div>
      </div>

      {/* Actions */}
      {showActions && onRemove && (
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <button className="flex-1 px-3 py-2 bg-green-500 text-white font-medium text-sm rounded-lg hover:bg-green-600 transition-colors">
            Order
          </button>
          <button
            onClick={onRemove}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
