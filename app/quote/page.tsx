"use client";
import { T } from "@/components/Lang";
import { LeadForm, InfoBlock } from "@/components/UI";
import { business } from "@/lib/data";
export default function Quote() {
  return (<section className="py-[74px]"><div className="max-w-6xl mx-auto px-5">
    <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3"><T en="Free Quote" es="Cotizacion Gratis"/></div>
    <h2 className="disp font-extrabold text-[clamp(30px,5vw,50px)] mb-4"><T en="Request A Quote" es="Pide Una Cotizacion"/></h2>
    <p className="text-zinc-400 text-lg max-w-xl mb-11"><T en="Tell us about your truck or equipment and we'll get you an estimate." es="Cuentanos sobre tu camion o equipo y te daremos un estimado."/></p>
    <div className="grid md:grid-cols-2 gap-10">
      <LeadForm kind="quote"/>
      <div>
        <InfoBlock icon="zap" title={"Fast Response"}><T en="We aim to respond to every quote the same day." es="Buscamos responder cada cotizacion el mismo dia."/></InfoBlock>
        <InfoBlock icon="phone" title={"Prefer to Call?"}><a href={business.phoneHref} className="hover:text-safety">{business.phone}</a></InfoBlock>
        <InfoBlock icon="globe" title={"English or Español"}><T en="Whichever you prefer." es="El que prefieras."/></InfoBlock>
      </div>
    </div>
  </div></section>);
}
