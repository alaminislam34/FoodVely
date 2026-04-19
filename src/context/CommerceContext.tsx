"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import {
  addToCart,
  clearCart,
  removeFromCart,
  removeFromWishlist,
  setCartItemQuantity,
  toggleWishlist,
} from "@/utils/commerceStorage";
import { useCommerceState } from "@/hooks/useCommerceState";

type WishlistType = "product" | "restaurant";

type CommerceContextValue = {
  cartItems: ReturnType<typeof useCommerceState>["cartItems"];
  wishlistItems: ReturnType<typeof useCommerceState>["wishlistItems"];
  cartCount: number;
  wishlistCount: number;
  addItemToCart: (id: string, quantity?: number) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  removeItemFromCart: (id: string) => void;
  clearCartItems: () => void;
  toggleWishlistItem: (id: string, type: WishlistType) => void;
  removeWishlistItem: (id: string, type: WishlistType) => void;
  isWishlisted: (id: string, type: WishlistType) => boolean;
  refresh: () => void;
};

const CommerceContext = createContext<CommerceContextValue | undefined>(
  undefined,
);

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const { cartItems, wishlistItems, cartCount, wishlistCount, refresh } =
    useCommerceState();

  const isWishlisted = useCallback(
    (id: string, type: WishlistType) =>
      wishlistItems.some((item) => item.id === id && item.type === type),
    [wishlistItems],
  );

  const value = useMemo<CommerceContextValue>(
    () => ({
      cartItems,
      wishlistItems,
      cartCount,
      wishlistCount,
      addItemToCart: addToCart,
      setItemQuantity: setCartItemQuantity,
      removeItemFromCart: removeFromCart,
      clearCartItems: clearCart,
      toggleWishlistItem: toggleWishlist,
      removeWishlistItem: removeFromWishlist,
      isWishlisted,
      refresh,
    }),
    [cartItems, wishlistItems, cartCount, wishlistCount, isWishlisted, refresh],
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerceContext() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error("useCommerceContext must be used within CommerceProvider");
  }
  return context;
}
