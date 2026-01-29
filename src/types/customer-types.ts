export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  defaultAddressId: number;
  preferences: CustomerPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  customerId: number;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  label?: string;
}

export interface CustomerPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  promotionalEmails: boolean;
  language: string;
  theme: "light" | "dark";
  timezone: string;
  currency: string;
}

// ============================================================
// RESTAURANT & FOOD TYPES
// ============================================================

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  deliveryTime: number; // minutes
  minOrder: number;
  isOpen: boolean;
  cuisineTypes: string[];
  address: string;
  phone: string;
  isFavorite: boolean;
}

export interface Food {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  spicyLevel: "mild" | "medium" | "spicy" | "very_spicy";
  isVegetarian: boolean;
  isVegan: boolean;
  isFavorite: boolean;
  preparationTime: number;
  calories?: number;
}

export interface OrderItem {
  id: number;
  foodId: number;
  foodName: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

// ============================================================
// ORDER TYPES
// ============================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";

export interface Order {
  id: number;
  orderId: string; // Human-readable ID (ORD-2024-001)
  customerId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantLogo: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: Address;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  deliveryPartnerRating?: number;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  timeline: OrderTimeline[];
  rating?: OrderRating;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface OrderRating {
  foodRating: number;
  restaurantRating: number;
  deliveryRating: number;
  comment?: string;
}

// ============================================================
// COUPON / OFFER TYPES
// ============================================================

export type CouponStatus = "active" | "expired" | "used" | "disabled";

export interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  applicableRestaurants: number[]; // Empty = all restaurants
  applicableCategories: string[]; // Empty = all categories
  status: CouponStatus;
  isApplied?: boolean;
}

// ============================================================
// FAVORITE / WISHLIST TYPES
// ============================================================

export interface Favorite {
  id: number;
  customerId: number;
  foodId?: number;
  restaurantId?: number;
  type: "food" | "restaurant";
  createdAt: string;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType =
  | "order_placed"
  | "order_confirmed"
  | "order_preparing"
  | "order_ready"
  | "order_out_for_delivery"
  | "order_delivered"
  | "order_cancelled"
  | "promotion"
  | "restaurant_message";

export interface Notification {
  id: number;
  customerId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>; // orderId, restaurantId, couponCode, etc.
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

// ============================================================
// PAGINATION & API TYPES
// ============================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  filter?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ============================================================
// FORM & UI TYPES
// ============================================================

export interface AddressFormData {
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  label?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateData {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface PreferencesUpdateData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  promotionalEmails: boolean;
  language: string;
  theme: "light" | "dark";
}

// ============================================================
// COMPONENT PROPS TYPES
// ============================================================

export interface OrderCardProps {
  order: Order;
  onReorder?: () => void;
  onCancel?: () => void;
  onRate?: () => void;
  onViewDetails?: () => void;
  showActions?: boolean;
}

export interface FoodCardProps {
  food: Food;
  restaurant?: Restaurant;
  onAddFavorite?: (isFavorite: boolean) => void;
  onQuickOrder?: () => void;
  onViewDetails?: () => void;
}

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onQuickOrder?: () => void;
  onViewDetails?: () => void;
  onAddFavorite?: (isFavorite: boolean) => void;
}

export interface CouponCardProps {
  coupon: Coupon;
  onApply?: () => void;
  onViewDetails?: () => void;
  onCopy?: () => void;
}

export interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export interface StepperProps {
  currentStep: number;
  steps: Array<{
    status: OrderStatus;
    title: string;
    description: string;
  }>;
  orientation?: "horizontal" | "vertical";
}

export interface TabbedLayoutProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}
