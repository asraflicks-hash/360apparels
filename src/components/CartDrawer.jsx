import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, 
  Tag, Check, Truck, MessageCircle, CreditCard 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORE_INFO, VOUCHERS } from '../data/products';
import { dispatchNewOrder } from '../data/storeState';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Lucknow',
    pincode: '226001'
  });

  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.flatDiscount) {
      discountAmount = appliedVoucher.flatDiscount;
    } else if (appliedVoucher.discountPercent) {
      discountAmount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
    }
  }

  const shipping = subtotal >= STORE_INFO.freeDeliveryThreshold ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    const found = VOUCHERS.find(v => v.code === code);
    if (!found) {
      setCouponError('Invalid promo code');
      return;
    }
    if (subtotal < found.minSpend) {
      setCouponError(`Min order value of ₹${found.minSpend} required`);
      return;
    }
    setAppliedVoucher(found);
    setCouponCode(code);
    setCouponError('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!customer.name || !customer.phone || !customer.address) {
      alert('Please fill your name, mobile number and delivery address.');
      return;
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const itemsSummary = cartItems
      .map((item, idx) => `${idx + 1}. ${item.title} (Qty: ${item.quantity}, Size: ${item.selectedSize || 'Standard'}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const orderText = `🛍️ *NEW 360APPARELS ORDER*
----------------------------------------
*Customer Name:* ${customer.name}
*Mobile Number:* ${customer.phone}
*Address:* ${customer.address}, ${customer.city} - ${customer.pincode}
*Payment Method:* ${paymentMethod.toUpperCase()}

*Ordered Items:*
${itemsSummary}

----------------------------------------
*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}
*Discount:* -₹${discountAmount.toLocaleString('en-IN')}
*Shipping:* ${shipping === 0 ? 'FREE' : `₹${shipping}`}
*GRAND TOTAL:* ₹${grandTotal.toLocaleString('en-IN')}

Please dispatch my order!`;

    // 1. Dispatch into local Manager App database with chime audio alert
    dispatchNewOrder({
      customer,
      items: cartItems,
      subtotal,
      discount: discountAmount,
      shipping,
      total: grandTotal,
      paymentMethod
    });

    // 2. Open WhatsApp with formatted order message
    window.open(`https://api.whatsapp.com/send?phone=${STORE_INFO.whatsappPhone}&text=${encodeURIComponent(orderText)}`, '_blank');

    setOrderSuccess(true);
    setTimeout(() => {
      onClearCart();
      setOrderSuccess(false);
      setIsCheckingOut(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {isCheckingOut ? 'Express Checkout' : 'Shopping Cart'}
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-amber-50/70 px-4 py-2 border-b border-amber-100/60">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-amber-900 font-medium flex items-center gap-1.5">
              <Truck size={13} className="text-amber-600" />
              {subtotal >= STORE_INFO.freeDeliveryThreshold 
                ? 'Free Express Shipping Unlocked! 🎉' 
                : `Add ₹${STORE_INFO.freeDeliveryThreshold - subtotal} more for FREE shipping`}
            </span>
            <span className="text-[10px] text-amber-800 font-bold">₹{STORE_INFO.freeDeliveryThreshold}</span>
          </div>
          <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / STORE_INFO.freeDeliveryThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Order Success View */}
        {orderSuccess ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check size={36} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Order Sent Successfully!</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Your order has been forwarded to 360apparels via WhatsApp. We will confirm dispatch shortly.
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <ShoppingBag size={28} />
            </div>
            <h4 className="text-base font-bold text-slate-900">Your Cart is Empty</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Browse sneakers, watches, and streetwear from the Lucknow vault.
            </p>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs active:scale-95 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : isCheckingOut ? (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-4 flex-1 overflow-y-auto space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Delivery Address
              </h4>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">WhatsApp Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Street Address</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House / Flat No, Street, Landmark"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Payment Method
              </h4>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle size={18} className="text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">WhatsApp 1-Tap Order</p>
                      <p className="text-[10px] text-slate-500">Confirmed directly with Lucknow store</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    FASTEST
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-medium'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Truck size={18} className="text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-slate-500">Pay at doorstep upon arrival</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-medium'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={18} className="text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">UPI / GPay / PhonePe / Card</p>
                      <p className="text-[10px] text-slate-500">Online payment via Razorpay</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <span>Confirm Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="w-full py-2 mt-1 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ← Back to Cart
              </button>
            </div>
          </form>
        ) : (
          /* Normal Cart List */
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div className="space-y-2.5">
              {cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedSize}`}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-15 h-15 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                    <p className="text-[11px] text-slate-500">
                      Size: <span className="font-semibold text-slate-800">{item.selectedSize || 'Standard'}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-black text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Delete */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.id, item.selectedSize)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200 shadow-2xs">
                      <button
                        onClick={() => onUpdateQty(item.id, item.selectedSize, item.quantity - 1)}
                        className="p-1 rounded text-slate-600 hover:bg-slate-100"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold text-slate-900 px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.selectedSize, item.quantity + 1)}
                        className="p-1 rounded text-slate-600 hover:bg-slate-100"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <Tag size={12} className="text-amber-500" />
                Apply Promo Voucher
              </span>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 360FIRST"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 uppercase focus:outline-none focus:border-slate-900"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[10px] text-rose-500 font-semibold">{couponError}</p>
              )}

              {appliedVoucher && (
                <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span>✓ {appliedVoucher.code} Applied ({appliedVoucher.title})</span>
                  <button 
                    onClick={() => { setAppliedVoucher(null); setCouponCode(''); }}
                    className="text-slate-500 hover:text-slate-900 text-xs ml-2"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Quick voucher chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {VOUCHERS.map(v => (
                  <button
                    key={v.code}
                    onClick={() => handleApplyCoupon(v.code)}
                    className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:border-slate-400 shrink-0"
                  >
                    {v.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Express Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'text-slate-900'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-slate-950 text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Bottom CTA */}
        {!isCheckingOut && cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}