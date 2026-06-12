# Deploy Progress — Eastern Truck & Equipment Repair & Welding

Target domain: **easterntruckrepair.com**
VPS: Hetzner `5.161.88.134` (SSH alias `hampton-vps`), behind shared dockerized `hampton_nginx` + Cloudflare.

## Infra note (deviation from `nginx.conf.example`)
The example file assumes host nginx + `127.0.0.1:3000`. The **actual** live convention on
this box is a single shared **dockerized** `hampton_nginx` container (config
`/opt/hosthampton/nginx/nginx.conf`) on docker network `hosthampton_hampton_net`, proxying
to each app **by container name** via `set $var http://<container>:3000; proxy_pass $var;`
with `resolver 127.0.0.11`. Per the operator prompt's "mirror existing conventions", this
deploy follows the real convention: the app container joins `hosthampton_hampton_net` and
nginx proxies to it by name. No `127.0.0.1:3000` host binding (nginx is containerized and
reaches the app over the docker network, not the host loopback).

## Status per task
- [x] **Pre-flight** — `npm install` + `npm run build` green locally: 28 static pages (6 core + 19 towns + not-found). Node 22 in Docker, standalone output.
- [x] **Task 1 — Lead forms** — DONE (code). `LeadForm` now POSTs FormData to `NEXT_PUBLIC_FORM_ENDPOINT` with `_form` (contact|quote) + `_lang` hidden fields; named inputs; sending/done/error states; on error shows bilingual message + click-to-call fallback. Degrades gracefully (optimistic success) when endpoint unset. `.env.example` documents the var. Baked at build time via Dockerfile `ARG`/compose build-arg (NEXT_PUBLIC_* inlines at build). **HUMAN NEEDED: supply Formspree form ID / Worker URL → set `NEXT_PUBLIC_FORM_ENDPOINT` (compose build arg) and rebuild before forms deliver.**
- [x] **Task 2 — NAP** — DONE. All NAP renders from `lib/data.ts` only (grep confirmed no duplicated literals anywhere in app/components). Values **UNVERIFIED — confirm vs Google Business Profile before public launch** (see list below). `towns[]` left exactly as-is (no additions/removals).
- [x] **Task 3 — Containerize on VPS** — DONE. Code at `/opt/easterntruckrepair`. `docker compose build` + `up -d` green. Container `easterntruck_web` (Up, restart:unless-stopped) on `hosthampton_hampton_net`; `curl 127.0.0.1:3010` → 200; `hampton_nginx` reaches `easterntruck_web:3000` and gets the homepage. Compose/Dockerfile adapted to shared-nginx convention (see Infra note).
- [x] **Task 4 — nginx + TLS** — DONE. Self-signed origin cert `/etc/ssl/hosthampton/easterntruckrepair.com.{pem,key}` (SAN apex+www, 10yr; reused an already-mounted dir to avoid recreating the shared proxy). Server block (443 + 80→301) inserted into shared `/opt/hosthampton/nginx/nginx.conf` **inode-preserving** (host/container inode matched 279280), backed up to `nginx.conf.bak.pre_easterntruck_*`. `nginx -t` passed → reloaded (no restart). Origin verified via Host header: home/www 200, 80→301, **unique per-town titles** (Speonk≠Riverhead). Regression: rentals/maningo/mygravelguy all still 200.
- [~] **Task 5 — Cloudflare + live verify** — BLOCKED ON OWNER (DNS). Domain is already on Cloudflare NS (`nadia`/`wilson.ns.cloudflare.com`) but has **no A records** (apex + www empty). No CF API token on the VPS → Claude cannot add them. Origin fully verified; site goes live the moment DNS is added.

## TLS note
Origin cert is **self-signed** → set Cloudflare SSL/TLS mode to **Full** (NOT Full Strict). To use Full Strict later, replace `/etc/ssl/hosthampton/easterntruckrepair.com.{pem,key}` with a Cloudflare Origin CA cert for this zone (same paths, then `docker exec hampton_nginx nginx -s reload`).

## Needs the human (launch blockers, in priority order)
1. **DNS (only thing between here and live)** — in Cloudflare zone `easterntruckrepair.com` add:
   - `A` `easterntruckrepair.com` → `5.161.88.134`, **Proxied (orange cloud)**
   - `A` `www` → `5.161.88.134`, **Proxied (orange cloud)**
   - SSL/TLS mode = **Full** (self-signed origin cert; not Full Strict).
   No Cloudflare API token on the VPS, so Claude cannot add these.
2. **Form endpoint** — Formspree form ID or Worker URL → set `NEXT_PUBLIC_FORM_ENDPOINT` and rebuild (`NEXT_PUBLIC_FORM_ENDPOINT=... docker compose up -d --build` on the VPS). Until then forms show success but do NOT deliver.
3. **NAP confirmation** — confirm the values below match the Google Business Profile exactly.
4. Optional later: real job photos (welding gallery), AWS weld cert badge + NY inspection license #, swap self-signed cert for a Cloudflare Origin cert if Full Strict is wanted.

## Redeploy / update procedure (no GitHub remote for this folder)
This folder lives inside the larger `c:\Users\alark\projects` git repo and has **no own GitHub remote**, so deploys are direct-SSH (not git-clone like the sibling projects):
```
# from c:\Users\alark\projects\eastern-truck-repair
tar --exclude=node_modules --exclude=.next --exclude=.git --exclude='*.tar.gz' \
    --exclude=eastern-truck-repair.code-workspace -czf /tmp/etr.tar.gz .
scp /tmp/etr.tar.gz hampton-vps:/opt/easterntruckrepair/
ssh hampton-vps 'cd /opt/easterntruckrepair && tar -xzf etr.tar.gz && rm etr.tar.gz \
    && docker compose up -d --build'
```

## Current NAP in `lib/data.ts` (UNVERIFIED — confirm vs Google Business Profile)
- Name: Eastern Truck & Equipment Repair & Welding
- Phone: (631) 939-1397
- Address: 91 N Phillips Ave, Speonk, NY 11972
- Hours: Mon–Fri 7AM–5PM

## Live URL / verified routes
**LIVE: https://easterntruckrepair.com** (Cloudflare A-records added + NAP confirmed by owner 2026-06-10).
Verified over public HTTPS: `/` 200, `/speonk` 200 (unique title), `/api/lead` 500 (until webhook set) + 400 validation.

---

## Lead-capture API route (added 2026-06-10)
**Design:** site owns a stable internal `/api/lead` route → forwards clean JSON to an n8n webhook → n8n owns all SMS/email delivery (provider can change without redeploying the site).

**Files changed:**
- `app/api/lead/route.ts` (NEW) — `POST` handler. Validates name+phone required & `formType` ∈ {contact,quote} (else 400); honeypot `company` non-empty → silent 200 no-forward; reads server-only `N8N_WEBHOOK_URL` (unset → 500 + console.error, no invented URL); forwards `{source:"eastern-website", submittedAt:ISO, formType, lang, name, phone, email, service, vehicle, message}` with 8s AbortController timeout; n8n non-2xx/error → 502 (detail logged server-side only). `export const dynamic = "force-dynamic"`.
- `components/UI.tsx` — `LeadForm` now POSTs JSON to `/api/lead` (FormData→object), includes `kind` as `formType`, `useLang()` lang, + a visually-hidden honeypot `company` input (tabIndex -1, aria-hidden, offscreen). Success → existing bilingual green box; failure → existing bilingual call-us error; submit disabled in flight. (Replaced the prior `NEXT_PUBLIC_FORM_ENDPOINT`/Formspree wiring.)
- `.env.example` — `N8N_WEBHOOK_URL=` (server-side; NOT `NEXT_PUBLIC_`).
- `Dockerfile` — dropped obsolete `NEXT_PUBLIC_FORM_ENDPOINT` build-arg.
- `docker-compose.yml` — `web` now passes runtime env `N8N_WEBHOOK_URL=${N8N_WEBHOOK_URL:-}` (read from VPS `/opt/easterntruckrepair/.env`).
- `README.md` — TODO updated to the n8n design.

**Build:** clean. `/api/lead` appears as `ƒ` (Dynamic, server-rendered on demand); 28 static pages unchanged.
**Verified (local, throwaway listener):** happy-path forwards exact clean payload (`source`/`submittedAt` present); honeypot returns 200 but does NOT forward (absent from listener log); missing name → 400; bad formType → 400; webhook unset → 500 "endpoint not configured"; n8n unreachable → 502. **Verified live** on https://easterntruckrepair.com: 500 (no webhook yet) + 400 validation.
**Deployed:** rebuilt on VPS; container `easterntruck_web` recreated. VPS `/opt/easterntruckrepair/.env` seeded with blank `N8N_WEBHOOK_URL`.

**ONE human action remaining:** set `N8N_WEBHOOK_URL` in `/opt/easterntruckrepair/.env` to the n8n webhook, then `docker compose up -d` (rebuild not required — it's runtime env). Until then forms show the bilingual call-us error.

---

## Lead route PIVOTED to direct SMTP email (2026-06-10) — supersedes n8n above
Owner chose direct email over n8n. Delivery now lives in `lib/sendLead.ts` (Nodemailer/SMTP), the one swappable seam; the `/api/lead` contract and the form are unchanged.

**Files changed:**
- `lib/sendLead.ts` (NEW) — `sendLead(payload)` builds plain-text+HTML email (every field, Language, clickable `tel:`, ISO timestamp, `replyTo`=customer email) and sends via Nodemailer SMTP to all `LEAD_TO` recipients. `LeadConfigError` thrown when SMTP env is incomplete (→ route 500, distinct from a 502 send failure). 10s connection/socket timeouts.
- `app/api/lead/route.ts` — now `export const runtime = "nodejs"`; validates, honeypot, calls `sendLead()`; `LeadConfigError`→500 "email not configured", other errors→502 "delivery failed", ok→200.
- `package.json` — added `nodemailer` + `@types/nodemailer`.
- `.env.example`, `docker-compose.yml`, `README.md` — swapped `N8N_WEBHOOK_URL` for `SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/LEAD_FROM/LEAD_TO`.
- `components/UI.tsx` — `LeadForm` unchanged from the JSON-POST + honeypot version (already correct).

**Build:** clean; `/api/lead` is `ƒ` (Dynamic, Node runtime).
**Verified locally (aiosmtpd catcher):** real send → 200 with correct From / To (both recipients) / Reply-To / Subject "New quote lead — Maria Lopez" / all fields; honeypot → 200 with **zero** mail transactions; missing name → 400; SMTP unset → 500 "email not configured". **Verified live:** 500 (no creds yet) + 400 validation; site healthy.
**Deployed:** VPS `/opt/easterntruckrepair/.env` reset to the SMTP template (blank); container has all six SMTP/LEAD env keys.

**ONE human action remaining (updated):** fill `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (+ `LEAD_FROM`, `LEAD_TO` — comma-separated; include the desk and optionally Carlos) in `/opt/easterntruckrepair/.env`, then `docker compose up -d`. Until then forms show the bilingual call-us error.
