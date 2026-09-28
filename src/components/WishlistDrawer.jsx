import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500 fill-rose-500" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Wishlist
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {wishlistItems.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {wishlistItems.length === 0 ? (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center">
                <Heart size={24} />
              </div>
              <h4 className="text-base font-bold text-slate-900">Your Wishlist is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Tap the heart on any sneakers, watches or apparel to save them here.
              </p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex gap-3 items-center group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  onClick={() => {
                    onClose();
                    onSelectProduct(item.id);
                  }}
                  className="w-15 h-15 rounded-xl object-cover bg-white shrink-0 border border-slate-200 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <h5 
                    onClick={() => {
                      onClose();
                      onSelectProduct(item.id);
                    }}
                    className="text-xs font-bold text-slate-900 truncate cursor-pointer hover:text-amber-600"
                  >
                    {item.title}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-semibold">{item.categoryName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-black text-slate-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{item.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onRemoveFromWishlist(item.id);
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-95 transition-all"
                    title="Move to Cart"
                  >
                    <ShoppingBag size={14} />
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
