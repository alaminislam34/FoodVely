"use client";

import RestaurantCard from "@/app/ui/ProviderCard";
import { Provider } from "@/types/provider";
import { useEffect, useState } from "react";

const PopularProvider = () => {
  const [Restaurants, setRestaurants] = useState<Provider[]>([]);
  useEffect(() => {
    fetch("/Restaurants.json")
      .then((res) => res.json())
      .then((data) => setRestaurants(data));
  }, []);

  return (
    <div className="py-12">
      <div className="py-6 mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-Sofia">
          Popular Restaurants
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Restaurants.slice(0, 8).map((item) => (
          <RestaurantCard key={item.id} provider={item} />
        ))}
      </div>
    </div>
  );
};

export default PopularProvider;
