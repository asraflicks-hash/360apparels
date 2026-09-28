import React from 'react';
import { Heart, ShoppingBag, Star, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function ProductCard({ 
  product, 
  onSelectProduct, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false 
}) {
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_INFO.whatsappPhone}&text=${encodeURIComponent(
    `Hello 360apparels! I am interested in: ${product.title} (Price: ₹${product.price.toLocaleString('en-IN')}). Link: ${product.cartpeUrl}`
  )}`;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200">
      {/* Product Image Area */}
      <div 
        onClick={() => onSelectProduct(product.id)}
        className="relative w-full aspect-square bg-slate-100/70 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
            {product.discount}
          </span>
          {product.badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-all z-10 ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-500 border border-rose-200' 
              : 'bg-white/90 text-slate-400 hover:text-rose-500'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={15} className={isWishlisted ? 'fill-rose-500' : ''} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px] truncate max-w-[90px]">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelectProduct(product.id)}
            className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-tight cursor-pointer hover:text-amber-600 transition-colors mb-2 min-h-[32px]"
          >
            {product.title}
          </h3>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5 mb-2.5 flex-wrap">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Buttons: WhatsApp & Add to Cart */}
          <div className="grid grid-cols-2 gap-1.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors active:scale-95"
            >
              <MessageCircle size={13} className="shrink-0" />
              <span className="truncate">Inquiry</span>
            </a>

            <button
              onClick={() => onAddToCart(product)}
              className="py-2 px-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-xs"
            >
              <ShoppingBag size={13} className="shrink-0" />
              <span className="truncate">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
