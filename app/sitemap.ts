import type { MetadataRoute } from "next";
import { towns, townSlug } from "@/lib/data";
import { serviceDetails } from "@/lib/serviceDetails";
import { equipment } from "@/lib/equipmentData";

const BASE = "https://easterntruckrepair.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const core: { path: string; priority: number }[] = [
    { path: "", priority: 1.0 },
    { path: "/services", priority: 0.8 },
    { path: "/welding", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/quote", priority: 0.7 },
    { path: "/faq", priority: 0.6 },
  ];

  const corePages: MetadataRoute.Sitemap = core.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority,
  }));

  const servicePages: MetadataRoute.Sitemap = serviceDetails.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const equipmentPages: MetadataRoute.Sitemap = equipment.map((e) => ({
    url: `${BASE}/equipment/${e.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const townPages: MetadataRoute.Sitemap = towns.map((t) => ({
    url: `${BASE}/${townSlug(t)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...corePages, ...servicePages, ...equipmentPages, ...townPages];
}
