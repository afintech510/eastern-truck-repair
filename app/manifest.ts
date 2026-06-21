import type { MetadataRoute } from "next";
import { business } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: business.shortName,
    description: `Commercial truck repair, heavy equipment service, and on-site welding across ${business.region}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#10161d",
    theme_color: "#ff7a00",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/wrench-icon-800.png", sizes: "800x800", type: "image/png", purpose: "any" },
    ],
  };
}
