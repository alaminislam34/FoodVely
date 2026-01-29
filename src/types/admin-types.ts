/**
 * Admin Dashboard - Complete TypeScript Types & Interfaces
 * FoodVelly Platform - Multi-role Food Delivery System
 *
 * Last Updated: January 29, 2026
 */

// ============================================================
// ADMIN USER TYPES
// ============================================================

export type AdminRole = "super_admin" | "admin" | "moderator";
export type AdminStatus = "active" | "inactive" | "suspended";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  permissions: AdminPermission[];
  avatar: string;
  status: AdminStatus;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
}

export interface AdminPermission {
  id: number;
  module: string; // 'restaurant', 'food', 'order', etc
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

// ============================================================
// RESTAURANT TYPES
// ============================================================

export type RestaurantStatus =
  | "pending"
  | "active"
  | "suspended"
  | "rejected"
  | "closed";

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  cuisineType: string[];
  logo: string;
  banner: string;
  description: string;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  totalRevenue: number;
  status: RestaurantStatus;
  verified: boolean;
  commissionRate: number;
  deliveryCharge: number;
  minOrderAmount: number;
  deliveryTime: number; // minutes
  maxDeliveryDistance: number; // km
  operatingHours: OperatingHours;
  bankDetails: BankDetails;
  documents: RestaurantDocument[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  verified: boolean;
}

export interface RestaurantDocument {
  id: number;
  type: "license" | "gstin" | "pancard" | "fssai" | "other";
  documentUrl: string;
  verified: boolean;
  uploadedAt: string;
}

export interface RestaurantPerformance {
  restaurantId: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  cancellationRate: number;
  avgDeliveryTime: number;
  customerSatisfaction: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

// ============================================================
// FOOD TYPES
// ============================================================

export type FoodStatus =
  | "active"
  | "inactive"
  | "pending"
  | "rejected"
  | "discontinued";

export interface Food {
  id: number;
  restaurantId: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  images: string[];
  category: string;
  tags: string[];
  ingredients: string[];
  preparationTime: number; // minutes
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  spiceLevel?: 1 | 2 | 3 | 4 | 5; // mild to very hot
  nutritionInfo: NutritionInfo;
  allergens: string[];
  rating: number;
  reviewCount: number;
  orderCount: number;
  status: FoodStatus;
  stock: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  servingSize: string;
}

export interface FoodModerationItem {
  id: number;
  foodId: number;
  restaurantId: number;
  restaurantName: string;
  foodName: string;
  foodImage: string;
  reason: string; // 'inappropriate', 'fake', 'banned_ingredient', etc
  reportCount: number;
  lastReportedAt: string;
  status: "new" | "in_review" | "resolved";
}

// ============================================================
// CUSTOMER TYPES
// ============================================================

export type CustomerStatus = "active" | "suspended" | "banned" | "inactive";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  addresses: Address[];
  paymentMethods: SavedPaymentMethod[];
  preferences: CustomerPreferences;
  createdAt: string;
  updatedAt: string;
  bannedReason?: string;
  bannedAt?: string;
}

export interface Address {
  id: number;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  label?: string;
}

export interface SavedPaymentMethod {
  id: number;
  customerId: number;
  type: "card" | "wallet" | "upi" | "bank";
  isDefault: boolean;
  last4Digits?: string;
  expiryDate?: string;
  provider?: string;
}

export interface CustomerPreferences {
  notifications: boolean;
  emailMarketing: boolean;
  language: string;
  theme: "light" | "dark";
  favoriteRestaurants: number[];
  favoriteFoods: number[];
}

export interface CustomerActivity {
  customerId: number;
  totalOrders: number;
  totalSpent: number;
  averageRating: number;
  averageDeliveryRating: number;
  lastActiveAt: string;
  preferredRestaurants: {
    restaurantId: number;
    name: string;
    orders: number;
  }[];
  preferredFoods: {
    foodId: number;
    name: string;
    orders: number;
  }[];
}

// ============================================================
// ORDER TYPES
// ============================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod =
  | "card"
  | "wallet"
  | "upi"
  | "cash"
  | "bank_transfer";

export interface Order {
  id: number;
  customerId: number;
  restaurantId: number;
  deliveryPartnerId?: number;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  taxPercentage: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  rating?: number;
  review?: string;
  refundDetails?: RefundDetails;
  cancelledReason?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  foodId: number;
  foodName: string;
  foodImage: string;
  quantity: number;
  price: number;
  total: number;
  specialInstructions?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface RefundDetails {
  reason: string;
  amount: number;
  status: "requested" | "approved" | "rejected" | "processed";
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface FailedPayment {
  id: number;
  orderId: number;
  customerId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  errorCode: string;
  errorMessage: string;
  failedAt: string;
  retryCount: number;
  lastRetryAt?: string;
  status: "failed" | "retried" | "cancelled" | "resolved";
}

// ============================================================
// COMMISSION & PAYOUT TYPES
// ============================================================

export interface Commission {
  id: number;
  restaurantId: number;
  commissionRate: number; // percentage (0-100)
  minOrderAmount: number;
  maxOrderAmount?: number;
  effectiveFrom: string;
  effectiveUntil?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Earnings {
  restaurantId: number;
  month: string; // YYYY-MM
  totalOrders: number;
  totalRevenue: number;
  commissionRate: number;
  commissionDeducted: number;
  taxPercentage: number;
  taxDeducted: number;
  otherCharges: number;
  netAmount: number;
  status: "pending" | "approved" | "processing" | "completed" | "failed";
}

export interface Payout {
  id: number;
  restaurantId: number;
  amount: number;
  netAmount: number;
  ordersCount: number;
  commissionsDeducted: number;
  taxDeducted: number;
  otherCharges: number;
  status: "pending" | "approved" | "processing" | "completed" | "failed";
  bankTransferId?: string;
  transferredAt?: string;
  failureReason?: string;
  period: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
  approvedBy?: number;
  approvedAt?: string;
}

// ============================================================
// BLOG TYPES
// ============================================================

export type BlogStatus = "draft" | "published" | "archived" | "scheduled";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: number;
  category: string;
  tags: string[];
  featuredImage: string;
  banner: string;
  relatedFoods: number[];
  relatedRestaurants: number[];
  status: BlogStatus;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledFor?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  postCount: number;
  isFeatured: boolean;
  createdAt: string;
}

// ============================================================
// REVIEW & REPORT TYPES
// ============================================================

export type ReviewStatus = "published" | "flagged" | "deleted" | "hidden";

export interface Review {
  id: number;
  foodId: number;
  restaurantId: number;
  customerId: number;
  customerName: string;
  customerAvatar: string;
  rating: number; // 1-5
  title: string;
  content: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  status: ReviewStatus;
  reportedReasons?: string[];
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ReportType = "restaurant" | "food" | "review" | "user" | "order";
export type ReportStatus = "new" | "in_review" | "resolved" | "dismissed";

export interface Report {
  id: number;
  reportedBy: number;
  reportType: ReportType;
  targetId: number;
  targetName: string;
  reason: string;
  description: string;
  evidence: string[];
  severity: "low" | "medium" | "high" | "critical";
  status: ReportStatus;
  actionTaken?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: number;
}

// ============================================================
// CATEGORY & TAG TYPES
// ============================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  emoji: string;
  products: number;
  revenue: number;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  usageCount: number;
  category?: string;
  createdAt: string;
}

// ============================================================
// SETTINGS TYPES
// ============================================================

export interface SiteSettings {
  id: number;
  appName: string;
  appLogo: string;
  appIcon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  contactEmail: string;
  contactPhone: string;
  supportEmail: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  language: string;
  deliveryChargePerKm: number;
  minOrderAmount: number;
  maxDeliveryDistance: number;
  maxDeliveryTime: number;
  taxPercentage: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  maintenanceSchedule?: {
    startTime: string;
    endTime: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
  updatedBy?: number;
}

export interface NotificationSettings {
  id: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  newRestaurantAlert: boolean;
  suspiciousActivityAlert: boolean;
  paymentFailureAlert: boolean;
}

export interface DeliverySettings {
  id: number;
  minOrderAmount: number;
  maxDeliveryDistance: number;
  deliveryChargePerKm: number;
  baseDeliveryCharge: number;
  freeDeliveryAbove: number;
  maxDeliveryTime: number;
  estimatedDeliveryFormula: "fixed" | "dynamic" | "based_on_distance";
  enableCashOnDelivery: boolean;
  enableOnlinePayment: boolean;
  enableWallet: boolean;
  enableScheduledOrders: boolean;
  maxScheduleAdvanceDays: number;
}

// ============================================================
// ACTIVITY LOG TYPES
// ============================================================

export type ActivityAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "suspend"
  | "activate"
  | "ban"
  | "unban"
  | "refund"
  | "payout";

export type ActivityModule =
  | "restaurant"
  | "food"
  | "order"
  | "customer"
  | "blog"
  | "review"
  | "category"
  | "settings"
  | "commission"
  | "payout"
  | "report"
  | "complaint";

export type ActivitySeverity = "info" | "warning" | "error" | "success";

export interface ActivityLog {
  id: number;
  adminId: number;
  adminName: string;
  action: ActivityAction;
  module: ActivityModule;
  targetId: number;
  targetType: string;
  changes: Record<string, { old: any; new: any }>;
  description: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
  severity: ActivitySeverity;
  createdAt: string;
}

// ============================================================
// COMPLAINT TYPES
// ============================================================

export type ComplaintType =
  | "order"
  | "delivery"
  | "food_quality"
  | "restaurant"
  | "payment"
  | "other";
export type ComplaintPriority = "low" | "medium" | "high" | "critical";
export type ComplaintStatus =
  | "new"
  | "in_progress"
  | "resolved"
  | "closed"
  | "reopened";

export interface Complaint {
  id: number;
  complaintNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  orderId?: number;
  restaurantId?: number;
  type: ComplaintType;
  subject: string;
  description: string;
  attachments: string[];
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedTo?: number;
  resolution?: string;
  resolutionNotes?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

// ============================================================
// ANALYTICS TYPES
// ============================================================

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  todayOrders: number;
  todayRevenue: number;
  monthOrders: number;
  monthRevenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  commission: number;
}

export interface TopPerformer {
  id: number;
  name: string;
  type: "restaurant" | "food";
  revenue: number;
  orders: number;
  rating: number;
  growth: number;
}

export interface AnalyticsReport {
  id: number;
  reportName: string;
  reportType: "daily" | "weekly" | "monthly" | "custom";
  startDate: string;
  endDate: string;
  data: Record<string, any>;
  generatedAt: string;
  generatedBy: number;
}

// ============================================================
// FILTER & PAGINATION TYPES
// ============================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FilterOptions {
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  [key: string]: any;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}

// ============================================================
// EXPORT ALL TYPES
// ============================================================
