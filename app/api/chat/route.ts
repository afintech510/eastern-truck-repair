import { NextResponse } from "next/server";
import { chatWithBot, type ChatMessage, type VehicleContext } from "@/lib/chatbot";

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

// Periodically clean stale entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimiter) {
    if (now - entry.start > RATE_WINDOW) rateLimiter.delete(ip);
  }
}, 5 * 60 * 1000);

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate limited" },
      { status: 429 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
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
    const message = await chatWithBot(body.messages, body.vehicle, {
      lang: body.lang,
    });
    return NextResponse.json({ ok: true, message });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { ok: false, error: "Chat unavailable" },
      { status: 502 },
    );
  }
}
