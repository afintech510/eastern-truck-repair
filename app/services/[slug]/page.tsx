import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { business } from "@/lib/data";
import { serviceDetails } from "@/lib/serviceDetails";
import { CtaBand } from "@/components/UI";

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

function resolve(slug: string) {
  return serviceDetails.find((s) => s.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = resolve(params.slug);
  if (!s) return {};
  return {
    title: `${s.title.en} Long Island | ${business.shortName}`,
    description: `${s.subtitle.en} Serving ${business.region}. Call ${business.phone}.`,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const s = resolve(params.slug);
  if (!s) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title.en,
    description: s.intro.en,
    provider: {
      "@type": "AutoRepair",
      name: business.name,
      telephone: business.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address,
        addressLocality: business.city,
        addressRegion: business.state,
        postalCode: business.zip,
      },
    },
    areaServed: { "@type": "State", name: "New York" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <section className="border-b border-line" style={{ background: "linear-gradient(180deg,#10161d,#1a232e)" }}>
        <div className="max-w-6xl mx-auto px-5 py-20">
          <Link href="/services" className="text-safety text-sm disp font-bold tracking-wider uppercase hover:underline mb-4 block">
            ← All Services
          </Link>
          <h1 className="disp font-extrabold text-[clamp(36px,6.5vw,68px)] mb-4">{s.title.en}</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mb-8">{s.subtitle.en}</p>
          <a href={business.phoneHref} className="skew bg-safety hover:bg-safety-d text-steel px-7 py-3.5 rounded disp font-bold text-lg">
            <span className="unskew">Call {business.phone}</span>
          </a>
        </div>
      </section>

      <section className="py-[74px]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <p className="text-zinc-300 text-lg leading-relaxed mb-10">{s.intro.en}</p>

              <h2 className="disp font-bold text-2xl mb-5 text-safety uppercase tracking-wide">How It Works</h2>
              <div className="space-y-4 mb-12">
                {s.process.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-safety text-steel grid place-items-center shrink-0 disp font-bold text-lg">{i + 1}</div>
                    <p className="text-zinc-300 text-[15px] pt-1.5">{step.en}</p>
                  </div>
                ))}
              </div>

              <h2 className="disp font-bold text-2xl mb-5 text-safety uppercase tracking-wide">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {s.faqs.map((f, i) => (
                  <div key={i} className="bg-steel2 border border-line rounded-lg p-6">
                    <h3 className="disp font-bold text-lg mb-2">{f.q.en}</h3>
                    <p className="text-zinc-400 text-[15px]">{f.a.en}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-steel2 border border-safety rounded-lg p-7 sticky top-8">
                <h3 className="disp font-bold text-xl mb-3">Need {s.title.en}?</h3>
                <p className="text-zinc-400 text-sm mb-5">Call now or request a quote — we respond same-day.</p>
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
            <h3 className="disp font-bold text-lg mb-3 text-zinc-400">Other Services</h3>
            <div className="flex flex-wrap gap-2">
              {serviceDetails.filter((o) => o.slug !== s.slug).map((o) => (
                <Link key={o.slug} href={`/services/${o.slug}`} className="disp font-semibold text-sm text-zinc-400 bg-steel2 border border-line rounded px-3 py-1.5 hover:text-safety hover:border-safety transition">
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
