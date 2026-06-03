import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://buudy.com/",
      lastModified: new Date("2026-05-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://buudy.com/products/buudy-led-mask",
      lastModified: new Date("2026-05-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://buudy.com/products/red-light-torch",
      lastModified: new Date("2026-05-28"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://buudy.com/cart",
      lastModified: new Date("2026-05-28"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://buudy.com/pages/contact-us",
      lastModified: new Date("2026-05-29"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://buudy.com/pages/about-us",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://buudy.com/pages/faqs",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://buudy.com/order-tracking",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://buudy.com/shipping-policy",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://buudy.com/return-policy",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://buudy.com/refund-policy",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://buudy.com/privacy-policy",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://buudy.com/terms-of-service",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://buudy.com/cookies-policy",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://buudy.com/pages/skincare-quiz",
      lastModified: new Date("2026-05-31"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://buudy.com/pages/premium-travel-box",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://buudy.com/pages/buudy-led-torch",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://buudy.com/pages/skincare-guide",
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
