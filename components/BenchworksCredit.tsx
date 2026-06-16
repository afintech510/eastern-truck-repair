import { T } from "./Lang";

/**
 * Site-wide builder attribution, rendered once in app/layout.tsx directly below
 * the main <Footer />. One source of truth — every page inherits it.
 * Variant D (Clean & Premium). Whole strip links to benchworksai.com.
 */
export default function BenchworksCredit() {
  return (
    <div className="bg-steel border-t border-line">
      <a
        href="https://benchworksai.com"
        target="_blank"
        rel="noopener"
        className="group max-w-6xl mx-auto px-5 py-4 flex flex-col items-center text-center gap-1.5
                   md:flex-row md:justify-center md:gap-3 md:text-left
                   text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <span className="font-semibold text-zinc-400 group-hover:text-zinc-200">
          <T en="Built by Benchworks" es="Hecho por Benchworks" />
        </span>
        <span className="hidden md:inline text-zinc-700">·</span>
        <span className="text-zinc-500">
          <T
            en="Custom platforms. AI tool coaching that multiplies your team's time."
            es="Plataformas a medida. Coaching de IA que multiplica el tiempo de tu equipo."
          />
        </span>
        <span className="hidden md:inline text-zinc-700">·</span>
        <span className="tracking-wide text-zinc-500">
          <T en="Advise · Build · Train · Manage" es="Asesorar · Construir · Capacitar · Gestionar" />
        </span>
        <span className="hidden md:inline text-zinc-700">·</span>
        <span className="text-safety/90 group-hover:text-safety">benchworksai.com</span>
      </a>
    </div>
  );
}
