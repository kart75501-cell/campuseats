# CampusEats Admin Dashboard Guide

## Accessing the Admin Dashboard

### Student Website
- URL: `http://localhost:8000` or `http://localhost:8000/index.html`
- This is the student-facing ordering system

### Admin Dashboard
- URL: `http://localhost:8000/admin.html`
- Or click "Admin Login" in the footer of the student website

### Admin Login Credentials
- **Username:** admin
- **Password:** admin123

## Features

### 1. Dashboard Overview
- View real-time statistics:
  - Total Orders
  - Pending Orders
  - Preparing Orders
  - Ready for Pickup
  - Completed Orders
  - Total Revenue
- Visual charts showing orders by status and revenue
- Recent orders table

### 2. Order Management
- View all student orders
- Filter by status (All, New, Preparing, Ready, Completed)
- Search by Order ID, Student Name, or Roll Number
- View detailed order information
- Update order status (Order Placed → Preparing → Ready for Pickup → Completed)

### 3. Menu Management
- View all menu items
- Add new menu items
- Edit existing items (name, category, description, price, image)
- Delete menu items
- Mark items as Available/Unavailable (Sold Out)
- Filter by category and availability

## Synchronization

The admin dashboard and student website synchronize in real-time using:
- **BroadcastChannel API** for same-browser tab synchronization
- **Storage events** as backup synchronization method

### How it works:
1. Student places an order → Appears in Admin Dashboard
2. Admin updates order status → Student sees updated status in My Orders
3. Admin changes menu → Student website reflects changes immediately

**Important:** This synchronization works between browser tabs in the same browser session. It does NOT synchronize across different devices or different users over the internet (this is a frontend-only demonstration).

## Testing the Complete Workflow

### Step 1: Open Student Website
1. Open `http://localhost:8000` in one browser tab
2. Browse the menu, add items to cart
3. Place an order with student details

### Step 2: Open Admin Dashboard
1. Open `http://localhost:8000/admin.html` in another tab
2. Login with admin/admin123
3. Go to "Orders" section
4. Verify the new order appears

### Step 3: Update Order Status
1. Click "Update" on the order
2. Change status to "Preparing"
3. Go back to student tab and check "My Orders"
4. Verify status shows "Preparing"

### Step 4: Mark Ready
1. In admin dashboard, update status to "Ready for Pickup"
2. Check student "My Orders" - should show "Ready for Pickup"

### Step 5: Complete Order
1. Update status to "Completed"
2. Verify in both admin and student views

### Step 6: Test Menu Management
1. In admin dashboard, go to "Menu"
2. Add a new menu item
3. Go to student website and verify it appears
4. Mark an item as "Unavailable"
5. Verify student cannot add it to cart (shows "Sold Out")

## File Structure

```
college-canteen/
├── index.html          # Student website
├── style.css           # Student website styles
├── script.js           # Student website logic
├── admin.html          # Admin dashboard
├── admin.css           # Admin dashboard styles
├── admin.js            # Admin dashboard logic
└── assets/
    └── images/         # Image directories
```

## Data Storage

All data is stored in browser localStorage:
- `campuseats_cart` - Shopping cart
- `campuseats_orders` - Order history
- `campuseats_menu` - Menu items
- `campuseats_admin_logged_in` - Admin session

Data persists across browser refreshes but is specific to each browser/device.

## Security Notes

- This is a demonstration/prototype system
- Login is NOT production-grade (username/password hardcoded)
- No real authentication or encryption
- Do not use in production without proper security measures
- All data is stored locally in the browser

## Browser Compatibility

Works in modern browsers that support:
- BroadcastChannel API
- localStorage
- ES6 JavaScript

Tested in: Chrome, Firefox, Edge, Safari
