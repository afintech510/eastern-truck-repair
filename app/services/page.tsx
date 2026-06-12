"use client";
import { T } from "@/components/Lang";
import { ServiceCard, CtaBand } from "@/components/UI";
import { services } from "@/lib/data";
export default function Services() {
  return (<>
    <section className="py-[74px]"><div className="max-w-6xl mx-auto px-5">
      <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3"><T en="Services" es="Servicios" /></div>
      <h2 className="disp font-extrabold text-[clamp(30px,5vw,50px)] mb-4"><T en="Everything Under One Roof" es="Todo Bajo Un Mismo Techo" /></h2>
      <p className="text-zinc-400 text-lg max-w-xl mb-11"><T en="Comprehensive repair for commercial fleets and heavy equipment operators across the East End." es="Reparacion integral para flotas comerciales y operadores de equipo pesado en todo el East End." /></p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{services.map((s) => <ServiceCard key={s.slug} s={s} />)}</div>
    </div></section>
    <CtaBand />
  </>);
}
