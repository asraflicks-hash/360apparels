import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingBag, Video, DollarSign, Bell, Plus, Trash2, 
  Edit3, Printer, MessageCircle, CheckCircle, Clock, Truck, 
  ExternalLink, Search, RefreshCw, X, Shield, ArrowUpRight 
} from 'lucide-react';
import { 
  getStoredOrders, saveStoredOrders, 
  getStoredProducts, saveStoredProducts, 
  getStoredReels, saveStoredReels 
} from '../data/storeState';
import { STORE_INFO, CATEGORIES } from '../data/products';
import InvoiceModal from './InvoiceModal';

export default function ManagerDashboard({ onCloseManager }) {
  const [managerTab, setManagerTab] = useState('orders'); // 'orders', 'products', 'reels', 'pos'
  
  // Reactive state synced with storage
  const [orders, setOrders] = useState(() => getStoredOrders());
  const [products, setProducts] = useState(() => getStoredProducts());
  const [reels, setReels] = useState(() => getStoredReels());

  // Invoice modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // New product form modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'shoes',
    categoryName: 'Sneakers & Kicks',
    price: 1999,
    mrp: 4999,
    stockCount: 10,
    image: 'https://cdn.cartpe.in/images/gallery_sm/6ab4cef7774140.jpeg',
    badge: 'NEW DROP',
    description: 'Fresh arrival at 360apparels showroom.',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10']
  });

  // New reel form modal
  const [isAddReelOpen, setIsAddReelOpen] = useState(false);
  const [newReel, setNewReel] = useState({
    title: '',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-modern-white-sneaker-in-hand-42398-large.mp4',
    poster: 'https://cdn.cartpe.in/images/gallery_sm/6ab4cef7774140.jpeg',
    author: '@360_lucknowonline',
    badge: 'UGC UNBOXING',
    description: 'Customer review and unboxing of fresh kicks.',
    productId: 1,
    music: 'Original Sound • 360 Beats'
  });

  // Walk-in POS form state
  const [posCustomer, setPosCustomer] = useState({ name: '', phone: '', address: 'Walk-in Store Customer, Lucknow' });
  const [posCart, setPosCart] = useState([]);

  // Listen for storage events across tabs & app
  useEffect(() => {
    const handleOrdersUpdate = (e) => {
      setOrders(e.detail || getStoredOrders());
    };
    const handleProductsUpdate = (e) => {
      setProducts(e.detail || getStoredProducts());
    };
    const handleReelsUpdate = (e) => {
      setReels(e.detail || getStoredReels());
    };

    window.addEventListener('360_orders_updated', handleOrdersUpdate);
    window.addEventListener('360_products_updated', handleProductsUpdate);
    window.addEventListener('360_reels_updated', handleReelsUpdate);

    return () => {
      window.removeEventListener('360_orders_updated', handleOrdersUpdate);
      window.removeEventListener('360_products_updated', handleProductsUpdate);
      window.removeEventListener('360_reels_updated', handleReelsUpdate);
    };
  }, []);

  // Update order status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // Send WhatsApp update to customer
  const handleSendWhatsAppUpdate = (order) => {
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const text = `Hello ${order.customer.name}! 👋
This is an update regarding your *360apparels Lucknow* order *${order.id}*.

*Current Status:* ${order.status.toUpperCase()}
*Items:* ${order.items.map(i => `${i.title} (${i.selectedSize || 'N/A'})`).join(', ')}
*Total Amount:* ₹${order.total?.toLocaleString('en-IN')}

Fulfillment: M-63 Indralok Market Flagship Store.
Thank you for shopping with us!`;

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Add Product Submit
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;

    const discountPct = Math.round(((newProduct.mrp - newProduct.price) / newProduct.mrp) * 100);

    const created = {
      id: Date.now(),
      title: newProduct.title,
      category: newProduct.category,
      categoryName: CATEGORIES.find(c => c.id === newProduct.category)?.name || 'Apparel',
      price: Number(newProduct.price),
      mrp: Number(newProduct.mrp),
      discount: `${discountPct}% OFF`,
      rating: 4.9,
      reviews: 1,
      badge: newProduct.badge,
      inStock: true,
      stockCount: Number(newProduct.stockCount),
      image: newProduct.image,
      sizes: newProduct.sizes,
      description: newProduct.description,
      cartpeUrl: `https://360apparels.cartpe.in/product-${Date.now()}`
    };

    const updated = [created, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    setIsAddProductOpen(false);
    setNewProduct({
      title: '',
      category: 'shoes',
      categoryName: 'Sneakers & Kicks',
      price: 1999,
      mrp: 4999,
      stockCount: 10,
      image: 'https://cdn.cartpe.in/images/gallery_sm/6ab4cef7774140.jpeg',
      badge: 'NEW DROP',
      description: 'Fresh arrival at 360apparels showroom.',
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10']
    });
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to remove this product from inventory?")) {
      const updated = products.filter(p => p.id !== productId);
      setProducts(updated);
      saveStoredProducts(updated);
    }
  };

  // Add Reel Submit
  const handleAddReel = (e) => {
    e.preventDefault();
    if (!newReel.title || !newReel.videoUrl) return;

    const created = {
      id: `ugc-${Date.now()}`,
      videoUrl: newReel.videoUrl,
      poster: newReel.poster,
      author: newReel.author || '@360_lucknowonline',
      authorAvatar: 'https://cdn.cartpe.in/images/store_logo_sm/64188cc8e9943.jpeg',
      badge: newReel.badge,
      title: newReel.title,
      description: newReel.description,
      likes: '1.2K',
      comments: '45',
      productId: Number(newReel.productId),
      music: newReel.music
    };

    const updated = [created, ...reels];
    setReels(updated);
    saveStoredReels(updated);
    setIsAddReelOpen(false);
  };

  // Delete reel
  const handleDeleteReel = (reelId) => {
    if (confirm("Delete this reel?")) {
      const updated = reels.filter(r => r.id !== reelId);
      setReels(updated);
      saveStoredReels(updated);
    }
  };

  // POS Add item
  const handleAddPosItem = (product) => {
    setPosCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1, selectedSize: product.sizes?.[0] || 'Standard' }];
    });
  };

  // POS Checkout & Generate Invoice
  const handlePosCheckout = () => {
    if (posCart.length === 0) return alert("Select at least 1 item for the bill");
    const subtotal = posCart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    
    const newPosOrder = {
      id: `360-POS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      customer: {
        name: posCustomer.name || "Walk-in Store Customer",
        phone: posCustomer.phone || "9044286001",
        address: posCustomer.address || "Showroom Counter Sale, Indralok",
        city: "Lucknow",
        pincode: "226001"
      },
      items: posCart,
      subtotal,
      discount: 0,
      shipping: 0,
      total: subtotal,
      paymentMethod: "Cash/Counter POS",
      status: "delivered"
    };

    const updated = [newPosOrder, ...orders];
    setOrders(updated);
    saveStoredOrders(updated);
    setSelectedInvoiceOrder(newPosOrder);
    setPosCart([]);
    setPosCustomer({ name: '', phone: '', address: 'Walk-in Store Customer, Lucknow' });
  };

  // Calculations for stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Windows Control / Software Header Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
            360
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-tight">
                360APPARELS MANAGER & WINDOWS POS
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                PRO CONTROL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live Showroom Dispatch & Inventory Control • M-63 Indralok Market
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onCloseManager}
            className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <ShoppingBag size={14} />
            <span>Switch to Customer App</span>
          </button>
        </div>
      </header>

      {/* Main Stats Header */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Sales</span>
              <p className="text-base sm:text-lg font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 relative">
              <Package size={20} />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Orders</span>
              <p className="text-base sm:text-lg font-black text-amber-600">{pendingOrdersCount} New</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
              <ShoppingBag size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Products Live</span>
              <p className="text-base sm:text-lg font-black text-slate-900">{products.length} Items</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
              <Video size={20} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Active 4K Reels</span>
              <p className="text-base sm:text-lg font-black text-slate-900">{reels.length} Reels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6">
        <div className="flex items-center gap-4 max-w-6xl mx-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: `Live Orders (${orders.length})`, icon: Package },
            { id: 'pos', label: '🧾 POS Billing / Tax Invoice', icon: Printer },
            { id: 'products', label: `Product Catalog (${products.length})`, icon: ShoppingBag },
            { id: 'reels', label: `4K Video Reels (${reels.length})`, icon: Video },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = managerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setManagerTab(tab.id)}
                className={`py-3 px-2 border-b-2 font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* TAB 1: ORDERS & DISPATCH */}
        {managerTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Live Customer Orders Stream
                </h2>
                <p className="text-xs text-slate-500">
                  Orders placed on the website or mobile app arrive here in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((order) => {
                const isPending = order.status === 'pending';

                return (
                  <div 
                    key={order.id} 
                    className={`p-4 rounded-2xl bg-white border transition-all ${
                      isPending ? 'border-amber-400 shadow-md ring-1 ring-amber-400/20' : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black text-slate-900">{order.id}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Status changer buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['pending', 'confirmed', 'dispatched', 'delivered'].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(order.id, st)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              order.status === st
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
                      {/* Customer Details */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Customer Info</span>
                        <p className="font-bold text-slate-900">{order.customer?.name}</p>
                        <p className="text-slate-600">+91 {order.customer?.phone}</p>
                        <p className="text-slate-500 mt-0.5">
                          {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
                        </p>
                      </div>

                      {/* Ordered Items */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Items List</span>
                        <ul className="space-y-1">
                          {order.items?.map((it, idx) => (
                            <li key={idx} className="text-slate-800 font-medium">
                              • {it.title} <span className="text-amber-600 font-bold">({it.selectedSize || 'N/A'})</span> x{it.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Amount & Actions */}
                      <div className="flex flex-col justify-between items-start sm:items-end gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Amount</span>
                          <span className="text-lg font-black text-slate-900">₹{order.total?.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Via {order.paymentMethod}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSendWhatsAppUpdate(order)}
                            className="py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors"
                            title="Send WhatsApp Update to Customer"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp Status</span>
                          </button>

                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <Printer size={14} />
                            <span>Bill / Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: POS BILLING SYSTEM */}
        {managerTab === 'pos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Catalog Selector */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">Select Items For Invoice</h3>
                <span className="text-xs text-slate-500">Tap to add into bill</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[550px] overflow-y-auto pr-1">
                {products.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleAddPosItem(p)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 cursor-pointer transition-all shadow-xs flex flex-col justify-between"
                  >
                    <img src={p.image} alt="" className="w-full aspect-square object-cover rounded-lg bg-slate-50 mb-2" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{p.title}</h5>
                      <span className="text-xs font-black text-slate-950">₹{p.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary Column */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-black text-slate-900">Current Bill Cart</h4>
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {posCart.length} Items
                  </span>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-2 py-3 border-b border-slate-100 text-xs">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={posCustomer.name}
                    onChange={(e) => setPosCustomer({ ...posCustomer, name: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                  <input
                    type="tel"
                    placeholder="Customer WhatsApp Mobile"
                    value={posCustomer.phone}
                    onChange={(e) => setPosCustomer({ ...posCustomer, phone: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>

                {/* Items in POS */}
                <div className="py-2 space-y-2 max-h-56 overflow-y-auto">
                  {posCart.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">Tap products from catalog to add into bill.</p>
                  ) : (
                    posCart.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="overflow-hidden pr-2">
                          <p className="font-bold text-slate-800 truncate">{it.title}</p>
                          <span className="text-[10px] text-slate-400">{it.selectedSize || 'N/A'} • x{it.quantity}</span>
                        </div>
                        <span className="font-black text-slate-900 shrink-0">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-950 mb-3">
                  <span>Grand Total:</span>
                  <span>₹{posCart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handlePosCheckout}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Printer size={16} />
                  <span>Generate & Print Bill</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS INVENTORY */}
        {managerTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Showroom Products Inventory
                </h2>
                <p className="text-xs text-slate-500">
                  Add, edit price, or manage stock in real-time. Changes sync to the live store immediately.
                </p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {products.map(product => (
                <div key={product.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex gap-3 items-center">
                  <img src={product.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0 border border-slate-100" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-600 font-bold uppercase block">{product.categoryName}</span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-slate-950">₹{product.price?.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{product.mrp?.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 rounded font-bold">Stock: {product.stockCount}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REELS & VIDEO DROPS */}
        {managerTab === 'reels' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  4K / 8K Video Reels & UGC Manager
                </h2>
                <p className="text-xs text-slate-500">
                  Add custom customer reviews, unboxings, or product videos.
                </p>
              </div>

              <button
                onClick={() => setIsAddReelOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus size={16} />
                <span>Upload / Add Reel</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {reels.map(reel => (
                <div key={reel.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex gap-3 items-center">
                  <img src={reel.poster} alt="" className="w-14 h-16 rounded-xl object-cover bg-slate-900 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-amber-600 font-bold uppercase block">{reel.badge || 'REEL'}</span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{reel.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{reel.author} • {reel.likes} likes</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReel(reel.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete reel"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal for orders */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* ADD NEW PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Product To Vault</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nike Air Jordan 1 Retro High"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Strike-through MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">High-Res Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs mt-3 shadow-sm active:scale-95 transition-all"
              >
                Save & Publish to Store App
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW REEL MODAL */}
      {isAddReelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Upload / Add 4K Video Reel</h3>
              <button onClick={() => setIsAddReelOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddReel} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reel Title / Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unboxing On Cloud Tilt in Lucknow 📦"
                  value={newReel.title}
                  onChange={(e) => setNewReel({ ...newReel, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Video Stream URL (MP4 / 4K)</label>
                <input
                  type="url"
                  required
                  value={newReel.videoUrl}
                  onChange={(e) => setNewReel({ ...newReel, videoUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Creator / Author Handle</label>
                  <input
                    type="text"
                    value={newReel.author}
                    onChange={(e) => setNewReel({ ...newReel, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newReel.badge}
                    onChange={(e) => setNewReel({ ...newReel, badge: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Linked Product ID</label>
                <select
                  value={newReel.productId}
                  onChange={(e) => setNewReel({ ...newReel, productId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs mt-3 shadow-sm active:scale-95 transition-all"
              >
                Publish Reel to Feed
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
