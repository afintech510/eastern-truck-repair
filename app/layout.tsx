import "./globals.css";
import type { Metadata } from "next";
import { LangProvider } from "@/components/Lang";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { business } from "@/lib/data";

export const metadata: Metadata = {
  title: `${business.name} | ${business.region}`,
  description: `Heavy-duty commercial truck repair, heavy equipment service, on-site welding & fabrication, and NY State inspections across ${business.region}. Call ${business.phone}.`,
  openGraph: {
    title: business.name,
    description: `Truck & equipment repair and on-site welding across ${business.region}.`,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LangProvider>
          <div className="hazard" />
          <Nav />
          {children}
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
