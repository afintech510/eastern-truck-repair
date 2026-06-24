import crypto from "crypto";
import { chatWithBot, type ChatMessage } from "@/lib/chatbot";
import { sendLead, LeadConfigError } from "@/lib/sendLead";
import { business } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_REPLY = `Thanks for reaching out! Please call us at ${business.phone} or visit easterntruckrepair.com. We're open Mon-Fri 7AM-5PM.`;

const LEAD_MARKER = "[LEAD_CAPTURED]";

const CONVERSATION_TTL = 30 * 60 * 1000;
const MAX_MESSAGES_PER_WINDOW = 10;

type Conversation = {
  messages: ChatMessage[];
  lastActivity: number;
  messageCount: number;
  leadCaptured: boolean;
};

const conversations = new Map<string, Conversation>();

function cleanupStale() {
  const now = Date.now();
  for (const [key, conv] of conversations) {
    if (now - conv.lastActivity > CONVERSATION_TTL) {
      conversations.delete(key);
    }
  }
}

const SPANISH_INDICATORS = [
  "hola", "buenos", "buenas", "gracias", "por favor", "necesito",
  "tengo", "puede", "quiero", "problema", "camión", "camion",
  "ayuda", "cita", "reparación", "reparacion", "equipo",
];

function detectLang(text: string): "en" | "es" {
  const lower = text.toLowerCase();
  const matches = SPANISH_INDICATORS.filter((w) => lower.includes(w));
  return matches.length >= 1 ? "es" : "en";
}

function extractName(messages: ChatMessage[]): string | null {
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    const match = msg.content.match(
      /(?:(?:my name is|i'm|i am|me llamo|soy|nombre es)\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    );
    if (match) return match[1];
  }
  return null;
}

function summarizeConversation(messages: ChatMessage[]): string {
  return messages
    .slice(-10)
    .map((m) => `${m.role === "user" ? "Customer" : "Bot"}: ${m.content}`)
    .join("\n");
}

function twiml(message: string): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string,
  authToken: string,
): boolean {
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  for (const key of sortedKeys) {
    data += key + params[key];
  }
  const expected = crypto
    .createHmac("sha1", authToken)
    .update(data)
    .digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature),
  );
}

export async function POST(req: Request) {
  cleanupStale();

  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  const from = params.From || "";
  const body = params.Body || "";
  const twilioSignature = req.headers.get("X-Twilio-Signature") || "";

  const authToken = process.env.TWILIO_AUTH;
  if (authToken) {
    const webhookUrl =
      process.env.TWILIO_WEBHOOK_URL ||
      "https://www.easterntruckrepair.com/api/sms";
    if (
      !twilioSignature ||
      !validateTwilioSignature(webhookUrl, params, twilioSignature, authToken)
    ) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  if (!from || !body.trim()) {
    return twiml(FALLBACK_REPLY);
  }

  let conv = conversations.get(from);
  if (!conv) {
    conv = { messages: [], lastActivity: Date.now(), messageCount: 0, leadCaptured: false };
    conversations.set(from, conv);
  }

  conv.messageCount++;
  if (conv.messageCount > MAX_MESSAGES_PER_WINDOW) {
    return twiml(
      `You've sent a lot of messages — please call us at ${business.phone} for faster help.`,
    );
  }

  conv.messages.push({ role: "user", content: body.trim() });
  conv.lastActivity = Date.now();

  if (!process.env.GEMINI_API_KEY) {
    return twiml(FALLBACK_REPLY);
  }

  try {
    const lang = detectLang(body);
    const result = await chatWithBot(conv.messages, undefined, {
      sms: true,
      lang,
    });

    let botResponse = result.message;

    if (result.leadCaptured && !conv.leadCaptured) {
      conv.leadCaptured = true;
    }

    if (botResponse.includes(LEAD_MARKER) && !conv.leadCaptured) {
      conv.leadCaptured = true;
      botResponse = botResponse.replace(LEAD_MARKER, "").trim();

      const name = extractName(conv.messages) || from;
      sendLead({
        formType: "chatbot-sms",
        lang,
        name,
        phone: from,
        message: summarizeConversation(conv.messages),
      }).catch((err) => {
        if (!(err instanceof LeadConfigError)) {
          console.error("[/api/sms] lead capture failed:", err);
        }
      });
    }

    conv.messages.push({ role: "assistant", content: botResponse });

    return twiml(botResponse);
  } catch (err) {
    console.error("[/api/sms] chatbot error:", err);
    return twiml(FALLBACK_REPLY);
  }
}
