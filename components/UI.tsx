"use client";
import Link from "next/link";
import { useState } from "react";
import { Truck, Settings, Flame, ClipboardCheck, Wrench, Siren, Phone, MapPin, Clock, Globe, Zap, Gauge, Fuel } from "lucide-react";
import { useLang, T } from "./Lang";
import { trackLeadConversion } from "./GoogleAnalytics";
import { business, Service } from "@/lib/data";

const icons: Record<string, any> = { Truck, Settings, Flame, ClipboardCheck, Wrench, Siren, Gauge, Fuel };

export function Icon({ name, size = 26 }: { name: string; size?: number }) {
  const C = icons[name] || Wrench;
  return <C size={size} />;
}

export function ServiceCard({ s }: { s: Service }) {
  const { lang } = useLang();
  const c = s[lang];
  return (
    <div className={`group relative overflow-hidden rounded-lg border p-7 transition hover:-translate-y-1 ${s.featured ? "border-safety bg-paint/20" : "border-line bg-steel2"}`}>
      <div className="absolute left-0 top-0 h-1 w-full bg-safety scale-x-0 group-hover:scale-x-100 origin-left transition" />
      <div className="w-12 h-12 rounded bg-panel grid place-items-center mb-4 text-safety"><Icon name={s.icon} /></div>
      <h3 className="disp font-bold text-2xl mb-2">{c.name}</h3>
      <p className="text-zinc-400 text-sm mb-3">{c.blurb}</p>
      <ul className="space-y-1.5">
        {c.bullets.map((b, i) => (
          <li key={i} className="text-sm text-zinc-200 pl-5 relative">
            <span className="absolute left-0 top-2.5 w-2.5 h-0.5 bg-safety" />{b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(120deg,#1b4965,#0f2f44)" }}>
      <div className="max-w-6xl mx-auto px-5 py-14 flex flex-wrap items-center justify-between gap-7 relative z-10">
        <div>
          <h2 className="disp font-extrabold text-3xl md:text-4xl max-w-xl"><T en="Truck down? Equipment broke?" es="¿Camion parado? ¿Equipo descompuesto?" /></h2>
          <p className="text-sky-100 mt-2"><T en="Call now or request a quote — we'll get you running." es="Llama ahora o pide cotizacion — te ponemos en marcha." /></p>
        </div>
        <a href={business.phoneHref} className="skew bg-safety hover:bg-safety-d text-steel px-7 py-4 rounded disp font-bold text-lg">
          <span className="unskew"><T en={`Call ${business.phone}`} es="Llamar Ahora" /></span>
        </a>
      </div>
    </section>
  );
}

export function LeadForm({ kind }: { kind: "contact" | "quote" }) {
  const { lang } = useLang();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      formType: kind,
      lang,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      service: String(fd.get("service") ?? ""),
      vehicle: String(fd.get("vehicle") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""), // honeypot
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error("submit failed");
      trackLeadConversion(kind);
      form.reset();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="bg-steel2 border border-line rounded-lg p-7" onSubmit={handleSubmit}>
      {/* Honeypot — hidden from humans; bots that fill it are silently dropped server-side. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <Field label={lang === "es" ? "Nombre" : "Name"} req><input required name="name" type="text" className="inp" /></Field>
      <Field label={lang === "es" ? "Telefono" : "Phone"} req><input required name="phone" type="tel" className="inp" /></Field>
      {kind === "contact" && <Field label="Email"><input name="email" type="email" className="inp" /></Field>}
      {kind === "quote" && (
        <>
          <Field label={lang === "es" ? "Servicio" : "Service Needed"}>
            <select name="service" className="inp">
              <option>{lang === "es" ? "Reparacion de Camion" : "Truck Repair"}</option>
              <option>{lang === "es" ? "Reparacion de Equipo" : "Equipment Repair"}</option>
              <option>{lang === "es" ? "Soldadura en Sitio" : "On-Site Welding"}</option>
              <option>{lang === "es" ? "Inspeccion NY" : "NY State Inspection"}</option>
              <option>{lang === "es" ? "Emergencia" : "Emergency Service"}</option>
              <option>{lang === "es" ? "Otro" : "Other"}</option>
            </select>
          </Field>
          <Field label={lang === "es" ? "Vehiculo / Equipo" : "Vehicle / Equipment"}>
            <input name="vehicle" type="text" className="inp" placeholder={lang === "es" ? "Marca, modelo, ano" : "Make, model, year"} />
          </Field>
        </>
      )}
      <Field label={lang === "es" ? "Mensaje" : "Message"} req><textarea required name="message" className="inp min-h-[110px]" /></Field>
      <button type="submit" disabled={status === "sending"} className="skew w-full bg-safety hover:bg-safety-d text-steel py-3.5 rounded disp font-bold text-lg disabled:opacity-60">
        <span className="unskew">{status === "sending" ? (lang === "es" ? "Enviando…" : "Sending…") : kind === "quote" ? (lang === "es" ? "Pedir Cotizacion" : "Request Quote") : (lang === "es" ? "Enviar Mensaje" : "Send Message")}</span>
      </button>
      {status === "done" && (
        <div className="mt-3 rounded border border-emerald-600 bg-emerald-600/10 text-emerald-300 text-sm p-3">
          {lang === "es" ? "✓ Recibido — te responderemos pronto." : "✓ Got it — we'll get back to you shortly."}
        </div>
      )}
      {status === "error" && (
        <div className="mt-3 rounded border border-red-600 bg-red-600/10 text-red-300 text-sm p-3">
          {lang === "es"
            ? <>No se pudo enviar. Llamanos al <a className="underline font-bold" href={business.phoneHref}>{business.phone}</a>.</>
            : <>Couldn&apos;t send. Please call us at <a className="underline font-bold" href={business.phoneHref}>{business.phone}</a>.</>}
        </div>
      )}
      <style>{`.inp{width:100%;background:#10161d;border:1px solid #313e4d;border-radius:5px;padding:11px 13px;color:#eef2f6;font-size:15px}.inp:focus{outline:none;border-color:#ff7a00}`}</style>
    </form>
  );
}
function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block disp font-bold text-[14px] tracking-wide uppercase text-zinc-400 mb-1.5">{label}{req && " *"}</label>
      {children}
    </div>
  );
}

export function InfoBlock({ icon, title, children }: { icon: "phone" | "pin" | "clock" | "globe" | "zap"; title: string; children: React.ReactNode }) {
  const I = { phone: Phone, pin: MapPin, clock: Clock, globe: Globe, zap: Zap }[icon];
  return (
    <div className="flex gap-4 mb-6 items-start">
      <div className="w-11 h-11 rounded bg-panel grid place-items-center text-safety shrink-0"><I size={22} /></div>
      <div>
        <h4 className="disp font-bold text-lg uppercase tracking-wide">{title}</h4>
        <div className="text-zinc-400 text-[15px]">{children}</div>
      </div>
    </div>
  );
}
