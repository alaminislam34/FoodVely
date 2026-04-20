Provider Dashboard পূর্ণ functional করতে Required API List (Must Have)

Provider Identity and Restaurant Context
GET /api/v1/provider/me
GET /api/v1/provider/restaurant
PATCH /api/v1/provider/restaurant
PATCH /api/v1/provider/restaurant/status (open বা closed toggle)
PATCH /api/v1/provider/restaurant/hours
Provider Dashboard Summary
GET /api/v1/provider/dashboard/summary
todayOrders, todayRevenue, avgPrepTime, avgRating, pendingCount
GET /api/v1/provider/dashboard/active-orders
GET /api/v1/provider/dashboard/top-items
Provider Products
GET /api/v1/provider/products?page=&limit=&search=&categoryId=&stockStatus=&sortBy=&sortOrder=
GET /api/v1/provider/products/:id
POST /api/v1/provider/products
PATCH /api/v1/provider/products/:id
DELETE /api/v1/provider/products/:id
PATCH /api/v1/provider/products/:id/stock
PATCH /api/v1/provider/products/:id/availability
GET /api/v1/provider/categories (dropdown এর জন্য)
Provider Orders and Fulfillment
GET /api/v1/provider/orders?page=&limit=&search=&status=&from=&to=
GET /api/v1/provider/orders/:id
PATCH /api/v1/provider/orders/:id/status
pending → confirmed → preparing → ready → out_for_delivery → delivered
PATCH /api/v1/provider/orders/:id/prep-time
POST /api/v1/provider/orders/:id/cancel
GET /api/v1/provider/orders/live অথবা SSE/WebSocket stream for real-time queue
Provider Reviews
GET /api/v1/provider/reviews?page=&limit=&search=&rating=&productId=
POST /api/v1/provider/reviews/:id/reply
PATCH /api/v1/provider/reviews/:id/reply
DELETE /api/v1/provider/reviews/:id/reply
Provider Coupons and Promotions
GET /api/v1/provider/coupons?page=&limit=&search=&status=
POST /api/v1/provider/coupons
PATCH /api/v1/provider/coupons/:id
DELETE /api/v1/provider/coupons/:id
POST /api/v1/provider/coupons/:id/activate
POST /api/v1/provider/coupons/:id/deactivate
GET /api/v1/provider/coupons/:id/analytics
Provider Reports and Analytics
GET /api/v1/provider/reports/overview?range=daily|weekly|monthly
GET /api/v1/provider/reports/sales?from=&to=&groupBy=day|week|month
GET /api/v1/provider/reports/orders?from=&to=&status=&channel=
GET /api/v1/provider/reports/payment-mix?from=&to=
GET /api/v1/provider/reports/order-heatmap?from=&to=
GET /api/v1/provider/reports/export/sales.csv?from=&to=
GET /api/v1/provider/reports/export/orders.csv?from=&to=
Media Upload (Profile + Product image)
POST /api/v1/uploads/image (signed url বা direct upload)
POST /api/v1/provider/products/:id/images
PATCH /api/v1/provider/restaurant/logo
PATCH /api/v1/provider/restaurant/cover
Notifications (Optional but high value)
GET /api/v1/provider/notifications
PATCH /api/v1/provider/notifications/:id/read
PATCH /api/v1/provider/notifications/read-all
