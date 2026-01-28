export type Provider = {
  id: string;
  name: string;
  slug: string;
  description: string;

  owner: {
    name: string;
    phone: string;
    email: string;
  };

  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };

  categories: string[]; // e.g., ["Burgers", "Pizza"]

  images: {
    logo: string;
    cover: string;
  };

  rating: {
    average: number; // e.g., 4.6
    totalReviews: number;
  };

  delivery: {
    isAvailable: boolean;
    deliveryTime: string; // e.g., "30-45 min"
    deliveryFee: number;
    minimumOrder: number;
  };

  openingHours: {
    open: string; // "10:00 AM"
    close: string; // "11:00 PM"
    isOpenNow: boolean;
  };

  status: {
    isVerified: boolean;
    isActive: boolean;
    isSuspended: boolean;
  };

  stats: {
    totalFoods: number;
    totalOrders: number;
  };

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
