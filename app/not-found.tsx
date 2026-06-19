import Link from "next/link";
import type { Metadata } from "next";
import { business } from "@/lib/data";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg,#10161d,#1a232e)" }}>
      <div className="max-w-2xl mx-auto px-5 text-center">
        <span className="disp font-extrabold text-[120px] text-safety leading-none block">404</span>
        <h1 className="disp font-extrabold text-3xl md:text-4xl mt-4 mb-4">Page Not Found</h1>
        <p className="text-zinc-400 text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="skew bg-safety hover:bg-safety-d text-steel px-7 py-3 rounded disp font-bold">
            <span className="unskew">Go Home</span>
          </Link>
          <Link href="/services" className="skew border border-line hover:border-safety text-zinc-300 hover:text-safety px-7 py-3 rounded disp font-bold">
            <span className="unskew">View Services</span>
          </Link>
          <a href={business.phoneHref} className="skew border border-line hover:border-safety text-zinc-300 hover:text-safety px-7 py-3 rounded disp font-bold">
            <span className="unskew">Call {business.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
