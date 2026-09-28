import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';

export default function SearchModal({
  isOpen,
  onClose,
  onSelectProduct
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const popularTags = [
    'On Cloud', 'Rado Diastar', 'Gucci Rhyton', 'Prada Black', 'Birkenstock', 'Tom Ford', 'New Balance'
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) || 
        (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [searchTerm, selectedCategory, sortBy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:my-8 flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-100 bg-white sticky top-0 z-20 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sneakers, watches, apparel, perfumes..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
          >
            <X size={17} />
          </button>
        </div>

        {/* Filters and Suggestions */}
        <div className="p-3.5 border-b border-slate-100 space-y-2.5 bg-slate-50/50">
          {/* Popular Tag Quick Search */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:border-slate-400 shrink-0 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort & Category controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-slate-900 shrink-0"
            >
              <option value="popular">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
          <p className="text-[11px] text-slate-400 font-medium">
            Found {filteredProducts.length} articles
          </p>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-1">
              <p className="text-sm">No items found for "{searchTerm}"</p>
              <p className="text-xs text-slate-500">Try searching for Sneakers, Watches, or Prada.</p>
            </div>
          ) : (
            filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onSelectProduct(item.id);
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between gap-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-13 h-13 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
                      {item.categoryName}
                    </span>
                    <h5 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {item.title}
                    </h5>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-black text-slate-900">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{item.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-emerald-600 font-bold">
                        {item.discount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0">
                  <ArrowRight size={15} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
