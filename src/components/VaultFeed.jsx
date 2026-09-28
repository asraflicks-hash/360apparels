import React from 'react';
import { 
  Sparkles, ShieldCheck, Truck, RotateCcw, MessageCircle, 
  MapPin, Phone, Flame, ArrowRight, Star, Footprints, Watch, Shirt, Layers, SprayCan 
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import StoriesBar from './StoriesBar';
import ProductCard from './ProductCard';
import { PRODUCTS, CATEGORIES, STORE_INFO } from '../data/products';

const categoryIconMap = {
  all: Sparkles,
  shoes: Footprints,
  watches: Watch,
  tshirts: Shirt,
  hoodies: Flame,
  jackets: Layers,
  clothing: Sparkles,
  perfumes: SprayCan
};

export default function VaultFeed({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistMap = {},
  onOpenStoreInfo,
  onSwitchToReels
}) {
  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-4 pb-24 bg-slate-50">
      {/* 1. Live Stories */}
      <StoriesBar onSelectProduct={onSelectProduct} />

      {/* 2. Sleek Compact Promo Banner (Modern E-Commerce style) */}
      <div className="px-3 sm:px-4">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="space-y-1.5 max-w-[65%] z-10">
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
              Lucknow Vault Drop
            </span>
            <h2 className="text-base sm:text-xl font-black leading-tight tracking-tight">
              Exclusive Sneakers & Luxury Watches
            </h2>
            <p className="text-[11px] text-slate-300 font-medium">
              Up to 90% Off • Same Day Lucknow Dispatch
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSelectProduct(1)}
                className="py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>Shop Now</span>
                <ArrowRight size={12} />
              </button>
              <button
                onClick={onSwitchToReels}
                className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10"
              >
                4K Reels
              </button>
            </div>
          </div>

          {/* Right Hero Image graphic */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden shadow-md border border-white/20">
            <img 
              src="https://cdn.cartpe.in/images/gallery_sm/6ab4cef7774140.jpeg" 
              alt="Promo"
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* 3. Category Bubbles (Amazon / Flipkart / Myntra Style) */}
      <div className="px-3 sm:px-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Explore Categories
          </h3>
          <button 
            onClick={() => onSelectCategory('all')} 
            className="text-xs font-semibold text-amber-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="flex items-start gap-3 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = categoryIconMap[cat.id] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
              >
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all shadow-xs ${
                  isSelected 
                    ? 'bg-slate-900 text-amber-400 scale-105 shadow-md' 
                    : 'bg-white text-slate-700 border border-slate-200/80 group-hover:border-slate-300'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`text-[11px] font-medium max-w-[65px] text-center leading-tight truncate ${
                  isSelected ? 'text-slate-950 font-bold' : 'text-slate-600'
                }`}>
                  {cat.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Trust Strip (Single Compact Clean Row) */}
      <div className="px-3 sm:px-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-slate-600 font-medium overflow-x-auto no-scrollbar gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>100% Genuine</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck size={14} className="text-amber-500" />
            <span>Lucknow 24h Express</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <RotateCcw size={14} className="text-blue-500" />
            <span>7-Day Size Exchange</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <MessageCircle size={14} className="text-emerald-600" />
            <span>WhatsApp Support</span>
          </div>
        </div>
      </div>

      {/* 5. Products Section: STRICTLY 2 Columns on Mobile */}
      <div className="px-3 sm:px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900">
              {selectedCategory === 'all' ? 'Featured Drops' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h3>
            <span className="text-[11px] text-slate-500 bg-slate-200/60 px-2 py-0.2 rounded-full font-semibold">
              {filteredProducts.length}
            </span>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* 2-Column Responsive Grid with proper spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={Boolean(wishlistMap[product.id])}
            />
          ))}
        </div>
      </div>

      {/* 6. Official 360apparels Lucknow Flagship Showroom Card */}
      <div className="px-3 sm:px-4 pt-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <img
                src={STORE_INFO.logoSm}
                alt=""
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-black text-slate-900">360apparels Lucknow</h4>
                <p className="text-[11px] text-slate-500">M-63, Indralok Market • 11:30 AM - 9:30 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors"
                title="Call"
              >
                <Phone size={14} className="text-amber-500" />
                <span className="hidden sm:inline">Call</span>
              </a>

              <a
                href={STORE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs flex items-center gap-1 transition-colors"
                title="Instagram"
              >
                <InstagramIcon size={14} />
                <span className="hidden sm:inline">Instagram</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone / WhatsApp:</span>
              <span className="font-semibold text-slate-900">+91 9044286001</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Location:</span>
              <span className="font-semibold text-slate-900">Indralok Market, LKO</span>
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
            <span>© 2026 360apparels</span>
            <span>Made with ❤️ for India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
