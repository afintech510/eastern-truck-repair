"use client";
import Link from "next/link";
import { Flame } from "lucide-react";
import { T } from "@/components/Lang";
import { CtaBand } from "@/components/UI";
import { business } from "@/lib/data";
export default function Welding() {
  const items: [string,string,string,string][] = [
    ["Mobile / On-Site Welding","Soldadura Movil / En Sitio","We bring the rig to your job site or roadside.","Llevamos el equipo a tu obra o a la carretera."],
    ["Structural & Frame Repair","Reparacion Estructural y de Chasis","Cracked frames, trailers, structural steel.","Chasis agrietados, remolques, acero estructural."],
    ["Bucket & Boom Repair","Reparacion de Cucharones y Brazos","Hardfacing and rebuilds for heavy equipment.","Recubrimiento y reconstruccion para equipo pesado."],
    ["Custom Fabrication","Fabricacion a Medida","Brackets, mounts, and one-off metal work.","Soportes, montajes y trabajo de metal unico."],
  ];
  return (<>
    <section className="relative overflow-hidden border-b border-line" style={{ background: "linear-gradient(135deg,#1b4965,#0f2f44)" }}>
      <div className="absolute inset-0 opacity-10" style={{ background: "repeating-linear-gradient(135deg,#ff7a00 0 20px,transparent 20px 40px)" }} />
      <div className="max-w-6xl mx-auto px-5 py-20 relative z-10">
        <div className="inline-flex items-center gap-2 disp font-bold text-sm tracking-[0.14em] text-safety uppercase mb-4"><Flame size={18}/><T en="Certified Welding & Fabrication" es="Soldadura y Fabricacion Certificada"/></div>
        <h1 className="disp font-extrabold text-[clamp(40px,7vw,72px)] mb-5"><T en={<>On-Site Welding.<br/><span className="text-safety">We Come To You.</span></>} es={<>Soldadura En Sitio.<br/><span className="text-safety">Vamos A Ti.</span></>}/></h1>
        <p className="text-sky-100 text-lg max-w-xl mb-8"><T en="Keep your equipment on the job. Our certified welders handle structural repair, fabrication, and heavy-equipment welding right where you need it." es="Manten tu equipo en el trabajo. Nuestros soldadores certificados hacen reparacion estructural, fabricacion y soldadura de equipo pesado justo donde lo necesitas."/></p>
        <a href={business.phoneHref} className="skew bg-safety hover:bg-safety-d text-steel px-7 py-3.5 rounded disp font-bold text-lg"><span className="unskew"><T en={`Call ${business.phone}`} es="Llamar Ahora"/></span></a>
      </div>
    </section>
    <section className="py-[74px]"><div className="max-w-6xl mx-auto px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map(([en,es,den,des],i)=>(
          <div key={i} className="bg-steel2 border border-line rounded-lg p-7 hover:border-safety transition">
            <div className="w-12 h-12 rounded bg-panel grid place-items-center text-safety mb-4"><Flame size={24}/></div>
            <h3 className="disp font-bold text-2xl mb-2"><T en={en} es={es}/></h3>
            <p className="text-zinc-400"><T en={den} es={des}/></p>
          </div>
        ))}
      </div>
    </div></section>
    <CtaBand/>
  </>);
}
