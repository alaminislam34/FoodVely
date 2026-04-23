"use client";

import { QueryClient } from "@tanstack/react-query";

/**
 * Note: getStoredUser amra ekhon use korbo na,
 * amra Query Cache theke user id check korbo.
 */

export type CartEntry = {
  id: string;
  quantity: number;
};

export type WishlistEntry = {
  id: string;
  type: "product" | "restaurant";
};

const GUEST_CART_KEY = "guest_cart";
const GUEST_WISHLIST_KEY = "guest_wishlist";
const COMMERCE_EVENT = "commerce-updated";

const isBrowser = typeof window !== "undefined";

// Helper: Query Client access korar jonno
const getUserIdFromCache = (): string | null => {
  if (!isBrowser) return null;

  /**
   * TanStack Query cache theke user fetch kora.
   * Amra useAuth hook-e queryKey ["authUser"] use korechi.
   */
  try {
    // Client-side singleton dorkar hole amra hook thekeo pass korte pari
    // Tobe temporary metadata localStorage e thaka commerce er jonno safe.
    const rawUser = localStorage.getItem("user_metadata");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      return user?.id ? String(user.id) : null;
    }
  } catch {
    return null;
  }
  return null;
};

const emitCommerceUpdate = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(COMMERCE_EVENT));
};

const getScopedKeys = () => {
  const userId = getUserIdFromCache();

  if (!userId) {
    return {
      cartKey: GUEST_CART_KEY,
      wishlistKey: GUEST_WISHLIST_KEY,
      userId: null,
    };
  }

  return {
    cartKey: `cart_${userId}`,
    wishlistKey: `wishlist_${userId}`,
    userId,
  };
};

const readJson = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T) => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// ... Baki function gulo (addToCart, getCartItems, etc.) eki thakbe ...

export const getCommerceUpdateEventName = () => COMMERCE_EVENT;

export const getCartItems = (): CartEntry[] => {
  const { cartKey } = getScopedKeys();
  return readJson<CartEntry[]>(cartKey, []);
};

export const getCartCount = (): number => {
  return getCartItems().reduce(
    (sum, item) => sum + Math.max(item.quantity, 0),
    0,
  );
};

export const addToCart = (id: string, quantity = 1) => {
  const { cartKey } = getScopedKeys();
  const items = readJson<CartEntry[]>(cartKey, []);
  const existing = items.find((item) => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ id, quantity: Math.max(quantity, 1) });
  }

  writeJson(cartKey, items);
  emitCommerceUpdate();
};

// ... Wishlist logic (eki logic maintain hobe query client er maddhome scoped key niye) ...

export const mergeGuestCommerceToUser = (userId: string) => {
  if (!isBrowser || !userId) return;

  const userCartKey = `cart_${userId}`;
  const userWishlistKey = `wishlist_${userId}`;

  const guestCart = readJson<CartEntry[]>(GUEST_CART_KEY, []);
  const guestWishlist = readJson<WishlistEntry[]>(GUEST_WISHLIST_KEY, []);

  const userCart = readJson<CartEntry[]>(userCartKey, []);
  const userWishlist = readJson<WishlistEntry[]>(userWishlistKey, []);

  const mergedCartMap = new Map<string, number>();
  [...userCart, ...guestCart].forEach((item) => {
    const prev = mergedCartMap.get(item.id) ?? 0;
    mergedCartMap.set(item.id, prev + Math.max(item.quantity, 0));
  });

  const mergedWishlistMap = new Map<string, WishlistEntry>();
  [...userWishlist, ...guestWishlist].forEach((item) => {
    mergedWishlistMap.set(`${item.type}:${item.id}`, item);
  });

  writeJson(
    userCartKey,
    Array.from(mergedCartMap.entries()).map(([id, quantity]) => ({
      id,
      quantity,
    })),
  );
  writeJson(userWishlistKey, Array.from(mergedWishlistMap.values()));

  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(GUEST_WISHLIST_KEY);
  emitCommerceUpdate();
};
