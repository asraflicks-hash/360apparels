import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, VolumeX, Sparkles, ShoppingBag } from 'lucide-react';
import { STORIES } from '../data/products';

export default function StoriesBar({ onSelectProduct }) {
  const [activeStory, setActiveStory] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    let interval;
    if (activeStory) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            const currentIndex = STORIES.findIndex(s => s.id === activeStory.id);
            if (currentIndex < STORIES.length - 1) {
              setActiveStory(STORIES[currentIndex + 1]);
              return 0;
            } else {
              setActiveStory(null);
              return 0;
            }
          }
          return prev + 1.2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  return (
    <div className="py-2.5 px-4 bg-white border-b border-slate-100">
      {/* Horizontal Story list */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 group-hover:scale-105 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white bg-slate-100">
                <img
                  src={story.avatar}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-sm whitespace-nowrap">
                {story.badge}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-700 max-w-[64px] truncate group-hover:text-slate-900 transition-colors">
              {story.title}
            </span>
          </button>
        ))}
      </div>

      {/* Story Video Fullscreen Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4">
          <div className="relative w-full max-w-sm h-full md:h-[90vh] bg-slate-950 md:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Top progress bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-amber-400 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <img
                    src={activeStory.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full border border-amber-400/60 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold leading-tight flex items-center gap-1">
                      {activeStory.title}
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/40">
                        {activeStory.badge}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-300">Indralok Market, Lucknow</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button
                    onClick={() => setActiveStory(null)}
                    className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={activeStory.video}
                poster={activeStory.poster}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom story callout */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
              <p className="text-xs text-slate-200 mb-3 font-medium">
                {activeStory.caption}
              </p>
              
              <button
                onClick={() => {
                  const prodId = activeStory.productId;
                  setActiveStory(null);
                  if (onSelectProduct) onSelectProduct(prodId);
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <ShoppingBag size={18} />
                <span>Shop This Drop Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
