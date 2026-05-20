"use client";

import React from "react";
import FavoriteFoodCard from "./FavoriteFoodCard";

interface Item {
  id: string | number;
  image?: string;
  name: string;
  price?: number;
  rating?: number;
}

interface Props {
  items: Item[];
}

export default function FavoritesGrid({ items }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-100 rounded-lg p-6 text-center text-slate-500">
        You don’t have any favorites yet. Explore the menu and save your top picks.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <FavoriteFoodCard key={it.id} {...it} />
      ))}
    </div>
  );
}
