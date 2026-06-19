"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "./Lang";

const labels: Record<string, [string, string]> = {
  services: ["Services", "Servicios"],
  equipment: ["Equipment", "Equipo"],
  welding: ["Welding", "Soldadura"],
  about: ["About", "Nosotros"],
  contact: ["Contact", "Contacto"],
  quote: ["Get a Quote", "Cotizar"],
  faq: ["FAQ", "Preguntas"],
  "truck-repair": ["Truck Repair", "Reparacion de Camiones"],
  "equipment-repair": ["Equipment Repair", "Reparacion de Equipo"],
  inspections: ["Inspections", "Inspecciones"],
  maintenance: ["Maintenance", "Mantenimiento"],
  emergency: ["Emergency", "Emergencia"],
  excavators: ["Excavators", "Excavadoras"],
  "dump-trucks": ["Dump Trucks", "Camiones de Volteo"],
  "wheel-loaders": ["Wheel Loaders", "Cargadores Frontales"],
  "skid-steers": ["Skid Steers", "Minicargadores"],
  trailers: ["Trailers", "Remolques"],
};

function humanize(slug: string): [string, string] {
  if (labels[slug]) return labels[slug];
  const en = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return [en, en];
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    href: "/" + segments.slice(0, i + 1).join("/"),
    label: humanize(seg),
  }));

  return (
    <nav aria-label="Breadcrumb" className="bg-steel border-b border-line">
      <div className="max-w-6xl mx-auto px-5 py-2.5 flex flex-wrap gap-1.5 text-[13px]">
        <Link href="/" className="text-zinc-500 hover:text-safety transition">
          <T en="Home" es="Inicio" />
        </Link>
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            <span className="text-zinc-700">/</span>
            {i === crumbs.length - 1 ? (
              <span className="text-zinc-300"><T en={c.label[0]} es={c.label[1]} /></span>
            ) : (
              <Link href={c.href} className="text-zinc-500 hover:text-safety transition">
                <T en={c.label[0]} es={c.label[1]} />
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
