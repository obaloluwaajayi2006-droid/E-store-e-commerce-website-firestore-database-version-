# Firestore Setup Checklist

Complete this checklist to finalize your Firestore migration.

---

## ✅ Pre-Setup Requirements

- [ ] Have access to [Firebase Console](https://console.firebase.google.com)
- [ ] Firebase project created: **e-store-project-24928**
- [ ] Browser with latest version installed
- [ ] Firestore files in place:
  - `firebase/config.js`
  - `firebase/firestore.js`

---

## 🗄️ Step 1: Create Firestore Database

1. [ ] Open [Firebase Console](https://console.firebase.google.com)
2. [ ] Click your project: **e-store-project-24928**
3. [ ] In left sidebar, click **Firestore Database**
4. [ ] Click **Create Database**
5. [ ] Select **Production mode** (recommended for security)
6. [ ] Click **Next**
7. [ ] Select your region:
   - [ ] Africa (South Africa) - `africa-south1`
   - [ ] Europe (London) - `europe-west2`
   - [ ] Asia (India) - `asia-south1`
   - Or closest to your users
8. [ ] Click **Enable**
9. [ ] Wait for database to initialize (2-3 minutes)

---

## 🔐 Step 2: Configure Security Rules

### 2.1 Navigate to Rules Tab
1. [ ] In Firestore, click **Rules** tab (at top)
2. [ ] You should see current rules

### 2.2 Replace Rules
1. [ ] Delete all existing rules
2. [ ] Copy these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read/write users (for signup/signin)
    match /users/{userId} {
      allow read, write: if request.auth.uid != null;
    }
    
    // Users can read/write their own cart
    match /carts/{cartId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid != null;
    }
    
    // Users can read/write their own addresses
    match /addresses/{addressId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid != null;
    }
    
    // Users can read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid != null;
    }
    
    // Dashboard settings accessible to all authenticated users
    match /dashboard/{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

3. [ ] Paste into the editor
4. [ ] Click **Publish**
5. [ ] Confirm when prompted
6. [ ] Wait for deployment (usually instant)

---

## 🗂️ Step 3: Create Collections (Optional)

Firestore auto-creates collections when you add documents, but you can pre-create them:

### 3.1 Create Users Collection
1. [ ] In Firestore, click **Start collection**
2. [ ] Collection ID: `users`
3. [ ] Click **Next**
4. [ ] Skip document ID (auto-generated)
5. [ ] Click **Create**

Repeat for:
- [ ] Collection: `carts`
- [ ] Collection: `addresses`
- [ ] Collection: `orders`
- [ ] Collection: `dashboard`

---

## 🧪 Step 4: Test the Setup

### 4.1 Sign Up Test
1. [ ] Open app in browser: `http://localhost:3000/` (or your local URL)
2. [ ] Navigate to `/signup/index.html`
3. [ ] Fill in form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
4. [ ] Click **Create Account**
5. [ ] Should redirect to sign in
6. [ ] Check Firestore Console → Collections → `users` → Should see your user

### 4.2 Sign In Test
1. [ ] Navigate to `/signin/index.html`
2. [ ] Enter email: `test@example.com`
3. [ ] Enter password: `TestPass123!`
4. [ ] Click **Sign In**
5. [ ] Should redirect to home page
6. [ ] Check browser console → Should see user object

### 4.3 Cart Test
1. [ ] On home page, add 2-3 items to cart
2. [ ] Check Firestore Console → Collections → `carts`
3. [ ] Should see document with your items
4. [ ] Refresh page → Cart should still have items
5. [ ] Go to `/cart/index.html` → Items should display

### 4.4 Address Test
1. [ ] Go to `/checkout/adress-page/address.html`
2. [ ] Fill in form:
   - First Name: `John`
   - Last Name: `Doe`
   - Phone: `08012345678`
   - Address: `123 Main Street`
   - Additional Info: `Apartment 4B`
3. [ ] Click **Save**
4. [ ] Check Firestore → `addresses` collection
5. [ ] Should see your address document

### 4.5 Order Test
1. [ ] Complete the checkout process
2. [ ] Confirm payment
3. [ ] Check Firestore → `orders` collection
4. [ ] Should see order document with:
   - Items array
   - Total price
   - Reference number
   - Shipping address
   - Created timestamp

### 4.6 Dashboard Test
1. [ ] After creating an order, go to `/dashboard/index.html`
2. [ ] Should see:
   - [ ] Total Revenue calculated
   - [ ] Monthly Revenue shown
   - [ ] Order in recent orders table
   - [ ] Sales chart displaying data

---

## 🔍 Step 5: Verify Data Structure

### 5.1 Check Users Collection
```
users/
└── {auto-generated-id}
    ├── firstName: "John"
    ├── lastName: "Doe"
    ├── email: "john@example.com"
    ├── password: "TestPass123!"
    ├── createdAt: timestamp
    └── updatedAt: timestamp
```
- [ ] Verify structure looks correct

### 5.2 Check Carts Collection
```
carts/
└── {auto-generated-id}
    ├── userId: "user-123"
    ├── items: [
    │   {
    │     id: "prod-1",
    │     productName: "Shirt",
    │     price: 5000,
    │     quantity: 2,
    │     image: "...",
    │     category: "shirt"
    │   }
    │ ]
    └── updatedAt: timestamp
```
- [ ] Verify structure looks correct

### 5.3 Check Addresses Collection
```
addresses/
└── {auto-generated-id}
    ├── userId: "user-123"
    ├── firstName: "John"
    ├── lastName: "Doe"
    ├── phone: "08012345678"
    ├── address: "123 Main Street"
    ├── additionalInfo: "Apt 4B"
    └── createdAt: timestamp
```
- [ ] Verify structure looks correct

### 5.4 Check Orders Collection
```
orders/
└── {auto-generated-id}
    ├── userId: "user-123"
    ├── items: [...]
    ├── totalPrice: 15000
    ├── reference: "TX-987654321"
    ├── status: "completed"
    ├── shippingAddress: {...}
    └── createdAt: timestamp
```
- [ ] Verify structure looks correct

---

## 🚨 Step 6: Verify Security Rules

### Test Unauthenticated Access (Should FAIL)
1. [ ] Open browser DevTools → Console
2. [ ] Try this code:
```javascript
import { db } from '../firebase/config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js';

const querySnapshot = await getDocs(collection(db, 'users'));
// Should throw: "Missing or insufficient permissions"
```
3. [ ] Should get permission denied error ✓

### Test Authenticated Access (Should SUCCEED)
1. [ ] Sign in first
2. [ ] Try same code again
3. [ ] Should return user data ✓

---

## 📊 Step 7: Monitor & Optimize

### 7.1 Check Usage
1. [ ] In Firestore, click **Usage**
2. [ ] Check read/write counts:
   - [ ] Reads: Should match your actions
   - [ ] Writes: Should match your actions
3. [ ] Note: Free tier = 50k reads/day

### 7.2 Review Indexes
1. [ ] In Firestore, click **Indexes**
2. [ ] Should be mostly empty for simple queries
3. [ ] Auto-created indexes should appear after use

---

## 🐛 Step 8: Troubleshoot Common Issues

### Issue: "Permission denied"
- [ ] Verify security rules are published
- [ ] Verify user is authenticated (logged in)
- [ ] Check browser console for exact error
- [ ] Temporarily open rules to `allow read, write: if true;` to test

### Issue: Collections don't appear
- [ ] Create first document to auto-create collection
- [ ] Refresh Firestore console
- [ ] Check you're in the right project

### Issue: Data not persisting
- [ ] Verify Firestore is enabled (green status)
- [ ] Check network tab in DevTools
- [ ] Look for error messages in console
- [ ] Verify user is logged in

### Issue: Slow performance
- [ ] Add indexes for frequently queried fields
- [ ] Limit real-time listeners
- [ ] Batch write operations
- [ ] Check free tier limits aren't exceeded

---

## ✨ Step 9: Final Verification

Run through complete user journey:

1. [ ] **Visit App**
   - [ ] Home page loads
   - [ ] Products display

2. [ ] **Sign Up**
   - [ ] Signup form works
   - [ ] User created in Firestore

3. [ ] **Sign In**
   - [ ] Can sign in with credentials
   - [ ] Stays logged in

4. [ ] **Shopping**
   - [ ] Add items to cart
   - [ ] Cart persists on refresh
   - [ ] Cart shows in Firestore

5. [ ] **Checkout**
   - [ ] Enter delivery address
   - [ ] Address saves to Firestore
   - [ ] Can complete purchase

6. [ ] **Orders**
   - [ ] Order created in Firestore
   - [ ] Visible in dashboard
   - [ ] Shows correct total

7. [ ] **Dashboard**
   - [ ] Shows recent orders
   - [ ] Calculates total revenue
   - [ ] Displays sales chart

---

## 🎯 Completion Checklist

- [ ] Firestore Database created
- [ ] Security rules published
- [ ] Collections created (5 collections)
- [ ] All tests passed
- [ ] Data structure verified
- [ ] Security rules tested
- [ ] Usage monitored
- [ ] Complete user journey tested
- [ ] No errors in console
- [ ] Dashboard shows data correctly

---

## 📈 Production Readiness

Before deploying to production:

### Security
- [ ] Review and tighten security rules
- [ ] Consider Firebase Auth (instead of custom)
- [ ] Enable email verification
- [ ] Implement password hashing
- [ ] Set up IP restrictions if needed

### Performance
- [ ] Create indexes for common queries
- [ ] Test with realistic data volume
- [ ] Monitor Firestore quotas
- [ ] Set up budget alerts

### Monitoring
- [ ] Set up error logging
- [ ] Monitor Firestore usage
- [ ] Track performance metrics
- [ ] Create backup strategy

### Documentation
- [ ] Document all collections
- [ ] Document security rules
- [ ] Create troubleshooting guide
- [ ] Document API changes

---

## 📞 Getting Help

If you encounter issues:

1. [ ] Check browser console for errors
2. [ ] Review Firestore rules
3. [ ] Verify Firebase config
4. [ ] Check network connectivity
5. [ ] Read [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
6. [ ] Check [QUICKSTART.md](./QUICKSTART.md)

---

## ✅ You're Done!

Once all items are checked, your Firestore setup is complete and ready for use.

**Congratulations! 🎉 Your e-store is now using Firestore Database!**

Next steps:
- Deploy to production
- Monitor usage and performance
- Plan scaling improvements
- Implement recommended features
