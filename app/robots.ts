import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://easterntruckrepair.com/sitemap.xml",
    host: "https://easterntruckrepair.com",
  };
}
