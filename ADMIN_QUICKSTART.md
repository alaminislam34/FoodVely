# 🚀 Admin Dashboard - Quick Start Guide

## Access the Admin Dashboard

Navigate to: **`http://localhost:3000/admin`**

---

## 📊 Dashboard Pages Overview

### 1️⃣ **Dashboard** (`/admin`)
**What you see:**
- 4 main KPI cards (Users, Products, Restaurants, Revenue)
- Recent activity feed (last 4 activities)
- Quick action buttons (Add Product, Add Restaurant, Create Banner, Create Coupon)
- Top 4 best-selling products
- Top 4 performing restaurants

**Use for:** Quick overview of platform status

---

### 2️⃣ **Users Management** (`/admin/users`)
**Features:**
- ✅ Search by name or email
- ✅ Filter by status: Active, Suspended, Banned
- ✅ Filter by role: Customer, Restaurant, Admin
- ✅ View user details (name, email, role, join date, orders)
- ✅ Actions: View, Manage roles (shield icon), Ban, Delete, More options

**Best for:** Managing user accounts, handling violations

**Status Badges:**
- 🟢 Active - User can access platform
- 🟡 Suspended - Temporary restriction
- 🔴 Banned - Permanent restriction

---

### 3️⃣ **Products Management** (`/admin/products`)
**Features:**
- ✅ Card-based layout showing all products
- ✅ Search products by name
- ✅ View stock status (shows "Out of Stock" warning)
- ✅ Performance metrics (orders, rating)
- ✅ Price display with gradient styling
- ✅ Actions: Edit, Delete

**Best for:** Managing product catalog, tracking best sellers

**Info shown:**
- Product image (placeholder)
- Category badge
- Star rating
- Stock level
- Order count
- Price

---

### 4️⃣ **Restaurants Management** (`/admin/restaurants`)
**Features:**
- ✅ Search by restaurant name or city
- ✅ Filter by status: All, Active, Pending Verification, Suspended
- ✅ Restaurant cards showing key info
- ✅ Contact info and operating hours
- ✅ Verification status indicator

**Actions by Status:**
- **Pending**: ✓ Verify button (approve restaurant)
- **Active**: ⏸ Suspend button (pause operations)
- **Suspended**: Manual action needed
- **All**: Edit, Delete

**Best for:** Onboarding restaurants, handling violations

---

### 5️⃣ **Reviews & Feedback** (`/admin/reviews`)
**Features:**
- ✅ Search by product or reviewer name
- ✅ Filter by star rating (1-5 stars)
- ✅ Filter by status: All, Normal, Reported
- ✅ Shows full review content
- ✅ Helpful count tracking
- ✅ Reported content highlighted in red

**Actions:**
- 👁️ View details
- 💬 Message reviewer (for reported content)
- 🗑️ Delete review
- 👍 Track helpful votes

**Best for:** Monitoring quality, handling fake/inappropriate reviews

---

### 6️⃣ **Coupons & Promotions** (`/admin/coupons`)
**Features:**
- ✅ Create new coupons
- ✅ Search by coupon code
- ✅ Filter: Active, Inactive coupons
- ✅ Shows discount type (percentage or fixed amount)
- ✅ Visual usage progress bars
- ✅ Copy coupon code to clipboard
- ✅ Summary stats (active count, total redeemed, savings)

**Columns:**
| Column | Shows |
|--------|-------|
| Code | SAVE20, FLAT10, etc. |
| Discount | 20%, $10 |
| Usage | 342/500 (with progress bar) |
| Min Order | Minimum purchase required |
| Valid Until | Expiration date |
| Status | Active/Expired |
| Actions | Edit/Delete |

**Best for:** Running promotions, tracking discount usage

---

### 7️⃣ **Website Banners** (`/admin/banners`)
**Features:**
- ✅ Add promotional banners
- ✅ Card layout with banner previews
- ✅ Position tags (Top, Middle, Bottom)
- ✅ Status badges (Active/Inactive)
- ✅ Click tracking
- ✅ Validity date display
- ✅ Enable/Disable without deleting
- ✅ Edit and Delete options

**Banner Info:**
- Title and description
- Click count
- Valid until date
- Position on homepage

**Best for:** Running campaigns, promoting special events

---

### 8️⃣ **Contact Messages** (`/admin/contacts`)
**Features:**
- ✅ Two-column layout (messages list + details)
- ✅ Search by sender name or subject
- ✅ Filter: All, New, Read, Replied
- ✅ Priority indicators (⚠️ Urgent flag)
- ✅ Quick reply interface
- ✅ Message status tracking

**Message Actions:**
- View full message
- Send reply directly
- Mark as read
- Delete message
- Flag as urgent

**Best for:** Customer support, partnership inquiries

---

### 9️⃣ **Platform Analytics** (`/admin/analytics`)
**Features:**
- ✅ 4 KPI metrics (Revenue, Orders, Users, Products)
- ✅ 6-month revenue & order chart
- ✅ Top performers ranking (restaurants + products)
- ✅ Growth metrics with percentage bars
- ✅ Performance indicators (AOV, retention, rating)

**Sections:**
- **KPI Cards**: Current metrics with growth percentages
- **Trends Chart**: Visual revenue and order data
- **Top Performers**: Ranked by revenue with growth rates
- **Growth Metrics**: User, Revenue, Order, and Partner growth
- **Key Stats**: AOV, retention rate, platform rating

**Best for:** Understanding business performance, reporting to stakeholders

---

### 🔟 **Profile Settings** (`/admin/profile`)
**Features:**
- ✅ Update personal info (name, email, phone)
- ✅ Profile picture upload
- ✅ Bio editing
- ✅ Account information display
- ✅ Security settings (password, 2FA, sessions)
- ✅ Danger zone (delete account)

**Best for:** Managing your admin account

---

## 🎯 Common Tasks

### ✅ Ban a Problematic User
1. Go to `/admin/users`
2. Search for the user
3. Click the ban icon (🚫) in their row
4. Confirm action

### ✅ Verify a New Restaurant
1. Go to `/admin/restaurants`
2. Filter by "Pending Verification"
3. Click the "✓ Verify" button on the restaurant card
4. Restaurant becomes active

### ✅ Suspend a Restaurant
1. Go to `/admin/restaurants`
2. Find the restaurant
3. Click the "⏸ Suspend" button
4. Restaurant goes offline

### ✅ Create a Promotional Coupon
1. Go to `/admin/coupons`
2. Click "Create Coupon" button
3. Fill in code, discount, validity dates
4. Save and activate

### ✅ Add a Website Banner
1. Go to `/admin/banners`
2. Click "Add Banner" button
3. Upload image, enter title/description
4. Choose position (top/middle/bottom)
5. Set dates and save

### ✅ Reply to Customer Message
1. Go to `/admin/contacts`
2. Click on a message in the list
3. Type your reply in the text area
4. Click "Send Reply"
5. Message marked as "Replied"

### ✅ Track Best Performers
1. Go to `/admin/analytics`
2. Scroll to "Top Performers" section
3. See ranked restaurants and products
4. View their revenue and growth

---

## 🎨 Design Features

### Color Meanings
- 🟢 **Green**: Active, approved, success
- 🟡 **Yellow**: Warning, pending, caution
- 🔴 **Red**: Danger, banned, critical
- 🔵 **Blue**: Info, new, neutral

### Icons & Symbols
- ✓ - Approved / Active
- ⏸ - Suspended / Paused
- ⚠️ - Warning / Urgent
- 👁️ - View details
- ✏️ - Edit
- 🗑️ - Delete
- ⭐ - Ratings
- 📈 - Growth / Trending

### Responsive Design
- **Mobile (< 640px)**: Single column, collapsed sidebar
- **Tablet (640-1024px)**: Two columns, sliding sidebar
- **Desktop (> 1024px)**: Three+ columns, fixed sidebar

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/admin` | Go to dashboard |
| Tab | Navigate elements |
| Enter | Submit/Click button |
| Esc | Close modals/sidebars |

---

## 🔐 Permissions Guide

| Role | Permissions |
|------|------------|
| **Super Admin** | All access to all sections |
| **Moderator** | Users, Reviews, Contacts, Banners |
| **Analyst** | Read-only Analytics and Reports |
| **Support** | Contacts, Users (view only) |

---

## 📱 Mobile Navigation

**On Mobile:**
1. Click menu button ☰ in top-left
2. Sidebar slides in from left
3. Tap any menu item to navigate
4. Tap outside or ✕ to close sidebar
5. Click links to expand submenus

---

## 🐛 Troubleshooting

### "Sidebar won't open on mobile"
- Clear browser cache
- Refresh the page
- Check if JavaScript is enabled

### "Data not loading"
- Check your internet connection
- Try refreshing the page
- Check if backend API is running

### "Animations are slow"
- Close other tabs/applications
- Clear browser cache
- Update your browser

---

## 💡 Tips & Tricks

1. **Search First**: Always search for specific items before browsing
2. **Use Filters**: Combine filters for precise results
3. **Hover for Info**: Hover over elements to see tooltips
4. **Keyboard Nav**: Use Tab to navigate without mouse
5. **Quick Actions**: Use gradient buttons on dashboard for fastest access

---

## 📞 Need Help?

- **Dashboard Issues**: Check browser console (F12)
- **Data Problems**: Verify API connection
- **Design Questions**: Check ADMIN_DASHBOARD_DOCUMENTATION.md
- **Feature Requests**: Contact development team

---

**Happy Managing! 🎉**

For complete documentation, see: [ADMIN_DASHBOARD_DOCUMENTATION.md](./ADMIN_DASHBOARD_DOCUMENTATION.md)
