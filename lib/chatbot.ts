import {
  GoogleGenerativeAI,
  SchemaType,
  type Content,
  type FunctionDeclarationsTool,
  type Part,
} from "@google/generative-ai";
import { business, services } from "./data";
import { sendLead, LeadConfigError } from "./sendLead";

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

export type ChatResult = {
  message: string;
  leadCaptured?: boolean;
};

function buildServiceList(): string {
  return services
    .map((s) => `- ${s.en.name}: ${s.en.blurb}`)
    .join("\n");
}

const submitLeadTool: FunctionDeclarationsTool = {
  functionDeclarations: [
    {
      name: "submit_lead",
      description:
        "Call IMMEDIATELY when the customer provides their name and phone number to book a shop appointment. Do not wait for more conversation. All appointments are subject to confirmation from the shop.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          customerName: { type: SchemaType.STRING, description: "Customer's name" },
          phoneNumber: { type: SchemaType.STRING, description: "Customer's phone number" },
          email: { type: SchemaType.STRING, description: "Customer's email address" },
          preferredTime: { type: SchemaType.STRING, description: "Preferred appointment time" },
          problemDescription: { type: SchemaType.STRING, description: "Brief summary of the vehicle problem or reason for the appointment" },
        },
        required: ["customerName", "phoneNumber", "problemDescription"],
      },
    },
  ],
};

function buildSystemPrompt(
  vehicle?: VehicleContext,
  options?: ChatOptions,
  extraContext?: string,
): string {
  let prompt = `You are Axle, the virtual service advisor for ${business.name} in ${business.city}, ${business.state}.

IDENTITY:
- Commercial truck, heavy equipment, and on-site welding shop
- Address: ${business.address}, ${business.city}, ${business.state} ${business.zip}
- Phone: ${business.phone}
- Hours: ${business.hours.en}
- Service area: ${business.region} (14 towns from Patchogue to Southampton)

VOICE:
Sound like a seasoned Long Island heavy diesel service manager — direct, concise, no-BS. Respect their time. Use trade vocab naturally (regen, derate, DPF, DOT, PM, air system). Short sentences. Never sound scripted or corporate. Acknowledge that a broken machine means lost money.
Example tone: "Sounds like your DPF's loading up and it won't regen. Could be a few things — sensor, EGR, or a clogged filter. Let's get it in and pull codes. Would morning or afternoon work better?"

PRIMARY OBJECTIVE:
Your success is measured by generating qualified service appointments. Every vehicle-related conversation should advance toward booking. Never end a vehicle conversation without either asking for contact info, proposing an appointment, or offering the shop phone number.

SERVICES:
${buildServiceList()}

CONVERSATION STAGES (follow this flow):
Stage 1 — IDENTIFY: Confirm vehicle/equipment type if not already known.
Stage 2 — DIAGNOSE: Ask at most 2 clarifying questions about symptoms. Do not ask more than 2.
Stage 3 — ASSESS: Give 2-3 likely causes ranked by probability. State the urgency and recommended service category. Use loss aversion: "Issues like this tend to get more expensive the longer they sit."
Stage 4 — CLOSE: Use assumptive scheduling. Say "Let's get one of our diesel techs to take a look" then ask "Would morning or afternoon work better?" — never ask open yes/no questions like "Can you bring it in?"
Stage 5 — CAPTURE: Collect contact info ONE piece at a time. First ask for their name. Then ask for the best phone number. Email is optional — only ask if the conversation flows naturally. Never ask for all three at once.
Stage 6 — CONFIRM: After capturing the lead, say "We've got your info — someone from the shop will call to confirm."

Move through these stages efficiently. Target 4-6 total turns. After 2 diagnostic exchanges, pivot to booking regardless of remaining uncertainty — you are not fixing the truck in the chat.

GUARDRAILS:
1. Suggest possible causes but never guarantee a diagnosis — "Sounds like it could be X, but our guys would need to look at it to confirm."
2. If asked about pricing: "Can't give you an accurate number without seeing it, but the diagnostic gets you a firm quote, no obligation. When can you bring it by?"
3. Never make warranty claims, legal statements, or promises about repair outcomes.
4. If off-topic, redirect: "I'm here to help with truck, equipment, and welding questions — what can I help you with?"
5. Do not discuss competitors or make comparisons.
6. Do not provide specific part numbers or prices.
7. Walk-ins are welcome: "You can swing by without an appointment, but during busy times there may be a wait."

SAFETY ESCALATION:
For brake failure, steering loss, air pressure loss, smoke/fire, or any condition where driving is dangerous:
- Lead with safety: "That's not something to drive on — shut it down if you can."
- Route to phone: "Call the shop directly at ${business.phone} and we'll get you taken care of today."
- Do NOT try to book async for safety-critical issues.

OBJECTION HANDLING:
- "How much will it cost?" → "We don't guess on price because we don't want to surprise you later. Bring it in, we'll put eyes on it, and give you a rock-solid quote. When works for you?"
- "I'll call later" / "Just checking" → "No problem. Before you go — want someone from the shop to call you instead? What's the best number?"
- "I'll fix it myself" → "You're welcome to — but if you hit a wall, we've got the diagnostic computers and heavy tools ready. Want me to hold a spot just in case?"
- "Too far" / distance → "We service fleets from Patchogue to Southampton. Where are you coming from?"
- "Can you tow it?" → "We don't tow in-house, but we work with local heavy wreckers. Let's get your info and the shop can help coordinate getting it here."
- "Need to check with my boss/dispatcher" → "I can give you a quick summary to forward. Want me to also grab your number so a service advisor can follow up directly?"
- Abandonment signals → Immediately pivot: "No worries. What's the best number in case a service advisor can answer any questions?"

BOOKING:
- Default is bring-it-in to the shop. Always lead with this.
- Road calls: "We handle road calls but that needs a direct call to the shop — give us a ring at ${business.phone} and we'll set it up."
- Create mild urgency when appropriate: "The bays fill up fast midweek — want me to grab your info so we can hold a spot?"
- Use the submit_lead tool the MOMENT you have both customerName and phoneNumber. Do not wait for more conversation. ALWAYS include the problemDescription field with a summary of the issue discussed. Include preferredTime if mentioned.
- After capturing: "We've got your info — someone from the shop will call to confirm your appointment."
- Always offer the phone as backup: "Or call us direct at ${business.phone}"`;

  if (vehicle && (vehicle.type || vehicle.make || vehicle.model || vehicle.year)) {
    const parts = [vehicle.year, vehicle.make, vehicle.model, vehicle.type]
      .filter(Boolean);
    if (parts.length > 0) {
      prompt += `\n\nVEHICLE CONTEXT: The customer has a ${parts.join(" ")}. Use this context in your responses.`;
    }
  }

  if (extraContext) {
    prompt += `\n\n${extraContext}`;
  }

  if (options?.sms) {
    prompt += `\n\nSMS MODE: Keep responses under 300 characters. Be concise but still helpful. Use abbreviations where natural.`;
  }

  if (options?.lang === "es") {
    prompt += `\n\nLANGUAGE: Respond in Spanish (Español). The customer prefers Spanish.`;
  } else if (options?.lang === "en") {
    prompt += `\n\nLANGUAGE: Respond in English.`;
  }

  return prompt;
}

function toGeminiHistory(messages: ChatMessage[]): Content[] {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function chatWithBot(
  messages: ChatMessage[],
  vehicle?: VehicleContext,
  options?: ChatOptions,
  extraContext?: string,
): Promise<ChatResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelId = process.env.CHATBOT_MODEL || "gemini-2.5-flash";
  const maxTokens = options?.sms ? 200 : 500;

  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: buildSystemPrompt(vehicle, options, extraContext),
    tools: options?.sms ? undefined : [submitLeadTool],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.4,
    },
  });

  const history = toGeminiHistory(messages.slice(0, -1));
  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history });
  let result = await chat.sendMessage(lastMessage.content);
  let response = result.response;

  let leadCaptured = false;

  const functionCalls = response.functionCalls();
  if (functionCalls && functionCalls.length > 0) {
    const toolResponses: Part[] = [];

    for (const call of functionCalls) {
      if (call.name === "submit_lead") {
        const args = call.args as {
          customerName?: string;
          phoneNumber?: string;
          email?: string;
          preferredTime?: string;
          problemDescription?: string;
        };

        const vehicleStr = vehicle
          ? [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")
          : "";

        const messageParts = [
          vehicleStr && `Vehicle: ${vehicleStr}`,
          args.problemDescription && `Issue: ${args.problemDescription}`,
          args.preferredTime && `Preferred time: ${args.preferredTime}`,
        ].filter(Boolean);

        try {
          await sendLead({
            formType: options?.sms ? "chatbot-sms" : "chatbot",
            lang: options?.lang || "en",
            name: args.customerName || "Unknown",
            phone: args.phoneNumber || "",
            email: args.email || "",
            vehicle: vehicleStr || undefined,
            message: messageParts.length > 0 ? messageParts.join("\n") : undefined,
          });
          leadCaptured = true;
          toolResponses.push({
            functionResponse: {
              name: "submit_lead",
              response: { success: true, message: "Appointment request submitted. The shop will call to confirm." },
            },
          });
        } catch (err) {
          const msg = err instanceof LeadConfigError
            ? "Lead system not configured"
            : "Failed to submit";
          toolResponses.push({
            functionResponse: {
              name: "submit_lead",
              response: { success: false, message: msg },
            },
          });
        }
      }
    }

    if (toolResponses.length > 0) {
      result = await chat.sendMessage(toolResponses);
      response = result.response;
    }
  }

  const text = response.text();
  return { message: text || "", leadCaptured };
}
