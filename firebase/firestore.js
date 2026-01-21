import { db, auth } from './config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/**
 * USER MANAGEMENT
 */

// Register a new user
export const registerUser = async (userData) => {
  try {
    const usersRef = collection(db, 'users');
    // Check if email already exists
    const q = query(usersRef, where('email', '==', userData.email));
    const existingUser = await getDocs(q);

    if (!existingUser.empty) {
      throw new Error('Email already registered');
    }

    const docRef = await addDoc(usersRef, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const result = await getDocs(q);

    if (result.empty) {
      throw new Error('Invalid email or password');
    }

    const user = result.docs[0];
    const userData = { id: user.id, ...user.data() };

    // Store user in sessionStorage for current session
    sessionStorage.setItem('user', JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  const storedUser = sessionStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Logout user
export const logoutUser = () => {
  sessionStorage.removeItem('user');
};

/**
 * CART MANAGEMENT
 */

// Get user's cart
export const getUserCart = async (userId) => {
  try {
    const cartRef = collection(db, 'carts');
    const q = query(cartRef, where('userId', '==', userId));
    const result = await getDocs(q);

    if (result.empty) {
      return [];
    }

    return result.docs[0].data().items || [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

// Save user's cart
export const saveUserCart = async (userId, cartItems) => {
  try {
    const cartRef = collection(db, 'carts');
    const q = query(cartRef, where('userId', '==', userId));
    const result = await getDocs(q);

    if (result.empty) {
      // Create new cart
      await addDoc(cartRef, {
        userId: userId,
        items: cartItems,
        updatedAt: new Date()
      });
    } else {
      // Update existing cart
      const cartDocId = result.docs[0].id;
      const cartDoc = doc(db, 'carts', cartDocId);
      await updateDoc(cartDoc, {
        items: cartItems,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
};

// Clear user's cart
export const clearUserCart = async (userId) => {
  try {
    await saveUserCart(userId, []);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * ADDRESS MANAGEMENT
 */

// Get user's addresses
export const getUserAddresses = async (userId) => {
  try {
    const addressesRef = collection(db, 'addresses');
    const q = query(addressesRef, where('userId', '==', userId));
    const result = await getDocs(q);

    return result.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
};

// Get last address
export const getLastUserAddress = async (userId) => {
  try {
    const addresses = await getUserAddresses(userId);
    return addresses.length > 0 ? addresses[addresses.length - 1] : null;
  } catch (error) {
    console.error('Error fetching last address:', error);
    return null;
  }
};

// Save address
export const saveAddress = async (userId, addressData) => {
  try {
    const addressesRef = collection(db, 'addresses');
    const docRef = await addDoc(addressesRef, {
      userId: userId,
      firstName: addressData.firstName,
      lastName: addressData.lastName,
      phone: addressData.phone,
      address: addressData.address,
      additionalInfo: addressData.additionalInfo,
      createdAt: new Date()
    });

    return { id: docRef.id, ...addressData };
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
};

/**
 * ORDERS MANAGEMENT
 */

// Get user's orders
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const result = await getDocs(q);

    return result.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Create order
export const createOrder = async (userId, orderData) => {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      userId: userId,
      items: orderData.items,
      totalPrice: orderData.totalPrice,
      reference: orderData.reference,
      status: 'completed',
      createdAt: new Date()
    });

    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all orders (for dashboard)
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const result = await getDocs(ordersRef);

    return result.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

/**
 * DASHBOARD DATA
 */

// Get dashboard settings
export const getDashboardSettings = async () => {
  try {
    const settingsRef = doc(db, 'dashboard', 'settings');
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      return {
        ownerName: 'Admin',
        ownerEmail: 'admin@example.com',
        balance: 0
      };
    }

    return settingsDoc.data();
  } catch (error) {
    console.error('Error fetching dashboard settings:', error);
    return {
      ownerName: 'Admin',
      ownerEmail: 'admin@example.com',
      balance: 0
    };
  }
};

// Update dashboard settings
export const updateDashboardSettings = async (settings) => {
  try {
    const settingsRef = doc(db, 'dashboard', 'settings');
    await setDoc(settingsRef, settings, { merge: true });
    return settings;
  } catch (error) {
    console.error('Error updating dashboard settings:', error);
    throw error;
  }
};

/**
 * REAL-TIME LISTENERS (Optional for live updates)
 */

// Listen to cart changes in real-time
export const onCartChange = (userId, callback) => {
  try {
    const cartRef = collection(db, 'carts');
    const q = query(cartRef, where('userId', '==', userId));

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback([]);
      } else {
        callback(snapshot.docs[0].data().items || []);
      }
    });
  } catch (error) {
    console.error('Error setting up cart listener:', error);
  }
};

// Listen to orders changes in real-time
export const onOrdersChange = (userId, callback) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    });
  } catch (error) {
    console.error('Error setting up orders listener:', error);
  }
};
