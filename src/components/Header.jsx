import React from 'react';
import { Search, Heart, ShoppingBag, MapPin, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function Header({ 
  onOpenSearch, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenStoreInfo,
  cartCount = 0, 
  wishlistCount = 0 
}) {
  return (
    <header className="sticky top-0 z-40 w-full clean-header px-4 py-2.5 shadow-sm transition-all">
      {/* Top Location & Fast Contact Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs text-slate-600 font-medium">
        <button 
          onClick={onOpenStoreInfo}
          className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors text-left"
        >
          <MapPin size={13} className="text-amber-500 shrink-0" />
          <span className="font-semibold text-slate-800">Lucknow Store</span>
          <span className="text-slate-400">• Indralok Mkt</span>
          <ChevronDown size={12} className="text-slate-400" />
        </button>

        <div className="flex items-center gap-3">
          <a 
            href={`tel:${STORE_INFO.phone}`} 
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Phone size={12} className="text-slate-500" />
            <span>Call</span>
          </a>
          <a 
            href={`https://api.whatsapp.com/send?phone=${STORE_INFO.whatsappPhone}&text=${encodeURIComponent("Hello 360apparels, I need help with an order.")}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <MessageCircle size={12} className="text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Bar: Logo & Actions */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenStoreInfo}>
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
            <img 
              src={STORE_INFO.logoSm} 
              alt={STORE_INFO.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://cdn.cartpe.in/images/store_logo/64188cc8e9943.jpeg";
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">
                360<span className="text-amber-500">APPARELS</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                LKO
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <button 
            onClick={onOpenWishlist}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition-all active:scale-95"
            aria-label="Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button 
            onClick={onOpenCart}
            className="p-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold relative transition-all active:scale-95 shadow-sm flex items-center gap-1.5"
            aria-label="Cart"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Embedded Search Input (Flipkart / Amazon style) */}
      <div 
        onClick={onOpenSearch}
        className="w-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors shadow-inner"
      >
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Search size={15} className="text-slate-500" />
          <span className="text-slate-500">Search sneakers, watches, tees, perfumes...</span>
        </div>
        <span className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-md font-semibold border border-slate-200 shadow-2xs">
          Search
        </span>
      </div>
    </header>
  );
}
