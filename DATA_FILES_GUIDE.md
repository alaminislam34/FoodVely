# 📊 JSON Data Files Guide

## Overview
All data for the admin dashboard is stored in JSON files in the `public/data/` folder. These files can be easily fetched from the frontend and updated as needed.

## Available Data Files

### 1. **users.json**
Location: `public/data/users.json`

Contains user account data:
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer | restaurant | delivery",
      "status": "active | suspended | banned",
      "joinDate": "2024-01-15",
      "orders": 45,
      "verified": true,
      "image": "👤"
    }
  ]
}
```

**Usage Pages:**
- `/admin/users` - User Management
- `/admin/user-roles` - Role Assignment

---

### 2. **products.json**
Location: `public/data/products.json`

Contains product catalog data:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "price": 12.99,
      "category": "Pizza",
      "restaurant": "Italian Kitchen",
      "stock": 45,
      "orders": 1250,
      "rating": 4.8,
      "emoji": "🍕"
    }
  ]
}
```

**Usage Pages:**
- `/admin/products` - Product Management
- `/admin/categories` - Category Management
- `/admin/best-sellers` - Top Products

---

### 3. **restaurants.json**
Location: `public/data/restaurants.json`

Contains restaurant partner data:
```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "Italian Kitchen",
      "city": "New York",
      "phone": "+1-800-123-4567",
      "rating": 4.8,
      "status": "active | pending | suspended",
      "verified": true,
      "orders": 2450,
      "openingHours": "10:00 AM - 11:00 PM",
      "cuisine": "Italian",
      "image": "🍝"
    }
  ]
}
```

**Usage Pages:**
- `/admin/restaurants` - Restaurant Management

---

### 4. **reviews.json**
Location: `public/data/reviews.json`

Contains customer review data:
```json
{
  "reviews": [
    {
      "id": 1,
      "productName": "Margherita Pizza",
      "authorName": "John Doe",
      "rating": 5,
      "helpfulCount": 234,
      "comment": "Absolutely delicious!",
      "date": "2024-12-20",
      "reported": false,
      "status": "published | flagged",
      "image": "🍕"
    }
  ]
}
```

**Usage Pages:**
- `/admin/reviews` - Review Moderation

---

### 5. **coupons.json**
Location: `public/data/coupons.json`

Contains promotion and coupon data:
```json
{
  "coupons": [
    {
      "id": 1,
      "code": "SAVE20",
      "type": "percentage | fixed",
      "value": 20,
      "maxUses": 1000,
      "usedCount": 312,
      "minOrder": 25,
      "validFrom": "2024-12-01",
      "validUntil": "2024-12-31",
      "active": true,
      "description": "20% off on all orders above $25"
    }
  ]
}
```

**Usage Pages:**
- `/admin/coupons` - Coupon Management

---

### 6. **banners.json**
Location: `public/data/banners.json`

Contains website banner data:
```json
{
  "banners": [
    {
      "id": 1,
      "title": "Holiday Special - 30% Off",
      "description": "Get 30% discount",
      "image": "/images/banners/holiday.jpg",
      "position": "top | middle | bottom",
      "status": "active | inactive",
      "clicks": 5420,
      "validFrom": "2024-12-01",
      "validUntil": "2024-12-31",
      "cta": "Shop Now",
      "emoji": "🎄"
    }
  ]
}
```

**Usage Pages:**
- `/admin/banners` - Banner Management

---

### 7. **contacts.json**
Location: `public/data/contacts.json`

Contains customer contact/support data:
```json
{
  "contacts": [
    {
      "id": 1,
      "senderName": "Alice Johnson",
      "senderEmail": "alice@example.com",
      "subject": "Complaint about delivery",
      "message": "My order was delivered 2 hours late...",
      "status": "new | read | replied",
      "priority": "high | low",
      "date": "2024-12-29",
      "response": null
    }
  ]
}
```

**Usage Pages:**
- `/admin/contacts` - Contact Messages

---

### 8. **categories.json**
Location: `public/data/categories.json`

Contains product categories:
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Burgers",
      "slug": "burgers",
      "products": 156,
      "image": "🍔",
      "trending": true,
      "revenue": "$12,450"
    }
  ]
}
```

**Usage Pages:**
- `/admin/categories` - Category Management

---

### 9. **best-sellers.json**
Location: `public/data/best-sellers.json`

Contains top-performing products:
```json
{
  "bestSellers": [
    {
      "id": 1,
      "name": "Spicy Chicken Burger",
      "restaurant": "Burger King",
      "rating": 4.8,
      "reviews": 2450,
      "orders": 15680,
      "revenue": "$78,400",
      "image": "🍔",
      "trend": "+23%"
    }
  ]
}
```

**Usage Pages:**
- `/admin/best-sellers` - Best Sellers

---

### 10. **banned-users.json**
Location: `public/data/banned-users.json`

Contains banned/suspended user data:
```json
{
  "bannedUsers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "reason": "Fraudulent activity",
      "bannedDate": "2024-12-15",
      "banDuration": "Permanent | 30 days",
      "orders": 45
    }
  ]
}
```

**Usage Pages:**
- `/admin/banned-users` - Banned Users

---

### 11. **activity-log.json**
Location: `public/data/activity-log.json`

Contains activity/audit log data:
```json
{
  "activityLog": [
    {
      "id": 1,
      "user": "John Doe",
      "action": "User Banned",
      "description": "Account suspended for fraudulent activity",
      "timestamp": "2 hours ago",
      "severity": "high | medium | low",
      "ip": "192.168.1.1"
    }
  ]
}
```

**Usage Pages:**
- `/admin/activity-log` - Activity Log

---

### 12. **stock.json**
Location: `public/data/stock.json`

Contains out-of-stock product alerts:
```json
{
  "outOfStock": [
    {
      "id": 1,
      "name": "Spicy Chicken Burger",
      "restaurant": "Burger King",
      "sku": "SKU-001",
      "lastOrdered": "2024-12-28",
      "daysOutOfStock": 2,
      "demandedBy": 156,
      "image": "🍔"
    }
  ]
}
```

**Usage Pages:**
- `/admin/stock` - Stock Management

---

### 13. **user-roles.json**
Location: `public/data/user-roles.json`

Contains system role definitions:
```json
{
  "userRoles": [
    {
      "id": 1,
      "name": "Customer",
      "description": "Regular user can order food",
      "permissions": 12,
      "users": 1234
    }
  ]
}
```

**Usage Pages:**
- `/admin/user-roles` - Role Management

---

### 14. **analytics.json**
Location: `public/data/analytics.json`

Contains comprehensive analytics data:
```json
{
  "analytics": {
    "kpis": [...],
    "revenueChart": [...],
    "topPerformers": [...],
    "growthMetrics": [...],
    "additionalStats": [...]
  }
}
```

**Usage Pages:**
- `/admin/analytics` - Analytics Dashboard

---

## How to Fetch Data in Components

### Example 1: Using useEffect Hook
```typescript
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/users.json")
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading users:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Example 2: Using Async/Await
```typescript
async function loadProducts() {
  try {
    const response = await fetch("/data/products.json");
    const data = await response.json();
    setProducts(data.products);
  } catch (error) {
    console.error("Error loading products:", error);
  }
}
```

### Example 3: Custom Hook
```typescript
function useData(filename) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/data/${filename}.json`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [filename]);

  return { data, loading };
}

// Usage:
const { data: restaurants, loading } = useData("restaurants");
```

---

## File Structure
```
public/
└── data/
    ├── users.json
    ├── products.json
    ├── restaurants.json
    ├── reviews.json
    ├── coupons.json
    ├── banners.json
    ├── contacts.json
    ├── categories.json
    ├── best-sellers.json
    ├── banned-users.json
    ├── activity-log.json
    ├── stock.json
    ├── user-roles.json
    └── analytics.json
```

---

## Accessing Data Endpoints

All files are publicly accessible via HTTP:

```
http://localhost:3000/data/users.json
http://localhost:3000/data/products.json
http://localhost:3000/data/restaurants.json
... etc
```

---

## Tips & Best Practices

✅ **Do:**
- Cache data in state to avoid repeated fetches
- Handle loading states
- Handle errors gracefully
- Use TypeScript interfaces for type safety
- Validate data before using

❌ **Don't:**
- Fetch data on every render (use useEffect)
- Ignore loading states
- Hardcode API endpoints
- Store sensitive data in JSON files

---

## Next Steps

1. Update pages to fetch from JSON files
2. Add error handling and loading states
3. Implement caching mechanism
4. Connect to real backend API when ready
5. Add data validation and sanitization

---

**Last Updated:** January 29, 2026  
**Format:** JSON  
**Access:** Public (no authentication required)  
**Update Frequency:** Real-time (update JSON files directly)
