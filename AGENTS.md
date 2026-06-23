# Eastern Truck & Equipment Repair & Welding — AGENTS.md

Marketing/lead-gen website for a commercial truck, heavy-equipment, and on-site
welding shop on Eastern Long Island (Speonk, NY).

## What this is
A bilingual (EN/ES) Next.js 14 App Router site. Single source of truth for all
business content lives in `lib/data.ts` (NAP, services, towns, per-town SEO copy).
The site programmatically generates one static SEO page per town in `towns[]`
(`app/[town]/page.tsx`) plus core pages (home, services, welding, about, contact,
quote). Lead forms POST to an in-app `/api/lead` route that emails the lead via
Nodemailer/SMTP (delivery isolated in `lib/sendLead.ts` so it can later be swapped
for SMS/automation). Welding is the featured differentiator (home band + `/welding`).

## Stack
- Next.js 14.2.5 (App Router, `output: 'standalone'`), React 18.3.1, TypeScript 5.5.
- Tailwind CSS 3.4 + PostCSS/autoprefixer.
- lucide-react (icons), nodemailer (lead email).
- Node 22 (alpine) in Docker. No test framework, no ORM, no client state lib.

## Where it runs
Production: Hetzner VPS `5.161.88.134` (SSH alias `hampton-vps`, user root), code at
`/opt/easterntruckrepair`. Runs as Docker container `easterntruck_web` (port 3000
inside), joined to the external shared network `hosthampton_hampton_net`. The shared
dockerized `hampton_nginx` reverse proxy (owned by the host-hampton-ops repo,
config `/opt/hosthampton/nginx/nginx.conf`) terminates TLS and proxies to the app
**by container name** (`http://easterntruck_web:3000`). Cloudflare sits in front
(SSL/TLS mode **Full** — origin cert is self-signed, not Full Strict).
The compose `127.0.0.1:3010:3000` publish is localhost-only for on-VPS curl/debug —
NOT the public path.

Note: `nginx.conf.example` in this repo describes a host-nginx + `127.0.0.1:3000`
setup that does NOT match the live convention; the live setup is the shared
dockerized nginx described above (see `DEPLOY-PROGRESS.md`).

The site is live at `https://www.easterntruckrepair.com` (DNS configured, Cloudflare proxied).

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```
Other scripts: `npm run build`, `npm start` (serves on port 3000), `npm run lint`.

Docker (mirrors VPS):
```bash
docker compose up -d --build   # publishes 127.0.0.1:3010 -> container :3000
```
Local docker compose needs the external network `hosthampton_hampton_net` to exist
(it lives on the VPS); on a laptop without it, run with `npm run dev` instead.

## Deploy
**Auto-deploys on every push to `main`** via `.github/workflows/deploy.yml`.

Push → GH Actions SSHs to VPS → `git fetch && git reset --hard origin/main` →
`docker compose up -d --build web` → health check (`/api/health`).

GitHub remote: `github.com/afintech510/eastern-truck-repair`.

Manual deploy (if GH Actions is broken):
```bash
ssh hampton-vps 'cd /opt/easterntruckrepair && git pull --ff-only && docker compose up -d --build'
```

SMTP/LEAD/Twilio env vars are runtime (not build-time), so changing only `.env` needs
just `docker compose up -d` (no rebuild). `NEXT_PUBLIC_GA_ID` is build-time — requires
`--build`. After an nginx/cert change: `docker exec hampton_nginx nginx -s reload`.

## Database
None. No database, no Supabase, no Prisma — all content is hard-coded in
`lib/data.ts`. Leads are delivered by email only (no persistence).

## Environment & secrets
Defined in `.env.example`, consumed in `lib/sendLead.ts` and `components/GoogleAnalytics.tsx`,
passed through `docker-compose.yml`. Real values live ONLY in the VPS
`/opt/easterntruckrepair/.env` (gitignored) — **never commit secrets**.

**Server-side (runtime):**
- `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS` — Gmail SMTP
- `LEAD_FROM` — sender address
- `LEAD_TO` — comma-separated primary recipients
- `LEAD_CC` — comma-separated CC recipients (used to avoid Gmail self-send dedup)
- `TWILIO_SID`, `TWILIO_AUTH`, `TWILIO_FROM`, `SMS_TO` — SMS lead notifications (optional, fire-and-forget)

**Build-time (must be Docker ARG, not just runtime ENV):**
- `NEXT_PUBLIC_GA_ID` — GA4 Measurement ID (inlined by Next.js at build)

If any required SMTP var is unset, `/api/lead` returns 500 "email not configured" and
the forms show the bilingual call-us fallback. If Twilio vars are unset, SMS is
silently skipped — email always sends first.

Note: `DEPLOY-PROGRESS.md` mentions `NEXT_PUBLIC_FORM_ENDPOINT` and
`N8N_WEBHOOK_URL` — dead references from earlier iterations.

## Cron / scheduled jobs
None.

## Day-to-day cheat sheet
- Edit business content / NAP / services → `lib/data.ts` (single source of truth).
- Add a service-area page → add a town string to `towns[]` in `lib/data.ts`, optionally
  add a `townContent[townSlug]` entry for unique copy → rebuild. New static page at `/<town-slug>`.
- Change site domain in sitemap/robots → `app/sitemap.ts` and `app/robots.ts`
  (`BASE = https://easterntruckrepair.com`).
- Change how leads are delivered (e.g. SMS/API) → edit ONLY `lib/sendLead.ts`; the
  `/api/lead` contract and forms stay the same.
- Verify forms locally → set the SMTP vars in a local `.env`, then submit a form.
- On VPS: `ssh hampton-vps 'cd /opt/easterntruckrepair && docker compose ps && docker compose logs --tail=50 web'`.
- Curl the origin on the box: `curl -I http://127.0.0.1:3010`.

## Key files
- `lib/data.ts` — business info, services, towns, per-town SEO content (edit content here).
- `lib/sendLead.ts` — the swappable lead-delivery seam (Nodemailer/SMTP + Twilio SMS).
- `lib/serviceDetails.ts` — per-service detail page content (6 services).
- `lib/equipmentData.ts` — per-equipment-type page content (5 equipment types).
- `app/api/lead/route.ts` — POST endpoint; honeypot, validation, 500/502 error contract.
- `app/api/health/route.ts` — `GET /api/health` returns `{"status":"ok"}` (used by deploy workflow).
- `app/[town]/page.tsx` — per-town SEO page generator.
- `app/services/[slug]/page.tsx` — per-service detail pages.
- `app/equipment/[slug]/page.tsx` — per-equipment-type pages.
- `app/faq/page.tsx` — aggregated FAQ page (general + service + equipment).
- `app/page.tsx`, `app/welding/page.tsx`, `app/services/page.tsx`, `app/about/page.tsx`,
  `app/contact/page.tsx`, `app/quote/page.tsx` — core pages.
- `app/sitemap.ts`, `app/robots.ts` — SEO (hard-coded domain, 38 URLs).
- `components/Lang.tsx` — EN/ES language context; `Nav.tsx`, `Footer.tsx`, `UI.tsx`.
- `components/GoogleAnalytics.tsx` — GA4 + conversion tracking.
- `components/JsonLd.tsx` — AutoRepair structured data.
- `components/Breadcrumbs.tsx` — client-side breadcrumb nav.
- `components/BenchworksCredit.tsx` — builder attribution footer.
- `Dockerfile`, `docker-compose.yml` — container build/run (shared-nginx convention).
- `.github/workflows/deploy.yml` — auto-deploy on push to main.
- `.env.example` — env var names + docs.
- `nginx.conf.example` — stale example (host-nginx model); not the live setup.
- `DEPLOY-PROGRESS.md` — deploy history (some references are outdated).

## Gotchas
- `nginx.conf.example` does NOT match the live shared-dockerized-nginx convention; trust
  `docker-compose.yml` for how it actually runs.
- DEPLOY-PROGRESS references `NEXT_PUBLIC_FORM_ENDPOINT` / `N8N_WEBHOOK_URL` — dead.
- NAP values in `lib/data.ts` — confirm against Google Business Profile before launch
  (phone `(631) 939-1397`, `91 N Phillips Ave, Speonk, NY 11972`).
- `NEXT_PUBLIC_*` vars are BUILD-TIME in Next.js — if you change `NEXT_PUBLIC_GA_ID`,
  you need `docker compose up -d --build web`, not just a restart.
- Gmail self-send dedup: info@easterntruckrepair.com routes to the same Gmail as
  the SMTP sender. LEAD_CC is used to deliver to that address; LEAD_TO goes to a
  different mailbox (adam@easternbuilding.supply).
- No test framework — `npm run build` is the only verification gate.
- Lead forms degrade to a bilingual call-us message until SMTP vars are set.
- TODO: real welding/fab job photos, AWS weld cert badge, NY inspection license #.
