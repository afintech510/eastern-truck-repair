import type { MetadataRoute } from "next";
import { towns, townSlug } from "@/lib/data";

const BASE = "https://easterntruckrepair.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const core: { path: string; priority: number }[] = [
    { path: "", priority: 1.0 },
    { path: "/services", priority: 0.8 },
    { path: "/welding", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/quote", priority: 0.7 },
  ];

  const corePages: MetadataRoute.Sitemap = core.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority,
  }));

  const townPages: MetadataRoute.Sitemap = towns.map((t) => ({
    url: `${BASE}/${townSlug(t)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...corePages, ...townPages];
}
