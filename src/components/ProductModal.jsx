import React, { useState } from 'react';
import { 
  X, Heart, Star, ShoppingBag, MessageCircle, ShieldCheck, 
  Truck, RotateCw, Check, ArrowRight, Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORE_INFO } from '../data/products';

export default function ProductModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false 
}) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : null);
  const [selectedColor, setSelectedColor] = useState(product?.colors ? product.colors[0] : null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [pincode, setPincode] = useState('226001');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  if (!product) return null;

  const gallery = product.gallery || [product.image];

  const handleAddToCartWithCelebration = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981']
    });
  };

  const handleWhatsAppOrder = () => {
    const text = `Hello 360apparels! I want to order this item:
*Item:* ${product.title}
*Price:* ₹${product.price.toLocaleString('en-IN')} (MRP: ₹${product.mrp.toLocaleString('en-IN')})
*Selected Size:* ${selectedSize || 'Standard'}
*Selected Color:* ${selectedColor ? selectedColor.name : 'Standard'}
*Product Link:* ${product.cartpeUrl}

Please confirm availability and share payment/delivery details.`;

    window.open(`https://api.whatsapp.com/send?phone=${STORE_INFO.whatsappPhone}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const toggleAutoSpin = () => {
    if (isAutoSpinning) {
      setIsAutoSpinning(false);
    } else {
      setIsAutoSpinning(true);
      setIs360Mode(true);
      let angle = rotationAngle;
      const interval = setInterval(() => {
        angle = (angle + 4) % 360;
        setRotationAngle(angle);
      }, 30);
      setTimeout(() => {
        clearInterval(interval);
        setIsAutoSpinning(false);
      }, 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200">
        {/* Sticky top action bar */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {product.categoryName}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              4K STUDIO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-full border transition-all ${
                isWishlisted 
                  ? 'bg-rose-50 border-rose-200 text-rose-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
            >
              <Heart size={17} className={isWishlisted ? 'fill-rose-500' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Main Visual Display & 360 Rotate Simulator */}
          <div className="relative rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden">
            {/* Interactive 360 mode banner */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <button
                onClick={() => setIs360Mode(!is360Mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  is360Mode 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <RotateCw size={12} className={isAutoSpinning ? 'animate-spin' : ''} />
                <span>360° Orbit</span>
              </button>

              {is360Mode && (
                <button
                  onClick={toggleAutoSpin}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
                >
                  {isAutoSpinning ? 'Pause' : 'Auto Spin'}
                </button>
              )}
            </div>

            {/* Discount Badge */}
            <div className="absolute top-3 right-3 z-20">
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-xs">
                {product.discount}
              </span>
            </div>

            {/* Image viewport */}
            <div className="w-full h-64 sm:h-80 flex items-center justify-center p-4 perspective-[1000px]">
              <img
                src={gallery[selectedImg] || product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-100 ease-out"
                style={{
                  transform: is360Mode 
                    ? `rotateY(${rotationAngle}deg) scale(${1 + Math.abs(Math.sin((rotationAngle * Math.PI) / 180)) * 0.1})` 
                    : 'none'
                }}
              />
            </div>

            {/* 360 Degree Drag slider */}
            {is360Mode && (
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-3">
                <span className="text-[11px] text-slate-700 font-bold whitespace-nowrap">
                  Rotate ({Math.round(rotationAngle)}°)
                </span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>
            )}

            {/* Gallery Thumbnails */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImg(idx);
                    setIs360Mode(false);
                  }}
                  className={`w-13 h-13 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImg === idx 
                      ? 'border-slate-900 scale-105 shadow-sm' 
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Header Info */}
          <div>
            <div className="flex items-center gap-2 text-xs mb-1.5">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-200">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviews})</span>
              </div>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck size={13} /> 100% Genuine
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-1">
              {product.title}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              {product.subtitle || product.description}
            </p>

            {/* Price Box */}
            <div className="flex items-baseline gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through">
                MRP: ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Color: <span className="text-slate-900">{selectedColor?.name}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${
                      selectedColor?.name === color.name
                        ? 'border-slate-900 bg-slate-100 text-slate-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Pincode */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Truck size={14} className="text-amber-500" />
                Delivery Options
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Lucknow Fast Dispatch
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <button
                onClick={() => setPincodeChecked(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white"
              >
                Check
              </button>
            </div>

            {pincodeChecked && (
              <p className="text-[11px] text-slate-600 flex items-center gap-1">
                <Check size={12} className="text-emerald-600" />
                <span>Delivering to <b>{pincode}</b> by <b>Tomorrow</b> (Express Delivery).</span>
              </p>
            )}
          </div>
        </div>

        {/* Sticky bottom CTA actions */}
        <div className="p-3.5 border-t border-slate-200 bg-white sticky bottom-0 z-30 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleWhatsAppOrder}
            className="py-3 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <MessageCircle size={16} />
            <span>Order on WhatsApp</span>
          </button>

          <button
            onClick={handleAddToCartWithCelebration}
            className="py-3 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
