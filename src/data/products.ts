import {
  productAsset,
  productMediaAsset,
  type ProductImage,
} from "@/lib/media";
import { market, type StoreCurrency } from "@/lib/market";
import {
  faqs,
  standardMaskFaqs,
  buudyLedMaskFaqs,
  torchFaqs,
  iplFaqs,
  torchWavelengths,
  type FAQItem,
  type Wavelength,
} from "./productSections";

export { standardMaskFaqs, buudyLedMaskFaqs };

export type ProductGift = {
  id: string;
  name: string;
  valueCents: number;
  image: string;
  label: string;
  href: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type IncludedItem = {
  quantity: string;
  label: string;
  tag?: string;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  template: "mask" | "torch" | "ipl" | "minimal" | "serum" | "cleanser";
  name: string;
  heroTitle: string;
  heroEmphasis: string;
  shortDescription: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  currency: StoreCurrency;
  priceCents: number;
  compareAtCents: number;
  rating: number;
  reviewCount: number;
  customerCount: string;
  promoCode: string;
  promoLabel: string;
  cartImage: string;
  gallery: ProductImage[];
  gifts: ProductGift[];
  specs: ProductSpec[];
  included: IncludedItem[];
  highlights: string[];
  keyBenefits?: string[];
  differentiators?: string[];
  faqs: FAQItem[];
  wavelengths?: Wavelength[];
  badges: string[];
};

export const fullLedMaskGallery: ProductImage[] = [
  {
    src: productAsset("buudy-7-colour-led-mask-ce-certified-red-light-therapy-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask CE certified for red light therapy and skin rejuvenation UK",
  },
  {
    src: productAsset("buudy-7-colour-led-mask-cleopatra-edition-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask worn at home in red light therapy mode for anti-ageing in the UK",
    badge: {
      title: "FULL FACE & NECK\nCOVERAGE",
      sub: "Targeted firming & smoothing\nfor jawline & neck",
      position: "bottom-right",
      theme: "white",
    },
  },
  {
    src: productMediaAsset(
      "buudy-7-colour-led-mask-7-light-modes-showcase-uk.mp4",
      "buudy-led-mask",
      "videos",
    ),
    alt: "Buudy 7 Colour LED Face Mask 7 clinical light wavelengths and modes video showcase UK",
    badge: {
      title: "7 CLINICAL\nWAVELENGTHS",
      sub: "Complete spectrum for\nrejuvenation, clarity & glow",
      position: "bottom-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-with-free-red-light-torch-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask with included complimentary Red Light Torch treatment UK",
    badge: {
      title: "FREE BUUDY\nLED TORCH",
      sub: "£70 targeted red light device\nincluded free with your order",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy_purple.jpeg"),
    alt: "Buudy 7 Colour LED Face Mask with 192 high-density clinical LEDs across face and neck UK",
    badge: {
      title: "192 HIGH-DENSITY\nCLINICAL LEDS",
      sub: "Maximum coverage & optical\npower across face & neck",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("02-buudy-led-mask-side-profile.webp"),
    alt: "Buudy LED Mask side profile with built-in touch controls and cordless design",
    badge: {
      title: "100% CORDLESS &\nPORTABLE",
      sub: "Built-in touch controls on mask —\nno remote needed to carry or charge",
      position: "bottom-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-skin-rejuvenation-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask dermatologist approved for full skin rejuvenation UK",
    badge: {
      title: "DERMATOLOGIST\nRECOMMENDED",
      sub: "Trusted by skincare specialists\nfor everyday at-home routines",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("07-buudy-led-mask-controller.webp"),
    alt: "Buudy LED Mask tap controller",
    badge: {
      title: "SMART BUUDY\nAPP COMPANION",
      sub: "Personalised guided routines\n& progress tracking",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("09-buudy-led-mask-home-spa.webp"),
    alt: "Buudy LED Mask home spa",
  },
  {
    src: productAsset("05-buudy-led-mask-packaging.webp"),
    alt: "Buudy LED Mask packaging",
    badge: {
      title: "830NM DEEP NEAR\nINFRARED LIGHT",
      sub: "Deep dermal penetration\nboosts collagen & elasticity",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("04-buudy-led-mask-blue-light-acne.webp"),
    alt: "Buudy LED Mask blue light acne mode",
    badge: {
      title: "415NM TARGETED\nBLUE LIGHT",
      sub: "Purifies active blemishes\n& eliminates acne bacteria",
      position: "bottom-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-before-after-acne-breakouts-complexion-uk.webp"),
    alt: "Buudy 7 Colour LED Mask before and after clinical results: clears active acne breakouts and calms inflamed complexion UK",
    pills: [
      { text: "2-Weeks", bg: "#F7F1E8", textColor: "#2E102F", borderColor: "rgba(58, 31, 61, 0.18)" },
      { text: "Blue 7-min", bg: "#2563EB", textColor: "#FFFFFF" },
      { text: "Yellow 3-min", bg: "#EAB308", textColor: "#1C1917" },
    ],
  },
  {
    src: productMediaAsset("Cleopatra-LED-Red-Light-Mask.webp"),
    alt: "Buudy LED Mask red light therapy mode for anti-ageing and collagen stimulation",
    badge: {
      title: "633NM RED LIGHT\nTHERAPY",
      sub: "Stimulates collagen production\n& reduces fine lines and wrinkles",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-before-after-anti-ageing-eye-wrinkles-uk.webp"),
    alt: "Buudy 7 Colour LED Mask before and after anti-ageing results: visibly reduces crow's feet and eye-area fine lines UK",
    pills: [
      { text: "4-Weeks", bg: "#F7F1E8", textColor: "#2E102F", borderColor: "rgba(58, 31, 61, 0.18)" },
      { text: "Red 6-min", bg: "#DC2626", textColor: "#FFFFFF" },
      { text: "White 4-min", bg: "#FFFFFF", textColor: "#1C1917", borderColor: "rgba(0, 0, 0, 0.18)" },
    ],
  },
  {
    src: productAsset("buudy-7-colour-led-mask-uk-anti-ageing-red-light-therapy.webp"),
    alt: "Buudy 7 Colour LED Mask purple light mode for skin rejuvenation in the UK",
    badge: {
      title: "390NM PURPLE\nLIGHT THERAPY",
      sub: "Combines red & blue wavelengths\nfor deep repair & blemish control",
      position: "bottom-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-before-after-blemish-clarity-radiance-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask before and after transformation: clears post-acne marks and enhances skin radiance UK",
    pills: [
      { text: "3-Weeks", bg: "#F7F1E8", textColor: "#2E102F", borderColor: "rgba(58, 31, 61, 0.18)" },
      { text: "Purple 3-min", bg: "#9333EA", textColor: "#FFFFFF" },
      { text: "Blue 7-min", bg: "#2563EB", textColor: "#FFFFFF" },
    ],
  },
  {
    src: productAsset("03-buudy-led-mask-anti-ageing-mode.webp"),
    alt: "Buudy LED Mask green light mode for dark spots and even skin tone",
    badge: {
      title: "525NM GREEN LIGHT\nTHERAPY",
      sub: "Fades dark spots, calms\nredness & evens skin tone",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-before-after-dark-spots-pigmentation-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask before and after results: fades dark spots and sun-induced hyperpigmentation UK",
    pills: [
      { text: "4-Weeks", bg: "#F7F1E8", textColor: "#2E102F", borderColor: "rgba(58, 31, 61, 0.18)" },
      { text: "Green 7-min", bg: "#16A34A", textColor: "#FFFFFF" },
      { text: "Red 3-min", bg: "#DC2626", textColor: "#FFFFFF" },
    ],
  },
  {
    src: productAsset("06-buudy-led-mask-results.webp"),
    alt: "Buudy LED Mask yellow light mode for balanced skin texture and tone",
    badge: {
      title: "590NM YELLOW\nLIGHT THERAPY",
      sub: "Balances skin texture, soothes\nsensitivity & boosts radiance",
      position: "top-right",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-before-after-evens-skin-tone-smoothing-uk.webp"),
    alt: "Buudy 7 Colour LED Mask before and after clinical comparison: evens mottled skin tone and smooths fine texture UK",
    pills: [
      { text: "4-Weeks", bg: "#F7F1E8", textColor: "#2E102F", borderColor: "rgba(58, 31, 61, 0.18)" },
      { text: "Green 6-min", bg: "#16A34A", textColor: "#FFFFFF" },
      { text: "Yellow 4-min", bg: "#EAB308", textColor: "#1C1917" },
    ],
  },
  {
    src: productAsset("buudy-7-colour-led-mask-cyan-light-therapy-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask white light therapy mode for accelerating skin metabolism and renewal UK",
    badge: {
      title: "510NM WHITE\nLIGHT THERAPY",
      sub: "Accelerates skin metabolism,\ntightens skin & boosts cellular repair",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-before-after-cystic-acne-jawline-uk.webp"),
    alt: "Buudy 7 Colour LED Mask before and after results: eliminates persistent cystic acne and smooths lower cheek and jawline UK",
    pills: [
      { text: "3-Weeks", bg: "#F7F1E8", textColor: "#2E102F", borderColor: "rgba(58, 31, 61, 0.18)" },
      { text: "Blue 6-min", bg: "#2563EB", textColor: "#FFFFFF" },
      { text: "Purple 4-min", bg: "#9333EA", textColor: "#FFFFFF" },
    ],
  },
  {
    src: productAsset("13-buudy-led-mask-starter-kit.webp"),
    alt: "Buudy LED Mask starter kit in cyan light therapy mode for calming capillaries and redness",
    badge: {
      title: "490NM CYAN\nLIGHT THERAPY",
      sub: "Calms swollen capillaries,\nreduces inflammation & redness",
      position: "top-left",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-before-after-calms-redness-rosacea-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask before and after: calms facial redness, sensitivity and rosacea flush UK",
    pills: [
      { text: "2-Weeks", bg: "#F7F1E8", textColor: "#2E102F", borderColor: "rgba(58, 31, 61, 0.18)" },
      { text: "Cyan 7-min", bg: "#0891B2", textColor: "#FFFFFF" },
      { text: "Yellow 3-min", bg: "#EAB308", textColor: "#1C1917" },
    ],
  },
  {
    src: productAsset("08-buudy-led-mask-lifestyle-use.webp"),
    alt: "Buudy LED Mask easy to use 3 minute daily skincare session",
    badge: {
      title: "FAST 3-MIN\nDAILY SESSIONS",
      sub: "Quick, effortless & easy to use —\njust 3 minutes a day for visible results",
      position: "bottom-right",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-unisex-skincare-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask unisex skincare treatment for men and women UK",
    badge: {
      title: "UNIVERSAL UNISEX\nDESIGN",
      sub: "Ergonomic fit designed for all\nskin types, both men & women",
      position: "bottom-right",
      theme: "white",
    },
  },
  {
    src: productAsset("buudy-7-colour-led-mask-lifestyle-red-light-therapy-uk.webp"),
    alt: "Buudy 7 Colour LED Face Mask lifestyle red light therapy routine in the UK",
  },
  {
    src: productAsset("11-buudy-led-mask-flexible-silicone.webp"),
    alt: "Buudy LED Mask flexible silicone",
  },
  {
    src: productMediaAsset("O3-w.webp"),
    alt: "Buudy LED Mask O3",
  },
  {
    src: productAsset("01-buudy-led-mask-front.webp"),
    alt: "Buudy LED Mask front view",
  },
];

export const buudyLedMaskGallery: ProductImage[] = fullLedMaskGallery;

export const buudyMask: Product = {
  id: "buudy-led-mask",
  sku: "BUUDY-LED-MASK-7W",
  slug: "buudy-led-mask",
  template: "mask",
  name: "Buudy LED Mask",
  heroTitle: "Buudy LED",
  heroEmphasis: "Mask",
  shortDescription:
    "Salon-grade LED mask with the Premium Travel Box included for protected storage and travel.",
  description:
    "Salon-grade light therapy reimagined for UK homes. The Buudy LED Mask combines 192 high-density LEDs, 7 visible light colours plus a dedicated 830nm near-infrared mode, full face and neck coverage, cordless wearability, and a simple ritual built for consistent at-home skincare.",
  seoTitle: "Best LED Face Mask UK | Buudy Red Light Therapy Mask",
  seoDescription:
    "Shop the Buudy LED Face Mask in the UK: 192 LEDs, red and blue light therapy, 830nm near-infrared mode, face plus neck coverage, cordless design, easy returns and refunds, and free glow kit.",
  currency: market.currency,
  priceCents: 17900,
  compareAtCents: 44900,
  rating: 4.9,
  reviewCount: 16000,
  customerCount: "16,000+",
  promoCode: "GLOWKIT",
  promoLabel: "Glow kit promo applied",
  cartImage: fullLedMaskGallery[0].src,
  gallery: fullLedMaskGallery,
  gifts: [
    {
      id: "buudy-led-torch",
      name: "Buudy LED Torch",
      valueCents: 7000,
      image: productAsset("01-buudy-red-light-therapy-torch-main.webp", "buudy-red-torch"),
      label: "Limited edition",
      href: "/products/red-light-torch",
    },
    {
      id: "premium-travel-box",
      name: "Premium Travel Box",
      valueCents: 3900,
      image: productMediaAsset("ChatGPT Image May 31, 2026, 11_53_13 PM.png"),
      label: "Exclusive item",
      href: "/pages/premium-travel-box",
    },
    {
      id: "skincare-ebook",
      name: "Skincare E-Book",
      valueCents: 1900,
      image: "/images/products/skincare-ebook/skincare-ebook.png",
      label: "Digital copy",
      href: "/products/skincare-ebook",
    },
  ],
  specs: [
    { label: "Dimensions", value: "20cm x 29cm (7.87in x 11.42in)" },
    { label: "Number of LEDs", value: "192" },
    { label: "Intensity Level", value: "4 levels" },
    { label: "Light Modes", value: "7 visible colours + 830nm near-infrared" },
    { label: "Near-Infrared (NIR)", value: "830nm" },
    { label: "Battery Life", value: "Up to 12 sessions per charge (1500mAh)" },
    { label: "Use Type", value: "Portable cordless LED mask for household" },
    { label: "Power Source", value: "Rechargeable battery" },
    { label: "Irradiance", value: "32 mW/cm2" },
    { label: "Voltage", value: "220V / 110V" },
    { label: "Power", value: "6.8W" },
  ],
  included: [
    { quantity: "1x", label: "Premium Travel Box", tag: "Free gift" },
    { quantity: "1x", label: "7-colour + NIR LED Light Face Mask" },
    { quantity: "1x", label: "Charger with USB-C cable" },
    { quantity: "2x", label: "Eye Support" },
    { quantity: "1x", label: "User Manual" },
    { quantity: "1x", label: "Comprehensive Treatment Guide" },
    { quantity: "1x", label: "Buudy LED Torch", tag: "Free gift" },
  ],
  highlights: [
    "Stimulates collagen production",
    "Smooths skin & fine lines",
    "Full face and neck coverage",
    "Cordless, rechargeable, and easy to use",
  ],
  keyBenefits: [
    "Stimulate collagen production",
    "Assist with anti-ageing",
    "Reduce acne",
    "Aid in healing",
    "Address sun damage",
    "Cleanse your skin",
    "Minimize wrinkles and lines",
  ],
  differentiators: [
    "Buudy AI app for guided sessions",
    "7 wavelengths plus 830nm near-infrared",
    "Full-face and neck coverage",
    "Cordless, rechargeable design",
    "3-minute treatment routine",
    "Tap-to-cycle touch control",
    "Integrated eye protection",
  ],
  faqs,
  badges: [
    "Health Canada approved",
    "CE / FCC / ROHS",
    "Easy return and refund",
    "Dermatologist endorsed",
  ],
};

const torchAsset = (fileName: string) =>
  productAsset(fileName, "buudy-red-torch");

export const buudyRedTorch: Product = {
  id: "buudy-red-torch",
  sku: "1000020579664204",
  slug: "red-light-torch",
  template: "torch",
  name: "Buudy LED Torch",
  heroTitle: "Buudy LED",
  heroEmphasis: "Torch",
  shortDescription:
    "A compact red and near-infrared light therapy torch with 3 targeted wavelengths for skin health, body relief, and easy travel use.",
  description:
    "Red light therapy device with 3 wavelengths: 630nm, 660nm, and 850nm. Designed for localized body relief, acne care, skin health, and portable at-home wellness rituals.",
  seoTitle: "Buudy LED Torch | 3 Wavelength Red Light Therapy Device",
  seoDescription:
    "Portable red light therapy torch with 3 wavelengths, near infrared support, rechargeable battery, and targeted body and skin relief.",
  currency: market.currency,
  priceCents: 7000,
  compareAtCents: 17500,
  rating: 4.8,
  reviewCount: 16000,
  customerCount: "16,000+",
  promoCode: "TORCH60",
  promoLabel: "LED torch offer applied",
  cartImage: torchAsset("01-buudy-red-light-therapy-torch-main.webp"),
  gallery: [
    {
      src: torchAsset("01-buudy-red-light-therapy-torch-main.webp"),
      alt: "Buudy LED Torch held by a woman applying targeted 630nm and 660nm red light to her cheek for facial skin rejuvenation and collagen stimulation",
    },
    {
      src: torchAsset("buudy-led-torch-premium-gift-set.webp"),
      alt: "Buudy LED Torch complete gift set with 2x rechargeable batteries, dock charger, tripod and travel case",
    },
    {
      src: torchAsset("buudy-led-torch-sculptural-warm-stone.webp"),
      alt: "Buudy LED Torch in precision-crafted aircraft-grade aluminum alloy on warm stone",
      badge: {
        title: "AIRCRAFT-GRADE\nALUMINUM ALLOY",
        sub: "Precision-milled metal body engineered\nfor durability & rapid heat dissipation",
        position: "top-left",
        theme: "white",
      },
    },
    {
      src: torchAsset("buudy-led-torch-silver-black-on-blush.webp"),
      alt: "Buudy LED Torch precision silver and black aesthetic with 3 clinical wavelengths",
      badge: {
        title: "3 CLINICAL\nWAVELENGTHS",
        sub: "630nm, 660nm visible red light\nplus 850nm deep near-infrared",
        position: "top-left",
        theme: "dark",
      },
    },
    {
      src: torchAsset("buudy-led-torch-mini-tripod-red-glow.webp"),
      alt: "Buudy LED Torch emitting active red and near-infrared light on mini tripod stand",
      badge: {
        title: "HANDS-FREE\nTRIPOD STAND",
        sub: "Stationary targeted treatment with\nincluded adjustable bracket",
        position: "bottom-left",
        theme: "dark",
      },
    },
    {
      src: torchAsset("buudy-led-torch-handheld-ergonomics.webp"),
      alt: "Buudy LED Torch held in hand demonstrating portable compact ergonomics",
      badge: {
        title: "ULTRA-LIGHTWEIGHT\n& ERGONOMIC",
        sub: "Only 74g with one-button control\nand anti-drop lanyard",
        position: "top-right",
        theme: "dark",
      },
    },
    {
      src: torchAsset("buudy-led-torch-travel-case-scale.webp"),
      alt: "Buudy LED Torch beside custom zipper travel case demonstrating portable scale",
      badge: {
        title: "TRAVEL-READY\nPROTECTION",
        sub: "Compact 12cm form factor fits\nsecurely in dedicated zipper case",
        position: "top-left",
        theme: "dark",
      },
    },
    {
      src: torchAsset("04-buudy-red-light-torch-neck-shoulder-treatment.webp"),
      alt: "Woman using the Buudy LED Torch for targeted red and near-infrared light therapy on her neck and shoulder for skin smoothing and tension relief",
      badge: {
        title: "NECK & SHOULDER\nRELIEF",
        sub: "Targeted soothing warmth & light\nfor everyday muscle tension",
        position: "bottom-left",
        theme: "white",
      },
    },
    {
      src: torchAsset("05-buudy-red-light-torch-arm-joint-pain-relief.webp"),
      alt: "Targeted application of the Buudy LED Torch on forearm and wrist joint for localized pain relief and cellular repair",
      badge: {
        title: "LOCALIZED JOINT\nRECOVERY",
        sub: "Direct deep-tissue light therapy\nfor joints, wrists & elbows",
        position: "bottom-left",
        theme: "white",
      },
    },
    {
      src: torchAsset("06-buudy-red-light-torch-deep-tissue-muscle-recovery.webp"),
      alt: "Close-up of Buudy LED Torch emitting concentrated 630nm, 660nm, and 850nm wavelengths for deep tissue muscle recovery and elbow joint relief",
      badge: {
        title: "DEEP TISSUE\nRECOVERY",
        sub: "850nm near-infrared light penetrates\ndeep into tired muscles",
        position: "top-left",
        theme: "dark",
      },
    },
    {
      src: torchAsset("07-buudy-red-light-torch-lifestyle-portable-relief.webp"),
      alt: "Buudy LED Torch held by a woman for portable on-the-go body and skin wellness",
    },
    {
      src: torchAsset("11-buudy-red-light-torch-multi-body-treatment-grid.webp"),
      alt: "Buudy LED Torch multi-zone application guide for elbow, hand, back, and knee relief",
    },
  ],
  gifts: [],
  specs: [
    { label: "Dimensions", value: "2.5cm × 12cm (0.98 in × 4.72 in)" },
    { label: "Model", value: "H100-3H" },
    { label: "Wavelength", value: "630nm, 660nm, 850nm" },
    { label: "Power", value: "7W" },
    { label: "Operating Voltage", value: "3.7V" },
    { label: "Protection Level", value: "IPX5 (Living Waterproof)" },
    { label: "Battery", value: "18650 Ricoh Lithium (2x included)" },
    { label: "Material", value: "Aluminum alloy" },
    { label: "Charging Method", value: "USB battery dock charger" },
    { label: "Weight", value: "74g" },
    { label: "Warranty", value: "24 months" },
    { label: "Lifespan", value: "50,000+ hours" },
  ],
  included: [
    { quantity: "1x", label: "Buudy LED Torch (3-Core Red Light Flashlight)" },
    { quantity: "2x", label: "18650 Lithium Rechargeable Batteries" },
    { quantity: "1x", label: "Zipper Storage Box (Travel Case)" },
    { quantity: "1x", label: "Triangular Bracket (Tripod Stand)" },
    { quantity: "1x", label: "Anti-Loss Lanyard (Tail Rope)" },
    { quantity: "1x", label: "Red Light Instruction Manual" },
    { quantity: "1x", label: "USB Charger (Dock Charger)" },
  ],
  highlights: [
    "Stimulate collagen production",
    "Smooths skin & fine lines",
    "Assist with anti-ageing and healing",
    "Enhances overall skin health",
    "Portable, safe, and easy to use",
    "Minimize wrinkles and lines",
  ],
  faqs: torchFaqs,
  wavelengths: torchWavelengths,
  badges: [
    "3 precision wavelengths",
    "7W high-power output",
    "IPX5 waterproof",
    "24 month warranty",
  ],
};

export const buudyIplDevice: Product = {
  id: "buudy-ipl-device",
  sku: "BUUDY-IPL-ICE",
  slug: "buudy-ipl-hair-removal-device",
  template: "ipl",
  name: "Buudy IPL Hair Removal Device",
  heroTitle: "Buudy IPL",
  heroEmphasis: "Device",
  shortDescription:
    "Painless at-home laser hair removal with Ice Cooling technology and 999,999 flashes for smooth skin.",
  description:
    "Experience professional-grade, painless hair removal at home. The Buudy IPL Device features an advanced ice-cooling head that stays at 5-8°C to soothe your skin while treating hair follicles. With 9 intensity levels and 999,999 flashes, it's a lifetime solution for smooth, hair-free skin.",
  seoTitle: "Buudy IPL Hair Removal Device | Painless Ice Cooling Laser",
  seoDescription:
    "Shop the Buudy IPL Hair Removal Device in the UK: 999,999 flashes, Ice Cooling technology, 9 intensity levels, painless hair removal at home.",
  currency: market.currency,
  priceCents: 12900, // TODO: Update with real pricing
  compareAtCents: 24900, // TODO: Update with real pricing
  rating: 4.9,
  reviewCount: 450,
  customerCount: "1,000+",
  promoCode: "SMOOTH20",
  promoLabel: "Launch promo applied",
  cartImage: "/images/products/buudy-ipl/hero.png",
  gallery: [
    {
      src: "/images/products/buudy-ipl/hero.png",
      alt: "Buudy IPL Hair Removal Device",
    },
    {
      src: "/images/products/buudy-ipl/standalone.png",
      alt: "Buudy IPL Device with Ice Cooling Display",
    },
    {
      src: "/images/products/buudy-ipl/lifestyle.png",
      alt: "2 Years of Smooth Skin",
    },
    {
      src: "/images/products/buudy-ipl/cooling.png",
      alt: "Ice Cooling for Sensitive Zones",
    },
    {
      src: "/images/products/buudy-ipl/arm.png",
      alt: "15-Min Full Body Treatment",
    },
  ],
  gifts: [],
  specs: [
    { label: "Cooling Technology", value: "Sapphire Ice Cooling (5-8°C)" },
    { label: "Flashes", value: "999,999 flashes (lifetime use)" },
    { label: "Intensity Levels", value: "9 adjustable levels" },
    { label: "Modes", value: "Auto (continuous) and Manual (single flash)" },
    { label: "Power Source", value: "Mains powered (Plug-in)" },
    { label: "Lamp Tube", value: "Quartz tube" },
  ],
  included: [
    { quantity: "1x", label: "Buudy IPL Hair Removal Device" },
    { quantity: "1x", label: "Power Adapter (UK)" },
    { quantity: "1x", label: "Protective Glasses" },
    { quantity: "1x", label: "Shaving Razor" },
    { quantity: "1x", label: "User Manual" },
  ],
  highlights: [
    "Virtually painless with Ice Cooling",
    "999,999 flashes - no refills needed",
    "Results visible in just 4 weeks",
    "Safe for face and body",
  ],
  keyBenefits: [
    "Painless hair removal",
    "Long-lasting smooth skin",
    "Saves money on salon trips",
    "Quick full body treatments",
  ],
  faqs: iplFaqs,
  badges: [
    "Ice Cooling Tech",
    "Painless Treatment",
    "999,999 Flashes",
    "1 Year Warranty",
  ],
};

export const ebookFaqs: FAQItem[] = [
  {
    question: "How do I receive the e-book after purchasing?",
    answer:
      "Your e-book download link is dispatched instantly to your email inbox immediately upon checkout completion. You can download and access the PDF right away on any device.",
  },
  {
    question: "What devices can I read the e-book on?",
    answer:
      "The guide is provided as a universal, high-resolution PDF compatible with Apple iPhones, iPads, Android smartphones and tablets, Kindle e-readers, MacBooks, and Windows PCs.",
  },
  {
    question: "What topics and wavelengths are covered in the guide?",
    answer:
      "The guide spans 38 chapters covering red (630nm), near-infrared (830nm), blue (460nm), green (525nm), yellow (590nm), purple, and cyan wavelengths, cellular mitochondrial ATP synthesis, and tailored routines for anti-ageing, acne, hyperpigmentation, and redness.",
  },
];

export const giftCardFaqs: FAQItem[] = [
  {
    question: "How will the recipient receive the gift card?",
    answer:
      "The digital gift card is delivered instantly via email to you (or directly to the recipient if specified) containing a secure 16-digit voucher code, redemption instructions, and a printable gift certificate.",
  },
  {
    question: "Does the Buudy Gift Card expire?",
    answer:
      "Yes, the Buudy Gift Card expires 3 months from the day you receive it. The recipient can redeem their £20 balance site-wide anytime within this 3-month validity period.",
  },
  {
    question: "Can the gift card balance be used across multiple orders?",
    answer:
      "Yes. If your total order amount is less than the £20 gift card balance, any remaining balance stays on the voucher code for future purchases within the 3-month validity window.",
  },
];

export const packageProtectionFaqs: FAQItem[] = [
  {
    question: "What does Buudy Package Protection cover?",
    answer:
      "Package Protection covers 100% of the replacement value if your order is damaged during transit, lost by the courier, or stolen from your doorstep (porch piracy).",
  },
  {
    question: "How quickly are replacement claims processed?",
    answer:
      "Claims are reviewed and processed within 24 hours. Once verified, a brand-new replacement unit is immediately dispatched via tracked express courier.",
  },
  {
    question: "How do I file a claim if my package is lost or damaged?",
    answer:
      "Simply email our dedicated priority claims team at support@buudy.co.uk with your order number and brief details (or photos if damaged). We handle carrier investigations on your behalf.",
  },
];

export const buudySkincareEbook: Product = {
  id: "buudy-skincare-ebook",
  sku: "BUUDY-EBOOK-SKINCARE",
  slug: "skincare-ebook",
  template: "minimal",
  name: "The Clinical Light Masterclass E-Book",
  heroTitle: "Clinical Skincare",
  heroEmphasis: "Masterclass",
  shortDescription:
    "The definitive 40+ page clinical guide to 7-colour photobiomodulation, multi-device synergy, and active skincare chemistry.",
  description:
    "The official Buudy Clinical Light Masterclass E-Book. 40+ comprehensive clinical pages and 38 chapters covering photobiomodulation physics, mitochondrial activation, wavelength depth penetration maps, 5 bespoke clinical pathways, active ingredient pairings, and printable 90-day progress trackers. Delivered instantly in high-resolution PDF format.",
  seoTitle: "The Clinical Light Masterclass E-Book (Digital PDF) | Buudy",
  seoDescription:
    "Download the official 40+ page Clinical Light Masterclass E-Book by Buudy: 7-colour photobiomodulation protocols, 830nm NIR guide, and active skincare chemistry.",
  currency: market.currency,
  priceCents: 1900,
  compareAtCents: 1900,
  rating: 0,
  reviewCount: 0,
  customerCount: "",
  promoCode: "",
  promoLabel: "",
  cartImage: "/images/products/skincare-ebook/skincare-ebook.png",
  gallery: [
    {
      src: "/images/products/skincare-ebook/skincare-ebook.png",
      alt: "The Clinical Light Masterclass E-Book by Buudy",
    },
  ],
  gifts: [],
  specs: [
    { label: "Format", value: "Instant Digital Download (PDF)" },
    { label: "Length", value: "40+ Clinical Pages (38 Chapters)" },
    { label: "Compatibility", value: "iPhone, iPad, Android, Mac, PC, Kindle" },
    { label: "Delivery", value: "Instant Email Link + Direct Access" },
    { label: "Language", value: "English (UK / US)" },
    { label: "Publisher", value: "Buudy Clinical Editorial Board" },
  ],
  included: [
    { quantity: "1x", label: "Full Clinical Light Masterclass E-Book (High-Res PDF)" },
    { quantity: "5x", label: "Bespoke Wavelength Routine Cards" },
    { quantity: "1x", label: "Active Skincare Ingredient Pairing Guide" },
    { quantity: "1x", label: "Printable 90-Day Weekly Session Tracker" },
  ],
  highlights: [
    "38 in-depth clinical chapters covering all 7 therapeutic wavelengths & 830nm NIR",
    "5 bespoke condition pathways for anti-ageing, acne, redness, pigmentation & radiance",
    "Active ingredient pairing cheat sheets (Vitamin C, Niacinamide, Retinoids, Peptides)",
    "Printable 90-day treatment calendar and weekly tracking sheets",
    "Instant digital delivery to your inbox with lifetime access & free future updates",
  ],
  keyBenefits: [
    "Maximize your LED Mask & Torch results with clinical protocols",
    "Prevent active skincare contraindications & ingredient pilling",
    "Track your progress with structured 90-day milestone templates",
    "Read anytime on your smartphone, tablet, e-reader, or laptop",
  ],
  badges: [
    "Instant PDF Download",
    "40+ Clinical Pages",
    "Official Companion",
    "Lifetime Access",
  ],
  faqs: ebookFaqs,
};

export const buudyGiftCard: Product = {
  id: "buudy-gift-card",
  sku: "BUUDY-GIFT-CARD",
  slug: "buudy-gift-card",
  template: "minimal",
  name: "Buudy Official Digital Gift Card",
  heroTitle: "Buudy Official",
  heroEmphasis: "Gift Card",
  shortDescription:
    "The ultimate gift of radiant glow. Instant electronic voucher delivery directly to your inbox. Valid for 3 months from date of receipt.",
  description:
    "Give the gift of clinical wellness and radiant skin. The Buudy Official £20 Digital Gift Card is delivered instantly via email and is valid for 3 months from the date you receive it. Valid site-wide across the Buudy 7 Colour LED Face Mask, Buudy LED Torch, IPL Hair Removal, and all beauty accessories.",
  seoTitle: "Buudy Official £20 Digital Gift Card | Instant Voucher Delivery",
  seoDescription:
    "Give the gift of glowing skin. The Buudy £20 digital gift card is delivered instantly via email and valid for 3 months from receipt. Site-wide redemption.",
  currency: market.currency,
  priceCents: 2000,
  compareAtCents: 2000,
  rating: 0,
  reviewCount: 0,
  customerCount: "",
  promoCode: "",
  promoLabel: "",
  cartImage: "/images/products/buudy-gift-card/buudy-gift-card-with-gold-ribbon.webp",
  gallery: [
    {
      src: "/images/products/buudy-gift-card/buudy-gift-card-with-gold-ribbon.webp",
      alt: "Buudy Official Digital Gift Card with Gold Ribbon",
    },
  ],
  gifts: [],
  specs: [
    { label: "Delivery", value: "Instant Digital Email Delivery" },
    { label: "Expiry Date", value: "Expires 3 months from day received" },
    { label: "Redemption", value: "Site-wide on all Buudy products & kits" },
    { label: "Format", value: "16-Digit Secure Electronic Voucher Code" },
    { label: "Value", value: "£20.00 Fixed Voucher Amount" },
    { label: "Currency", value: "GBP (£)" },
  ],
  included: [
    { quantity: "1x", label: "Official Buudy Digital Gift Voucher Code" },
    { quantity: "1x", label: "Instant Email Presentation with Custom Message" },
    { quantity: "1x", label: "Printable Gift Certificate PDF" },
  ],
  highlights: [
    "Instant digital delivery dispatched directly to your inbox within seconds",
    "Valid for 3 months from the date you receive it",
    "Valid site-wide on all LED masks, torches, IPL devices, and skincare accessories",
    "Personalized gift note option to include your heartfelt message",
    "Simple zero-friction redemption during checkout",
  ],
  keyBenefits: [
    "Gifting made effortless for birthdays, anniversaries, and holidays",
    "Allows recipient to choose their ideal light therapy device",
    "Fixed £20 voucher amount for quick, easy checkout",
    "3-month validity window for flexible redemption",
  ],
  badges: [
    "Instant Email Delivery",
    "Valid for 3 Months",
    "Site-Wide Valid",
    "100% Satisfaction",
  ],
  faqs: giftCardFaqs,
};

export const buudyPackageProtection: Product = {
  id: "buudy-package-protection",
  sku: "BUUDY-PKG-PROTECTION",
  slug: "buudy-package-protection",
  template: "minimal",
  name: "Buudy Complete Package Protection",
  heroTitle: "Complete Package",
  heroEmphasis: "Protection",
  shortDescription:
    "Complete transit damage, loss, and theft guarantee for your order with expedited zero-cost unit replacement.",
  description:
    "Secure your order for pennies. Buudy Package Protection provides 100% peace of mind against accidental transit damage, lost courier shipments, defective deliveries, and doorstep theft. Includes fast-track 24-hour claims processing and immediate brand-new unit reshipment at zero additional charge.",
  seoTitle: "Buudy Complete Package Protection | Transit & Theft Guarantee",
  seoDescription:
    "Protect your Buudy delivery against courier damage, loss, and theft. Instant zero-cost replacement and priority dispatch.",
  currency: market.currency,
  priceCents: 300,
  compareAtCents: 300,
  rating: 0,
  reviewCount: 0,
  customerCount: "",
  promoCode: "",
  promoLabel: "",
  cartImage: "/images/products/buudy-package-protection/buudy-package-protection.webp",
  gallery: [
    {
      src: "/images/products/buudy-package-protection/buudy-package-protection.webp",
      alt: "Buudy Complete Package Protection Transit Guarantee",
    },
  ],
  gifts: [],
  specs: [
    { label: "Coverage Type", value: "Full Transit Damage, Loss & Doorstep Theft" },
    { label: "Claims Processing", value: "Fast-Track within 24 Hours" },
    { label: "Replacement Cost", value: "£0 (Zero Deductible, Brand New Unit)" },
    { label: "Underwriting", value: "Direct Buudy Official Guarantee" },
    { label: "Courier Support", value: "Royal Mail, DPD, EVRi & Express Couriers" },
  ],
  included: [
    { quantity: "1x", label: "Full Order Transit Insurance Coverage" },
    { quantity: "1x", label: "Expedited Zero-Cost Replacement Guarantee" },
    { quantity: "1x", label: "Priority 24/7 VIP Customer Support Fast-Track" },
  ],
  highlights: [
    "100% complete coverage against courier damage, lost parcels & porch piracy",
    "Fast-track 24-hour claims response with zero paperwork hassle",
    "Immediate brand-new unit replacement dispatched via tracked express courier",
    "Covers your entire order from dispatch until safely in your hands",
    "Dedicated claims specialist handles carrier investigations for you"
  ],
  keyBenefits: [
    "Total peace of mind from our warehouse to your doorstep",
    "Skip lengthy postal courier investigation waiting periods",
    "Brand new replacement dispatched with zero deductible fees",
    "Priority queue status with dedicated resolution liaison",
  ],
  badges: [
    "100% Transit Coverage",
    "Zero Deductible",
    "24h Express Replacement",
    "Doorstep Theft Protection",
  ],
  faqs: packageProtectionFaqs,
};

// Clinical Serums for The Buudy Clinical Light Regimen (Selfnamed Sourced)
export const clinicalSerumFaqs: FAQItem[] = [
  {
    question: "When should I apply this in my light therapy routine?",
    answer: "Step 1 (Hyaluronic Serum) should be applied immediately before putting on your LED mask to hydrate without scattering light. Step 2 (Collagen-Lock Hexapeptide Serum) should be applied immediately after your 10-minute session when cellular pathways are primed for peptide signaling. Step 3 (Botanical Retinol Alternative) is for overnight repair, and Step 4 (5% Niacinamide Gel) pairs specifically with 415nm Blue Light for acne and pore control.",
  },
  {
    question: "Are these formulas safe to use with all 7 LED wavelengths?",
    answer: "Yes, every formula in The Buudy Clinical Light Regimen is specifically formulated to be 100% compatible with phototherapy. They are free from photosensitizing synthetic compounds, heavy occlusives, and artificial dyes.",
  },
  {
    question: "Is the packaging recyclable and travel-friendly?",
    answer: "All Buudy Clinical Serums are packaged in airless glass and recyclable containers that preserve delicate peptide and botanical actives from oxidation while remaining 100% airport security friendly.",
  },
  {
    question: "What is the return and guarantee policy?",
    answer: "All Buudy clinical skincare items are backed by our 30-day satisfaction guarantee and ship via tracked UK delivery.",
  },
];

export const peptideSerumFaqs: FAQItem[] = [
  {
    question: "Why should I use Buudy Peptide Anti-Aging Serum with LED light therapy?",
    answer: "During and immediately after a 10-minute session with your Buudy LED Mask, cellular microcirculation and mitochondrial ATP synthesis are elevated, creating an optimal biological window for active peptide absorption. Applying Buudy Peptide Serum immediately post-phototherapy allows bio-fermented Hexapeptide-11 and Dipalmitoyl Hydroxyproline to signal fibroblasts directly, dramatically accelerating collagen type I and III synthesis and locking in skin firmness.",
  },
  {
    question: "How does Hexapeptide-11 differ from regular peptide serums?",
    answer: "Hexapeptide-11 is a high-potency bio-fermented peptide naturally isolated from yeast ferment. Clinical studies show it upregulates key extracellular matrix genes responsible for collagen and elastin production. It specifically targets loss of skin elasticity, relaxes stubborn facial expression lines, and improves cellular dermal bounce.",
  },
  {
    question: "Can I use this peptide serum daily without an LED mask?",
    answer: "Yes, absolutely! While formulated to maximize post-phototherapy collagen remodeling, it is an exceptional daily anti-aging treatment. Apply 2-3 pumps morning and night to clean skin before your heavier moisturiser or daily SPF for all-day skin density, barrier defense, and wrinkle smoothing.",
  },
  {
    question: "Will this serum clog pores, cause breakouts, or feel greasy?",
    answer: "No. The formula features a lightweight, silky botanical emulsion matrix that absorbs cleanly within 30 seconds. Powered by organic Jojoba and Strawberry seed oils alongside multi-molecular Hyaluronic Acid and Sodium PCA, it delivers intensive nourishment without heaviness, silicones, or comedogenic oils.",
  },
  {
    question: "Is it safe for medical-grade silicone LED masks?",
    answer: "Yes, 100%. The formula is diode-safe, free from degrading synthetic occlusives or mineral oils. It will never cloud or damage medical-grade silicone LED diodes and wipes cleanly off with a damp cloth.",
  },
  {
    question: "What makes the ECOCERT COSMOS certification important?",
    answer: "Our formula is certified under European ECOCERT COSMOS standards, guaranteeing 100% natural origin ingredients, organic farming provenance for our botanical extracts (Aloe, Blueberry, Ginkgo Biloba), zero parabens, zero phthalates, and cruelty-free European formulation.",
  },
  {
    question: "What is the return and guarantee policy?",
    answer: "All Buudy clinical skincare items are backed by our 30-day satisfaction guarantee and ship via tracked UK delivery.",
  },
];

export const buudyPeptideSerum: Product = {
  id: "buudy-peptide-serum",
  sku: "BUUDY-SERUM-PEP-30",
  slug: "buudy-peptide-serum",
  template: "serum",
  name: "Buudy Peptide Anti-Aging Serum (30ml)",
  heroTitle: "Buudy Peptide Anti-Aging Serum",
  heroEmphasis: "Collagen-Lock™ Hexapeptide Complex",
  shortDescription: "STEP 2: POST-LIGHT PEPTIDE BOOSTER & COLLAGEN LOCK (30ml)",
  description: "High-performance anti-aging peptide serum powered by bio-fermented Hexapeptide-11, Dipalmitoyl Hydroxyproline, and multi-molecular hyaluronic acid. Formulated to stimulate cellular collagen synthesis, relax facial expression lines, and restore dermal firmness. Enriched with antioxidant-rich Blueberry, Ginkgo Biloba, and nourishing Jojoba. Engineered specifically for post-phototherapy synergy and intensive daily age-defense.",
  seoTitle: "Buudy Peptide Anti-Aging Serum (30ml) | Hexapeptide-11 Collagen Booster | Buudy UK",
  seoDescription: "Clinical-grade Buudy Peptide Anti-Aging Serum 30ml with Hexapeptide-11 and Dipalmitoyl Hydroxyproline. ECOCERT COSMOS certified, stimulates collagen, smooths wrinkles.",
  currency: market.currency,
  priceCents: 9900,
  compareAtCents: 19900,
  rating: 4.9,
  reviewCount: 486,
  customerCount: "14,000+",
  promoCode: "",
  promoLabel: "",
  cartImage: "/images/products/buudy-peptide-serum/buudy-peptide-serum-bottle-and-box-hero-uk.webp",
  gallery: [
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-bottle-and-box-hero-uk.webp",
      alt: "Buudy Peptide Anti-Aging Serum 30ml bottle and luxury deep plum carton on studio plinth for LED light therapy UK",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-bottle-front-uk.webp",
      alt: "Buudy 30ml Peptide Anti-Aging Serum bottle with precision treatment pump dispenser",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-luxury-carton-box-three-quarter-uk.webp",
      alt: "Buudy Peptide Anti-Aging Serum luxury deep plum folding carton packaging with vertical logo",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-bottle-angle-plum-uk.webp",
      alt: "Buudy Peptide Anti-Aging Serum bottle angled portrait on signature plum background",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-overhead-pair-flatlay-uk.webp",
      alt: "Overhead flatlay composition of Buudy Peptide Anti-Aging Serum bottle and outer folding box",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-architectural-pair-plinth-uk.webp",
      alt: "Buudy Peptide Anti-Aging Serum bottle and carton displayed on sculptural architectural cream plinth",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-pump-label-macro-uk.webp",
      alt: "Macro detail of Buudy Peptide Anti-Aging Serum label and precision hygienic treatment pump",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-glass-light-study-uk.webp",
      alt: "Optical study of Buudy Peptide Anti-Aging Serum glass bottle with crystal light refraction",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-bottle-side-profile-uk.webp",
      alt: "Side profile of Buudy Peptide Anti-Aging Serum 30ml glass pump bottle",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-campaign-editorial-pair-uk.webp",
      alt: "Editorial campaign pairing of Buudy Peptide Serum bottle and carton on plinth against deep plum backdrop",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-neck-collarbone-beauty-uk.webp",
      alt: "Model neck and collarbone beauty portrait demonstrating firm, radiant skin after peptide care",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-two-hand-pump-ritual-uk.webp",
      alt: "Two-hand dispensing ritual using Buudy Peptide Anti-Aging Serum precision pump bottle",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-plum-manicure-hand-hero-uk.webp",
      alt: "Model hand with signature plum manicure holding Buudy Peptide Anti-Aging Serum bottle",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-on-hand-editorial-texture-uk.webp",
      alt: "Silky botanical peptide emulsion texture swatch of Buudy Peptide Serum on back of hand",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-plump-smooth-benefits-uk.webp",
      alt: "Clinical anti-aging benefits: visible line smoothing, restored skin bounce, and accelerated collagen support",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-targeted-daily-care-uk.webp",
      alt: "Targeted daily care guide: facial tension relaxation and extracellular matrix reinforcement",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-key-ingredients-texture-uk.webp",
      alt: "Key ingredients breakdown: Hexapeptide-11, Dipalmitoyl Hydroxyproline, and Multi-Molecular Hyaluronic Acid",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-ingredient-spotlight-uk.webp",
      alt: "Ingredient spotlight on bio-fermented peptides, Ginkgo Biloba, and Blueberry antioxidant botanicals",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-skin-types-and-ritual-uk.webp",
      alt: "Skin types and daily application ritual guide for mature, dry, and combination skin barriers",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-verified-formula-facts-uk.webp",
      alt: "Verified formula facts: ECOCERT COSMOS certified, vegan, cruelty-free, and diode-safe",
    },
    {
      src: "/images/products/buudy-peptide-serum/buudy-peptide-serum-campaign-hero-display-uk.webp",
      alt: "Buudy Peptide Anti-Aging Serum campaign hero display highlighting comprehensive firming and anti-wrinkle results",
    },
  ],
  gifts: [],
  specs: [
    { label: "Active Complex", value: "Bio-Fermented Hexapeptide-11 & Hydroxyproline" },
    { label: "Hydration Matrix", value: "Multi-Molecular Hyaluronic Acid & Sodium PCA" },
    { label: "Regimen Step", value: "Step 2: Immediate Post-Phototherapy & Daily AM/PM" },
    { label: "Volume", value: "30ml Precision Treatment Pump (Airless Glass)" },
    { label: "Skin Compatibility", value: "All skin types, mature skin & sensitive barriers" },
    { label: "Manufacturing", value: "ECOCERT COSMOS Certified Organic / 100% Natural Origin" },
  ],
  included: [{ quantity: "1x", label: "30ml Buudy Peptide Anti-Aging Serum" }],
  highlights: [
    "Aloe Barbadensis (Aloe) Leaf Juice➀",
    "Glycerin",
    "Simmondsia Chinensis (Jojoba) Seed Oil➀",
    "Aqua/Water",
    "Pentylene Glycol",
    "Cetearyl Alcohol",
    "Sodium PCA",
    "Isoamyl Laurate",
    "Glyceryl Stearate Citrate",
    "Dipalmitoyl Hydroxyproline",
    "Propanediol",
    "Parfum/Fragrance",
    "Caprylic/Capric Triglyceride",
    "Fragaria Ananassa (Strawberry) Seed Oil",
    "Xanthan Gum",
    "Hexapeptide-11",
    "Phytosterols",
    "Vaccinium Myrtillus (Blueberry) Fruit Extract➀",
    "Ricinus Communis (Castor) Seed Oil➀",
    "Ascorbyl Palmitate",
    "Hydrolyzed Hyaluronic Acid",
    "Potassium Hydroxide",
    "Sodium Hyaluronate",
    "Sodium Phytate",
    "Tocopherol",
    "Leuconostoc/Radish Root Ferment Filtrate",
    "Ginkgo Biloba (Ginkgo) Leaf Extract➀",
    "CI 77491 (Iron Oxides)➂",
    "Citric Acid",
    "Sodium Benzoate",
    "Potassium Sorbate",
    "Glycolipids"
  ],
  keyBenefits: [
    "Bio-fermented Hexapeptide-11 communicates with fibroblasts to accelerate collagen type I & III synthesis",
    "Plant-derived Dipalmitoyl Hydroxyproline vectors deep into dermal architecture to remodel collagen and restore elasticity",
    "Multi-molecular hyaluronic acid and Sodium PCA deliver deep intercellular hydration and immediate bouncy plumpness",
    "Antioxidant-rich organic Blueberry and Ginkgo Biloba protect newly stimulated skin from environmental free-radical damage",
    "Cold-pressed organic Jojoba and Strawberry seed oils reinforce lipid barrier resilience without clogging pores",
    "Completely free from heavy occlusives and silicones—100% diode-safe and compatible with medical-grade LED devices",
  ],
  badges: ["Post-Light Step 2", "Hexapeptide-11", "Collagen Lock"],
  faqs: peptideSerumFaqs,
};

export const buudyCollagenSerum: Product = buudyPeptideSerum;

export const doubleHydrationBoostGelFaqs: FAQItem[] = [
  {
    question: "Why should I use Double Hydration Boost Gel before or during LED light therapy?",
    answer: "Standard facial serums and creams contain silicones, mineral oils, or lipids that have high refractive indices, reflecting up to 90% of therapeutic LED photons away from the skin. Buudy's Double Hydration Boost Gel is 100% water-based and matched to the natural refractive index of skin moisture (n ~ 1.33). This ensures 100% of 630nm red and 830nm near-infrared wavelengths penetrate deep into the dermis while preventing thermal moisture evaporation.",
  },
  {
    question: "Can I use this gel serum daily without an LED mask?",
    answer: "Absolutely! While engineered specifically as a zero-scattering phototherapy primer, it is an exceptional clinical-grade daily hydrating gel serum. Apply 2-3 pumps morning and night to clean, damp skin before your heavier creams or SPF for all-day moisture and skin plumpness.",
  },
  {
    question: "Will this serum clog pores, cause breakouts, or leave a sticky residue?",
    answer: "No. The formula is completely oil-free, silicone-free, fragrance-free, and non-comedogenic. It absorbs cleanly within 20-30 seconds, leaving a soft, non-tacky matte finish that never feels greasy or congests pores.",
  },
  {
    question: "Is it safe for medical-grade silicone LED masks?",
    answer: "Yes, 100%. Oils and silicones can degrade and cloud the medical-grade silicone diodes of LED devices over time. Buudy Double Hydration Boost Gel contains zero damaging occlusives, wiping cleanly off skin and mask surfaces with a damp cloth.",
  },
  {
    question: "What makes the ECOCERT COSMOS certification important?",
    answer: "Our formula is certified under European ECOCERT COSMOS standards, guaranteeing 100% natural origin ingredients, organic farming provenance for our botanical extracts (Aloe, White Tea, Sage), zero parabens, zero phthalates, and cruelty-free European formulation.",
  },
  {
    question: "What is the return and guarantee policy?",
    answer: "All Buudy clinical skincare items are backed by our 30-day satisfaction guarantee and ship via tracked UK delivery.",
  },
];

export const buudyHyaluronicSerum: Product = {
  id: "buudy-light-activating-hyaluronic-serum",
  sku: "BUUDY-SERUM-HA-30",
  slug: "buudy-light-activating-hyaluronic-serum",
  template: "serum",
  name: "Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel (30ml)",
  heroTitle: "Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel",
  heroEmphasis: "Light-Activating Hydrogel Matrix",
  shortDescription: "STEP 1: PRE / DURING-LIGHT HYDROGEL PRIMER & HYDRATION BOOST (30ml)",
  description: "100% water-based, crystal-clear optical hydrogel matrix engineered specifically for clinical LED phototherapy and intensive daily moisture. Zero oils, zero silicones, zero light reflection. Matches the refractive index of skin moisture (n ~ 1.33) so 100% of 630nm red and 830nm near-infrared wavelengths penetrate unhindered into dermal tissue, while multi-molecular hyaluronic acid and Provitamin B5 deliver multi-depth plumping hydration for up to 72 hours.",
  seoTitle: "Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel (30ml) | Buudy UK",
  seoDescription: "Clinical-grade 100% water-based Hyaluronic Acid 2% + B5 Double Hydration Boost Gel. Zero light scattering, multi-depth dermal plumping, ECOCERT organic certified.",
  currency: market.currency,
  priceCents: 9900,
  compareAtCents: 19900,
  rating: 4.9,
  reviewCount: 512,
  customerCount: "16,000+",
  promoCode: "",
  promoLabel: "",
  cartImage: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-double-hydration-boost-gel-hero-uk.webp",
  gallery: [
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-double-hydration-boost-gel-hero-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel 30ml and luxury plum box for LED light therapy UK",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-b5-serum-bottle-front-uk.webp",
      alt: "Buudy 30ml Hyaluronic Acid 2% + B5 serum bottle with precision pump dispenser",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-precision-dropper-dispensing-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 precision pump dispenser releasing clear hydrating hydrogel droplet",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-water-optical-clarity-caustics-uk.webp",
      alt: "Buudy Light-Activating Hyaluronic Serum in clear water with refractive light caustics demonstrating zero light scattering",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-gel-texture-droplet-macro-uk.webp",
      alt: "Clear multi-molecular hyaluronic acid hydrogel droplet swatch beside Buudy 30ml serum bottle",
    },
    {
      src: "/images/products/buudy-serum/buudy-double-hydration-boost-gel-water-splash-uk.webp",
      alt: "Buudy Double Hydration Boost Gel submerged in dynamic splashing water showing intensive dermal hydration",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-pump-label-macro-uk.webp",
      alt: "Macro detail of Buudy Hyaluronic Acid 2% + B5 label and precision hygienic treatment pump",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-luxury-carton-box-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 luxury deep plum folding carton packaging with vertical logo",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-plum-studio-shot-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 serum bottle against signature plum background",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-cream-pedestal-display-uk.webp",
      alt: "Buudy Hyaluronic Acid Serum and carton on sculptural cream plinth architectural display",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-packaging-overhead-flatlay-uk.webp",
      alt: "Overhead flatlay of Buudy Hyaluronic Acid 2% + B5 serum bottle and outer box",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-campaign-editorial-pair-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 serum campaign editorial on plinth against deep plum backdrop",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-natural-botanical-pebbles-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 serum resting on glistening wet river stones emphasizing natural hydration",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-model-hand-plum-manicure-uk.webp",
      alt: "Model hand holding Buudy Hyaluronic Acid 2% + B5 serum bottle with signature plum manicure",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-texture-application-on-hand-uk.webp",
      alt: "Silky water-based hydrogel texture swatch of Buudy Hyaluronic Acid 2% + B5 on hand",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-two-hand-application-ritual-uk.webp",
      alt: "Two-hand dispensing ritual using Buudy Hyaluronic Acid 2% + B5 pump bottle",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-neck-decolletage-glow-model-uk.webp",
      alt: "Radiant, plump skin on neck and décolletage after using Buudy Hyaluronic Acid Serum with LED Mask",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-facial-hydration-glow-model-uk.webp",
      alt: "Model with glass skin holding Buudy Hyaluronic Acid 2% + B5 serum bottle against cheek",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-serum-lifestyle-handheld-studio-uk.webp",
      alt: "Hand holding Buudy Hyaluronic Acid 2% + B5 serum bottle in bright studio lighting",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-skin-type-daily-ritual-guide-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 Serum skin type compatibility and AM PM daily application ritual guide UK",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-formula-specifications-ph-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 formula at a glance: 99% natural origin, 11% organic content, pH 5.0 to 5.25",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-moisture-barrier-plump-finish-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel moisture support and natural plumper looking finish UK",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-inside-formula-botanicals-uk.webp",
      alt: "Inside the Buudy Hyaluronic Acid Serum formula: multi-molecular HA, sodium PCA, and aloe leaf juice with white tea and sage",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-bottle-carton-still-life-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 30ml serum bottle and luxury plum packaging carton in studio still life UK",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-lightweight-hydration-benefits-uk.webp",
      alt: "A lighter way to hydrate: Buudy Double Hydration Boost Gel lightweight hydrogel benefits and dewy finish",
    },
    {
      src: "/images/products/buudy-serum/buudy-hyaluronic-acid-serum-key-ingredients-hydrogel-macro-uk.webp",
      alt: "Buudy Hyaluronic Acid 2% + B5 key ingredients macro droplet swatch showing sodium PCA and pure water hydrogel texture",
    },
  ],
  gifts: [],
  specs: [
    { label: "Active Matrix", value: "2% Multi-Molecular HA + Provitamin B5 & Sodium PCA" },
    { label: "Optical Transparency", value: "100% Zero-Scattering Clear Water-Based Hydrogel" },
    { label: "Regimen Step", value: "Step 1: Prior to Mask Application & Daily Hydration" },
    { label: "Volume", value: "30ml Precision Treatment Pump (Airless Glass)" },
    { label: "Light Synergy", value: "Red (630nm), NIR (830nm), Blue (415nm) & All Spectrum" },
    { label: "Manufacturing", value: "ECOCERT COSMOS Certified Organic / 100% Natural Origin" },
  ],
  included: [{ quantity: "1x", label: "30ml Buudy Hyaluronic Acid 2% + B5 Double Hydration Boost Gel" }],
  highlights: [
    "Aloe Barbadensis (Aloe) Leaf Juice➀",
    "Aqua/Water",
    "Glycerin➁",
    "Propanediol",
    "Sodium PCA",
    "Sodium Hyaluronate (Hyaluronic Acid)",
    "Hydrolyzed Hyaluronic Acid",
    "Camellia Sinensis (White Tea) Leaf Extract➀",
    "Salvia Officinalis (Sage) Leaf Extract➀",
    "Cellulose Gum",
    "Algin",
    "Lactic Acid",
    "Rhamnose",
    "Glucose",
    "Glucuronic Acid"
  ],
  keyBenefits: [
    "100% water-based formulation matches skin moisture refractive index (n ~ 1.33) to prevent light reflection",
    "Multi-molecular hyaluronic acid penetrates deep into dermal layers to bind water and plump fine lines",
    "Provitamin B5 (Panthenol) & Sodium PCA lock in a 72-hour moisture reservoir without oiliness",
    "Organic White Tea & Sage botanical antioxidants calm micro-inflammation and prevent heat dehydration",
    "Zero silicones or heavy occlusives ensures zero diode clouding or damage to medical-grade LED devices",
  ],
  badges: ["Pre-Light Step 1", "2% Multi-Molecular HA + B5", "100% Light-Permeable"],
  faqs: doubleHydrationBoostGelFaqs,
};

export const buudyRetinolAlternativeSerum: Product = {
  id: "buudy-phyto-renew-retinol-alternative-serum",
  sku: "BUUDY-SERUM-RET-30",
  slug: "buudy-phyto-renew-retinol-alternative-serum",
  template: "serum",
  name: "Buudy Phyto-Renew™ Botanical Retinol Alternative (30ml)",
  heroTitle: "Buudy Phyto-Renew™ Botanical Retinol Alternative",
  heroEmphasis: "Overnight Cellular Renewal",
  shortDescription: "STEP 3: LED-SAFE NIGHT CELLULAR RENEWAL (30ml)",
  description: "2% Bidens Pilosa botanical retinoid complex delivering retinol-strength anti-ageing without peeling, irritation, or light sensitivity.",
  seoTitle: "Buudy Phyto-Renew™ Botanical Retinol Alternative | Buudy UK",
  seoDescription: "LED-safe natural retinol alternative. 2% Bidens Pilosa + Organic Sea Buckthorn. Zero photosensitivity, 100% clinical efficacy.",
  currency: market.currency,
  priceCents: 4400,
  compareAtCents: 8800,
  rating: 4.9,
  reviewCount: 286,
  customerCount: "12,000+",
  promoCode: "",
  promoLabel: "",
  cartImage: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/retinol-alternative-serum-30ml/retinol-alternative-serum-30ml-01-3d-flat-selfnamed.jpg?width=1440",
  gallery: [
    { src: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/retinol-alternative-serum-30ml/retinol-alternative-serum-30ml-01-3d-flat-selfnamed.jpg?width=1440", alt: "Buudy Phyto-Renew™ Botanical Retinol Alternative 30ml" },
    { src: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/retinol-alternative-serum-30ml/retinol-alternative-serum-30ml-01c-3d-box-flat-badge-selfnamed.jpg?width=1440", alt: "Buudy Phyto-Renew™ Serum Bottle and Packaging" },
    { src: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/retinol-alternative-serum-30ml/retinol-alternative-serum-30ml-02-texture-selfnamed.jpg?width=1440", alt: "Golden Nectar Texture Swatch" },
    { src: "https://static.selfnamed.com/gallery-photos/3CUSiRBXYQG-Wa5JnD8H9u5wsYXfs5sJ.jpg", alt: "Buudy Phyto-Renew™ Serum Studio Shot" }
  ],
  gifts: [],
  specs: [
    { label: "Phyto-Retinoid Actives", value: "2% Bidens Pilosa & Sea Buckthorn Oil" },
    { label: "Photosensitivity", value: "Zero (Safe alongside LED phototherapy)" },
    { label: "Regimen Step", value: "Step 3: Overnight Cellular Rejuvenation" },
    { label: "Volume", value: "30ml Dropper" },
    { label: "Texture", value: "Silky Botanical Nectar" },
  ],
  included: [{ quantity: "1x", label: "30ml Phyto-Renew™ Botanical Retinol Alternative" }],
  highlights: [
    "Aqua/Water", "Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract", "Bidens Pilosa Extract",
    "Rosa Canina Fruit Oil", "Sodium Hyaluronate", "Tocopherol (Vitamin E)"
  ],
  keyBenefits: [
    "Accelerates cellular turnover matching standard retinol without redness or peeling",
    "100% safe to use alongside daily LED light therapy with zero photosensitivity",
    "Sea buckthorn and rosehip botanicals replenish depleted lipid barrier",
    "Fades hyperpigmentation and softens stubborn static wrinkles"
  ],
  badges: ["Night Repair Step 3", "2% Bidens Pilosa", "Zero Photosensitivity"],
  faqs: clinicalSerumFaqs,
};

export const buudyNiacinamideGel: Product = {
  id: "buudy-blemish-defense-niacinamide-gel",
  sku: "BUUDY-SERUM-NIA-50",
  slug: "buudy-blemish-defense-niacinamide-gel",
  template: "serum",
  name: "Buudy Blemish-Defense™ 5% Niacinamide Gel (50ml)",
  heroTitle: "Buudy Blemish-Defense™ 5% Niacinamide Gel",
  heroEmphasis: "Blue Light Clarifier",
  shortDescription: "TARGETED: 415nm BLUE LIGHT BLEMISH COMPANION (50ml)",
  description: "5% pure Niacinamide and Ginkgo Biloba gel formulated to pair synergistically with 415nm Blue Light therapy to clear breakouts and refine pores.",
  seoTitle: "Buudy Blemish-Defense™ 5% Niacinamide Gel | Buudy UK",
  seoDescription: "5% Niacinamide blemish gel for 415nm blue light therapy. Regulates sebum, shrinks enlarged pores, fades marks.",
  currency: market.currency,
  priceCents: 2900,
  compareAtCents: 5800,
  rating: 4.8,
  reviewCount: 198,
  customerCount: "10,000+",
  promoCode: "",
  promoLabel: "",
  cartImage: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/niacinamide-gel-moisturiser-50ml/niacinamide-gel-moisturiser-50ml-01-3d-flat-selfnamed.jpg?width=1440",
  gallery: [
    { src: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/niacinamide-gel-moisturiser-50ml/niacinamide-gel-moisturiser-50ml-01-3d-flat-selfnamed.jpg?width=1440", alt: "Buudy Blemish-Defense™ 5% Niacinamide Gel 50ml" },
    { src: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/niacinamide-gel-moisturiser-50ml/niacinamide-gel-moisturiser-50ml-01c-3d-box-flat-badge-selfnamed.jpg?width=1440", alt: "Buudy Blemish-Defense™ Gel Packaging and Bottle" },
    { src: "https://www.selfnamed.com/static/assets/product-card-v2/selfnamed-product-images-main-5-1x1/face-care/niacinamide-gel-moisturiser-50ml/niacinamide-gel-moisturiser-50ml-02-texture-selfnamed.jpg?width=1440", alt: "Clear Matte Gel Swatch" },
    { src: "https://static.selfnamed.com/gallery-photos/C9k-L1c7X_j5wLgP5z8N-v-w9K1q4x7.jpg", alt: "Buudy Blemish-Defense™ Lifestyle Shot" }
  ],
  gifts: [],
  specs: [
    { label: "Active Concentration", value: "5% Pure Vitamin B3 (Niacinamide)" },
    { label: "Botanical Base", value: "Ginkgo Biloba & Zinc PCA" },
    { label: "Regimen Step", value: "Targeted: 415nm Blue Light Companion" },
    { label: "Volume", value: "50ml Airless Pump" },
    { label: "Finish", value: "Matte, non-greasy, non-comedogenic" },
  ],
  included: [{ quantity: "1x", label: "50ml Blemish-Defense™ 5% Niacinamide Gel" }],
  highlights: [
    "Aqua/Water", "Niacinamide (5%)", "Glycerin", "Ginkgo Biloba Leaf Extract",
    "Sodium Hyaluronate", "Zinc PCA", "Cellulose Gum"
  ],
  keyBenefits: [
    "Pairs with 415nm Blue Light to stop active breakouts and calm redness",
    "5% Niacinamide visibly tightens enlarged pores and regulates sebum",
    "Ginkgo Biloba antioxidants protect congested skin against oxidation",
    "Lightweight matte gel absorbs instantly without shine or residue"
  ],
  badges: ["Blue Light Companion", "5% Pure Niacinamide", "Pore & Sebum Control"],
  faqs: clinicalSerumFaqs,
};

export const buudyFaceWashGallery: ProductImage[] = [
  {
    src: "/images/products/buudy-face-wash/02-bottle-front-cream.webp",
    alt: "Buudy Blemish Purifying Face Wash 140ml bottle on cream architectural plinth for blemish-prone skin UK",
  },
  {
    src: "/images/products/buudy-face-wash/04-face-wash.webp",
    alt: "Buudy 140ml Blemish Purifying Face Wash bottle with precision treatment pump",
  },
  {
    src: "/images/products/buudy-face-wash/06-side-angle-architectural-shadow.webp",
    alt: "Architectural side shadow profile of Buudy Blemish Purifying Face Wash bottle",
  },
  {
    src: "/images/products/buudy-face-wash/07-pump-and-wordmark-macro.webp",
    alt: "Macro detail of Buudy hygienic face wash pump and crisp typography",
  },
  {
    src: "/images/products/buudy-face-wash/08-water-ripple-studio.webp",
    alt: "Buudy Blemish Purifying Face Wash in pure water ripple studio setting showing gentle purifying formula",
  },
  {
    src: "/images/products/buudy-face-wash/09-face-wash.webp",
    alt: "Buudy Blemish Purifying Face Wash bottle still life against minimalist backdrop",
  },
  {
    src: "/images/products/buudy-face-wash/08-two-hand-pump-ritual.webp",
    alt: "Two-hand pump dispensing ritual of Buudy Blemish Purifying Face Wash",
  },
  {
    src: "/images/products/buudy-face-wash/10-damp-hand-beauty-editorial (1).webp",
    alt: "Model damp hand beauty editorial demonstrating silky gentle lathering action",
  },
  {
    src: "/images/products/buudy-face-wash/10-damp-hand-beauty-editorial.webp",
    alt: "Close-up model editorial with cleansed, refreshed, calm blemish-free skin",
  },
  {
    src: "/images/products/buudy-face-wash/09-neck-and-collarbone-beauty.webp",
    alt: "Radiant, clear skin on face and neck after using Buudy Purifying Cleanser",
  },
  {
    src: "/images/products/buudy-face-wash/11-plum-manicure-hand-hero.webp",
    alt: "Model hand holding Buudy Blemish Purifying Face Wash with signature plum manicure",
  },
  {
    src: "/images/products/buudy-face-wash/01-skin-and-ritual.webp",
    alt: "Skin and ritual daily protocol for Buudy Blemish Purifying Face Wash",
  },
  {
    src: "/images/products/buudy-face-wash/03-targeted-cleansing-benefits.webp",
    alt: "Targeted cleansing benefits: pore refinement, sebum regulation, and soothing hydration",
  },
  {
    src: "/images/products/buudy-face-wash/02-verified-formula-facts.webp",
    alt: "Verified formula facts: 98% Natural Origin, ECOCERT COSMOS Natural, sulfate-free",
  },
  {
    src: "/images/products/buudy-face-wash/04-botanical-blend.webp",
    alt: "Botanical blend: Organic Mate Leaf, Iceland Moss, and Alpine Juniper Callus extracts",
  },
  {
    src: "/images/products/buudy-face-wash/05-cleanse-rinse-reset-still-life.webp",
    alt: "Cleanse, Rinse, Reset still life showing refreshing non-drying post-wash feel",
  },
  {
    src: "/images/products/buudy-face-wash/01-ingredients-with-copy-no-bottle.webp",
    alt: "Active ingredients guide: Mate Leaf, Iceland Moss, Juniper Callus, and humectants",
  },
  {
    src: "/images/products/buudy-face-wash/03-ingredients-minimal-no-bottle.webp",
    alt: "Minimal botanical ingredients breakdown: clean European natural formulation",
  },
];

export const blemishPurifyingFaceWashFaqs: FAQItem[] = [
  {
    question: "Why should I cleanse with Blemish Purifying Face Wash before LED light therapy?",
    answer: "Natural surface sebum, sweat, daily pollution, cosmetics, and SPF create an optical barrier that scatters up to 40% of therapeutic LED photons away from your skin. Buudy Blemish Purifying Face Wash effectively clears these light-blocking residues without stripping your moisture barrier, ensuring 100% of 415nm blue (anti-acne) and 630nm red (healing) wavelengths penetrate deep into target pores and dermal tissue.",
  },
  {
    question: "Can I use this cleanser daily without an LED mask?",
    answer: "Yes, absolutely! While specifically optimized as an optical pre-light purifying cleanser, it is an exceptional clinical-grade daily face wash for blemish-prone, oily, and combination skin. Use 1–2 pumps morning and evening on damp skin to maintain a balanced, calm, and clear complexion.",
  },
  {
    question: "How does this face wash cleanse without sulfates?",
    answer: "Conventional acne washes rely on harsh sulfates (like SLS/SLES) that strip the acid mantle, triggering rebound oiliness, flakiness, and barrier irritation. Buudy uses gentle, plant-derived micellar surfactants (Coco-Glucoside and Cocamidopropyl Betaine) that dissolve sebum and lift impurities while respecting skin pH and natural cellular moisture.",
  },
  {
    question: "What makes Mate Leaf, Iceland Moss, and Juniper Callus effective for blemishes?",
    answer: "Organic Mate Leaf provides potent antioxidant polyphenols and caffeine to calm inflammation and energize tired skin. Arctic Iceland Moss and Lichen deliver natural antimicrobial lichen acids that purify acne-causing bacteria without drying out tissue. Alpine Juniper Callus stem cells help regulate overactive sebaceous activity, tightening enlarged pores and smoothing rough texture.",
  },
  {
    question: "Will this cleanser dry out or strip my skin barrier?",
    answer: "No. Unlike harsh acne washes that leave skin squeaky and tight, our formula is pH-balanced and infused with physiological osmolytes Glycerin and Sodium PCA. These humectants lock water into stratum corneum cells, ensuring your face feels soft, comfortable, and supple after rinsing.",
  },
  {
    question: "What is the texture, lather, and aroma?",
    answer: "It is a silky, refreshing purifying gel that transforms into a soft, gentle micro-foam with lukewarm water. It features an uplifting, natural green tea aroma derived directly from botanical extracts, with zero artificial perfumes or synthetic dyes.",
  },
  {
    question: "What certifications does this face wash carry?",
    answer: "Formulated under strict European ECOCERT COSMOS Natural standards, 98% of the total ingredients are of natural origin. It is 100% certified vegan, cruelty-free, nut-free, and housed in a recyclable PET #1 bottle with a durable PP #5 pump.",
  },
  {
    question: "What is the return and guarantee policy?",
    answer: "All Buudy clinical skincare items are backed by our 30-day satisfaction guarantee and ship via tracked UK delivery.",
  },
];

export const buudyFaceWash: Product = {
  id: "buudy-blemish-purifying-face-wash",
  sku: "BUUDY-WASH-BL-140",
  slug: "buudy-blemish-purifying-face-wash",
  template: "cleanser",
  name: "Buudy Blemish Purifying Face Wash (140ml)",
  heroTitle: "Buudy Blemish Purifying Face Wash",
  heroEmphasis: "Clarifying Botanical Cleanser (140ml)",
  shortDescription: "STEP 1: PRE-LIGHT PURIFYING & SEBUM BALANCING CLEANSER (140ml)",
  description: "Gentle, pH-balanced facial cleanser without harsh surfactants that purifies blemish-prone and oily skin while preserving essential barrier moisture. Formulated with organic Mate Leaf, Arctic Iceland Moss, and Alpine Juniper Callus stem cells to dissolve excess sebum, eliminate daily impurities, and soothe redness. Perfectly preps pores for maximum photon penetration during 415nm Blue Light and 630nm Red Light therapy sessions. ECOCERT COSMOS Natural certified with 98% natural origin ingredients and a fresh green tea aroma.",
  seoTitle: "Buudy Blemish Purifying Face Wash (140ml) | Buudy UK",
  seoDescription: "ECOCERT COSMOS Natural gentle face wash for blemish-prone skin. Mate Leaf, Iceland Moss, and Juniper Callus clear impurities and sebum without stripping. 140ml.",
  currency: market.currency,
  priceCents: 9900,
  compareAtCents: 19900,
  rating: 4.9,
  reviewCount: 485,
  customerCount: "14,000+",
  promoCode: "",
  promoLabel: "",
  cartImage: "/images/products/buudy-face-wash/02-bottle-front-cream.webp",
  gallery: buudyFaceWashGallery,
  gifts: [],
  specs: [
    { label: "Active Botanicals", value: "Organic Mate Leaf, Iceland Moss & Juniper Callus" },
    { label: "Surfactant Base", value: "Sulfate-Free Coco-Glucoside & Cocamidopropyl Betaine" },
    { label: "Regimen Step", value: "Step 1: AM/PM Cleanser & Pre-Light Phototherapy Primer" },
    { label: "Volume", value: "140ml / 4.73 fl oz (Precision Treatment Pump)" },
    { label: "Skin Compatibility", value: "Blemish-prone, oily, combination & sensitive skin" },
    { label: "Manufacturing", value: "ECOCERT COSMOS Natural (98% Natural Origin) / Vegan" },
  ],
  included: [{ quantity: "1x", label: "140ml Buudy Blemish Purifying Face Wash" }],
  highlights: [
    "Aqua/Water",
    "Coco-Glucoside",
    "Cocamidopropyl Betaine",
    "Glycerin",
    "Xanthan Gum",
    "Propanediol",
    "Sodium PCA",
    "Sodium Levulinate",
    "Lactic Acid",
    "Ilex Paraguariensis (Mate) Leaf Extract➀",
    "Parfum/Fragrance",
    "Acacia Senegal Gum",
    "Sodium Anisate",
    "Cetraria Islandica (Iceland Moss) Extract",
    "Usnea Barbata (Lichen) Extract",
    "Juniperus Communis (Juniper) Callus Extract",
    "Silica",
    "Kaolin",
    "Linalool➁",
    "Linalyl Acetate➁"
  ],
  keyBenefits: [
    "Gentle, sulfate-free micellar wash removes excess sebum, makeup, and daily impurities without disrupting the protective acid mantle",
    "Organic Mate Leaf extract delivers rich polyphenols and caffeine to soothe active inflammation and energize congested skin",
    "Arctic Iceland Moss and Lichen provide natural antimicrobial defense, helping to purify blemish-prone skin and prevent breakouts",
    "Alpine Juniper Callus stem cell extract helps regulate sebum production and visibly refines enlarged, congested pores",
    "Natural osmolytes Glycerin and Sodium PCA maintain vital moisture balance, leaving the complexion soft, calm, and fresh with zero tightness",
    "Prepares skin for 415nm Blue Light and 630nm Red Light phototherapy by clearing light-scattering surface oils and cellular debris",
  ],
  badges: ["Cleanse Step 1", "Mate Leaf + Iceland Moss", "ECOCERT COSMOS Natural"],
  faqs: blemishPurifyingFaceWashFaqs,
};

export const buudyPrebioticSerumGallery: ProductImage[] = [
  {
    src: "/images/products/buudy-prebiotics-serum/01-noni.webp",
    alt: "Buudy Bioactive Prebiotics Jelly Serum 30ml bottle and luxury plum box for skin microbiome barrier UK",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/02-noni.webp",
    alt: "Buudy 30ml Bioactive Prebiotics Jelly Serum bottle with precision dropper",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/03-noni.webp",
    alt: "Buudy Bioactive Prebiotics Jelly Serum bottle and folding packaging three-quarter angle",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/04-noni.webp",
    alt: "Buudy Bioactive Prebiotics Jelly Serum bottle on signature plum backdrop",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/05-noni.webp",
    alt: "Overhead flatlay of Buudy Bioactive Prebiotics Jelly Serum bottle and carton packaging",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/06-sculptural-plinth-pair.webp",
    alt: "Buudy Bioactive Prebiotics Jelly Serum and box on architectural stone plinth display",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/07-dropper-and-serum-detail.webp",
    alt: "Macro detail of Buudy glass dropper dispensing clear prebiotic jelly serum droplet",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/08-clear-glass-caustics.webp",
    alt: "Buudy Bioactive Prebiotics Jelly Serum submerged in clear water with refractive light caustics",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/09-bottle-diagonal-editorial.webp",
    alt: "Diagonal editorial still life of Buudy Bioactive Prebiotics Jelly Serum bottle",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/10-noni.webp",
    alt: "Buudy Bioactive Prebiotics Jelly Serum campaign editorial pair on stone plinth",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/08-two-hand-dropper-ritual.webp",
    alt: "Two-hand precision dropper dispensing ritual of Buudy Bioactive Prebiotics Jelly Serum",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/09-neck-collarbone-beauty.webp",
    alt: "Model with radiant, calm, balanced skin on neck and décolletage after using Prebiotic Jelly Serum",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/10-serum-on-hand-editorial.webp",
    alt: "Silky weightless fluid jelly texture swatch of Buudy Bioactive Prebiotics Serum on hand",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/11-plum-manicure.webp",
    alt: "Model hand with signature plum manicure holding Buudy Bioactive Prebiotics Jelly Serum bottle",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/01-skin.webp",
    alt: "Buudy Prebiotics Jelly Serum skin type compatibility and AM PM daily ritual guide",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/03-barrier-and-lightweight-care.webp",
    alt: "Targeted barrier and lightweight care: microbiome support, calming redness, and deep hydration",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/02-verified-formula.webp",
    alt: "Verified formula facts: 2% Prebiotics, 99% Natural Origin, ECOCERT COSMOS Natural certified",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/04-ingredient-spotlight.webp",
    alt: "Inside the formula: Lactobacillus Ferment Lysate, dual Hyaluronic Acid, and Sodium PCA",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/05-considered-care-science-still-life.webp",
    alt: "Considered care science: 30ml glass bottle and luxury plum carton in architectural studio still life",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/06-comfort-in-every-drop.webp",
    alt: "Comfort in every drop: soothing hydration, calm redness relief, and balanced moisture barrier",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/07-key-ingredients-clear-jelly.webp",
    alt: "Key ingredients: crystal-clear bioactive jelly droplet swatch with dual hyaluronic acid",
  },
  {
    src: "/images/products/buudy-prebiotics-serum/05-considered-hydration-still-life.webp",
    alt: "Thoughtfully formulated: Buudy Prebiotics Jelly Serum in warm luxury still life display",
  },
];

export const bioactivePrebioticsJellySerumFaqs: FAQItem[] = [
  {
    question: "What are prebiotics in skincare, and how do they benefit my skin?",
    answer: "Prebiotics are specialized bio-fermented nutrients that nourish and stimulate the growth of beneficial microorganisms living naturally on your skin (the skin microbiome). Just like your gut microbiome, a healthy cutaneous microbiome protects against opportunistic bacteria, environmental stressors, and inflammation. Buudy's 2% Lactobacillus Ferment Lysate helps maintain a resilient, diverse microbiome, calming surface redness, fortifying the lipid barrier, and preventing transepidermal water loss.",
  },
  {
    question: "How does the Bioactive Prebiotics Jelly Serum work alongside LED light therapy?",
    answer: "Unlike conventional serums loaded with heavy silicones and oils that reflect and scatter therapeutic light, our formula is a 100% water-based, crystal-clear jelly that matches the refractive index of skin moisture (n ~ 1.33). It allows 100% of 630nm Red, 415nm Blue, and 830nm Near-Infrared photons to pass through unhindered, while soothing skin and preventing mild warmth-induced moisture loss during your 10-minute session.",
  },
  {
    question: "When should I apply this serum in my routine?",
    answer: "Apply 3–4 drops morning and evening to freshly cleansed skin (ideally right after Buudy Blemish Purifying Face Wash) and before your moisturiser. If using with the Buudy LED Mask, apply a thin, even layer directly prior to your light therapy session as an optical hydrogel matrix.",
  },
  {
    question: "What skin types is this serum suitable for?",
    answer: "It is formulated for all skin types, and is particularly transformative for barrier-compromised, dehydrated, sensitive, stressed, or blemish-prone skin that experiences frequent tightness or redness.",
  },
  {
    question: "What is the texture, absorption, and finish?",
    answer: "It is a silky, refreshing fluid jelly texture derived from natural cellulose gum and algin. It glides smoothly, absorbs within seconds, and leaves a completely weightless, non-sticky, natural finish without clogging pores or leaving tacky residue.",
  },
  {
    question: "What is the pH level and why does it matter?",
    answer: "The serum is precisely buffered to pH 4.5–5.1. This matches the natural acidic pH of healthy human skin (the acid mantle), providing the ideal biological environment for beneficial microflora while discouraging harmful pathogens.",
  },
  {
    question: "What key ingredients are inside the formula?",
    answer: "The formula features 2% Lactobacillus Ferment Lysate (cosmeceutical-grade prebiotics), dual-action multi-molecular Hyaluronic Acid (Hydrolyzed HA + Sodium Hyaluronate), physiological humectants Sodium PCA and Glycerin, and botanical Patchouli oil, in a 99% natural origin base.",
  },
  {
    question: "What certifications does this serum carry?",
    answer: "Formulated under strict European ECOCERT COSMOS Natural standards, 99% of total ingredients are of natural origin and 10% are organic. It is 100% certified vegan, cruelty-free, nut-free, and housed in a recyclable heavy glass bottle with a durable PP #5 dropper.",
  },
  {
    question: "What is the return and guarantee policy?",
    answer: "All Buudy clinical skincare items are backed by our 30-day satisfaction guarantee and ship via tracked UK delivery.",
  },
];

export const buudyPrebioticSerum: Product = {
  id: "buudy-bioactive-prebiotics-serum",
  sku: "BUUDY-SERUM-PRE-30",
  slug: "buudy-bioactive-prebiotics-serum",
  template: "serum",
  name: "Buudy Bioactive Prebiotics Jelly Serum (30ml)",
  heroTitle: "Buudy Bioactive Prebiotics Jelly Serum",
  heroEmphasis: "Microbiome Barrier Jelly Matrix (30ml)",
  shortDescription: "STEP 1: PREBIOTIC MICROBIOME BARRIER & BALANCING JELLY (30ml)",
  description: "Lightweight, 100% water-based gel serum formulated to balance and nourish your skin, support the microbiome, and reinforce the vital moisture barrier. Infused with 2% Bioactive Prebiotics (Lactobacillus Ferment Lysate) to feed beneficial skin microflora, dual-action Hyaluronic Acid to hydrate and plump, and Sodium PCA to lock in all-day suppleness. Perfectly calibrated at skin-friendly pH 4.5–5.1 with zero oils, silicones, or light scattering—making it the ideal balancing companion for daily skincare and LED phototherapy. ECOCERT COSMOS Natural certified with 99% natural origin ingredients.",
  seoTitle: "Buudy Bioactive Prebiotics Jelly Serum (30ml) | Buudy UK",
  seoDescription: "ECOCERT COSMOS Natural 2% Prebiotics Jelly Serum. Lactobacillus Ferment Lysate, dual Hyaluronic Acid, and Sodium PCA to restore skin microbiome and barrier. 30ml.",
  currency: market.currency,
  priceCents: 9900,
  compareAtCents: 19900,
  rating: 4.9,
  reviewCount: 496,
  customerCount: "15,000+",
  promoCode: "",
  promoLabel: "",
  cartImage: "/images/products/buudy-prebiotics-serum/01-noni.webp",
  gallery: buudyPrebioticSerumGallery,
  gifts: [],
  specs: [
    { label: "Active Prebiotics", value: "2% Lactobacillus Ferment Lysate (Microbiome Support)" },
    { label: "Hydration Complex", value: "Dual Multi-Molecular HA + Sodium PCA & Glycerin" },
    { label: "pH Level", value: "pH 4.5–5.1 (Skin-Identical Acid Mantle)" },
    { label: "Texture & Finish", value: "Weightless Light Jelly Fluid / Non-Greasy Natural" },
    { label: "Regimen Step", value: "Step 1: AM/PM Prebiotic Barrier Care & Phototherapy Companion" },
    { label: "Volume & Packaging", value: "30ml Heavy Glass Bottle with Precision PP #5 Dropper" },
    { label: "Manufacturing", value: "ECOCERT COSMOS Natural (99% Natural Origin / 10% Organic)" },
  ],
  included: [{ quantity: "1x", label: "30ml Buudy Bioactive Prebiotics Jelly Serum" }],
  highlights: [
    "Aqua/Water",
    "Alcohol➁",
    "Glycerin➁",
    "Sodium PCA",
    "Cellulose Gum",
    "Algin",
    "Lactobacillus Ferment Lysate (2% Prebiotics)",
    "Parfum/Fragrance",
    "Sodium Phytate",
    "Potassium Sorbate",
    "Sodium Benzoate",
    "Hydrolyzed Hyaluronic Acid",
    "Sodium Hyaluronate",
    "Pogostemon Cablin (Patchouli) Oil",
  ],
  keyBenefits: [
    "2% Bioactive Prebiotics (Lactobacillus Ferment Lysate) nourish beneficial skin microflora, fortifying the natural lipid barrier against external stressors",
    "Dual-action Hyaluronic Acid (Hydrolyzed HA + Sodium Hyaluronate) deeply plumps and hydrates across multiple epidermal layers",
    "Sodium PCA and natural Glycerin act as physiological Natural Moisturizing Factors (NMF) to seal in long-lasting moisture with zero greasy weight",
    "Lightweight, cooling fluid jelly texture absorbs instantly with a weightless, non-sticky finish",
    "Skin-friendly pH 4.5–5.1 restores and preserves the acid mantle, soothing tightness, redness, and sensitivity",
    "100% oil-free and silicone-free hydrogel matrix ensures zero light scattering and zero diode clouding during LED phototherapy sessions",
    "Formulated under European ECOCERT COSMOS Natural standards with 99% ingredients of natural origin and 10% organic content",
  ],
  badges: ["Microbiome Step 1", "2% Bioactive Prebiotics", "ECOCERT COSMOS Natural"],
  faqs: bioactivePrebioticsJellySerumFaqs,
};

export const buudyNoniSerum: Product = buudyPrebioticSerum;

export const products = [
  buudyMask,
  buudyRedTorch,
  buudyIplDevice,
  buudySkincareEbook,
  buudyGiftCard,
  buudyPackageProtection,
  buudyPeptideSerum,
  buudyCollagenSerum,
  buudyHyaluronicSerum,
  buudyRetinolAlternativeSerum,
  buudyNiacinamideGel,
  buudyFaceWash,
  buudyPrebioticSerum,
  buudyNoniSerum,
];

export const productsById = Object.fromEntries(
  products.map((product) => [product.id, product]),
) as Record<string, Product>;

export function getProductBySlug(slug: string) {
  if (slug === "buudy-gift-card" || slug === "gift-card" || slug === "buudygiftcard") return buudyGiftCard;
  if (slug === "buudy-package-protection" || slug === "package-protection" || slug === "buudypackageprotection") return buudyPackageProtection;
  if (slug === "skincare-ebook" || slug === "buudy-skincare-ebook") return buudySkincareEbook;
  if (
    slug === "double-hydration-boost-gel" ||
    slug === "buudy-double-hydration-boost-gel" ||
    slug === "buudy-hyaluronic-serum" ||
    slug === "buudy-light-activating-hyaluronic-serum"
  ) {
    return buudyHyaluronicSerum;
  }
  if (
    slug === "peptide-serum" ||
    slug === "buudy-peptide-serum" ||
    slug === "buudy-collagen-boost-serum" ||
    slug === "collagen-boost-serum" ||
    slug === "buudy-peptide-anti-aging-serum"
  ) {
    return buudyPeptideSerum;
  }
  if (
    slug === "blemish-purifying-face-wash" ||
    slug === "buudy-blemish-purifying-face-wash" ||
    slug === "acne-purifying-face-wash" ||
    slug === "buudy-acne-purifying-face-wash" ||
    slug === "buudy-face-wash"
  ) {
    return buudyFaceWash;
  }
  if (
    slug === "bioactive-prebiotics-jelly-serum" ||
    slug === "buudy-bioactive-prebiotics-jelly-serum" ||
    slug === "buudy-bioactive-prebiotics-serum" ||
    slug === "buudy-prebiotics-serum" ||
    slug === "prebiotics-jelly-serum" ||
    slug === "buudy-noni-serum" ||
    slug === "noni-serum"
  ) {
    return buudyPrebioticSerum;
  }
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return productsById[id];
}

