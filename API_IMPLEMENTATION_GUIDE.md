# FoodValy Backend API Implementation Guide

Version: `v1`
Base path: `/api/v1`

This document is intended for frontend integration and for sharing with another Copilot instance. It describes the current implemented backend contract, request/response formats, permissions, validations, and integration notes.

## 1. Architecture Overview

The backend is organized as a REST API with a single public version prefix:

- `/api/v1/auth` for authentication-related operations.
- `/api/v1/users` for current non-admin user routes.
- `/api/v1/admin` for all admin-panel operations.

The current implementation follows these principles:

- JSON request and response bodies.
- JWT access-token based authorization for protected endpoints.
- Role-based access control for admin routes.
- Centralized error handling.
- Consistent request correlation via `x-request-id`.
- Pagination support for list endpoints.
- Audit logging for sensitive admin actions.

Important implementation note:

- Core admin data modules such as users, products, restaurants, reviews, reports, categories, and activity logs are backed by Prisma/PostgreSQL.
- Some content and promotion modules are currently implemented with an in-memory store until dedicated Prisma models are added. These endpoints are available for frontend integration now, but they are not yet durable production persistence.

## 2. Authentication and Authorization Design

### 2.1 Current auth routes

Implemented auth endpoints:

- `POST /api/v1/auth/create-customer`
- `POST /api/v1/auth/create-provider`
- `POST /api/v1/auth/login`

### 2.2 Login behavior

`POST /api/v1/auth/login` returns:

- `accessToken`
- `refreshToken`
- `token` from Better Auth session login
- `user`

The backend auth middleware accepts:

- `Authorization: Bearer <accessToken>` header, or
- `accessToken` cookie

Recommended frontend behavior:

- Store the access token securely.
- Send the access token in the `Authorization` header for admin APIs.
- Keep the refresh token for future refresh flow support.

### 2.3 Role model

Current role enum in the backend:

- `ADMIN`
- `PROVIDER`
- `CUSTOMER`

Admin route protection currently allows only `ADMIN`.

### 2.4 Permission model

Permissions are enforced per admin module. The implemented permission groups are:

- `users.read`
- `users.update`
- `users.ban`
- `roles.read`
- `roles.update`
- `activity.read`
- `products.read`
- `products.write`
- `categories.read`
- `categories.write`
- `stock.write`
- `restaurants.read`
- `restaurants.write`
- `restaurants.moderate`
- `analytics.read`
- `reviews.read`
- `reviews.moderate`
- `reports.read`
- `reports.resolve`
- `content.read`
- `content.write`
- `promotions.read`
- `promotions.write`
- `settings.read`
- `settings.write`
- `security.read`
- `security.write`

## 3. Global Standards

### 3.1 URL conventions

- Use plural resource names.
- Use nested sub-resources only for lifecycle or state actions.
- Use explicit action endpoints only for non-CRUD transitions such as ban, approve, publish, activate, suspend, launch, or revoke.

Examples:

- `/api/v1/admin/users`
- `/api/v1/admin/users/:id/ban`
- `/api/v1/admin/campaigns/:id/launch`

### 3.2 Request format

All request bodies must be JSON unless the endpoint is a file upload endpoint in the future.

Unknown fields should be rejected by validation for write endpoints.

### 3.3 Success response envelope

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [],
  "meta": {
    "requestId": "uuid",
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 3.4 Error response envelope

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "email",
        "message": "Invalid email address"
      }
    ]
  },
  "meta": {
    "requestId": "uuid",
    "path": "/api/v1/admin/users",
    "timestamp": "2026-04-18T12:00:00.000Z"
  }
}
```

### 3.5 Error codes

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `RESOURCE_NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

### 3.6 Recommended status codes

- `200 OK` for successful reads and updates
- `201 Created` for successful creates and bans
- `204 No Content` for deletes
- `401 Unauthorized` for missing or invalid token
- `403 Forbidden` for insufficient role/permission
- `404 Not Found` for missing resources
- `409 Conflict` for duplicate or invalid state transition
- `422 Unprocessable Entity` for validation failures

### 3.7 Pagination, filtering, sorting, search

Supported list query pattern:

- `page`
- `limit`
- `search`
- `sortBy`
- `sortOrder`

Example:

`GET /api/v1/admin/users?page=1&limit=20&search=rahim&sortBy=createdAt&sortOrder=desc`

Rules:

- Default `page = 1`
- Default `limit = 20`
- Maximum `limit = 100`
- `sortOrder` must be `asc` or `desc`

### 3.8 Naming conventions

- JSON fields use `camelCase`.
- IDs are UUID strings.
- Dates are ISO-8601 UTC strings.
- Boolean fields use `isX` or `hasX`.

## 4. Module-by-Module API Reference

### 4.1 Auth Module

#### 4.1.1 Create customer

- Path: `POST /api/v1/auth/create-customer`
- Auth: public
- Purpose: create a customer account

Request body:

```json
{
  "name": "Rahim Uddin",
  "email": "rahim@example.com",
  "password": "StrongPass123!"
}
```

Validation:

- `name`: required, string, min 2, max 80
- `email`: required, valid email
- `password`: required, strong password recommended

Success response:

```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": "uuid",
    "name": "Rahim Uddin",
    "email": "rahim@example.com"
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

Common errors:

- `422` validation error
- `409` email already exists

#### 4.1.2 Create provider

- Path: `POST /api/v1/auth/create-provider`
- Auth: public
- Purpose: create a provider account with restaurant profile

Request body:

```json
{
  "password": "StrongPass123!",
  "user": {
    "name": "Provider Name",
    "email": "provider@example.com",
    "role": "PROVIDER"
  },
  "restaurant": {
    "restaurantName": "Food House",
    "city": "Dhaka",
    "address": "House 12, Road 5",
    "contactNumber": "+8801XXXXXXXXX",
    "cuisine": "Fast Food",
    "openingHours": "10:00-22:00",
    "logo": "https://cdn.example.com/logo.png",
    "coverImage": "https://cdn.example.com/cover.png",
    "foodCategories": ["uuid-category-1", "uuid-category-2"]
  }
}
```

Validation:

- provider `user.role` must be `PROVIDER`
- restaurant fields required: `restaurantName`, `city`, `address`
- category UUIDs must exist if provided

#### 4.1.3 Login

- Path: `POST /api/v1/auth/login`
- Auth: public
- Purpose: authenticate and issue tokens

Request body:

```json
{
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "token": "better-auth-session-token",
    "user": {
      "id": "uuid",
      "name": "Admin",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

Common errors:

- `401` invalid credentials
- `403` blocked account
- `410` deleted account

### 4.2 Admin Users Module

#### 4.2.1 List users

- Path: `GET /api/v1/admin/users`
- Permission: `users.read`

Query params:

- `page`
- `limit`
- `search`
- `role`
- `status`
- `sortBy`
- `sortOrder`

Example response `data` item:

```json
{
  "id": "uuid",
  "name": "Rahim Uddin",
  "email": "rahim@example.com",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "isDeleted": false,
  "emailVerified": false,
  "deletedAt": null,
  "image": null,
  "needPasswordReset": false,
  "createdAt": "2026-04-18T12:00:00.000Z",
  "updatedAt": "2026-04-18T12:00:00.000Z"
}
```

#### 4.2.2 Get user by id

- Path: `GET /api/v1/admin/users/:id`
- Permission: `users.read`

#### 4.2.3 Update user

- Path: `PATCH /api/v1/admin/users/:id`
- Permission: `users.update`

Request body fields:

- `name` optional, min 2 max 80
- `image` optional, valid URL
- `status` optional, enum value

Sample:

```json
{
  "name": "Updated Name",
  "status": "ACTIVE"
}
```

#### 4.2.4 Ban user

- Path: `POST /api/v1/admin/users/:id/ban`
- Permission: `users.ban`

Request body:

```json
{
  "reason": "Fraudulent activity detected"
}
```

#### 4.2.5 Unban user

- Path: `POST /api/v1/admin/users/:id/unban`
- Permission: `users.ban`

Request body:

```json
{
  "reason": "Issue resolved"
}
```

#### 4.2.6 Banned users

- Path: `GET /api/v1/admin/banned-users`
- Permission: `users.read`

#### 4.2.7 Roles list

- Path: `GET /api/v1/admin/roles`
- Permission: `roles.read`

#### 4.2.8 Assign user role

- Path: `PATCH /api/v1/admin/users/:id/role`
- Permission: `roles.update`

Request body:

```json
{
  "role": "PROVIDER"
}
```

#### 4.2.9 Activity logs

- Path: `GET /api/v1/admin/activity-logs`
- Permission: `activity.read`

Query params:

- `page`
- `limit`
- `action`

### 4.3 Catalog Module

#### 4.3.1 Categories list

- Path: `GET /api/v1/admin/categories`
- Permission: `categories.read`

#### 4.3.2 Create category

- Path: `POST /api/v1/admin/categories`
- Permission: `categories.write`

Request body:

```json
{
  "title": "Burgers",
  "description": "All burger items",
  "icon": "https://cdn.example.com/icon.png",
  "bannerImage": "https://cdn.example.com/banner.png"
}
```

Validation:

- `title`: required, min 2, max 120
- `description`: optional, max 600
- URL fields must be valid URLs

#### 4.3.3 Update category

- Path: `PATCH /api/v1/admin/categories/:id`
- Permission: `categories.write`

#### 4.3.4 Delete category

- Path: `DELETE /api/v1/admin/categories/:id`
- Permission: `categories.write`

#### 4.3.5 Products list

- Path: `GET /api/v1/admin/products`
- Permission: `products.read`

Query params:

- `page`
- `limit`
- `search`
- `categoryId`
- `providerId`
- `sortBy`
- `sortOrder`

#### 4.3.6 Create product

- Path: `POST /api/v1/admin/products`
- Permission: `products.write`

Request body:

```json
{
  "title": "Chicken Burger",
  "description": "Juicy chicken burger",
  "price": 5.99,
  "image": "https://cdn.example.com/product.png",
  "providerId": "uuid",
  "categoryId": "uuid",
  "isAvailable": true
}
```

Validation:

- `title`: required, min 2, max 120
- `price`: positive number
- `providerId`: UUID, must exist
- `categoryId`: UUID, must exist

#### 4.3.7 Update product

- Path: `PATCH /api/v1/admin/products/:id`
- Permission: `products.write`

#### 4.3.8 Delete product

- Path: `DELETE /api/v1/admin/products/:id`
- Permission: `products.write`

#### 4.3.9 Update product stock

- Path: `PATCH /api/v1/admin/products/:id/stock`
- Permission: `stock.write`

Request body:

```json
{
  "isAvailable": false,
  "reason": "Out of stock"
}
```

#### 4.3.10 Out-of-stock products

- Path: `GET /api/v1/admin/stock/out-of-stock`
- Permission: `products.read`

### 4.4 Restaurant Module

#### 4.4.1 Restaurants list

- Path: `GET /api/v1/admin/restaurants`
- Permission: `restaurants.read`

Query params:

- `page`
- `limit`
- `search`
- `city`
- `isActive`
- `isVerified`

#### 4.4.2 Get restaurant by id

- Path: `GET /api/v1/admin/restaurants/:id`
- Permission: `restaurants.read`

#### 4.4.3 Update restaurant

- Path: `PATCH /api/v1/admin/restaurants/:id`
- Permission: `restaurants.write`

#### 4.4.4 Approve restaurant

- Path: `POST /api/v1/admin/restaurants/:id/approve`
- Permission: `restaurants.moderate`

Request body:

```json
{
  "note": "Documents verified"
}
```

#### 4.4.5 Reject restaurant

- Path: `POST /api/v1/admin/restaurants/:id/reject`
- Permission: `restaurants.moderate`

Request body:

```json
{
  "note": "Missing trade license"
}
```

#### 4.4.6 Suspend / unsuspend restaurant

- Paths:
  - `POST /api/v1/admin/restaurants/:id/suspend`
  - `POST /api/v1/admin/restaurants/:id/unsuspend`

### 4.5 Best Sellers Module

- `GET /api/v1/admin/best-sellers/products`
- `GET /api/v1/admin/best-sellers/restaurants`

Permission:

- `analytics.read`

### 4.6 Reviews Module

#### 4.6.1 Reviews list

- Path: `GET /api/v1/admin/reviews`
- Permission: `reviews.read`

Query params:

- `page`
- `limit`
- `rating`
- `search` if added later

#### 4.6.2 Review detail

- Path: `GET /api/v1/admin/reviews/:id`
- Permission: `reviews.read`

#### 4.6.3 Delete review

- Path: `DELETE /api/v1/admin/reviews/:id`
- Permission: `reviews.moderate`

Request body:

```json
{
  "reason": "Abusive language"
}
```

### 4.7 Reports Module

#### 4.7.1 Reports list

- Path: `GET /api/v1/admin/reports`
- Permission: `reports.read`

#### 4.7.2 Report detail

- Path: `GET /api/v1/admin/reports/:id`
- Permission: `reports.read`

#### 4.7.3 Assign report

- Path: `POST /api/v1/admin/reports/:id/assign`
- Permission: `reports.resolve`

Request body:

```json
{
  "assigneeId": "uuid"
}
```

#### 4.7.4 Resolve report

- Path: `POST /api/v1/admin/reports/:id/resolve`
- Permission: `reports.resolve`

Request body:

```json
{
  "note": "Issue resolved and policy applied"
}
```

#### 4.7.5 Reject report

- Path: `POST /api/v1/admin/reports/:id/reject`
- Permission: `reports.resolve`

Request body:

```json
{
  "note": "Insufficient evidence"
}
```

### 4.8 Dashboard and Analytics

#### 4.8.1 Dashboard summary

- Path: `GET /api/v1/admin/dashboard/summary`
- Permission: `analytics.read`

Response includes aggregated counts such as:

- total users
- total restaurants
- total foods
- total orders
- blocked users

#### 4.8.2 Revenue trend

- Path: `GET /api/v1/admin/analytics/revenue-trend`
- Permission: `analytics.read`

The current implementation returns a time-series derived from recent orders.

### 4.9 Admin Profile

#### 4.9.1 Get admin profile

- Path: `GET /api/v1/admin/profile`
- Auth: admin only

#### 4.9.2 Update admin profile

- Path: `PATCH /api/v1/admin/profile`
- Auth: admin only

Request body:

```json
{
  "name": "Admin Name",
  "image": "https://cdn.example.com/avatar.png"
}
```

### 4.10 Content Management

These modules are currently available for frontend integration and use an in-memory store until dedicated tables are added.

#### 4.10.1 Banners

- `GET /api/v1/admin/banners`
- `GET /api/v1/admin/banners/:id`
- `POST /api/v1/admin/banners`
- `PATCH /api/v1/admin/banners/:id`
- `DELETE /api/v1/admin/banners/:id`
- `POST /api/v1/admin/banners/:id/activate`
- `POST /api/v1/admin/banners/:id/deactivate`

Validation example:

- `title`: required, min 2, max 180
- `imageUrl`: required, valid URL
- `position`: required

Sample create request:

```json
{
  "title": "Eid Offer",
  "imageUrl": "https://cdn.example.com/banner.jpg",
  "position": "home_hero",
  "status": "active"
}
```

#### 4.10.2 Blog posts

- `GET /api/v1/admin/blog-posts`
- `GET /api/v1/admin/blog-posts/:id`
- `POST /api/v1/admin/blog-posts`
- `PATCH /api/v1/admin/blog-posts/:id`
- `DELETE /api/v1/admin/blog-posts/:id`
- `POST /api/v1/admin/blog-posts/:id/publish`
- `POST /api/v1/admin/blog-posts/:id/unpublish`

Sample create request:

```json
{
  "title": "Top 10 Ramadan Meals",
  "slug": "top-10-ramadan-meals",
  "summary": "Curated meal ideas",
  "content": "Long content here",
  "status": "draft"
}
```

#### 4.10.3 FAQs

- `GET /api/v1/admin/faqs`
- `GET /api/v1/admin/faqs/:id`
- `POST /api/v1/admin/faqs`
- `PATCH /api/v1/admin/faqs/:id`
- `DELETE /api/v1/admin/faqs/:id`
- `POST /api/v1/admin/faqs/reorder`

Sample create request:

```json
{
  "title": "Delivery FAQ",
  "question": "How long does delivery take?",
  "answer": "Usually 30 to 45 minutes.",
  "category": "delivery",
  "order": 1
}
```

#### 4.10.4 Sliders

- `GET /api/v1/admin/sliders`
- `GET /api/v1/admin/sliders/:id`
- `POST /api/v1/admin/sliders`
- `PATCH /api/v1/admin/sliders/:id`
- `DELETE /api/v1/admin/sliders/:id`

### 4.11 Promotions

#### 4.11.1 Coupons

- `GET /api/v1/admin/coupons`
- `GET /api/v1/admin/coupons/:id`
- `POST /api/v1/admin/coupons`
- `PATCH /api/v1/admin/coupons/:id`
- `DELETE /api/v1/admin/coupons/:id`
- `POST /api/v1/admin/coupons/:id/activate`
- `POST /api/v1/admin/coupons/:id/deactivate`

Sample request:

```json
{
  "title": "Eid Offer",
  "code": "EID25",
  "type": "percentage",
  "value": 25,
  "startsAt": "2026-04-20T00:00:00.000Z",
  "endsAt": "2026-04-27T23:59:59.000Z",
  "status": "draft"
}
```

#### 4.11.2 Events

- `GET /api/v1/admin/events`
- `GET /api/v1/admin/events/:id`
- `POST /api/v1/admin/events`
- `PATCH /api/v1/admin/events/:id`
- `DELETE /api/v1/admin/events/:id`
- `POST /api/v1/admin/events/:id/publish`

#### 4.11.3 Discounts

- `GET /api/v1/admin/discounts`
- `GET /api/v1/admin/discounts/:id`
- `POST /api/v1/admin/discounts`
- `PATCH /api/v1/admin/discounts/:id`
- `DELETE /api/v1/admin/discounts/:id`
- `POST /api/v1/admin/discounts/:id/deactivate`

#### 4.11.4 Campaigns

- `GET /api/v1/admin/campaigns`
- `GET /api/v1/admin/campaigns/:id`
- `POST /api/v1/admin/campaigns`
- `PATCH /api/v1/admin/campaigns/:id`
- `DELETE /api/v1/admin/campaigns/:id`
- `POST /api/v1/admin/campaigns/:id/launch`
- `POST /api/v1/admin/campaigns/:id/pause`

### 4.12 Website Settings

- `GET /api/v1/admin/settings/site`
- `PATCH /api/v1/admin/settings/site`

Sample request:

```json
{
  "siteName": "FoodValy",
  "supportEmail": "support@foodvaly.com",
  "defaultCurrency": "BDT",
  "maintenanceMode": false
}
```

### 4.13 Security Settings

- `GET /api/v1/admin/security/policies`
- `PATCH /api/v1/admin/security/policies`
- `GET /api/v1/admin/security/sessions`
- `POST /api/v1/admin/security/sessions/:sessionId/revoke`

Sample policy update:

```json
{
  "passwordMinLength": 10,
  "passwordRequireSymbols": true,
  "sessionTtlMinutes": 10080,
  "ipAllowList": ["127.0.0.1"]
}
```

## 5. Validation Rules

### 5.1 Global write validation

- Reject unknown fields.
- Validate UUIDs strictly.
- Validate all dates as ISO-8601 strings.
- Enforce max list sizes for bulk operations.

### 5.2 Entity-specific rules

Users:

- `name`: 2-80 characters
- `image`: valid URL

Categories:

- `title`: 2-120 characters

Products:

- `price > 0`
- `providerId` and `categoryId` must exist

Restaurants:

- `restaurantName`: 2-180 characters
- `city`: 2-100 characters

Coupons:

- `code`: uppercase, 4-20 chars, unique
- `startsAt < endsAt`
- `value`: positive

Content items:

- titles max 180 chars
- URLs must be valid

Security settings:

- password min length in the range 8-64
- session TTL bounded

## 6. Error Handling Patterns

### 6.1 Common cases

- `401` token missing or invalid
- `403` permission denied
- `404` resource missing
- `409` duplicate or invalid transition
- `422` validation failure

### 6.2 Example validation error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "email",
        "message": "Invalid email address"
      }
    ]
  },
  "meta": {
    "requestId": "uuid",
    "path": "/api/v1/auth/create-customer",
    "timestamp": "2026-04-18T12:00:00.000Z"
  }
}
```

## 7. Audit Logging

Sensitive admin actions are logged, including:

- user update, ban, unban, and role assignment
- product/category/restaurant mutation
- review delete and report resolution
- settings and security changes
- content and promotion actions

Each audit event includes:

- actor id
- actor role
- action
- target type
- target id
- request id
- IP and user agent when available

## 8. Security Best Practices Checklist

- Send JWT access token in the `Authorization` header.
- Keep refresh token handling server-side or in a secure cookie strategy.
- Use `x-request-id` for tracing.
- Apply rate limiting to login and security endpoints.
- Audit all sensitive actions.
- Validate and sanitize all write requests.
- Restrict admin APIs to admin roles only.

## 9. Sample Frontend Integration Flow

### 9.1 Login flow

1. Call `POST /api/v1/auth/login`.
2. Save `accessToken`.
3. Attach `Authorization: Bearer <accessToken>` on every admin request.
4. Read user role from the login response.

### 9.2 Admin API call example

Request:

```http
GET /api/v1/admin/users?page=1&limit=20 HTTP/1.1
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## 10. What is live now vs planned next

Live now:

- Admin user management
- Role assignment
- Activity logs
- Catalog and restaurant admin
- Moderation and reports
- Dashboard summary and revenue trend
- Admin profile
- Content, promotions, settings, and security endpoints

Planned next for production hardening:

- Persist content/promotion/settings/security modules in Prisma/PostgreSQL tables
- Add refresh-token rotation endpoints
- Add logout and session revoke flow for auth
- Add file upload endpoints for images and avatars
- Add OpenAPI YAML generation from code

## 11. Frontend Integration Notes

- Use the `data` field as the primary payload.
- Use `meta.page`, `meta.limit`, `meta.total`, and `meta.totalPages` for paginated views.
- For mutation endpoints, treat `201` and `200` as success.
- For delete endpoints, treat `204` as success even when the body is empty.
- Always inspect `error.code` on failures.
