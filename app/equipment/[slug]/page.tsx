import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { business } from "@/lib/data";
import { equipment } from "@/lib/equipmentData";
import { CtaBand } from "@/components/UI";

export function generateStaticParams() {
  return equipment.map((e) => ({ slug: e.slug }));
}

function resolve(slug: string) {
  return equipment.find((e) => e.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = resolve(params.slug);
  if (!e) return {};
  return {
    title: `${e.title.en} Long Island | ${business.shortName}`,
    description: `${e.subtitle.en} All brands serviced. Serving ${business.region}. Call ${business.phone}.`,
  };
}

export default function EquipmentDetailPage({ params }: { params: { slug: string } }) {
  const e = resolve(params.slug);
  if (!e) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: e.faqs.map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="border-b border-line" style={{ background: "linear-gradient(180deg,#10161d,#1a232e)" }}>
        <div className="max-w-6xl mx-auto px-5 py-20">
          <Link href="/services" className="text-safety text-sm disp font-bold tracking-wider uppercase hover:underline mb-4 block">
            ← All Services
          </Link>
          <h1 className="disp font-extrabold text-[clamp(36px,6.5vw,68px)] mb-4">{e.title.en}</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mb-8">{e.subtitle.en}</p>
          <a href={business.phoneHref} className="skew bg-safety hover:bg-safety-d text-steel px-7 py-3.5 rounded disp font-bold text-lg">
            <span className="unskew">Call {business.phone}</span>
          </a>
        </div>
      </section>

      <section className="py-[74px]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <p className="text-zinc-300 text-lg leading-relaxed mb-10">{e.intro.en}</p>

              <h2 className="disp font-bold text-2xl mb-5 text-safety uppercase tracking-wide">What We Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
                {e.services.map((svc, i) => (
                  <div key={i} className="flex items-start gap-3 bg-steel2 border border-line rounded-lg p-4">
                    <span className="w-2.5 h-0.5 bg-safety mt-2.5 shrink-0" />
                    <span className="text-zinc-300 text-[15px]">{svc.en}</span>
                  </div>
                ))}
              </div>

              <h2 className="disp font-bold text-2xl mb-5 text-safety uppercase tracking-wide">Brands We Work On</h2>
              <div className="flex flex-wrap gap-2 mb-12">
                {e.brands.map((b) => (
                  <span key={b} className="text-sm text-zinc-300 bg-panel border border-line rounded px-3 py-1.5 disp font-semibold">{b}</span>
                ))}
              </div>

              <h2 className="disp font-bold text-2xl mb-5 text-safety uppercase tracking-wide">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {e.faqs.map((f, i) => (
                  <div key={i} className="bg-steel2 border border-line rounded-lg p-6">
                    <h3 className="disp font-bold text-lg mb-2">{f.q.en}</h3>
                    <p className="text-zinc-400 text-[15px]">{f.a.en}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-steel2 border border-safety rounded-lg p-7 sticky top-8">
                <h3 className="disp font-bold text-xl mb-3">{e.title.en}</h3>
                <p className="text-zinc-400 text-sm mb-5">On-site or in-shop service. All brands, all sizes.</p>
                <a href={business.phoneHref} className="block text-center skew bg-safety hover:bg-safety-d text-steel py-3 rounded disp font-bold mb-3">
                  <span className="unskew">Call {business.phone}</span>
                </a>
                <Link href="/quote" className="block text-center skew border border-line hover:border-safety text-zinc-300 hover:text-safety py-3 rounded disp font-bold">
                  <span className="unskew">Request a Quote</span>
                </Link>
                <div className="mt-6 pt-5 border-t border-line">
                  <h4 className="disp font-bold text-sm uppercase tracking-wider text-zinc-400 mb-3">Service Area</h4>
                  <p className="text-zinc-500 text-sm">{business.region} — Speonk, Riverhead, Hampton Bays, Patchogue, and surrounding towns.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-line">
            <h3 className="disp font-bold text-lg mb-3 text-zinc-400">Other Equipment We Service</h3>
            <div className="flex flex-wrap gap-2">
              {equipment.filter((o) => o.slug !== e.slug).map((o) => (
                <Link key={o.slug} href={`/equipment/${o.slug}`} className="disp font-semibold text-sm text-zinc-400 bg-steel2 border border-line rounded px-3 py-1.5 hover:text-safety hover:border-safety transition">
                  {o.title.en}
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
