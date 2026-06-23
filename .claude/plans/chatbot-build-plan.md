---
title: AI Chatbot — Website + SMS
status: planning
created: 2026-06-23
---

# AI Chatbot Build Plan

LLM-powered hybrid chatbot for easterntruckrepair.com (website widget + SMS auto-responder). Conversational vehicle diagnostics, symptom analysis, and appointment booking. Bilingual EN/ES.

## Design Decisions (Locked)

| Decision | Choice |
|---|---|
| Widget UI | Inline section on homepage + floating bubble on subpages |
| Diagnostics depth | Detailed — asks follow-up questions before suggesting causes |
| Primary CTA | Book on-site appointment (walk-in copy + $29 mechanic call as secondary) |
| Bilingual | Auto-detect language, respond in EN or ES |
| SMS | Same LLM brain, prompted for shorter responses |
| LLM provider | Claude API (Anthropic SDK) |

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│  ChatWidget.tsx  │────▶│  /api/chat       │──▶ Anthropic Claude API
│  (web UI)        │◀────│  (POST)          │
└─────────────────┘     └──────────────────┘
                              │
┌─────────────────┐     ┌────▼─────────────┐
│  Twilio Inbound  │────▶│  /api/sms        │──▶ Same LLM logic
│  (SMS webhook)   │◀────│  (POST)          │     + shorter responses
└─────────────────┘     └──────────────────┘
                              │
                         ┌────▼─────────────┐
                         │  sendLead.ts      │──▶ Email + SMS to Carlos
                         │  (existing seam)  │
                         └──────────────────┘
```

### New Files
- `lib/chatbot.ts` — System prompt, LLM call logic, conversation types, guardrails
- `lib/vehicleData.ts` — Year/make/model data for structured intake (common truck/equipment makes)
- `app/api/chat/route.ts` — Web chat endpoint (stateless, receives full conversation history)
- `app/api/sms/route.ts` — Twilio inbound SMS webhook (needs conversation state in-memory or simple Map)
- `components/ChatWidget.tsx` — Floating bubble + inline chat UI
- `components/ChatInline.tsx` — Homepage inline variant (reuses ChatWidget internals)

### Modified Files
- `app/page.tsx` — Add inline chat section
- `app/layout.tsx` — Add floating ChatWidget to layout (conditionally hidden on homepage)
- `package.json` — Add `@anthropic-ai/sdk` dependency
- `docker-compose.yml` — Add `ANTHROPIC_API_KEY` env var
- `.env.example` — Document new env vars
- `lib/sendLead.ts` — Add `chatbot` form type to LeadPayload

### New Env Vars
- `ANTHROPIC_API_KEY` — Claude API key (runtime, server-side)
- `CHATBOT_MODEL` — Model ID override, default `claude-sonnet-4-5-20250514` (optional)

## Build Phases

### Phase 1: Core Chat Engine (`lib/chatbot.ts` + `/api/chat`)
- [x] Install `@anthropic-ai/sdk`
- [x] Create system prompt with: shop identity, services from `data.ts`, vehicle knowledge, guardrails, bilingual instruction, CTA logic
- [x] Define TypeScript types: `ChatMessage`, `ChatContext` (vehicle info), `ChatResponse`
- [x] Implement `chatWithBot()` function: takes conversation history + vehicle context, returns assistant message
- [x] Create `/api/chat` POST route: validates input, calls `chatWithBot()`, returns response
- [x] Guardrails: refuse off-topic, no pricing promises, no legal/warranty claims, always push toward appointment

### Phase 2: Vehicle Data (`lib/vehicleData.ts`)
- [x] Common commercial truck makes (Freightliner, Peterbilt, Kenworth, International, Mack, Volvo, Hino, Isuzu, Ford, Chevy, RAM, etc.)
- [x] Heavy equipment makes (CAT, Deere, Komatsu, Kubota, Bobcat, Case, Volvo, Hitachi, etc.)
- [x] Trailer types (flatbed, dump, lowboy, reefer, dry van, landscape, utility)
- [x] Equipment types (excavator, loader, backhoe, skid steer, dozer, mini excavator, etc.)
- [x] Year range: 1990-2027

### Phase 3: Chat Widget UI (`components/ChatWidget.tsx`)
- [x] Floating bubble component (bottom-right, fixed position)
- [x] Expand/collapse animation
- [x] Chat panel: header with shop name, message list, input area
- [x] Hybrid intake flow: first screen = vehicle type selector (Truck / Trailer / Equipment / Other) → make/model dropdowns → "What's going on?" free text
- [x] After intake, free-form conversation with the LLM
- [x] CTA buttons rendered inline when bot suggests booking (phone link, appointment request)
- [x] Bilingual: follows site language toggle
- [x] Mobile responsive (full-screen on small screens)
- [x] Walk-in copy: "You're welcome to stop by without an appointment — but during busy times there may be a wait to speak with a mechanic."
- [x] $29 mechanic call option as secondary CTA

### Phase 4: Homepage Integration
- [x] Inline chat variant — using `<ChatWidget inline />` prop (no separate ChatInline.tsx needed)
- [x] Add to `app/page.tsx` as a new section (after welding band, before MapEmbed)
- [x] Floating bubble: added to `app/layout.tsx` (present on all pages including homepage — both inline + bubble coexist)
- [x] Style to match existing dark theme (steel, safety orange accents)

### Phase 5: SMS Inbound (`/api/sms`)
- [x] Create Twilio webhook endpoint at `/api/sms` (POST, TwiML response)
- [x] Validate Twilio signature for security
- [x] In-memory conversation state keyed by phone number (Map with TTL, clears after 30 min idle)
- [x] Same `chatWithBot()` logic with SMS-specific system prompt modifier ("keep responses under 300 chars")
- [x] Auto-detect language from message content
- [x] When bot reaches CTA: capture lead via `sendLead.ts` with `formType: 'chatbot-sms'`
- [ ] Twilio configuration: point inbound SMS webhook to `https://www.easterntruckrepair.com/api/sms`

### Phase 6: Lead Capture Integration
- [x] Extend `LeadPayload` type: add `formType: 'chatbot' | 'chatbot-sms'`
- [x] When bot guides to appointment, collect name + phone in chat
- [x] Submit lead through existing `sendLead()` pipeline
- [x] Include conversation summary in the lead email (so Carlos has context)
- [x] Track chat-originated leads in GA4 as conversion events

### Phase 7: Polish & Deploy
- [x] Rate limiting on `/api/chat` (simple IP-based, prevent abuse)
- [x] Error handling: graceful fallback if API is down ("Sorry, our chat is temporarily unavailable. Please call us at...")
- [x] Loading states and typing indicators
- [x] `npm run build` passes
- [ ] Add `ANTHROPIC_API_KEY` to VPS `.env`
- [ ] Configure Twilio inbound webhook URL
- [ ] Push to main → auto-deploy
- [ ] Test web chat end-to-end
- [ ] Test SMS end-to-end

## System Prompt (Draft)

```
You are the virtual service advisor for Eastern Truck & Equipment Repair & Welding in Speonk, NY.

IDENTITY:
- You represent a commercial truck, heavy equipment, and on-site welding shop
- Located at 91 N Phillips Ave, Speonk, NY 11972
- Phone: (631) 939-1397
- Hours: Mon-Fri 7AM-5PM
- You serve Eastern Long Island (14 towns from Patchogue to Southampton)

SERVICES YOU KNOW ABOUT:
[Injected from data.ts services array]

CONVERSATION RULES:
1. Be helpful, knowledgeable, and professional — like a real service advisor
2. Ask follow-up questions about symptoms before suggesting causes
3. Always suggest possible causes but never guarantee a diagnosis — "It sounds like it could be X, but a mechanic would need to inspect it to confirm"
4. Guide EVERY conversation toward booking: on-site appointment (primary) or $29 phone consultation with a mechanic (secondary)
5. Walk-ins are welcome but note: "You're welcome to stop by without an appointment, but during busy times there may be a wait to speak with a mechanic"
6. If asked about pricing: "Pricing depends on the specific job — let's get you scheduled so we can give you an accurate quote"
7. Never make warranty claims, legal statements, or promises about repair outcomes
8. If the conversation goes off-topic (not vehicle/equipment related), politely redirect
9. Detect the customer's language and respond in the same language (English or Spanish)
10. For SMS: keep responses concise (under 300 characters when possible)

VEHICLE KNOWLEDGE:
- Commercial trucks: all major makes (Freightliner, Peterbilt, Kenworth, International, Mack, Volvo, Hino, Isuzu, Ford, Chevy, RAM)
- Heavy equipment: CAT, Deere, Komatsu, Kubota, Bobcat, Case, Volvo, Hitachi
- Trailers: flatbed, dump, lowboy, reefer, dry van, landscape, utility
- Systems: engine, transmission, brakes, suspension, steering, electrical, hydraulic, exhaust/emissions (DPF/DEF/EGR/SCR), frame/structural

DIAGNOSTIC APPROACH:
When a customer describes a symptom:
1. Ask what type of vehicle/equipment (if not already known)
2. Ask clarifying questions: "When does it happen? How long has it been going on? Any other symptoms?"
3. Suggest 2-3 possible causes ranked by likelihood
4. Recommend the appropriate service category
5. Push toward booking: "Let's get a mechanic to take a look — want to schedule an appointment?"

CTA OPTIONS (present when appropriate):
- "Schedule an appointment" → collect name + phone
- "Call us now: (631) 939-1397"
- "$29 phone consultation with a mechanic" → collect name + phone + preferred time
```

## Cost Estimate

- **Claude API**: ~$0.01-0.05 per web conversation (5-10 messages avg), ~$0.005-0.02 per SMS exchange
- **Monthly estimate**: 100 web chats + 200 SMS = ~$10-15/month at current Sonnet pricing
- **No new infrastructure**: runs on existing VPS, no database needed
- **Twilio SMS**: already configured, inbound SMS is free (outbound reply ~$0.0079/msg)
