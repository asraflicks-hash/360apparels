import React from 'react';
import { X, MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { STORE_INFO } from '../data/products';

export default function StoreLocationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Store Information</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <img
              src={STORE_INFO.logoUrl}
              alt={STORE_INFO.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                {STORE_INFO.name}
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                  Verified
                </span>
              </h4>
              <p className="text-xs text-slate-500">{STORE_INFO.tagline}</p>
              <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                <span>★ {STORE_INFO.rating}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-normal">{STORE_INFO.reviewsCount} reviews</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physical Store Address</span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{STORE_INFO.address}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Store Timings</span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{STORE_INFO.hours}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <Phone size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Direct Phone</span>
                <a href={`tel:${STORE_INFO.phone}`} className="text-xs font-bold text-slate-900 hover:text-amber-600 mt-0.5 block">
                  +91 {STORE_INFO.phone}
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <Mail size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Support</span>
                <a href={`mailto:${STORE_INFO.email}`} className="text-xs font-semibold text-slate-800 mt-0.5 block">
                  {STORE_INFO.email}
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <div className="text-pink-600 shrink-0 mt-0.5">
                <InstagramIcon size={16} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Instagram</span>
                <a 
                  href={STORE_INFO.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-bold text-pink-600 hover:underline mt-0.5 flex items-center gap-1"
                >
                  {STORE_INFO.instagramHandle} <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href={`https://api.whatsapp.com/send?phone=${STORE_INFO.whatsappPhone}&text=${encodeURIComponent("Hello 360apparels, I want to visit your Indralok Market store!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${STORE_INFO.phone}`}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Phone size={15} />
              <span>Call Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
