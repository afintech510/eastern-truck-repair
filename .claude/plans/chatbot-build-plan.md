---
title: Axle AI Chatbot — Website + SMS
status: in-progress
created: 2026-06-23
updated: 2026-06-24
---

# Axle AI Chatbot Build Plan

LLM-powered hybrid chatbot ("Axle") for easterntruckrepair.com (website widget + SMS auto-responder). Conversational vehicle diagnostics with NHTSA recall data, symptom analysis, and appointment booking. Bilingual EN/ES. Cyberpunk neon-green branding.

## Design Decisions (Locked)

| Decision | Choice |
|---|---|
| Widget UI | Inline section on homepage (after services grid) + floating bubble scrolls to inline |
| Diagnostics depth | Detailed — asks follow-up questions, references NHTSA recalls + diagnostic KB |
| Primary CTA | Book on-site appointment (walk-in copy + $29 mechanic call as secondary) |
| Bilingual | Auto-detect language, respond in EN or ES |
| SMS | Same LLM brain, prompted for shorter responses |
| LLM provider | Google Gemini API (`@google/generative-ai`) |
| Branding | "AXLE" — neon green (#39ff14) cyberpunk aesthetic |
| Lead capture | Gemini tool calling (`submit_lead`) auto-captures leads |

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  ChatWidget.tsx  │────▶│  /api/chat       │────▶│  Gemini API  │
│  (Axle UI)       │◀────│  (POST)          │◀────│              │
└─────────────────┘     └──────────────────┘     └──────────────┘
                              │         │
                        ┌─────▼───┐ ┌───▼──────────┐
                        │ nhtsa.ts│ │diagnosticKB.ts│
                        │(recalls)│ │(symptom map)  │
                        └─────────┘ └──────────────┘
┌─────────────────┐     ┌──────────────────┐
│  Twilio Inbound  │────▶│  /api/sms        │──▶ Same Gemini logic
│  (SMS webhook)   │◀────│  (POST)          │     + shorter responses
└─────────────────┘     └──────────────────┘
                              │
                         ┌────▼─────────────┐
                         │  sendLead.ts      │──▶ Email + SMS to Carlos
                         │  (existing seam)  │
                         └──────────────────┘
```

### New Files
- `lib/chatbot.ts` — Gemini system prompt, tool calling (submit_lead), conversation types, guardrails
- `lib/vehicleData.ts` — Year/make/model data for structured intake
- `lib/nhtsa.ts` — NHTSA Recalls & Complaints API integration (24h cache)
- `lib/diagnosticKB.ts` — 30+ symptom → causes → service mapping
- `app/api/chat/route.ts` — Web chat endpoint with NHTSA + diagnostic KB injection
- `app/api/sms/route.ts` — Twilio inbound SMS webhook (in-memory conversation state)
- `components/ChatWidget.tsx` — Axle inline chat + scroll-to bubble

### Modified Files
- `app/page.tsx` — Axle chat section (after services grid, before welding band)
- `app/layout.tsx` — Floating bubble (scroll-to-inline on all pages)
- `package.json` — `@google/generative-ai` dependency
- `docker-compose.yml` — `GEMINI_API_KEY` env var
- `.env.example` — Document new env vars
- `lib/sendLead.ts` — `chatbot` / `chatbot-sms` form types in LeadPayload

### Env Vars
- `GEMINI_API_KEY` — Google AI API key (runtime, server-side)
- `CHATBOT_MODEL` — Model ID override, default `gemini-2.0-flash` (optional)

## Build Phases

### Phase 1: Core Chat Engine (`lib/chatbot.ts` + `/api/chat`)
- [x] Install `@google/generative-ai`
- [x] Create system prompt with: shop identity (Axle), services from `data.ts`, vehicle knowledge, guardrails, bilingual instruction, CTA logic
- [x] Define TypeScript types: `ChatMessage`, `VehicleContext`, `ChatOptions`, `ChatResult`
- [x] Implement `chatWithBot()` function: takes conversation history + vehicle context, returns `ChatResult` (message + leadCaptured flag)
- [x] Gemini tool calling: `submit_lead` tool declaration for automatic lead capture
- [x] Create `/api/chat` POST route: validates input, calls `chatWithBot()`, returns response with leadCaptured flag
- [x] Guardrails: refuse off-topic, no pricing promises, no legal/warranty claims, always push toward appointment

### Phase 2: Vehicle Data (`lib/vehicleData.ts`)
- [x] Common commercial truck makes (Freightliner, Peterbilt, Kenworth, International, Mack, Volvo, Hino, Isuzu, Ford, Chevy, RAM, etc.)
- [x] Heavy equipment makes (CAT, Deere, Komatsu, Kubota, Bobcat, Case, Volvo, Hitachi, etc.)
- [x] Trailer types (flatbed, dump, lowboy, reefer, dry van, landscape, utility)
- [x] Equipment types (excavator, loader, backhoe, skid steer, dozer, mini excavator, etc.)
- [x] Year range: 1990-2027

### Phase 2.5: NHTSA Integration + Diagnostic KB
- [x] `lib/nhtsa.ts` — Fetch recalls and complaints from NHTSA API, 24h in-memory cache, graceful fallback
- [x] `lib/diagnosticKB.ts` — 30+ symptom entries with causes, service mapping, urgency levels
- [x] Inject NHTSA data and diagnostic KB matches into system prompt via `/api/chat` route

### Phase 3: Chat Widget UI (`components/ChatWidget.tsx`) — Axle Branding
- [x] Floating bubble scrolls to inline section (no expanding panel)
- [x] Auto-hide bubble when inline section is in viewport (IntersectionObserver)
- [x] Axle cyberpunk branding: neon green (#39ff14) border, glow animation, scanline overlay
- [x] "AXLE AI" badge with glow, pulsing online indicator
- [x] Chat panel: Axle header, message list, input area
- [x] Hybrid intake flow: vehicle type selector → make/model dropdowns → symptom free text
- [x] After intake, free-form conversation with Gemini
- [x] CTA buttons rendered inline (phone link, appointment request, $29 consultation)
- [x] Bilingual: follows site language toggle
- [x] Walk-in copy
- [x] Gemini tool-call lead capture triggers GA4 tracking automatically

### Phase 4: Homepage Integration
- [x] Inline Axle section after services grid, before welding band
- [x] Section ID: `axle-chat` for scroll targeting
- [x] Floating bubble in layout (all pages, scrolls to inline or navigates to homepage)
- [x] Cyberpunk styling with scanline overlay and neon green accents

### Phase 5: SMS Inbound (`/api/sms`)
- [x] Create Twilio webhook endpoint at `/api/sms` (POST, TwiML response)
- [x] Validate Twilio signature for security
- [x] In-memory conversation state keyed by phone number (Map with TTL, clears after 30 min idle)
- [x] Same `chatWithBot()` logic with SMS-specific system prompt modifier
- [x] Auto-detect language from message content
- [x] Lead capture via Gemini tool calling + fallback marker detection
- [ ] Twilio configuration: point inbound SMS webhook to `https://www.easterntruckrepair.com/api/sms`

### Phase 6: Lead Capture Integration
- [x] `LeadPayload` type: `formType: 'chatbot' | 'chatbot-sms'`
- [x] Gemini `submit_lead` tool auto-captures leads with name + phone
- [x] Manual booking form in ChatWidget as fallback
- [x] Submit lead through existing `sendLead()` pipeline
- [x] Include conversation summary in the lead email
- [x] Track chat-originated leads in GA4 as conversion events

### Phase 7: Polish & Deploy
- [x] Rate limiting on `/api/chat` (30 req/IP/15 min)
- [x] Error handling: graceful fallback if API is down
- [x] Loading states and typing indicators (neon green bounce)
- [x] `npm run build` passes
- [ ] Add `GEMINI_API_KEY` to VPS `.env`
- [ ] Configure Twilio inbound webhook URL
- [ ] Push to main → auto-deploy
- [ ] Test web chat end-to-end
- [ ] Test SMS end-to-end

## Cost Estimate

- **Gemini API**: ~$0.002-0.01 per web conversation, ~$0.001-0.005 per SMS exchange (Gemini 2.0 Flash pricing: $0.10/1M input, $0.40/1M output)
- **Monthly estimate**: 100 web chats + 200 SMS = ~$1-2/month
- **NHTSA API**: Free, no API key required
- **No new infrastructure**: runs on existing VPS, no database needed
- **Twilio SMS**: already configured, inbound SMS is free (outbound reply ~$0.0079/msg)
