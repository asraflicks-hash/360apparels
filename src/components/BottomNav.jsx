import React from 'react';
import { Home, Grid, Video, Heart, ShoppingBag } from 'lucide-react';

export default function BottomNav({
  activeTab,
  onTabChange,
  cartCount = 0,
  wishlistCount = 0
}) {
  const tabs = [
    { id: 'vault', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'reels', label: '4K Reels', icon: Video, badge: 'LIVE' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, count: cartCount }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around max-w-md mx-auto sm:rounded-t-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 focus:outline-none ${
              isActive
                ? 'text-slate-950 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Icon size={20} className={isActive ? 'stroke-[2.5] text-amber-500' : 'stroke-2'} />

              {/* Counter Badge */}
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {tab.count}
                </span>
              )}

              {/* LIVE Badge */}
              {tab.badge && (
                <span className="absolute -top-1 -right-3 bg-rose-500 text-white text-[8px] font-black px-1 rounded-full shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] tracking-tight">{tab.label}</span>

            {/* Active indicator dot */}
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
