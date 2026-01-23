# Developer's Quick Reference - Firestore APIs

## 🚀 Quick Copy-Paste Code Examples

### Import Everything
```javascript
import {
  registerUser,           // Register new user
  loginUser,             // Login user
  getCurrentUser,        // Get logged-in user
  logoutUser,           // Logout user
  getUserCart,          // Get user's cart
  saveUserCart,         // Save cart
  clearUserCart,        // Clear cart
  getUserAddresses,     // Get all addresses
  getLastUserAddress,   // Get most recent address
  saveAddress,          // Save new address
  getUserOrders,        // Get user's orders
  createOrder,          // Create new order
  getAllOrders,         // Get all orders (admin)
  getDashboardSettings, // Get dashboard settings
  updateDashboardSettings, // Update settings
  onCartChange,         // Real-time cart listener
  onOrdersChange        // Real-time orders listener
} from '../firebase/firestore.js';
```

---


<!-- today's commit -->

## 👤 User Management

### Sign Up
```javascript
try {
  const user = await registerUser({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Pass123!'
  });
  console.log('User registered:', user.id);
} catch (error) {
  console.error('Sign up failed:', error.message);
  if (error.message === 'Email already registered') {
    alert('Email already exists');
  }
}
```

### Sign In
```javascript
try {
  const user = await loginUser('john@example.com', 'Pass123!');
  console.log('Logged in:', user.firstName);
  // User now in sessionStorage
} catch (error) {
  console.error('Sign in failed:', error.message);
}
```

### Get Current User
```javascript
const user = getCurrentUser();
if (user) {
  console.log('Logged in as:', user.email);
  console.log('User ID:', user.id);
} else {
  console.log('No user logged in');
  // Redirect to login
  window.location.href = '/signin/index.html';
}
```

### Sign Out
```javascript
logoutUser();
console.log('User logged out');
window.location.href = '/signin/index.html';
```

---

## 🛒 Shopping Cart

### Load Cart
```javascript
const user = getCurrentUser();
if (!user) {
  console.log('User must be logged in');
  return;
}

try {
  const cartItems = await getUserCart(user.id);
  console.log('Cart items:', cartItems);
  // cartItems = [{id, productName, price, quantity, ...}]
} catch (error) {
  console.error('Error loading cart:', error);
}
```

### Save Cart
```javascript
const user = getCurrentUser();
const cartItems = [
  { id: '1', productName: 'Shirt', price: 5000, quantity: 2 },
  { id: '2', productName: 'Jeans', price: 8000, quantity: 1 }
];

try {
  await saveUserCart(user.id, cartItems);
  console.log('Cart saved successfully');
} catch (error) {
  console.error('Error saving cart:', error);
}
```

### Clear Cart
```javascript
try {
  await clearUserCart(user.id);
  console.log('Cart cleared');
} catch (error) {
  console.error('Error clearing cart:', error);
}
```

### Real-Time Cart Updates
```javascript
// Listen to cart changes
const unsubscribe = onCartChange(user.id, (items) => {
  console.log('Cart updated:', items);
  renderCart(items); // Update UI
});

// Stop listening
window.addEventListener('beforeunload', () => {
  unsubscribe(); // Cleanup
});
```

---

## 📍 Addresses

### Save Address
```javascript
const user = getCurrentUser();

try {
  const address = await saveAddress(user.id, {
    firstName: 'John',
    lastName: 'Doe',
    phone: '08012345678',
    address: '123 Main Street',
    additionalInfo: 'Apartment 4B, Gate 2'
  });
  console.log('Address saved:', address.id);
} catch (error) {
  console.error('Error saving address:', error);
}
```

### Get All Addresses
```javascript
try {
  const addresses = await getUserAddresses(user.id);
  // addresses = [{id, firstName, lastName, phone, address, ...}]
  
  addresses.forEach(addr => {
    console.log(addr.firstName, addr.address);
  });
} catch (error) {
  console.error('Error loading addresses:', error);
}
```

### Get Last Used Address
```javascript
try {
  const lastAddress = await getLastUserAddress(user.id);
  
  if (lastAddress) {
    console.log('Last address:', lastAddress.address);
    // Display in form for confirmation
  } else {
    console.log('No previous addresses');
  }
} catch (error) {
  console.error('Error loading address:', error);
}
```

---

## 📦 Orders

### Create Order
```javascript
const user = getCurrentUser();
const cartItems = [
  { id: '1', productName: 'Shirt', price: 5000, quantity: 2 }
];

try {
  const order = await createOrder(user.id, {
    items: cartItems,
    totalPrice: 15000,
    reference: 'TX-' + Math.random().toString(36).substr(2, 9)
  });
  
  console.log('Order created:', order.id);
  
  // Clear cart after successful order
  await clearUserCart(user.id);
  
} catch (error) {
  console.error('Error creating order:', error);
}
```

### Get User's Orders
```javascript
try {
  const orders = await getUserOrders(user.id);
  // orders = [{id, items, totalPrice, reference, createdAt, ...}]
  
  orders.forEach(order => {
    console.log('Order', order.reference, ':', order.totalPrice);
  });
} catch (error) {
  console.error('Error loading orders:', error);
}
```

### Real-Time Order Updates
```javascript
const unsubscribe = onOrdersChange(user.id, (orders) => {
  console.log('Orders updated:', orders);
  displayOrders(orders); // Update UI
});
```

---

## 📊 Dashboard / Admin

### Get All Orders
```javascript
try {
  const allOrders = await getAllOrders();
  // allOrders = [{id, userId, items, totalPrice, createdAt, ...}]
  
  // Calculate total revenue
  let totalRevenue = 0;
  allOrders.forEach(order => {
    totalRevenue += order.totalPrice;
  });
  console.log('Total revenue:', totalRevenue);
  
} catch (error) {
  console.error('Error loading orders:', error);
}
```

### Get Dashboard Settings
```javascript
try {
  const settings = await getDashboardSettings();
  console.log('Owner:', settings.ownerName);
  console.log('Email:', settings.ownerEmail);
  console.log('Balance:', settings.balance);
} catch (error) {
  console.error('Error loading settings:', error);
}
```

### Update Dashboard Settings
```javascript
try {
  await updateDashboardSettings({
    ownerName: 'John Doe',
    ownerEmail: 'john@store.com',
    balance: 50000
  });
  console.log('Settings updated');
} catch (error) {
  console.error('Error updating settings:', error);
}
```

---

## 🔄 Common Patterns

### Complete User Journey
```javascript
// 1. Sign up
const newUser = await registerUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Pass123!'
});

// 2. Sign in
const user = await loginUser('john@example.com', 'Pass123!');

// 3. Add to cart
const cart = [{id: '1', productName: 'Shirt', price: 5000, quantity: 1}];
await saveUserCart(user.id, cart);

// 4. Save address
await saveAddress(user.id, {
  firstName: 'John',
  lastName: 'Doe',
  phone: '08012345678',
  address: '123 Main St',
  additionalInfo: ''
});

// 5. Create order
await createOrder(user.id, {
  items: cart,
  totalPrice: 5000,
  reference: 'TX-123456789'
});

// 6. Clear cart
await clearUserCart(user.id);
```

### Error Handling Pattern
```javascript
try {
  const user = await loginUser(email, password);
  console.log('Login successful');
} catch (error) {
  console.error('Login error:', error.message);
  
  if (error.message.includes('Invalid')) {
    alert('Invalid credentials');
  } else if (error.message.includes('not found')) {
    alert('User not found');
  } else {
    alert('Error: ' + error.message);
  }
}
```

### Data Validation Pattern
```javascript
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

if (!validateEmail(email)) {
  alert('Invalid email format');
  return;
}

if (!validatePassword(password)) {
  alert('Password must be 8+ chars with uppercase, lowercase, number, and special char');
  return;
}
```

### Loading State Pattern
```javascript
async function processCheckout() {
  const btn = document.getElementById('checkoutBtn');
  
  // Show loading
  btn.disabled = true;
  btn.innerHTML = '<span>Processing...</span>';
  
  try {
    // Do work
    await createOrder(user.id, orderData);
    alert('Order created successfully!');
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    // Reset button
    btn.disabled = false;
    btn.innerHTML = 'Complete Checkout';
  }
}
```

---

## 🧪 Testing Examples

### Test User Registration
```javascript
// Test 1: Valid registration
const result1 = await registerUser({
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'TestPass123!'
});
console.assert(result1.id, 'User should have ID');

// Test 2: Duplicate email
try {
  await registerUser({
    firstName: 'Another',
    lastName: 'User',
    email: 'test@example.com', // Same email
    password: 'Pass123!'
  });
  console.error('Should have rejected duplicate email');
} catch (error) {
  console.assert(error.message === 'Email already registered', 'Should reject duplicate');
}
```

### Test Cart Operations
```javascript
const userId = 'test-user-123';
const items = [
  {id: '1', productName: 'Shirt', price: 5000, quantity: 2},
  {id: '2', productName: 'Jeans', price: 8000, quantity: 1}
];

// Test save
await saveUserCart(userId, items);
const saved = await getUserCart(userId);
console.assert(saved.length === 2, 'Cart should have 2 items');

// Test clear
await clearUserCart(userId);
const cleared = await getUserCart(userId);
console.assert(cleared.length === 0, 'Cart should be empty');
```

---

## ⚡ Performance Tips

### Use Real-Time Listeners Sparingly
```javascript
// Good: Listen once when page loads
const orders = await getUserOrders(user.id);

// Bad: Don't listen for every action
// const unsubscribe = onOrdersChange(...);
// Don't forget to unsubscribe!
```

### Batch Operations
```javascript
// Bad: Multiple saves
await saveUserCart(user.id, items1);
await saveUserCart(user.id, items2);

// Better: Combine into one
const combined = [...items1, ...items2];
await saveUserCart(user.id, combined);
```

### Cache Data
```javascript
let cachedUser = null;

function getCachedUser() {
  if (!cachedUser) {
    cachedUser = getCurrentUser();
  }
  return cachedUser;
}
```

---

## 🐛 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot read property 'id' of null" | User not logged in | Call `loginUser()` first |
| "Permission denied" | No Firestore rules | Publish security rules |
| "Document not found" | Wrong ID | Verify ID exists in Firestore |
| "Network error" | Offline | Check internet connection |
| "Email already registered" | Duplicate email | Use different email |
| "Invalid credentials" | Wrong password | Check password carefully |

---

## 📚 Key Facts to Remember

- **Always check user logged in** before operations: `const user = getCurrentUser()`
- **Passwords must be strong**: 8+ chars, uppercase, lowercase, number, special char
- **Emails must be unique**: System prevents duplicate registrations
- **Cart tied to user**: Each user has their own cart
- **Orders permanent**: Cannot be deleted, only created
- **Real-time listeners** must be unsubscribed to avoid memory leaks
- **Error handling** is essential for production apps

---

## 🔗 Related Files

- **Main Functions**: `firebase/firestore.js`
- **Firebase Config**: `firebase/config.js`
- **Complete Docs**: `MIGRATION_GUIDE.md`
- **Setup Guide**: `FIRESTORE_SETUP.md`
- **Quick Start**: `QUICKSTART.md`

---

**Last Updated:** January 21, 2024
**Version:** 1.0
**Status:** Production Ready
