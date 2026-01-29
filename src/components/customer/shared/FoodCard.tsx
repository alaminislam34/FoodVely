'use client';

import Image from 'next/image';
import { Star, Heart, Trash2 } from 'lucide-react';
import { Food } from '@/types/customer-types';
import { useState } from 'react';

interface FoodCardProps {
  food: Food;
  showActions?: boolean;
  onRemove?: () => void;
}

/**
 * Reusable food card component
 */
export function FoodCard({ food, showActions = false, onRemove }: FoodCardProps) {
  const [isFavorite, setIsFavorite] = useState(food.isFavorite);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <div className="relative h-32 bg-gray-200 overflow-hidden">
        <Image
          src={food.image || '/images/placeholder.jpg'}
          alt={food.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        {food.isVegan && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Vegan
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{food.name}</h3>
          {showActions && (
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Heart
                size={16}
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>
          )}
        </div>

        {/* Category & Spice */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>{food.category}</span>
          {food.spicyLevel && (
            <>
              <span>•</span>
              <span>🌶️ Level {food.spicyLevel}</span>
            </>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{food.rating}</span>
          <span className="text-gray-600">({food.reviewCount})</span>
        </div>

        {/* Price & Prep Time */}
        <div className="flex items-center justify-between text-sm">
          <p className="font-bold text-green-600">${food.price.toFixed(2)}</p>
          <p className="text-xs text-gray-600">{food.preparationTime} mins</p>
        </div>
      </div>

      {/* Actions */}
      {showActions && onRemove && (
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <button className="flex-1 px-3 py-2 bg-green-500 text-white font-medium text-sm rounded-lg hover:bg-green-600 transition-colors">
            Add
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
