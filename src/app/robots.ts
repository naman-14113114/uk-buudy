import type { MetadataRoute } from "next";
import { market } from "@/lib/market";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account-settings",
        "/my-profile",
        "/order-history",
        "/order-confirmation",
        "/sign-in",
        "/sign-up",
      ],
    },
    sitemap: `${market.siteUrl}/sitemap.xml`,
  };
}
