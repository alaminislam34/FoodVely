"use client";

import { Component } from "react";
import RestaurantCard from "@/app/ui/ProviderCard";

const providers = [
  {
    id: "prov_101",
    name: "FoodVally Kitchen",
    slug: "FoodVally-kitchen",
    description: "Best homemade food with authentic Bangla taste.",
    owner: {
      name: "Rahim Uddin",
      phone: "017XXXXXXXX",
      email: "FoodVally@gmail.com",
    },
    location: {
      address: "Dhanmondi 27, Dhaka",
      city: "Dhaka",
      lat: 23.7465,
      lng: 90.376,
    },
    categories: ["Biriyani", "Chicken", "Rice Bowls"],
    images: {
      logo: "/images/providers/FoodVally-logo.png",
      cover: "/images/providers/covers/FoodVelyKitchen.jpg",
    },
    rating: { average: 4.6, totalReviews: 320 },
    delivery: {
      isAvailable: true,
      deliveryTime: "30-45 min",
      deliveryFee: 60,
      minimumOrder: 300,
    },
    openingHours: { open: "10:00 AM", close: "11:00 PM", isOpenNow: true },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 48, totalOrders: 1250 },
    createdAt: "2025-01-12T10:30:00Z",
    updatedAt: "2025-01-20T08:15:00Z",
  },

  {
    id: "prov_102",
    name: "Burger Bros",
    slug: "burger-bros",
    description: "Juicy burgers with fresh ingredients.",
    owner: {
      name: "Tanvir Hasan",
      phone: "018XXXXXXXX",
      email: "burgerbros@gmail.com",
    },
    location: {
      address: "Mirpur 10, Dhaka",
      city: "Dhaka",
      lat: 23.8069,
      lng: 90.3687,
    },
    categories: ["Burgers", "Fries"],
    images: {
      logo: "/images/providers/burgerbros-logo.png",
      cover: "/images/providers/covers/GrillHouse.jpg",
    },
    rating: { average: 4.4, totalReviews: 210 },
    delivery: {
      isAvailable: true,
      deliveryTime: "25-35 min",
      deliveryFee: 50,
      minimumOrder: 250,
    },
    openingHours: { open: "11:00 AM", close: "12:00 AM", isOpenNow: true },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 22, totalOrders: 860 },
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-01-22T06:30:00Z",
  },

  {
    id: "prov_103",
    name: "Pizza Point",
    slug: "pizza-point",
    description: "Hot & cheesy pizza delivered fast.",
    owner: {
      name: "Sabbir Ahmed",
      phone: "019XXXXXXXX",
      email: "pizzapoint@gmail.com",
    },
    location: {
      address: "Banani 11, Dhaka",
      city: "Dhaka",
      lat: 23.7936,
      lng: 90.4043,
    },
    categories: ["Pizza", "Pasta"],
    images: {
      logo: "/images/providers/pizzapoint-logo.png",
      cover: "/images/providers/covers/PizzaPoint.jpg",
    },
    rating: { average: 4.5, totalReviews: 410 },
    delivery: {
      isAvailable: true,
      deliveryTime: "30-40 min",
      deliveryFee: 70,
      minimumOrder: 400,
    },
    openingHours: { open: "12:00 PM", close: "11:30 PM", isOpenNow: false },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 30, totalOrders: 1540 },
    createdAt: "2024-12-18T11:20:00Z",
    updatedAt: "2025-01-19T10:10:00Z",
  },

  {
    id: "prov_104",
    name: "Chinese Wok",
    slug: "chinese-wok",
    description: "Authentic Chinese & Thai flavors.",
    owner: {
      name: "Li Wong",
      phone: "016XXXXXXXX",
      email: "chinesewok@gmail.com",
    },
    location: {
      address: "Uttara Sector 7, Dhaka",
      city: "Dhaka",
      lat: 23.8738,
      lng: 90.3983,
    },
    categories: ["Chinese", "Thai"],
    images: {
      logo: "/images/providers/chinesewok-logo.png",
      cover: "/images/providers/covers/SweetTooth.jpg",
    },
    rating: { average: 4.3, totalReviews: 190 },
    delivery: {
      isAvailable: true,
      deliveryTime: "35-50 min",
      deliveryFee: 80,
      minimumOrder: 350,
    },
    openingHours: { open: "11:30 AM", close: "10:30 PM", isOpenNow: true },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 40, totalOrders: 720 },
    createdAt: "2025-01-02T14:00:00Z",
    updatedAt: "2025-01-21T09:40:00Z",
  },

  {
    id: "prov_105",
    name: "Healthy Bites",
    slug: "healthy-bites",
    description: "Fresh, healthy & diet-friendly meals.",
    owner: {
      name: "Nusrat Jahan",
      phone: "015XXXXXXXX",
      email: "healthybites@gmail.com",
    },
    location: {
      address: "Gulshan 2, Dhaka",
      city: "Dhaka",
      lat: 23.7925,
      lng: 90.4078,
    },
    categories: ["Healthy", "Salads", "Vegan"],
    images: {
      logo: "/images/providers/healthybites-logo.png",
      cover: "/images/providers/covers/BurgerBros.jpg",
    },
    rating: { average: 4.7, totalReviews: 150 },
    delivery: {
      isAvailable: true,
      deliveryTime: "30-45 min",
      deliveryFee: 60,
      minimumOrder: 300,
    },
    openingHours: { open: "8:00 AM", close: "9:00 PM", isOpenNow: true },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 18, totalOrders: 540 },
    createdAt: "2025-01-10T07:45:00Z",
    updatedAt: "2025-01-23T08:00:00Z",
  },

  {
    id: "prov_106",
    name: "Sweet Tooth",
    slug: "sweet-tooth",
    description: "Desserts, cakes & ice cream.",
    owner: {
      name: "Farhana Islam",
      phone: "014XXXXXXXX",
      email: "sweettooth@gmail.com",
    },
    location: {
      address: "Mohammadpur, Dhaka",
      city: "Dhaka",
      lat: 23.759,
      lng: 90.3612,
    },
    categories: ["Desserts", "Cakes", "Ice Cream"],
    images: {
      logo: "/images/providers/sweettooth-logo.png",
      cover: "/images/providers/covers/CafeMocha.png",
    },
    rating: { average: 4.8, totalReviews: 500 },
    delivery: {
      isAvailable: true,
      deliveryTime: "20-30 min",
      deliveryFee: 40,
      minimumOrder: 200,
    },
    openingHours: { open: "10:00 AM", close: "10:00 PM", isOpenNow: true },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 35, totalOrders: 2100 },
    createdAt: "2024-12-01T09:30:00Z",
    updatedAt: "2025-01-24T12:00:00Z",
  },

  {
    id: "prov_107",
    name: "Grill House",
    slug: "grill-house",
    description: "BBQ, grilled chicken & steak.",
    owner: {
      name: "Imran Khan",
      phone: "013XXXXXXXX",
      email: "grillhouse@gmail.com",
    },
    location: {
      address: "Bashundhara R/A, Dhaka",
      city: "Dhaka",
      lat: 23.8151,
      lng: 90.4285,
    },
    categories: ["Grill", "BBQ", "Steak"],
    images: {
      logo: "/images/providers/grillhouse-logo.png",
      cover: "/images/providers/covers/ChineseWok.jpg",
    },
    rating: { average: 4.5, totalReviews: 260 },
    delivery: {
      isAvailable: true,
      deliveryTime: "40-55 min",
      deliveryFee: 90,
      minimumOrder: 500,
    },
    openingHours: { open: "4:00 PM", close: "12:00 AM", isOpenNow: false },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 26, totalOrders: 680 },
    createdAt: "2024-11-20T16:00:00Z",
    updatedAt: "2025-01-18T18:20:00Z",
  },

  {
    id: "prov_108",
    name: "Cafe Mocha",
    slug: "cafe-mocha",
    description: "Coffee, snacks & breakfast items.",
    owner: {
      name: "Samiul Karim",
      phone: "012XXXXXXXX",
      email: "cafemocha@gmail.com",
    },
    location: {
      address: "Baily Road, Dhaka",
      city: "Dhaka",
      lat: 23.7356,
      lng: 90.3993,
    },
    categories: ["Coffee", "Snacks", "Breakfast"],
    images: {
      logo: "/images/providers/cafemocha-logo.png",
      cover: "/images/providers/covers/HealthyBites.jpg",
    },
    rating: { average: 4.2, totalReviews: 180 },
    delivery: {
      isAvailable: true,
      deliveryTime: "20-30 min",
      deliveryFee: 40,
      minimumOrder: 200,
    },
    openingHours: { open: "7:30 AM", close: "9:30 PM", isOpenNow: true },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 20, totalOrders: 430 },
    createdAt: "2025-01-08T06:30:00Z",
    updatedAt: "2025-01-25T07:10:00Z",
  },

  {
    id: "prov_109",
    name: "Street Khaoa",
    slug: "street-khaoa",
    description: "Popular Bangladeshi street food.",
    owner: {
      name: "Kamal Mia",
      phone: "011XXXXXXXX",
      email: "streetkhaoa@gmail.com",
    },
    location: {
      address: "Old Dhaka",
      city: "Dhaka",
      lat: 23.7182,
      lng: 90.3885,
    },
    categories: ["Street Food", "Snacks"],
    images: {
      logo: "/images/providers/streetkhaoa-logo.png",
      cover: "/images/providers/covers/CafeMocha.jpg",
    },
    rating: { average: 4.1, totalReviews: 300 },
    delivery: {
      isAvailable: true,
      deliveryTime: "35-45 min",
      deliveryFee: 50,
      minimumOrder: 150,
    },
    openingHours: { open: "5:00 PM", close: "11:00 PM", isOpenNow: true },
    status: { isVerified: false, isActive: true, isSuspended: false },
    stats: { totalFoods: 15, totalOrders: 980 },
    createdAt: "2024-10-15T17:00:00Z",
    updatedAt: "2025-01-17T19:30:00Z",
  },

  {
    id: "prov_110",
    name: "Seafood Hub",
    slug: "seafood-hub",
    description: "Fresh fish & seafood dishes.",
    owner: {
      name: "Abdul Jalil",
      phone: "010XXXXXXXX",
      email: "seafoodhub@gmail.com",
    },
    location: {
      address: "Chittagong Road, Dhaka",
      city: "Dhaka",
      lat: 23.685,
      lng: 90.5076,
    },
    categories: ["Seafood", "Fish"],
    images: {
      logo: "/images/providers/seafoodhub-logo.png",
      cover: "/images/providers/covers/CafeMocha.jpg",
    },
    rating: { average: 4.6, totalReviews: 140 },
    delivery: {
      isAvailable: true,
      deliveryTime: "45-60 min",
      deliveryFee: 100,
      minimumOrder: 600,
    },
    openingHours: { open: "12:00 PM", close: "10:00 PM", isOpenNow: false },
    status: { isVerified: true, isActive: true, isSuspended: false },
    stats: { totalFoods: 24, totalOrders: 390 },
    createdAt: "2024-12-28T12:15:00Z",
    updatedAt: "2025-01-26T11:45:00Z",
  },
];

export class PopularProvider extends Component {
  render() {
    return (
      <div className="py-12">
        <div className="py-6 mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-Sofia">
            Popular Restaurants
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {providers.slice(0, 8).map((item) => (
            <RestaurantCard key={item.id} provider={item} />
          ))}
        </div>
      </div>
    );
  }
}

export default PopularProvider;
