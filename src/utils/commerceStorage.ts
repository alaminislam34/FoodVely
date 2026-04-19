import { getStoredUser } from "@/services/authService";

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

const emitCommerceUpdate = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(COMMERCE_EVENT));
};

const getScopedKeys = () => {
  const user = getStoredUser();
  const userId = user?.id ? String(user.id) : null;

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

export const getCommerceUpdateEventName = () => COMMERCE_EVENT;

export const getCartItems = (): CartEntry[] => {
  const { cartKey } = getScopedKeys();
  return readJson<CartEntry[]>(cartKey, []);
};

export const getCartCount = (): number => {
  return getCartItems().reduce((sum, item) => sum + Math.max(item.quantity, 0), 0);
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

export const setCartItemQuantity = (id: string, quantity: number) => {
  const { cartKey } = getScopedKeys();
  const items = readJson<CartEntry[]>(cartKey, []);
  const existing = items.find((item) => item.id === id);

  if (!existing) {
    if (quantity > 0) {
      items.push({ id, quantity });
    }
  } else if (quantity <= 0) {
    const nextItems = items.filter((item) => item.id !== id);
    writeJson(cartKey, nextItems);
    emitCommerceUpdate();
    return;
  } else {
    existing.quantity = quantity;
  }

  writeJson(cartKey, items);
  emitCommerceUpdate();
};

export const removeFromCart = (id: string) => {
  const { cartKey } = getScopedKeys();
  const items = readJson<CartEntry[]>(cartKey, []);
  const nextItems = items.filter((item) => item.id !== id);
  writeJson(cartKey, nextItems);
  emitCommerceUpdate();
};

export const clearCart = () => {
  const { cartKey } = getScopedKeys();
  writeJson<CartEntry[]>(cartKey, []);
  emitCommerceUpdate();
};

export const getWishlistItems = (): WishlistEntry[] => {
  const { wishlistKey } = getScopedKeys();
  return readJson<WishlistEntry[]>(wishlistKey, []);
};

export const getWishlistCount = () => getWishlistItems().length;

export const isWishlisted = (id: string, type: "product" | "restaurant") => {
  return getWishlistItems().some((item) => item.id === id && item.type === type);
};

export const toggleWishlist = (id: string, type: "product" | "restaurant") => {
  const { wishlistKey } = getScopedKeys();
  const items = readJson<WishlistEntry[]>(wishlistKey, []);
  const index = items.findIndex((item) => item.id === id && item.type === type);

  if (index >= 0) {
    items.splice(index, 1);
  } else {
    items.push({ id, type });
  }

  writeJson(wishlistKey, items);
  emitCommerceUpdate();
};

export const removeFromWishlist = (id: string, type: "product" | "restaurant") => {
  const { wishlistKey } = getScopedKeys();
  const items = readJson<WishlistEntry[]>(wishlistKey, []);
  const nextItems = items.filter((item) => !(item.id === id && item.type === type));
  writeJson(wishlistKey, nextItems);
  emitCommerceUpdate();
};

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

  const mergedCart = Array.from(mergedCartMap.entries()).map(([id, quantity]) => ({
    id,
    quantity,
  }));
  const mergedWishlist = Array.from(mergedWishlistMap.values());

  writeJson(userCartKey, mergedCart);
  writeJson(userWishlistKey, mergedWishlist);

  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(GUEST_WISHLIST_KEY);
  emitCommerceUpdate();
};
