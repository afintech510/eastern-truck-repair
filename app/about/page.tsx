"use client";
import { T } from "@/components/Lang";
import { business } from "@/lib/data";
export default function About() {
  return (<section className="py-[74px]"><div className="max-w-6xl mx-auto px-5">
    <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3"><T en="About Us" es="Nosotros"/></div>
    <p className="disp font-bold text-[clamp(20px,3vw,30px)] leading-tight max-w-3xl mb-7" style={{textTransform:"none"}}>
      <T en={<>We're the shop the <span className="text-safety">working trucks and crews</span> of {business.region} count on to keep moving.</>}
         es={<>Somos el taller en el que <span className="text-safety">los camiones y cuadrillas</span> de {business.region} confian para seguir avanzando.</>}/>
    </p>
    <div className="max-w-2xl space-y-4 text-zinc-400 text-base">
      <p><T en={`Eastern Truck & Equipment Repair & Welding is a full-service shop serving contractors, fleet operators, landscapers, and owner-operators across ${business.region}. We fix it right and get it back to work fast.`} es={`Eastern Truck & Equipment Repair & Welding es un taller de servicio completo que atiende a contratistas, operadores de flotas, jardineros y duenos-operadores en ${business.region}. Lo arreglamos bien y lo regresamos al trabajo rapido.`}/></p>
      <p><T en="From routine inspections to major rebuilds, custom welding, and on-site fabrication, our team works on all makes and models. And because our community speaks more than one language, so do we." es="Desde inspecciones de rutina hasta reconstrucciones mayores, soldadura a medida y fabricacion en sitio, nuestro equipo trabaja en todas las marcas y modelos. Y como nuestra comunidad habla mas de un idioma, nosotros tambien."/></p>
      <p><T en="When your equipment is down, you're not just losing a machine — you're losing a day's work. That's the urgency we bring to every job." es="Cuando tu equipo esta parado, no solo pierdes una maquina — pierdes un dia de trabajo. Esa es la urgencia que traemos a cada trabajo."/></p>
    </div>
  </div></section>);
}
