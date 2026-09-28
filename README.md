# 📱 360apparels — Ultra Luxury Mobile App (Android & iOS)

A world-class, high-performance cross-platform mobile e-commerce application created for **[360apparels](https://360apparels.cartpe.in/)** (Lucknow Flagship Showroom). Engineered with an ultra-luxury obsidian & gold aesthetic that surpasses mainstream retail giants like Amazon and Flipkart in visual polish, micro-animations, speed, and media presentation.

---

## 🏬 Scraped & Integrated Store Information

| Detail | Store Data |
| :--- | :--- |
| **Store Name** | **360apparels** (360 Lucknow Online) |
| **Direct Contact / WhatsApp** | `+91 9044286001` |
| **Email Support** | `shivendrajha786@gmail.com` |
| **Physical Flagship Address** | `M-63, Indralok Market, Lucknow, Uttar Pradesh` |
| **Operating Hours** | `11:30 AM - 9:30 PM (Monday - Saturday)` |
| **Instagram Official** | [@360_lucknowonline](http://instagram.com/360_lucknowonline) |
| **Core Inventory** | Sneakers & Kicks, Luxury Watches, Oversized Tees, Hoodies, Jackets, Designer Fragrances |

---

## 🌟 Key Features (Amazon & Flipkart-Beating Design)

1. **4K & 8K Ultra UHD Live Media & Reels Feed**:
   - Instagram / TikTok / Myntra Studio-inspired vertical video feed playing high-res 4K fashion runways, sneaker unboxings, and wrist watch reviews.
   - One-tap "Shop This Look" floating card embedded inside videos.
   - Stories bar at the top with tap-to-watch 4K story progress bars.
2. **Interactive 360° Orbit Simulator**:
   - Tap any sneaker or luxury watch to enter 360° mode: drag the interactive degree slider or hit "Auto 360°" to inspect every angle in 4K resolution.
3. **1-Tap WhatsApp Direct Ordering & Checkout**:
   - Direct pre-filled inquiries & formatted order placement sent straight to `9044286001` with customer name, phone, address, selected sizes, quantities, and totals.
4. **One-Page Express Checkout**:
   - Pincode check with automatic Lucknow same-day express delivery badge.
   - Cash on Delivery (COD), Direct WhatsApp Confirmation, and UPI / Razorpay options.
   - Promo coupon vouchers (`360FIRST` for 15% OFF, `LUCKNOW500` for ₹500 OFF).
5. **Glassmorphism & Haptic Aesthetics**:
   - Obsidian dark mode, frosted blur panels, gold gradient accents, and dynamic bottom navigation dock.
   - Persistent Cart and Wishlist using local storage.
6. **Phone Frame Preview / Responsive Web Toggle**:
   - Toggle between responsive fullscreen view and an iPhone 16 Pro / Android titanium phone mockup with simulated 5G status bar.

---

## 🚀 How to Run & Preview

The dev server is running live:
- **Local Browser:** `http://localhost:5173/`
- **On Your Phone (Same WiFi):** `http://192.168.1.4:5173/`

### Commands:
```bash
# Start dev server
npm run dev

# Re-build and sync assets to native Android
npm run mobile:sync

# Open native Android project in Android Studio (for generating APK / AAB)
npm run android:open
```

---

## 📦 Building Native Android APK & iOS IPA

This project is fully powered by **Capacitor**:
- **Android:** Native project located in `./android`. Open it in Android Studio with `npm run android:open`, then click `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.
- **iOS:** On macOS, run `npx cap add ios` followed by `npm run ios:open` to open Xcode and run on iPhone or build IPA.
