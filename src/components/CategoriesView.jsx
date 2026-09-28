import React from 'react';
import { 
  Footprints, Watch, Shirt, Flame, Layers, Crown, SprayCan, Sparkles, ArrowRight 
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

const iconMap = {
  Sparkles,
  Footprints,
  Watch,
  Shirt,
  Flame,
  Layers,
  Crown,
  SprayCan
};

export default function CategoriesView({ onSelectCategory }) {
  return (
    <div className="p-4 space-y-4 pb-24 bg-slate-50 min-h-screen">
      <div>
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>Vault Categories</span>
          <span className="text-[10px] uppercase bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
            Showroom
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Curated departments from the 360apparels Lucknow store.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-slate-900 text-slate-800 group-hover:text-amber-400 transition-colors">
                  <IconComponent size={20} />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {cat.count} Items
                </span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-950 transition-colors">
                  {cat.name}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold mt-1">
                  <span>Explore</span>
                  <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
