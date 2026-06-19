"use client";
import Link from "next/link";
import { T } from "@/components/Lang";
import { ServiceCard, CtaBand } from "@/components/UI";
import Gallery from "@/components/Gallery";
import { business, services } from "@/lib/data";
import { Flame } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line" style={{ background: "linear-gradient(180deg,#10161d,#1a232e)" }}>
        <div className="max-w-6xl mx-auto px-5 py-24 relative z-10 max-w-[840px]">
          <span className="disp font-bold text-sm tracking-[0.16em] text-safety inline-flex items-center gap-2 mb-5">
            <span className="w-7 h-0.5 bg-safety" /><T en={`${business.region} · Serving the East End`} es={`${business.region} · Sirviendo el East End`} />
          </span>
          <h1 className="disp font-extrabold text-[clamp(44px,8vw,84px)] mb-5">
            <T en={<>Heavy-Duty Repair.<br /><span className="text-safety">Done Right.</span></>}
               es={<>Reparacion Pesada.<br /><span className="text-safety">Bien Hecha.</span></>} />
          </h1>
          <p className="text-[clamp(16px,2vw,20px)] text-zinc-400 max-w-xl mb-8">
            <T en="Commercial trucks, heavy equipment, on-site welding & fabrication, and NY State inspections. We keep your fleet working so you can keep working."
               es="Camiones comerciales, equipo pesado, soldadura en sitio e inspecciones del Estado de NY. Mantenemos tu flota trabajando para que tu sigas trabajando." />
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link href="/quote" className="skew bg-safety hover:bg-safety-d text-steel px-7 py-3.5 rounded disp font-bold text-lg"><span className="unskew"><T en="Get a Quote" es="Pedir Cotizacion" /></span></Link>
            <a href={business.phoneHref} className="skew border border-line hover:border-safety hover:text-safety px-7 py-3.5 rounded disp font-bold text-lg"><span className="unskew"><T en={`Call ${business.phone}`} es={`Llamar ${business.phone}`} /></span></a>
          </div>
          <div className="flex flex-wrap mt-14 border border-line rounded-md overflow-hidden max-w-[640px]">
            {[["24/7","Emergency","Emergencia"],["NY","Inspections","Inspecciones"],["2","Languages","Idiomas"],["All","Makes & Models","Marcas"]].map(([b,en,es],i) => (
              <div key={i} className="flex-1 min-w-[140px] px-5 py-4 border-r border-line last:border-r-0">
                <b className="disp font-extrabold text-3xl text-safety block leading-none">{b}</b>
                <small className="text-xs text-zinc-400 uppercase tracking-wide"><T en={en} es={es} /></small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[74px]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3"><T en="What We Do" es="Que Hacemos" /></div>
          <h2 className="disp font-extrabold text-[clamp(30px,5vw,50px)] mb-4"><T en="Built For The Toughest Jobs" es="Hecho Para Los Trabajos Mas Duros" /></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 gap-5">
            {services.slice(0, 3).map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
        </div>
      </section>

      <Gallery />

      {/* ===== WELDING FEATURE BAND ===== */}
      <section className="border-y border-line relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1a232e,#222d3a)" }}>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10" style={{ background: "repeating-linear-gradient(135deg,#ff7a00 0 18px,transparent 18px 36px)" }} />
        <div className="max-w-6xl mx-auto px-5 py-16 relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 disp font-bold text-sm tracking-[0.14em] text-safety uppercase mb-4">
              <Flame size={18} /><T en="Certified · Mobile · On-Site" es="Certificada · Movil · En Sitio" />
            </div>
            <h2 className="disp font-extrabold text-[clamp(28px,4.5vw,46px)] mb-4">
              <T en={<>We Bring The Welder<br /><span className="text-safety">To Your Job Site.</span></>}
                 es={<>Llevamos El Soldador<br /><span className="text-safety">A Tu Obra.</span></>} />
            </h2>
            <p className="text-zinc-300 text-lg mb-6 max-w-lg">
              <T en="Most shops make you tow it in. We don't. Our certified welders come to your site for structural repair, frame work, bucket and boom fixes, and custom fabrication — keeping your equipment where the work is."
                 es="La mayoria de los talleres te hacen remolcarlo. Nosotros no. Nuestros soldadores certificados llegan a tu obra para reparacion estructural, chasis, cucharones y brazos, y fabricacion a medida — manteniendo tu equipo donde esta el trabajo." />
            </p>
            <Link href="/welding" className="skew bg-safety hover:bg-safety-d text-steel px-6 py-3 rounded disp font-bold"><span className="unskew"><T en="See Welding Services" es="Ver Soldadura" /></span></Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["On-Site / Mobile","En Sitio / Movil"],["Structural Repair","Reparacion Estructural"],["Bucket & Boom","Cucharones y Brazos"],["Custom Fabrication","Fabricacion a Medida"]].map(([en,es],i) => (
              <div key={i} className="bg-steel border border-line rounded-lg p-5">
                <Flame size={20} className="text-safety mb-2" />
                <span className="disp font-bold text-lg block leading-tight"><T en={en} es={es} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
