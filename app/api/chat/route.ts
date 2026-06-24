import { NextResponse } from "next/server";
import { chatWithBot, type ChatMessage, type VehicleContext } from "@/lib/chatbot";
import { getVehicleRecalls, getVehicleComplaints } from "@/lib/nhtsa";
import { findRelevantEntries } from "@/lib/diagnosticKB";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT = 30;

type RateEntry = { count: number; start: number };
const rateLimiter = new Map<string, RateEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    rateLimiter.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimiter) {
    if (now - entry.start > RATE_WINDOW) rateLimiter.delete(ip);
  }
}, 5 * 60 * 1000);

async function buildExtraContext(
  vehicle: VehicleContext | undefined,
  messages: ChatMessage[],
): Promise<string> {
  const parts: string[] = [];

  if (vehicle?.make && vehicle?.model && vehicle?.year) {
    const [recalls, complaints] = await Promise.all([
      getVehicleRecalls(vehicle.make, vehicle.model, vehicle.year),
      getVehicleComplaints(vehicle.make, vehicle.model, vehicle.year),
    ]);

    if (recalls.length > 0) {
      parts.push(
        "KNOWN RECALLS FOR THIS VEHICLE:\n" +
          recalls.slice(0, 5).map((r) => `- ${r}`).join("\n"),
      );
    }

    if (complaints.length > 0) {
      parts.push(
        "COMMON COMPLAINTS FOR THIS VEHICLE:\n" +
          complaints.slice(0, 5).map((c) => `- ${c}`).join("\n"),
      );
    }
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (lastUserMsg) {
    const kbEntries = findRelevantEntries(lastUserMsg.content);
    if (kbEntries.length > 0) {
      parts.push(
        "DIAGNOSTIC KNOWLEDGE (use to inform your response):\n" +
          kbEntries
            .map(
              (e) =>
                `- Symptom: "${e.symptom}" → Possible causes: ${e.causes.join(", ")} → Recommended: ${e.service} (Urgency: ${e.urgency})`,
            )
            .join("\n"),
      );
    }
  }

  return parts.join("\n\n");
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate limited" },
      { status: 429 },
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Chat not configured" },
      { status: 500 },
    );
  }

  let body: {
    messages?: ChatMessage[];
    vehicle?: VehicleContext;
    lang?: "en" | "es";
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { ok: false, error: "messages array required" },
      { status: 400 },
    );
  }

  if (body.messages.length > 50) {
    return NextResponse.json(
      { ok: false, error: "Too many messages" },
      { status: 400 },
    );
  }

  for (const msg of body.messages) {
    if (
      !msg ||
      typeof msg.role !== "string" ||
      typeof msg.content !== "string" ||
      !["user", "assistant"].includes(msg.role)
    ) {
      return NextResponse.json(
        { ok: false, error: "Each message must have role (user|assistant) and content" },
        { status: 400 },
      );
    }
  }

  try {
    const extraContext = await buildExtraContext(body.vehicle, body.messages);
    const result = await chatWithBot(body.messages, body.vehicle, {
      lang: body.lang,
    }, extraContext);
    return NextResponse.json({
      ok: true,
      message: result.message,
      leadCaptured: result.leadCaptured || false,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { ok: false, error: "Chat unavailable" },
      { status: 502 },
    );
  }
}
