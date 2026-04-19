import { Category, Product } from "@/types/product";

export type CatalogCategoryCard = Category & {
  emoji: string;
  description: string;
  productCount: number;
  featured: boolean;
};

const baseCategories: Category[] = [
  { id: "cat-burgers", title: "Burgers", slug: "burgers" },
  { id: "cat-pizza", title: "Pizza", slug: "pizza" },
  { id: "cat-sushi", title: "Sushi", slug: "sushi" },
  { id: "cat-desserts", title: "Desserts", slug: "desserts" },
  { id: "cat-beverages", title: "Beverages", slug: "beverages" },
  { id: "cat-salads", title: "Salads", slug: "salads" },
];

export const catalogCategories = baseCategories;

export const catalogProducts: Product[] = [
  {
    id: "food_01",
    name: "Classic Chicken Burger",
    slug: "classic-chicken-burger",
    description:
      "Grilled chicken burger with lettuce, tomato, and creamy mayo.",
    shortDescription: "Juicy chicken burger",
    price: 250,
    discountPrice: 220,
    currency: "BDT",
    images: [
      "/images/burger1.png",
      "/images/burger2.png",
      "/images/Spaghetti.jpg",
    ],
    thumbnail: "/images/burger1.png",
    category: baseCategories[0],
    provider: {
      id: "res_001",
      name: "Burger Bros",
      slug: "burger-bros",
      logo: "/images/providers/covers/BurgerBros.jpg",
      rating: 4.5,
    },
    rating: { average: 4.5, totalReviews: 210 },
    foodInfo: {
      isVeg: false,
      isSpicy: false,
      calories: 520,
      preparationTime: 15,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 60,
    },
    tags: ["burger", "chicken", "fast-food"],
    isFeatured: true,
    isBestSeller: true,
    seo: {
      metaTitle: "Classic Chicken Burger | FoodValy",
      metaDescription: "Order the classic chicken burger from FoodValy.",
      keywords: ["burger", "chicken burger", "food delivery"],
    },
    createdAt: "2025-01-08T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "food_02",
    name: "Pepperoni Pizza",
    slug: "pepperoni-pizza",
    description:
      "Wood-fired pizza topped with pepperoni, mozzarella, and herbs.",
    shortDescription: "Cheesy pepperoni pizza",
    price: 690,
    discountPrice: 590,
    currency: "BDT",
    images: ["/images/pizza1.png", "/images/pizza2.png", "/images/pizza3.png"],
    thumbnail: "/images/pizza1.png",
    category: baseCategories[1],
    provider: {
      id: "res_003",
      name: "Pizza Point",
      slug: "pizza-point",
      logo: "/images/providers/covers/PizzaPoint.jpg",
      rating: 4.6,
    },
    rating: { average: 4.8, totalReviews: 324 },
    foodInfo: {
      isVeg: false,
      isSpicy: false,
      calories: 810,
      preparationTime: 20,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 32,
    },
    tags: ["pizza", "pepperoni", "cheese"],
    isFeatured: true,
    isBestSeller: true,
    seo: {
      metaTitle: "Pepperoni Pizza | FoodValy",
      metaDescription: "Hot and fresh pepperoni pizza delivered fast.",
      keywords: ["pizza", "pepperoni pizza", "food delivery"],
    },
    createdAt: "2025-01-11T00:00:00.000Z",
    updatedAt: "2025-01-18T00:00:00.000Z",
  },
  {
    id: "food_03",
    name: "Beef Biryani",
    slug: "beef-biryani",
    description:
      "Slow-cooked beef biryani with fragrant basmati rice and rich spices.",
    shortDescription: "Rich beef biryani",
    price: 400,
    discountPrice: 370,
    currency: "BDT",
    images: ["/images/Spaghetti.jpg", "/images/beef-biryani1.png"],
    thumbnail: "/images/beef-biryani1.png",
    category: {
      ...baseCategories[0],
      id: "cat-biryani",
      title: "Biryani",
      slug: "biryani",
    },
    provider: {
      id: "res_004",
      name: "FoodValy Kitchen",
      slug: "foodvaly-kitchen",
      logo: "/images/providers/covers/BurgerBros.jpg",
      rating: 4.7,
    },
    rating: { average: 4.7, totalReviews: 180 },
    foodInfo: {
      isVeg: false,
      isSpicy: true,
      calories: 680,
      preparationTime: 35,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 40,
    },
    tags: ["biryani", "beef", "spicy"],
    isFeatured: true,
    isBestSeller: true,
    seo: {
      metaTitle: "Beef Biryani | FoodValy",
      metaDescription: "Order delicious beef biryani online from FoodValy.",
      keywords: ["beef biryani", "bangladeshi food"],
    },
    createdAt: "2025-01-08T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "food_04",
    name: "Dragon Sushi Platter",
    slug: "dragon-sushi-platter",
    description: "Fresh sushi rolls with avocado, salmon, and wasabi mayo.",
    shortDescription: "Fresh sushi platter",
    price: 820,
    discountPrice: 750,
    currency: "BDT",
    images: ["/images/sushi1.png", "/images/sushi2.png", "/images/sushi3.png"],
    thumbnail: "/images/sushi1.png",
    category: baseCategories[2],
    provider: {
      id: "res_005",
      name: "Tokyo Bites",
      slug: "tokyo-bites",
      logo: "/images/providers/covers/SushiBar.jpg",
      rating: 4.8,
    },
    rating: { average: 4.9, totalReviews: 150 },
    foodInfo: {
      isVeg: false,
      isSpicy: false,
      calories: 560,
      preparationTime: 25,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 18,
    },
    tags: ["sushi", "salmon", "japanese"],
    isFeatured: true,
    isBestSeller: false,
    seo: {
      metaTitle: "Dragon Sushi Platter | FoodValy",
      metaDescription: "Fresh sushi platter with premium ingredients.",
      keywords: ["sushi", "platter", "food delivery"],
    },
    createdAt: "2025-01-16T00:00:00.000Z",
    updatedAt: "2025-01-24T00:00:00.000Z",
  },
  {
    id: "food_05",
    name: "Chocolate Lava Cake",
    slug: "chocolate-lava-cake",
    description:
      "Warm chocolate cake with a molten center and vanilla ice cream.",
    shortDescription: "Molten lava dessert",
    price: 220,
    discountPrice: 190,
    currency: "BDT",
    images: ["/images/cake1.png", "/images/cake2.png"],
    thumbnail: "/images/cake1.png",
    category: baseCategories[3],
    provider: {
      id: "res_006",
      name: "Sweet Spot",
      slug: "sweet-spot",
      logo: "/images/providers/covers/SweetSpot.jpg",
      rating: 4.6,
    },
    rating: { average: 4.7, totalReviews: 98 },
    foodInfo: {
      isVeg: true,
      isSpicy: false,
      calories: 410,
      preparationTime: 12,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 26,
    },
    tags: ["dessert", "chocolate", "cake"],
    isFeatured: false,
    isBestSeller: true,
    seo: {
      metaTitle: "Chocolate Lava Cake | FoodValy",
      metaDescription: "Rich chocolate lava cake with creamy ice cream.",
      keywords: ["dessert", "cake", "sweet"],
    },
    createdAt: "2025-01-09T00:00:00.000Z",
    updatedAt: "2025-01-19T00:00:00.000Z",
  },
  {
    id: "food_06",
    name: "Mango Lassi",
    slug: "mango-lassi",
    description:
      "Creamy yogurt drink blended with ripe mangoes and a hint of cardamom.",
    shortDescription: "Refreshing mango drink",
    price: 140,
    discountPrice: 120,
    currency: "BDT",
    images: ["/images/drink1.png", "/images/drink2.png"],
    thumbnail: "/images/drink1.png",
    category: baseCategories[4],
    provider: {
      id: "res_001",
      name: "Burger Bros",
      slug: "burger-bros",
      logo: "/images/providers/covers/BurgerBros.jpg",
      rating: 4.5,
    },
    rating: { average: 4.4, totalReviews: 76 },
    foodInfo: {
      isVeg: true,
      isSpicy: false,
      calories: 180,
      preparationTime: 8,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 42,
    },
    tags: ["drink", "mango", "refreshing"],
    isFeatured: false,
    isBestSeller: false,
    seo: {
      metaTitle: "Mango Lassi | FoodValy",
      metaDescription: "Cool off with a fresh mango lassi.",
      keywords: ["mango lassi", "drink", "beverage"],
    },
    createdAt: "2025-01-10T00:00:00.000Z",
    updatedAt: "2025-01-20T00:00:00.000Z",
  },
  {
    id: "food_07",
    name: "Caesar Salad",
    slug: "caesar-salad",
    description:
      "Crisp romaine lettuce with parmesan, croutons, and creamy dressing.",
    shortDescription: "Fresh garden salad",
    price: 260,
    discountPrice: 230,
    currency: "BDT",
    images: ["/images/salad1.png", "/images/salad2.png"],
    thumbnail: "/images/salad1.png",
    category: baseCategories[5],
    provider: {
      id: "res_007",
      name: "Green Bowl",
      slug: "green-bowl",
      logo: "/images/providers/covers/HealthyBowl.jpg",
      rating: 4.3,
    },
    rating: { average: 4.5, totalReviews: 84 },
    foodInfo: {
      isVeg: true,
      isSpicy: false,
      calories: 290,
      preparationTime: 10,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 35,
    },
    tags: ["salad", "healthy", "fresh"],
    isFeatured: false,
    isBestSeller: false,
    seo: {
      metaTitle: "Caesar Salad | FoodValy",
      metaDescription: "A light and fresh salad for everyday meals.",
      keywords: ["salad", "healthy food", "fresh meals"],
    },
    createdAt: "2025-01-13T00:00:00.000Z",
    updatedAt: "2025-01-21T00:00:00.000Z",
  },
  {
    id: "food_08",
    name: "Spicy Fried Rice",
    slug: "spicy-fried-rice",
    description:
      "Stir-fried rice with vegetables, egg, and a bold chili finish.",
    shortDescription: "Quick spicy rice bowl",
    price: 310,
    discountPrice: 280,
    currency: "BDT",
    images: ["/images/rice1.png", "/images/rice2.png"],
    thumbnail: "/images/rice1.png",
    category: baseCategories[0],
    provider: {
      id: "res_004",
      name: "FoodValy Kitchen",
      slug: "foodvaly-kitchen",
      logo: "/images/providers/covers/BurgerBros.jpg",
      rating: 4.7,
    },
    rating: { average: 4.6, totalReviews: 126 },
    foodInfo: {
      isVeg: false,
      isSpicy: true,
      calories: 640,
      preparationTime: 18,
    },
    availability: {
      status: "active",
      isAvailable: true,
      stock: 28,
    },
    tags: ["rice", "spicy", "quick meal"],
    isFeatured: true,
    isBestSeller: false,
    seo: {
      metaTitle: "Spicy Fried Rice | FoodValy",
      metaDescription: "A bold and satisfying fried rice meal.",
      keywords: ["fried rice", "spicy food", "quick meal"],
    },
    createdAt: "2025-01-14T00:00:00.000Z",
    updatedAt: "2025-01-24T00:00:00.000Z",
  },
];

const categoryCardMeta: Record<
  string,
  { emoji: string; description: string; featured: boolean }
> = {
  burgers: {
    emoji: "🍔",
    description: "Juicy grilled and crispy burger picks.",
    featured: true,
  },
  pizza: {
    emoji: "🍕",
    description: "Freshly baked slices and cheesy crusts.",
    featured: true,
  },
  sushi: {
    emoji: "🍣",
    description: "Clean, premium, and fresh rolls.",
    featured: true,
  },
  desserts: {
    emoji: "🍰",
    description: "Sweet endings and indulgent treats.",
    featured: true,
  },
  beverages: {
    emoji: "🥤",
    description: "Cold drinks, shakes, and lassi.",
    featured: false,
  },
  salads: {
    emoji: "🥗",
    description: "Light bowls for balanced meals.",
    featured: false,
  },
  biryani: {
    emoji: "🍛",
    description: "Fragrant rice dishes and rich spices.",
    featured: true,
  },
};

const buildCategoryCounts = () => {
  return catalogProducts.reduce<Record<string, number>>((counts, product) => {
    const slug = product.category.slug.toLowerCase();
    counts[slug] = (counts[slug] ?? 0) + 1;
    return counts;
  }, {});
};

const categoryCounts = buildCategoryCounts();

export const catalogCategoryCards: CatalogCategoryCard[] = [
  ...catalogCategories,
  { id: "cat-biryani", title: "Biryani", slug: "biryani" },
].map((category) => {
  const meta = categoryCardMeta[category.slug] ?? {
    emoji: "🍽️",
    description: "Curated food picks for every craving.",
    featured: false,
  };

  return {
    ...category,
    emoji: meta.emoji,
    description: meta.description,
    featured: meta.featured,
    productCount: categoryCounts[category.slug] ?? 0,
  };
});

export const featuredCatalogProducts = catalogProducts.filter(
  (product) => product.isFeatured || product.isBestSeller,
);

export const catalogStats = {
  products: catalogProducts.length,
  categories: catalogCategoryCards.length,
  featured: featuredCatalogProducts.length,
  bestSellers: catalogProducts.filter((product) => product.isBestSeller).length,
};

export function getCatalogProducts() {
  return catalogProducts;
}

export function getCatalogCategories() {
  return catalogCategoryCards;
}

export function getFeaturedCatalogProducts(limit = 6) {
  return featuredCatalogProducts.slice(0, limit);
}

export function getProductsByCategory(categorySlug: string) {
  const normalizedSlug = categorySlug.trim().toLowerCase();
  if (!normalizedSlug) {
    return catalogProducts;
  }

  return catalogProducts.filter(
    (product) => product.category.slug.toLowerCase() === normalizedSlug,
  );
}

export function searchCatalogProducts(query: string, categorySlug?: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const scopedProducts = categorySlug
    ? getProductsByCategory(categorySlug)
    : catalogProducts;

  if (!normalizedQuery) {
    return scopedProducts;
  }

  return scopedProducts.filter((product) => {
    const searchableText = [
      product.name,
      product.description,
      product.shortDescription,
      product.category.title,
      product.provider.name,
      ...(product.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getProductBySlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return catalogProducts.find(
    (product) => product.slug.toLowerCase() === normalizedSlug,
  );
}

export function getProductById(id: string) {
  const normalizedId = id.trim();
  return catalogProducts.find((product) => product.id === normalizedId);
}

export function getProductsByIds(ids: string[]) {
  const idSet = new Set(ids.map((id) => id.trim()));
  return catalogProducts.filter((product) => idSet.has(product.id));
}
