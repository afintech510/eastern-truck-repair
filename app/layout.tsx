import "./globals.css";
import type { Metadata } from "next";
import { LangProvider } from "@/components/Lang";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BenchworksCredit from "@/components/BenchworksCredit";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { business } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://easterntruckrepair.com"),
  title: {
    default: `${business.name} | Commercial Truck Repair & On-Site Welding | ${business.region}`,
    template: `%s | ${business.shortName}`,
  },
  description: `Heavy-duty commercial truck repair, heavy equipment service, on-site welding & fabrication, and NY State inspections across ${business.region}. Serving Speonk, Riverhead, Hampton Bays, Patchogue & surrounding towns. Call ${business.phone}.`,
  keywords: [
    "truck repair Long Island", "heavy equipment repair Long Island",
    "mobile welding Suffolk County", "on-site welding Eastern Long Island",
    "commercial truck repair Riverhead", "excavator repair Hamptons",
    "dump truck repair Long Island", "NY State inspection Suffolk County",
    "diesel repair Long Island", "heavy equipment welding Speonk NY",
    "trailer repair Long Island", "emergency truck repair East End",
  ],
  alternates: { canonical: "https://easterntruckrepair.com" },
  openGraph: {
    title: `${business.name} | Truck Repair & On-Site Welding`,
    description: `Commercial truck repair, heavy equipment service, and certified on-site welding across ${business.region}. All makes, all models. Call ${business.phone}.`,
    type: "website",
    locale: "en_US",
    url: "https://easterntruckrepair.com",
    siteName: business.name,
  },
  twitter: {
    card: "summary",
    title: business.name,
    description: `Truck & equipment repair and on-site welding across ${business.region}.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  other: {
    "geo.region": "US-NY",
    "geo.placename": `${business.city}, ${business.state}`,
    "geo.position": "40.8268;-72.7068",
    "ICBM": "40.8268, -72.7068",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <JsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LangProvider>
          <div className="hazard" />
          <Nav />
          <Breadcrumbs />
          {children}
          <Footer />
          <BenchworksCredit />
        </LangProvider>
      </body>
    </html>
  );
}
