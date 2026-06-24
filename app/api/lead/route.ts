import { NextResponse } from "next/server";
import { sendLead, LeadConfigError, type LeadPayload } from "@/lib/sendLead";

// Nodemailer needs the Node runtime (not Edge). Never statically prerendered.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = Partial<LeadPayload> & { company?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 400 });
  }

  // Honeypot: a filled `company` field means a bot. Silently accept, never send.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const formType = body.formType;

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "name and phone are required" }, { status: 400 });
  }
  if (formType !== "contact" && formType !== "quote" && formType !== "chatbot" && formType !== "chatbot-sms") {
    return NextResponse.json({ ok: false, error: "invalid formType" }, { status: 400 });
  }

  const payload: LeadPayload = {
    formType,
    lang: body.lang === "es" ? "es" : "en",
    name,
    phone,
    email: (body.email ?? "").trim(),
    service: (body.service ?? "").trim(),
    vehicle: (body.vehicle ?? "").trim(),
    message: (body.message ?? "").trim(),
  };

  try {
    await sendLead(payload);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof LeadConfigError) {
      console.error("[/api/lead] email not configured:", err.message);
      return NextResponse.json({ ok: false, error: "email not configured" }, { status: 500 });
    }
    console.error("[/api/lead] send failed:", err);
    return NextResponse.json({ ok: false, error: "delivery failed" }, { status: 502 });
  }
}
