import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/data";
import { serviceDetails } from "@/lib/serviceDetails";
import { equipment } from "@/lib/equipmentData";
import { CtaBand } from "@/components/UI";

export const metadata: Metadata = {
  title: `FAQ | ${business.shortName}`,
  description: `Frequently asked questions about commercial truck repair, heavy equipment service, on-site welding, and NY State inspections. Serving ${business.region}.`,
};

const generalFaqs = [
  {
    q: "Where are you located?",
    a: `Our shop is at ${business.address}, ${business.city}, ${business.state} ${business.zip}. We also provide mobile service across ${business.region}.`,
  },
  {
    q: "What are your hours?",
    a: `${business.hours.en}. For emergencies, call us any time.`,
  },
  {
    q: "Do you offer mobile / on-site service?",
    a: "Yes. We bring our fully equipped mobile welding and repair rig to your job site, yard, or roadside location across Eastern Long Island. No need to tow heavy equipment to the shop.",
  },
  {
    q: "What areas do you serve?",
    a: `We serve all of ${business.region} including Speonk, Westhampton, Eastport, Hampton Bays, Flanders, Riverhead, Calverton, Manorville, Center Moriches, East Moriches, Shirley, Mastic, Patchogue, and Southampton.`,
  },
  {
    q: "Do you work on all makes and models?",
    a: "Yes. We service all makes and models of commercial trucks, heavy equipment, and trailers — domestic and import, gas and diesel.",
  },
  {
    q: "Do you speak Spanish?",
    a: "Si. Nuestro equipo es bilingue — hablamos ingles y espanol.",
  },
  {
    q: "How do I get a quote?",
    a: "Call us or fill out the quote form on our website. Describe the issue, the vehicle/equipment make and model, and your location. We respond same-day.",
  },
];

export default function FaqPage() {
  const allServiceFaqs = serviceDetails.flatMap((s) =>
    s.faqs.map((f) => ({ q: f.q.en, a: f.a.en, category: s.title.en }))
  );
  const allEquipmentFaqs = equipment.flatMap((e) =>
    e.faqs.map((f) => ({ q: f.q.en, a: f.a.en, category: e.title.en }))
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...generalFaqs,
      ...allServiceFaqs,
      ...allEquipmentFaqs,
    ].map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="border-b border-line" style={{ background: "linear-gradient(180deg,#10161d,#1a232e)" }}>
        <div className="max-w-6xl mx-auto px-5 py-20">
          <h1 className="disp font-extrabold text-[clamp(36px,6.5vw,68px)] mb-4">Frequently Asked Questions</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Common questions about our truck repair, heavy equipment service, welding, and inspection services across {business.region}.
          </p>
        </div>
      </section>

      <section className="py-[74px]">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="disp font-bold text-2xl mb-6 text-safety uppercase tracking-wide">General</h2>
          <div className="space-y-4 mb-14">
            {generalFaqs.map((f, i) => (
              <div key={i} className="bg-steel2 border border-line rounded-lg p-6">
                <h3 className="disp font-bold text-lg mb-2">{f.q}</h3>
                <p className="text-zinc-400 text-[15px]">{f.a}</p>
              </div>
            ))}
          </div>

          <h2 className="disp font-bold text-2xl mb-6 text-safety uppercase tracking-wide">Services</h2>
          <div className="space-y-4 mb-14">
            {allServiceFaqs.map((f, i) => (
              <div key={i} className="bg-steel2 border border-line rounded-lg p-6">
                <span className="text-xs text-safety disp font-bold uppercase tracking-wider">{f.category}</span>
                <h3 className="disp font-bold text-lg mb-2 mt-1">{f.q}</h3>
                <p className="text-zinc-400 text-[15px]">{f.a}</p>
              </div>
            ))}
          </div>

          <h2 className="disp font-bold text-2xl mb-6 text-safety uppercase tracking-wide">Equipment</h2>
          <div className="space-y-4 mb-14">
            {allEquipmentFaqs.map((f, i) => (
              <div key={i} className="bg-steel2 border border-line rounded-lg p-6">
                <span className="text-xs text-safety disp font-bold uppercase tracking-wider">{f.category}</span>
                <h3 className="disp font-bold text-lg mb-2 mt-1">{f.q}</h3>
                <p className="text-zinc-400 text-[15px]">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="bg-paint/20 border border-safety rounded-lg p-8 text-center">
            <h2 className="disp font-bold text-2xl mb-3">Still Have Questions?</h2>
            <p className="text-zinc-300 mb-5">Call us or send a message — we respond same-day.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={business.phoneHref} className="skew bg-safety hover:bg-safety-d text-steel px-7 py-3 rounded disp font-bold">
                <span className="unskew">Call {business.phone}</span>
              </a>
              <Link href="/contact" className="skew border border-line hover:border-safety text-zinc-300 hover:text-safety px-7 py-3 rounded disp font-bold">
                <span className="unskew">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
