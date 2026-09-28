// Reactive Synchronized State for 360apparels Store & Manager App
import { PRODUCTS as INITIAL_PRODUCTS, REELS as INITIAL_REELS, STORE_INFO } from './products';

const STORAGE_KEYS = {
  PRODUCTS: '360_inventory_products_v4',
  REELS: '360_inventory_reels_v4',
  ORDERS: '360_store_orders_v4',
};

// Initialize or load products
export function getStoredProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading stored products:', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('360_products_updated', { detail: products }));
  } catch (e) {
    console.error('Error saving products:', e);
  }
}

// Initialize or load reels
export function getStoredReels() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REELS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize: replace any legacy mixkit url that fails
        return parsed.map((r, i) => {
          if (r.videoUrl && r.videoUrl.includes('mixkit')) {
            const fallback = INITIAL_REELS[i % INITIAL_REELS.length]?.videoUrl || '/videos/walking.mp4';
            return { ...r, videoUrl: fallback };
          }
          return r;
        });
      }
    }
  } catch (e) {
    console.error('Error loading stored reels:', e);
  }
  return INITIAL_REELS;
}

export function saveStoredReels(reels) {
  try {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
    window.dispatchEvent(new CustomEvent('360_reels_updated', { detail: reels }));
  } catch (e) {
    console.error('Error saving reels:', e);
  }
}

// Initial sample orders for store manager
const INITIAL_ORDERS = [
  {
    id: "360-ORD-1092",
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      name: "Aryan Verma",
      phone: "9839123456",
      address: "Flat 402, Gomti Nagar Phase 2",
      city: "Lucknow",
      pincode: "226010"
    },
    items: [
      { id: 1, title: "On Cloud Running Tilt Ivory Black", price: 2699, quantity: 1, selectedSize: "UK 9" }
    ],
    subtotal: 2699,
    discount: 0,
    shipping: 0,
    total: 2699,
    paymentMethod: "cod",
    status: "dispatched",
    notes: "Customer requested evening delivery"
  },
  {
    id: "360-ORD-1091",
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    customer: {
      name: "Pooja Malhotra",
      phone: "9450098765",
      address: "House 18, Hazratganj Main Road",
      city: "Lucknow",
      pincode: "226001"
    },
    items: [
      { id: 14, title: "Tom Ford Ombré Leather EDP 100ml", price: 849, quantity: 1, selectedSize: "100ml" },
      { id: 2, title: "Prada Black 132 Luxury Edition", price: 400, quantity: 1, selectedSize: "M" }
    ],
    subtotal: 1249,
    discount: 100,
    shipping: 0,
    total: 1149,
    paymentMethod: "whatsapp",
    status: "confirmed",
    notes: "Packed with official 360 carry bag"
  },
  {
    id: "360-ORD-1090",
    date: new Date(Date.now() - 3600000 * 12).toISOString(),
    customer: {
      name: "Sameer Siddiqui",
      phone: "9129876543",
      address: "Near Indralok Market Gate 3",
      city: "Lucknow",
      pincode: "226001"
    },
    items: [
      { id: 4, title: "Rado Diastar Skeleton Timepiece", price: 899, quantity: 1, selectedSize: "Adjustable Link" }
    ],
    subtotal: 899,
    discount: 0,
    shipping: 99,
    total: 998,
    paymentMethod: "upi",
    status: "delivered",
    notes: "Store walk-in pickup"
  }
];

// Initialize or load orders
export function getStoredOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading stored orders:', e);
  }
  return INITIAL_ORDERS;
}

export function saveStoredOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('360_orders_updated', { detail: orders }));
  } catch (e) {
    console.error('Error saving orders:', e);
  }
}

// Function to dispatch a new live customer order into the Manager App
export function dispatchNewOrder(orderData) {
  const currentOrders = getStoredOrders();
  const orderId = `360-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newOrder = {
    id: orderId,
    date: new Date().toISOString(),
    status: 'pending',
    ...orderData
  };

  const updatedOrders = [newOrder, ...currentOrders];
  saveStoredOrders(updatedOrders);

  // Play audio chime alert if supported
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioContext.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.4);
  } catch (err) {
    console.log("Audio notice:", err);
  }

  return newOrder;
}
