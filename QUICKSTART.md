# Quick Start Guide - Firestore Migration

## What You Need to Know

Your e-store project has been **fully migrated from LocalStorage to Firestore**. Here's what that means:

### Before Migration ❌
- User data → LocalStorage
- Cart items → LocalStorage  
- Addresses → LocalStorage
- Orders → LocalStorage
- ❌ Data lost on browser clear
- ❌ No cloud backup
- ❌ No cross-device sync

### After Migration ✅
- User data → Firestore
- Cart items → Firestore
- Addresses → Firestore
- Orders → Firestore
- ✅ Data persists permanently
- ✅ Cloud backup & security
- ✅ Cross-device sync
- ✅ Real-time analytics

---

## Getting Started

### Step 1: Firestore Setup (One-time)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **e-store-project-24928**
3. Click **Firestore Database** in left menu
4. Click **Create Database**
5. Choose **Production mode**
6. Select a region (closest to your users)
7. Click **Create**

### Step 2: Set Security Rules

1. In Firestore, go to **Rules** tab
2. Replace all content with rules from [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
3. Click **Publish**

### Step 3: Test It Out

1. Open your app in browser
2. **Sign up** at `/signup/index.html`
3. **Sign in** at `/signin/index.html`
4. **Add products to cart**
5. Check Firestore Console → `carts` collection (you should see your data!)
6. **Complete a purchase**
7. Check Firestore Console → `orders` collection

---

## Key Changes in Your Code

### 1. Cart Handling
**Old Code (LocalStorage):**
```javascript
let cart = JSON.parse(localStorage.getItem('cart')) || [];
localStorage.setItem('cart', JSON.stringify(cart));
```

**New Code (Firestore):**
```javascript
import { saveUserCart, getCurrentUser } from '../firebase/firestore.js';

const user = getCurrentUser();
if (user) {
  await saveUserCart(user.id, cart);
}
```

### 2. User Authentication
**Old Code:**
```javascript
let allUsers = JSON.parse(localStorage.getItem('e-store')) || [];
```

**New Code:**
```javascript
import { registerUser, loginUser } from '../firebase/firestore.js';

const user = await registerUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Pass123!'
});
```

### 3. Getting User Data
**Old Code:**
```javascript
const user = JSON.parse(localStorage.getItem('user'));
```

**New Code:**
```javascript
import { getCurrentUser } from '../firebase/firestore.js';

const user = getCurrentUser(); // Already authenticated
```

---

## Files You Should Know About

### New Files
- `firebase/config.js` - Firebase setup
- `firebase/firestore.js` - All database operations
- `MIGRATION_GUIDE.md` - Complete documentation

### Modified Files
```
signin/script.js          ← Authentication
signup/script.js          ← Registration
scripts/script.js         ← Cart & Orders
scripts/landing.js        ← Product Cart
checkout/adress-page/address.js    ← Address Storage
checkout/delivery/delivery.js       ← Address Retrieval
checkout/payment/payment.js         ← Order Creation
dashboard/*.js            ← Analytics & Reports
```

---

## Firestore Collections Explained

### 📦 users
Stores user accounts
```
{
  firstName: "John",
  lastName: "Doe", 
  email: "john@example.com",
  password: "...",
  createdAt: <timestamp>
}
```

### 🛒 carts
Stores user's shopping carts
```
{
  userId: "user123",
  items: [
    { id: "prod1", productName: "Shirt", quantity: 2, price: 5000 }
  ],
  updatedAt: <timestamp>
}
```

### 📍 addresses
Stores delivery addresses
```
{
  userId: "user123",
  firstName: "John",
  lastName: "Doe",
  phone: "08012345678",
  address: "123 Main St",
  additionalInfo: "Gate 2",
  createdAt: <timestamp>
}
```

### 📦 orders
Stores completed orders
```
{
  userId: "user123",
  items: [...],
  totalPrice: 15000,
  reference: "TX-987654321",
  shippingAddress: {...},
  createdAt: <timestamp>
}
```

---

## Testing Checklist

- [ ] User can **sign up** successfully
- [ ] User can **sign in** successfully
- [ ] User can **add products to cart**
- [ ] Cart persists after **refresh** 
- [ ] User can **enter delivery address**
- [ ] User can **complete purchase**
- [ ] Order appears in **Orders list**
- [ ] Dashboard shows **correct analytics**

---

## Troubleshooting

### ❌ "Cannot read property 'id' of null"
**Cause**: User not logged in
**Fix**: Make sure user signs in before adding to cart

### ❌ "Permission denied" errors
**Cause**: Firestore security rules not set
**Fix**: Copy security rules from MIGRATION_GUIDE.md and publish in Firestore console

### ❌ Cart empty after refresh
**Cause**: User logged out or Firestore disabled
**Fix**: Sign in again and check Firestore is running (Firestore Console → green status)

### ❌ "Module not found: ../firebase/firestore.js"
**Cause**: Import path wrong
**Fix**: Check file exists at `firebase/firestore.js` relative to script location

---

## Performance Tips

1. **Cache user data** - Don't fetch on every page load
2. **Use real-time listeners** - For cart and orders pages
3. **Batch writes** - When saving multiple items
4. **Index fields** - For better query performance

Example real-time listener:
```javascript
import { onCartChange } from '../firebase/firestore.js';

const unsubscribe = onCartChange(userId, (items) => {
  console.log('Cart updated:', items);
  renderCart(items);
});

// Stop listening when page closes
window.addEventListener('beforeunload', unsubscribe);
```

---

## Production Checklist

- [ ] Firestore security rules are set correctly
- [ ] Firebase is in **Production mode** (not Development)
- [ ] Custom domain is configured (if using one)
- [ ] Error handling is complete
- [ ] Loading states added to UI
- [ ] Tested on slow network
- [ ] Email validation working
- [ ] Password validation working

---

## Useful Links

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Import/Export Data](https://firebase.google.com/docs/firestore/manage-data/export-import)

---

## FAQ

**Q: Will my old localStorage data migrate automatically?**
A: No, but the app includes fallback to localStorage. You can manually migrate data if needed.

**Q: Can I use Firestore without changing my code?**
A: Yes! The code is backwards compatible. Fallback to localStorage works if Firestore fails.

**Q: Is my password safe?**
A: Currently stored in plain text. For production, use [Firebase Authentication](https://firebase.google.com/docs/auth).

**Q: How much does Firestore cost?**
A: Free tier includes 50k reads/day. See [Firebase Pricing](https://firebase.google.com/pricing).

**Q: Can users access other users' data?**
A: No, security rules prevent it. Users can only access their own data.

---

**You're all set! 🚀 Your e-store is now running on Firestore!**

For detailed documentation, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
