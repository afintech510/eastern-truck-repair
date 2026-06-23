"use client";
import { T } from "@/components/Lang";
import { LeadForm, InfoBlock } from "@/components/UI";
import MapEmbed from "@/components/MapEmbed";
import { business } from "@/lib/data";
export default function Contact() {
  return (<><section className="py-[74px]"><div className="max-w-6xl mx-auto px-5">
    <div className="disp font-bold text-[15px] tracking-[0.16em] text-safety uppercase mb-3"><T en="Contact" es="Contacto"/></div>
    <h2 className="disp font-extrabold text-[clamp(30px,5vw,50px)] mb-9"><T en="Get In Touch" es="Contactanos"/></h2>
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <InfoBlock icon="phone" title={"Call Us"}><a href={business.phoneHref} className="hover:text-safety">{business.phone}</a></InfoBlock>
        <InfoBlock icon="pin" title={"Visit"}>{business.address}<br/>{business.city}, {business.state} {business.zip}</InfoBlock>
        <InfoBlock icon="clock" title={"Hours"}><T en={business.hours.en} es={business.hours.es}/><br/><T en="Emergency service available" es="Servicio de emergencia disponible"/></InfoBlock>
        <InfoBlock icon="globe" title={"English / Español"}><T en="Talk to us in whichever you prefer." es="Hablanos en el que prefieras."/></InfoBlock>
      </div>
      <LeadForm kind="contact"/>
    </div>
  </div></section>
  <MapEmbed />
  </>);
}
