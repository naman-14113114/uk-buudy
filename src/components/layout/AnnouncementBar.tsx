"use client";

import { usePathname } from "next/navigation";

const earlyBlackFridayItems = [
  "🖤 EARLY BLACK FRIDAY SALE - SAVE 60% + EXTRA £10 OFF 🖤",
  "🏷️ EXTRA £10 OFF WITH CODE BUUDY10 🏷️",
  "🎁 FREE £70 RED TORCH + GIFT BUNDLE 🎁",
  "🚚 FREE UK EXPRESS DELIVERY · 90-DAY EXTENDED HOLIDAY GUARANTEE",
];

const halloweenItems = [
  "🎃 HALLOWEEN SALE - SAVE 60% 🎃",
  "🦇 SIGN UP AND ENJOY £10 OFF 🦇",
  "🎃 FREE SHIPPING ON ALL ORDERS 🎃",
  "EASY RETURNS AND REFUNDS",
];

export function AnnouncementBar() {
  const pathname = usePathname();
  const isEarlyBlackFridayPage =
    pathname === "/products/buudy-led-face-mask" ||
    pathname === "/products/buudy-led-face-mask/";
  const activeItems = isEarlyBlackFridayPage ? earlyBlackFridayItems : halloweenItems;
  const items = [...activeItems, ...activeItems, ...activeItems];

  return (
    <div className={`overflow-hidden py-3 text-[#f7f1e8] transition-colors duration-300 ${isEarlyBlackFridayPage ? "bg-[#140617] border-b border-[rgba(184,149,86,0.3)]" : "bg-[#200e24]"}`}>
      <div className="buudy-marquee buudy-marquee-slow flex items-center gap-6">
        {items.map((item, index) => (
          <span
            className="font-sans text-xs font-bold uppercase tracking-[0.15em] whitespace-nowrap flex items-center gap-6"
            key={`${item}-${index}`}
          >
            {item}
            <span className="text-[#f7f1e8] opacity-80">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
