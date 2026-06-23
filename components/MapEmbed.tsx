"use client";
import { MapPin } from "lucide-react";
import { T } from "./Lang";
import { business } from "@/lib/data";

const QUERY = encodeURIComponent(`${business.name}, ${business.address}, ${business.city}, ${business.state} ${business.zip}`);
const MAP_URL = `https://www.google.com/maps?q=${QUERY}&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${QUERY}`;

export default function MapEmbed() {
  return (
    <section className="py-[74px] border-t border-line">
      <div className="max-w-6xl mx-auto px-5">
        <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3">
          <T en="Find Us" es="Encuentranos" />
        </div>
        <h2 className="disp font-extrabold text-[clamp(26px,4vw,40px)] mb-6">
          <T en="Come See Us In Speonk" es="Visitanos en Speonk" />
        </h2>
        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          <div className="rounded-lg overflow-hidden border border-line aspect-[16/9] md:aspect-auto">
            <iframe
              src={MAP_URL}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 350 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Eastern Truck & Equipment Repair location on Google Maps"
            />
          </div>
          <div className="bg-steel2 border border-line rounded-lg p-6 flex flex-col justify-center">
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={22} className="text-safety shrink-0 mt-0.5" />
              <div>
                <h3 className="disp font-bold text-lg">{business.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {business.address}<br />
                  {business.city}, {business.state} {business.zip}
                </p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              <T en={business.hours.en} es={business.hours.es} />
            </p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="skew bg-safety hover:bg-safety-d text-steel px-5 py-3 rounded disp font-bold text-center"
            >
              <span className="unskew"><T en="Get Directions" es="Como Llegar" /></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
