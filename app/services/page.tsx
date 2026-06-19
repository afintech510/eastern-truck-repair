"use client";
import Link from "next/link";
import { T } from "@/components/Lang";
import { ServiceCard, CtaBand } from "@/components/UI";
import { services } from "@/lib/data";
import { equipment } from "@/lib/equipmentData";
import { Settings, Truck } from "lucide-react";

export default function Services() {
  return (<>
    <section className="py-[74px]"><div className="max-w-6xl mx-auto px-5">
      <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3"><T en="Services" es="Servicios" /></div>
      <h2 className="disp font-extrabold text-[clamp(30px,5vw,50px)] mb-4"><T en="Everything Under One Roof" es="Todo Bajo Un Mismo Techo" /></h2>
      <p className="text-zinc-400 text-lg max-w-xl mb-11"><T en="Comprehensive repair for commercial fleets and heavy equipment operators across the East End." es="Reparacion integral para flotas comerciales y operadores de equipo pesado en todo el East End." /></p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {services.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="block">
            <ServiceCard s={s} />
          </Link>
        ))}
      </div>
    </div></section>

    <section className="py-[74px] border-t border-line"><div className="max-w-6xl mx-auto px-5">
      <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3"><T en="Equipment We Service" es="Equipo Que Reparamos" /></div>
      <h2 className="disp font-extrabold text-[clamp(26px,4vw,40px)] mb-8"><T en="All Brands, All Sizes" es="Todas Las Marcas, Todos Los Tamanos" /></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map((e) => (
          <Link key={e.slug} href={`/equipment/${e.slug}`} className="group bg-steel2 border border-line rounded-lg p-6 hover:border-safety hover:-translate-y-1 transition">
            <div className="w-10 h-10 rounded bg-panel grid place-items-center text-safety mb-3">
              {e.icon === "Truck" ? <Truck size={22} /> : <Settings size={22} />}
            </div>
            <h3 className="disp font-bold text-xl mb-1 group-hover:text-safety transition"><T en={e.title.en} es={e.title.es} /></h3>
            <p className="text-zinc-500 text-sm"><T en={e.subtitle.en} es={e.subtitle.es} /></p>
          </Link>
        ))}
      </div>
    </div></section>

    <CtaBand />
  </>);
}
