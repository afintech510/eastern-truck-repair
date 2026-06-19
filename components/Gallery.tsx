"use client";
import { Camera } from "lucide-react";
import { T } from "./Lang";

const SLOTS = 6;

export default function Gallery() {
  return (
    <section className="py-[74px] border-t border-line">
      <div className="max-w-6xl mx-auto px-5">
        <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3">
          <T en="Our Work" es="Nuestro Trabajo" />
        </div>
        <h2 className="disp font-extrabold text-[clamp(30px,5vw,50px)] mb-6">
          <T en="From The Shop & The Field" es="Del Taller y Del Campo" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: SLOTS }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-lg border border-line bg-steel2 flex flex-col items-center justify-center gap-2 text-zinc-600"
            >
              <Camera size={28} />
              <span className="text-xs uppercase tracking-wide">
                <T en="Photo Coming Soon" es="Foto Proximamente" />
              </span>
            </div>
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-4 text-center">
          <T
            en="Project photos — before & after repairs, on-site welding, and custom fabrication jobs."
            es="Fotos de proyectos — reparaciones antes y despues, soldadura en sitio, y trabajos de fabricacion a medida."
          />
        </p>
      </div>
    </section>
  );
}
