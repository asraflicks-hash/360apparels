import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VaultFeed from './components/VaultFeed';
import CategoriesView from './components/CategoriesView';
import ReelsFeed from './components/ReelsFeed';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import SearchModal from './components/SearchModal';
import StoreLocationModal from './components/StoreLocationModal';
import BottomNav from './components/BottomNav';
import ManagerDashboard from './components/ManagerDashboard';
import { STORE_INFO } from './data/products';
import { getStoredProducts, getStoredReels } from './data/storeState';
import { Smartphone, Monitor, MessageCircle, Shield, Store } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('vault');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Manager Mode state
  const [isManagerMode, setIsManagerMode] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);

  // View frame toggle (clean light default)
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Synchronized catalog products & reels
  const [productsList, setProductsList] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleProductsUpdated = (e) => {
      setProductsList(e.detail || getStoredProducts());
    };
    window.addEventListener('360_products_updated', handleProductsUpdated);
    return () => window.removeEventListener('360_products_updated', handleProductsUpdated);
  }, []);

  // Cart State (Persisted)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('360_cart');
      const initialItem = getStoredProducts()[0];
      return saved ? JSON.parse(saved) : [
        { ...initialItem, quantity: 1, selectedSize: 'UK 9', selectedColor: initialItem.colors?.[0] }
      ];
    } catch {
      const initialItem = getStoredProducts()[0];
      return [{ ...initialItem, quantity: 1, selectedSize: 'UK 9', selectedColor: initialItem.colors?.[0] }];
    }
  });

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('360_wishlist');
      return saved ? JSON.parse(saved) : { 1: true, 4: true, 7: true };
    } catch {
      return { 1: true, 4: true, 7: true };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('360_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('360_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === (product.selectedSize || 'Standard')
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }
      return [...prev, { ...product, quantity: 1, selectedSize: product.selectedSize || 'Standard' }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const copy = { ...prev };
      if (copy[product.id]) {
        delete copy[product.id];
      } else {
        copy[product.id] = true;
      }
      return copy;
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = Object.keys(wishlist).length;

  const wishlistedProducts = productsList.filter(p => Boolean(wishlist[p.id]));
  const currentProduct = productsList.find(p => p.id === selectedProductId);

  const handleTabChange = (tabId) => {
    if (tabId === 'cart') {
      setIsCartOpen(true);
    } else if (tabId === 'wishlist') {
      setIsWishlistOpen(true);
    } else {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If Manager Mode is active, render the Store Manager & POS Control Center
  if (isManagerMode) {
    return (
      <ManagerDashboard
        onCloseManager={() => setIsManagerMode(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-100/80 text-slate-900 flex flex-col items-center justify-start ${isMobileFrame ? 'p-2 sm:p-6' : ''}`}>
      {/* Top Multi-Platform Toolbar */}
      <div className="w-full max-w-md sm:max-w-2xl px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-bold text-slate-800">360APPARELS 8K</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
            Android • iOS • Windows
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Switch to Store Manager / POS */}
          <button
            onClick={() => setIsManagerMode(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs flex items-center gap-1.5 transition-all"
            title="Open Store Manager & Billing POS"
          >
            <Shield size={12} />
            <span>Store Manager</span>
          </button>

          <button
            onClick={() => setIsMobileFrame(false)}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              !isMobileFrame 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Monitor size={12} />
            <span className="hidden sm:inline">Responsive</span>
          </button>

          <button
            onClick={() => setIsMobileFrame(true)}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isMobileFrame 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Smartphone size={12} />
            <span className="hidden sm:inline">Phone</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div 
        className={`w-full transition-all duration-300 relative bg-white shadow-md flex flex-col min-h-screen ${
          isMobileFrame 
            ? 'max-w-[420px] rounded-[40px] border-[8px] border-slate-800 shadow-2xl h-[850px] overflow-y-auto my-2' 
            : 'max-w-md sm:max-w-xl md:max-w-2xl border-x border-slate-200'
        }`}
      >
        {/* Mobile Status Bar (Visible in phone frame) */}
        {isMobileFrame && (
          <div className="w-full bg-white px-6 py-2 flex items-center justify-between text-[11px] text-slate-700 font-semibold border-b border-slate-100">
            <span>9:41</span>
            <div className="w-20 h-4 bg-slate-100 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Global App Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenStoreInfo={() => setIsStoreInfoOpen(true)}
          cartCount={totalCartCount}
          wishlistCount={totalWishlistCount}
        />

        {/* Active Tab View */}
        <main className="flex-1 w-full bg-slate-50">
          {activeTab === 'vault' && (
            <VaultFeed
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectProduct={(id) => setSelectedProductId(id)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistMap={wishlist}
              onOpenStoreInfo={() => setIsStoreInfoOpen(true)}
              onSwitchToReels={() => setActiveTab('reels')}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setActiveTab('vault');
              }}
            />
          )}

          {activeTab === 'reels' && (
            <div className="p-2 sm:p-4">
              <ReelsFeed
                onSelectProduct={(id) => setSelectedProductId(id)}
              />
            </div>
          )}
        </main>

        {/* Floating WhatsApp Quick Action Button */}
        <a
          href={`https://api.whatsapp.com/send?phone=${STORE_INFO.whatsappPhone}&text=${encodeURIComponent("Hello 360apparels, I am shopping on your app and have a question.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 sm:right-6 z-30 p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          title="Direct WhatsApp Support"
        >
          <MessageCircle size={22} className="fill-white text-emerald-500" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-2">
            9044286001
          </span>
        </a>

        {/* Bottom Floating Navigation Dock */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          cartCount={totalCartCount}
          wishlistCount={totalWishlistCount}
        />

        {/* Modals and Drawers */}
        <ProductModal
          product={currentProduct}
          onClose={() => setSelectedProductId(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={Boolean(wishlist[selectedProductId])}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
        />

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistItems={wishlistedProducts}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onAddToCart={handleAddToCart}
          onSelectProduct={(id) => setSelectedProductId(id)}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(id) => setSelectedProductId(id)}
        />

        <StoreLocationModal
          isOpen={isStoreInfoOpen}
          onClose={() => setIsStoreInfoOpen(false)}
        />
      </div>
    </div>
  );
}
