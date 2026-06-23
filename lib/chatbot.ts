import Anthropic from "@anthropic-ai/sdk";
import { business, services } from "./data";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type VehicleContext = {
  type?: string;
  year?: string;
  make?: string;
  model?: string;
};

export type ChatOptions = {
  sms?: boolean;
  lang?: "en" | "es";
};

function buildServiceList(): string {
  return services
    .map((s) => `- ${s.en.name}: ${s.en.blurb}`)
    .join("\n");
}

function buildSystemPrompt(
  vehicle?: VehicleContext,
  options?: ChatOptions,
): string {
  let prompt = `You are the virtual service advisor for ${business.name} in ${business.city}, ${business.state}.

IDENTITY:
- Commercial truck, heavy equipment, and on-site welding shop
- Address: ${business.address}, ${business.city}, ${business.state} ${business.zip}
- Phone: ${business.phone}
- Hours: ${business.hours.en}
- Service area: ${business.region} (14 towns from Patchogue to Southampton)

SERVICES:
${buildServiceList()}

CONVERSATION RULES:
1. Be helpful, knowledgeable, and professional — like a real service advisor.
2. Ask follow-up questions about symptoms before suggesting causes.
3. Suggest possible causes but never guarantee a diagnosis — "It sounds like it could be X, but a mechanic would need to inspect it to confirm."
4. Guide EVERY conversation toward booking: on-site appointment (primary) or calling the shop (secondary).
5. Walk-ins are welcome: "You're welcome to stop by without an appointment, but during busy times there may be a wait to speak with a mechanic."
6. If asked about pricing: "Pricing depends on the specific job — let's get you scheduled so we can give you an accurate quote."
7. Never make warranty claims, legal statements, or promises about repair outcomes.
8. If the conversation goes off-topic (not vehicle/equipment related), politely redirect: "I'm here to help with truck, equipment, and welding questions — what can I help you with?"
9. Do not discuss competitors, other shops, or make comparisons.
10. Do not provide specific part numbers or prices.

DIAGNOSTIC APPROACH:
When a customer describes a symptom:
1. Ask what type of vehicle/equipment if not already known.
2. Ask clarifying questions: "When does it happen? How long has it been going on? Any other symptoms?"
3. Suggest 2-3 possible causes ranked by likelihood.
4. Recommend the appropriate service category.
5. Push toward booking: "Let's get a mechanic to take a look — want to schedule an appointment?"

BOOKING:
- To schedule, collect the customer's name and phone number.
- Always offer the shop phone as a direct option: "Or call us at ${business.phone}"`;

  if (vehicle && (vehicle.type || vehicle.make || vehicle.model || vehicle.year)) {
    const parts = [vehicle.year, vehicle.make, vehicle.model, vehicle.type]
      .filter(Boolean);
    if (parts.length > 0) {
      prompt += `\n\nVEHICLE CONTEXT: The customer has a ${parts.join(" ")}. Use this context in your responses.`;
    }
  }

  if (options?.sms) {
    prompt += `\n\nSMS MODE: Keep responses under 300 characters. Be concise but still helpful. Use abbreviations where natural.
When the customer has provided their name and agreed to schedule an appointment (or you have enough info to capture a lead), include the exact marker [LEAD_CAPTURED] at the end of your response. Only include this marker ONCE per conversation. Do not explain the marker to the customer — it is an internal signal.`;
  }

  if (options?.lang === "es") {
    prompt += `\n\nLANGUAGE: Respond in Spanish (Español). The customer prefers Spanish.`;
  } else if (options?.lang === "en") {
    prompt += `\n\nLANGUAGE: Respond in English.`;
  }

  return prompt;
}

export async function chatWithBot(
  messages: ChatMessage[],
  vehicle?: VehicleContext,
  options?: ChatOptions,
): Promise<string> {
  const client = new Anthropic();
  const model = process.env.CHATBOT_MODEL || "claude-sonnet-4-5-20250514";
  const maxTokens = options?.sms ? 200 : 500;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: buildSystemPrompt(vehicle, options),
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const block = response.content[0];
  if (block.type === "text") {
    return block.text;
  }
  return "";
}
