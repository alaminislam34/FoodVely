# FoodValy Phase 0 - Provider Route Audit

## Existing Provider Routes

- /provider
- /provider/profile
- /provider/products
- /provider/addFood
- /provider/orders
- /provider/reviews
- /provider/coupons
- /provider/overview
- /provider/sales_reports
- /provider/order_reports

## Missing Routes Referenced in UI

- /provider/finance
- /provider/performance
- /provider/menu
- /provider/menu/add

## Dead Link Sources

- src/app/provider/page.tsx
  : daily revenue stat card links to /provider/finance
- src/app/provider/page.tsx
  : avg prep time stat card links to /provider/performance
- src/app/provider/page.tsx
  : quick action add item links to /provider/menu/add
- src/app/provider/page.tsx
  : top menu card footer links to /provider/menu

## Recommended Route Decisions

- Keep canonical naming as kebab-style for consistency.
- Either:
  - Create missing routes directly, or
  - Update links to existing routes (/provider/addFood and /provider/products).

## Phase 0 Completion Criteria

- No unresolved provider links in dashboard entry pages.
- Shared UI primitives available for provider pages.
- Shared list controls and pagination utilities available for provider tables.
