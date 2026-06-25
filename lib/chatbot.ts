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
        "Call when the customer provides name and phone to book a bring-it-in shop appointment. All appointments are subject to confirmation from the shop.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          customerName: { type: SchemaType.STRING, description: "Customer's name" },
          phoneNumber: { type: SchemaType.STRING, description: "Customer's phone number" },
          email: { type: SchemaType.STRING, description: "Customer's email address" },
          preferredTime: { type: SchemaType.STRING, description: "Preferred appointment time" },
          problemDescription: { type: SchemaType.STRING, description: "Brief summary of the vehicle problem or reason for the appointment" },
        },
        required: ["customerName", "phoneNumber"],
      },
    },
  ],
};

function buildSystemPrompt(
  vehicle?: VehicleContext,
  options?: ChatOptions,
  extraContext?: string,
): string {
  let prompt = `You are the virtual service advisor for ${business.name} in ${business.city}, ${business.state}. Your name is Axle.

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
4. Guide EVERY conversation toward getting the customer to bring the vehicle/equipment to the shop for diagnosis. That is the primary objective.
5. Walk-ins are welcome: "You're welcome to stop by without an appointment, but during busy times there may be a wait to speak with a mechanic."
6. If asked about pricing: "Pricing depends on the specific job — bring it in and we'll give you an accurate quote after we take a look."
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
5. Push toward bringing it in: "Let's get a mechanic to take a look — can you bring it by the shop?"

BOOKING:
- The DEFAULT is for the customer to bring the vehicle/equipment to the shop for service. Always lead with this.
- If the customer asks about mobile/road calls: we can do road calls, but they should call the shop directly to arrange that. Say: "We do offer road calls — give us a call at ${business.phone} and we'll get that set up for you."
- Do NOT book road calls through the chat — only in-shop appointments. Road calls require a phone conversation with the shop.
- When the customer is ready to bring it in, ask for their name, phone number, and email address. You need all three before submitting.
- Once you have all three, use the submit_lead tool to capture their information. ALWAYS include the problemDescription field summarizing the vehicle issue or symptoms discussed. Include preferredTime if mentioned. All appointments booked through chat are subject to confirmation from the shop.
- After capturing the lead, let the customer know: "We've got your info — someone from the shop will call to confirm your appointment."
- Always offer the shop phone as a direct option: "Or call us at ${business.phone}"`;

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
