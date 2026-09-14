import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/analys/", "/trap/", "/wp-admin"] },
      {
        userAgent: ["GPTBot", "CCBot", "Google-Extended", "anthropic-ai", "ClaudeBot"],
        allow: ["/ai.txt"],
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
