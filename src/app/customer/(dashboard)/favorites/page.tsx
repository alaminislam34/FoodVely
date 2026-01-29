'use client';

import { useFetch } from '@/hooks/useFetch';
import { TabbedLayout } from '@/components/customer/shared/TabbedLayout';
import { LoadingState } from '@/components/customer/shared/LoadingState';
import { EmptyState } from '@/components/customer/shared/EmptyState';
import { RestaurantCard } from '@/components/customer/shared/RestaurantCard';
import { FoodCard } from '@/components/customer/shared/FoodCard';
import { Restaurant, Food, Favorite } from '@/types/customer-types';

interface FavoritesResponse {
  favorites: Favorite[];
  restaurants: Restaurant[];
  foods: Food[];
}

export default function FavoritesPage() {
  const { data: favoritesData, loading } = useFetch<FavoritesResponse>(
    '/data/customer/my-favorites.json'
  );

  if (loading) return <LoadingState type="grid" />;
  if (!favoritesData?.restaurants || !favoritesData?.foods) {
    return <EmptyState type="favorites" />;
  }

  const restaurants = favoritesData.restaurants || [];
  const foods = favoritesData.foods || [];

  const tabs = [
    {
      id: 'restaurants',
      label: `Favorite Restaurants (${restaurants.length})`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.length === 0 ? (
            <EmptyState type="favorites" />
          ) : (
            restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                showActions
              />
            ))
          )}
        </div>
      ),
    },
    {
      id: 'foods',
      label: `Favorite Foods (${foods.length})`,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.length === 0 ? (
            <EmptyState type="favorites" />
          ) : (
            foods.map((food) => (
              <FoodCard key={food.id} food={food} showActions />
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600">Your favorite restaurants and foods</p>
      </div>

      <TabbedLayout tabs={tabs} defaultTab="restaurants" />
    </div>
  );
}
