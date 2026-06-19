import Link from "next/link";
import { T } from "./Lang";
import { business, towns, townSlug } from "@/lib/data";
import { serviceDetails } from "@/lib/serviceDetails";
import { equipment } from "@/lib/equipmentData";

export default function Footer() {
  return (
    <footer className="bg-steel2 border-t border-line mt-0">
      <div className="max-w-6xl mx-auto px-5 pt-12 pb-9 grid grid-cols-1 md:grid-cols-3 gap-9">
        <div>
          <b className="disp font-extrabold text-xl block">{business.name}</b>
          <small className="text-safety text-xs tracking-[0.12em] uppercase font-semibold">
            {business.city}, {business.state} · {business.region}
          </small>
          <p className="text-zinc-400 text-sm mt-3 max-w-xs">
            <T en={`Your local partner for commercial truck and heavy equipment repair and on-site welding across ${business.region}.`}
               es={`Tu socio local para reparacion de camiones, equipo pesado y soldadura en sitio en ${business.region}.`} />
          </p>
        </div>
        <div>
          <h5 className="disp font-bold text-base uppercase tracking-wider mb-3"><T en="Menu" es="Menu" /></h5>
          {[["/", "Home", "Inicio"],["/services","Services","Servicios"],["/welding","Welding","Soldadura"],["/about","About","Nosotros"],["/contact","Contact","Contacto"],["/quote","Get a Quote","Pedir Cotizacion"],["/faq","FAQ","Preguntas"]].map(([h,en,es]) => (
            <Link key={h} href={h} className="block text-zinc-400 text-sm py-1 hover:text-safety"><T en={en} es={es} /></Link>
          ))}
        </div>
        <div>
          <h5 className="disp font-bold text-base uppercase tracking-wider mb-3"><T en="Contact" es="Contacto" /></h5>
          <a href={business.phoneHref} className="block text-zinc-400 text-sm py-1 hover:text-safety">{business.phone}</a>
          <span className="block text-zinc-400 text-sm py-1">{business.address}</span>
          <span className="block text-zinc-400 text-sm py-1">{business.city}, {business.state} {business.zip}</span>
          <Link href="/sitemap.xml" className="block text-zinc-500 text-sm py-1 hover:text-safety mt-2"><T en="Sitemap" es="Mapa del sitio" /></Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 pt-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="disp font-bold text-sm uppercase tracking-wider mb-3 text-zinc-400">
              <T en="Services" es="Servicios" />
            </h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {serviceDetails.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="text-[13px] text-zinc-500 hover:text-safety transition">
                  <T en={s.title.en} es={s.title.es} />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h5 className="disp font-bold text-sm uppercase tracking-wider mb-3 text-zinc-400">
              <T en="Equipment We Service" es="Equipo Que Reparamos" />
            </h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {equipment.map((e) => (
                <Link key={e.slug} href={`/equipment/${e.slug}`} className="text-[13px] text-zinc-500 hover:text-safety transition">
                  <T en={e.title.en} es={e.title.es} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 pt-6 pb-4">
          <h5 className="disp font-bold text-sm uppercase tracking-wider mb-3 text-zinc-400">
            <T en="Service Area" es="Area de Servicio" />
          </h5>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {towns.map((t) => (
              <Link key={t} href={`/${townSlug(t)}`} className="text-[13px] text-zinc-500 hover:text-safety transition">
                {t}, NY
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 py-4 text-[13px] text-zinc-500 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {business.name}. <T en="All rights reserved." es="Todos los derechos reservados." /></span>
          <span className="text-zinc-600">{business.region}</span>
        </div>
      </div>
    </footer>
  );
}
