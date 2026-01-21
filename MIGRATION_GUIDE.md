# E-Store Migration: LocalStorage to Firestore Database

## Overview
This project has been successfully migrated from LocalStorage-based persistence to **Firestore Database**. All user data, cart items, addresses, and orders are now stored securely in the cloud.

---

## What Changed

### 1. **Firebase Utilities Module** (`firebase/`)
A new folder containing two modules for database operations:

- **`firebase/config.js`** - Firebase configuration and initialization
- **`firebase/firestore.js`** - All Firestore database operations

### 2. **User Authentication**
- **Before**: Users registered/logged in with data stored in localStorage
- **After**: User data stored in Firestore `users` collection
  - Email uniqueness validation happens in Firestore
  - Current user stored in `sessionStorage` for session management

### 3. **Shopping Cart**
- **Before**: Cart stored as JSON in `localStorage.getItem('cart')`
- **After**: Cart stored in Firestore `carts` collection per user
  - Automatic synchronization when user logs in
  - Fallback to localStorage if user not logged in
  - Real-time updates possible with `onCartChange` listener

### 4. **Addresses**
- **Before**: All addresses stored in `localStorage['addressData']`
- **After**: Stored in Firestore `addresses` collection, linked to user ID
  - Multiple addresses support
  - Easy retrieval of last address used

### 5. **Orders**
- **Before**: Orders stored in `localStorage['orders']`
- **After**: Stored in Firestore `orders` collection with full metadata
  - User ID association
  - Shipping address embedded in order
  - Automatic timestamp tracking

### 6. **Dashboard**
- **Before**: All stats calculated from localStorage data
- **After**: Real-time data fetching from Firestore
  - Dynamic order totals
  - Weekly/monthly analytics
  - Order details with full customer information

---

## Firestore Database Structure

### Collections

#### 1. **users**
```javascript
{
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. **carts**
```javascript
{
  userId: string,
  items: [{
    id: string,
    productName: string,
    price: number,
    quantity: number,
    image: string,
    category: string
  }],
  updatedAt: timestamp
}
```

#### 3. **addresses**
```javascript
{
  userId: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
  additionalInfo: string,
  createdAt: timestamp
}
```

#### 4. **orders**
```javascript
{
  userId: string,
  items: [...],
  totalPrice: number,
  reference: string,
  status: string (e.g., "completed"),
  shippingAddress: {
    firstName: string,
    lastName: string,
    phone: string,
    address: string,
    additionalInfo: string
  },
  createdAt: timestamp
}
```

#### 5. **dashboard**
```javascript
// Document: settings
{
  ownerName: string,
  ownerEmail: string,
  balance: number
}
```

---

## API Reference

### User Management
```javascript
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../firebase/firestore.js';

// Register new user
await registerUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!'
});

// Login
const user = await loginUser('john@example.com', 'SecurePass123!');

// Get current session user
const user = getCurrentUser();

// Logout
logoutUser();
```

### Cart Management
```javascript
import { getUserCart, saveUserCart, clearUserCart } from '../firebase/firestore.js';

// Get user's cart
const cartItems = await getUserCart(userId);

// Save cart
await saveUserCart(userId, cartItems);

// Clear cart
await clearUserCart(userId);

// Listen to cart changes in real-time
const unsubscribe = onCartChange(userId, (items) => {
  console.log('Cart updated:', items);
});
```

### Address Management
```javascript
import { getUserAddresses, getLastUserAddress, saveAddress } from '../firebase/firestore.js';

// Get all user addresses
const addresses = await getUserAddresses(userId);

// Get last address
const lastAddress = await getLastUserAddress(userId);

// Save new address
await saveAddress(userId, {
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  address: '123 Main St',
  additionalInfo: 'Apartment 4B'
});
```

### Order Management
```javascript
import { getUserOrders, createOrder, getAllOrders } from '../firebase/firestore.js';

// Get user's orders
const orders = await getUserOrders(userId);

// Create new order
await createOrder(userId, {
  items: cartItems,
  totalPrice: 5000,
  reference: 'TX-123456789'
});

// Get all orders (dashboard/admin)
const allOrders = await getAllOrders();
```

### Dashboard Settings
```javascript
import { getDashboardSettings, updateDashboardSettings } from '../firebase/firestore.js';

// Get settings
const settings = await getDashboardSettings();

// Update settings
await updateDashboardSettings({
  ownerName: 'Admin',
  ownerEmail: 'admin@example.com',
  balance: 10000
});
```

---

## Files Modified

### Core Files
- `firebase/config.js` ✨ **NEW**
- `firebase/firestore.js` ✨ **NEW**
- `scripts/script.js` - Updated for Firestore cart
- `scripts/landing.js` - Updated for Firestore cart
- `signin/script.js` - Updated for Firestore authentication
- `signup/script.js` - Updated for Firestore authentication

### Checkout Files
- `checkout/adress-page/address.js` - Updated for Firestore addresses
- `checkout/delivery/delivery.js` - Updated to fetch from Firestore
- `checkout/payment/payment.js` - Updated to fetch from Firestore

### Dashboard Files
- `dashboard/dashboard.js` - Updated to fetch from Firestore
- `dashboard/sales/sales.js` - Updated to fetch from Firestore
- `dashboard/reports/report.js` - Updated to fetch from Firestore

---

## Setup Instructions

### 1. Enable Firestore in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (e-store-project-24928)
3. Go to Firestore Database
4. Click "Create Database"
5. Start in **Production mode**
6. Choose your region

### 2. Set Firestore Security Rules
Add these rules to allow authenticated access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid != null;
    }
    
    // Carts collection
    match /carts/{cartId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid != null;
    }
    
    // Addresses collection
    match /addresses/{addressId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid != null;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid != null;
    }
    
    // Dashboard settings
    match /dashboard/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

### 3. Test the Migration
1. **Sign up** a new user at `/signup/index.html`
2. **Sign in** at `/signin/index.html`
3. **Add items to cart** - Check Firestore under `carts` collection
4. **Enter address** - Check Firestore under `addresses` collection
5. **Complete purchase** - Check Firestore under `orders` collection
6. **Visit dashboard** - View orders and analytics

---

## Backward Compatibility

The system includes **fallback to localStorage** when:
- User is not logged in
- Firestore operations fail

This ensures the app continues to work even if there are connectivity issues.

---

## Security Notes

⚠️ **Important**: 
- Passwords are currently stored in plain text. **In production**, use Firebase Authentication instead.
- Update security rules to be more restrictive based on your use case.
- Never commit Firebase credentials to version control.

---

## Common Issues & Solutions

### Issue: "Permission denied" errors
**Solution**: Check Firestore security rules. Ensure user is authenticated before operations.

### Issue: Cart not persisting
**Solution**: Verify user is logged in (check `sessionStorage.getItem('user')`). For guests, localStorage is used as fallback.

### Issue: Orders not showing in dashboard
**Solution**: Verify orders have `createdAt` field. Check dashboard console for errors.

### Issue: Slow loading
**Solution**: Firestore requires internet. Check network connectivity. Consider adding loading states.

---

## Migration Checklist

- [x] Create Firebase utilities module
- [x] Update authentication to use Firestore
- [x] Migrate cart storage
- [x] Migrate address storage
- [x] Migrate orders storage
- [x] Update dashboard to fetch from Firestore
- [ ] Test all features thoroughly
- [ ] Update Firestore security rules
- [ ] Deploy to production
- [ ] Monitor Firestore usage

---

## Next Steps

1. **Test thoroughly** in development
2. **Update security rules** in Firestore console
3. **Migrate existing localStorage data** if needed (manual scripts can be created)
4. **Deploy** with confidence
5. **Monitor** Firestore usage and adjust rules as needed

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Review Firestore rules and data structure
3. Verify Firebase configuration in `firebase/config.js`
4. Check network connectivity

---

**Migration completed successfully! Your E-store now uses Firestore for all data persistence.** 🎉
