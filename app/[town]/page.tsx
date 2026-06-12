import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { business, services, towns, townSlug, townContent } from "@/lib/data";
import { CtaBand } from "@/components/UI";

// Pre-render a page for every town at build time (the SEO matrix).
export function generateStaticParams() {
  return towns.map((t) => ({ town: townSlug(t) }));
}

function resolve(slug: string) {
  return towns.find((t) => townSlug(t) === slug);
}

export function generateMetadata({ params }: { params: { town: string } }): Metadata {
  const town = resolve(params.town);
  if (!town) return {};
  return {
    title: `Truck & Equipment Repair in ${town}, NY | ${business.shortName}`,
    description: `Commercial truck repair, heavy equipment service, and on-site welding in ${town}, NY. Fast, certified, bilingual. Call ${business.phone}.`,
  };
}

export default function TownPage({ params }: { params: { town: string } }) {
  const town = resolve(params.town);
  if (!town) notFound();
  const tc = townContent[params.town];
  return (
    <>
      <section className="border-b border-line" style={{ background: "linear-gradient(180deg,#10161d,#1a232e)" }}>
        <div className="max-w-6xl mx-auto px-5 py-20">
          <span className="disp font-bold text-sm tracking-[0.16em] text-safety uppercase mb-4 block">Serving {town}, NY</span>
          <h1 className="disp font-extrabold text-[clamp(36px,6.5vw,68px)] mb-5">
            Truck & Equipment Repair<br /><span className="text-safety">in {town}</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mb-8">
            {tc
              ? tc.blurb.en
              : `${business.shortName} provides commercial truck repair, heavy equipment service, on-site welding, and NY State inspections to ${town} and the surrounding ${business.region} area. When your equipment goes down in ${town}, we get you back to work fast.`}
          </p>
          <a href={business.phoneHref} className="skew bg-safety hover:bg-safety-d text-steel px-7 py-3.5 rounded disp font-bold text-lg">
            <span className="unskew">Call {business.phone}</span>
          </a>
        </div>
      </section>

      <section className="py-[74px]">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="disp font-extrabold text-[clamp(26px,4vw,40px)] mb-8">Our Services in {town}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.slug} className={`rounded-lg border p-7 ${s.featured ? "border-safety bg-paint/20" : "border-line bg-steel2"}`}>
                <h3 className="disp font-bold text-2xl mb-2">{s.en.name}</h3>
                <p className="text-zinc-400 text-sm">{s.en.blurb}</p>
                <p className="text-zinc-500 text-sm mt-3">{s.en.name} in {town}, NY and across {business.region}.</p>
              </div>
            ))}
          </div>
          {tc && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-7">
              <div className="rounded-lg border border-line bg-steel2 p-7">
                <h3 className="disp font-bold text-xl mb-3 text-safety uppercase tracking-wide">On the road in {town}</h3>
                <p className="text-zinc-400 text-[15px] mb-4">{tc.localWork.en}</p>
                <div className="flex flex-wrap gap-2">
                  {tc.roads.map((r) => (
                    <span key={r} className="text-sm text-zinc-300 bg-panel border border-line rounded px-3 py-1.5">{r}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-safety bg-paint/20 p-7 flex flex-col justify-center">
                <h3 className="disp font-bold text-xl mb-2">Mobile service to {town}</h3>
                <p className="text-zinc-300 text-[15px] mb-4">On-site welding and diesel repair — we bring the rig to your yard or job site. Call to get on the schedule today.</p>
                <a href={business.phoneHref} className="skew bg-safety hover:bg-safety-d text-steel px-6 py-3 rounded disp font-bold self-start">
                  <span className="unskew">Call {business.phone}</span>
                </a>
              </div>
            </div>
          )}

          <div className="mt-12">
            <h3 className="disp font-bold text-xl mb-3 text-zinc-300">Also serving nearby</h3>
            <div className="flex flex-wrap gap-2">
              {towns.filter((t) => t !== town).slice(0, 10).map((t) => (
                <Link key={t} href={`/${townSlug(t)}`} className="disp font-semibold text-sm text-zinc-400 bg-steel2 border border-line rounded px-3 py-1.5 hover:text-safety hover:border-safety transition">
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
