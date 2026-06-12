"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang, T } from "./Lang";
import { business } from "@/lib/data";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();
  const links = [
    { href: "/", en: "Home", es: "Inicio" },
    { href: "/services", en: "Services", es: "Servicios" },
    { href: "/welding", en: "Welding", es: "Soldadura" },
    { href: "/about", en: "About", es: "Nosotros" },
    { href: "/contact", en: "Contact", es: "Contacto" },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-steel/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-[68px]">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/eastern-truck-emblem.png"
            alt="Eastern Truck & Equipment Repair & Welding logo"
            width={80}
            height={80}
            priority
            unoptimized
            className="w-[80px] h-[80px] shrink-0 object-contain translate-y-[8px] drop-shadow-lg"
          />
          <span className="leading-tight uppercase">
            <b className="disp font-extrabold text-xl md:text-2xl block text-safety tracking-tight">
              Eastern Truck
            </b>
            <span className="disp font-bold text-[11px] md:text-xs tracking-[0.14em] text-zinc-100 block">
              <T en="+ Equipment Repair" es="+ Reparacion de Equipos" />
            </span>
            <span className="disp font-bold text-[11px] md:text-xs tracking-[0.14em] text-zinc-400 block">
              <T en="+ Welding & Fabrication" es="+ Soldadura y Fabricacion" />
            </span>
          </span>
        </Link>

        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-[68px] left-0 right-0 md:top-auto bg-steel2 md:bg-transparent border-b md:border-0 border-line p-5 md:p-0 gap-1 md:gap-7 items-start md:items-center`}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="disp font-bold text-[16px] md:text-base text-zinc-300 hover:text-safety transition py-2 md:py-0">
              <T en={l.en} es={l.es} />
            </Link>
          ))}
          <Link href="/quote" onClick={() => setOpen(false)}
            className="skew bg-safety hover:bg-safety-d text-steel px-4 py-2 rounded disp font-bold">
            <span className="unskew"><T en="Get a Quote" es="Cotizar" /></span>
          </Link>
          <div className="flex border border-line rounded overflow-hidden mt-2 md:mt-0">
            <button onClick={() => setLang("en")} className={`disp font-bold text-[13px] px-3 py-1.5 ${lang === "en" ? "bg-safety text-steel" : "text-zinc-400"}`}>EN</button>
            <button onClick={() => setLang("es")} className={`disp font-bold text-[13px] px-3 py-1.5 ${lang === "es" ? "bg-safety text-steel" : "text-zinc-400"}`}>ES</button>
          </div>
        </div>

        <button className="md:hidden text-zinc-200" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </nav>
  );
}
