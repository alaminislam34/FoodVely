"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CartEntry,
  WishlistEntry,
  getCartCount,
  getCartItems,
  getCommerceUpdateEventName,
  getWishlistCount,
  getWishlistItems,
} from "@/utils/commerceStorage";

export function useCommerceState() {
  const [cartItems, setCartItems] = useState<CartEntry[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistEntry[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refresh = useCallback(() => {
    setCartItems(getCartItems());
    setWishlistItems(getWishlistItems());
    setCartCount(getCartCount());
    setWishlistCount(getWishlistCount());
  }, []);

  useEffect(() => {
    refresh();

    const commerceEvent = getCommerceUpdateEventName();
    window.addEventListener(commerceEvent, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(commerceEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return {
    cartItems,
    wishlistItems,
    cartCount,
    wishlistCount,
    refresh,
  };
}
