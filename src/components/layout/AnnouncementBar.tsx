"use client";

const halloweenItems = [
  "🎃 HALLOWEEN SALE - SAVE 60% 🎃",
  "🦇 SIGN UP AND ENJOY £10 OFF 🦇",
  "🎃 FREE SHIPPING ON ALL ORDERS 🎃",
  "EASY RETURNS AND REFUNDS",
];

export function AnnouncementBar() {
  const items = [...halloweenItems, ...halloweenItems, ...halloweenItems];

  return (
    <div className="overflow-hidden py-3 bg-[#200e24] text-[#f7f1e8]">
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
