# Eastern Truck & Equipment Repair & Welding — Website

Next.js 14 (App Router) + Tailwind. Bilingual EN/ES. Dockerized for VPS + nginx + Cloudflare.

## Structure
- `lib/data.ts` — single source of truth: business info, services, towns. **Edit content here.**
- `app/[town]/page.tsx` — the SEO matrix: one static page per town in `towns[]`.
- `components/` — Lang context, Nav, Footer, UI (cards, forms, CTA).
- Welding is featured: home band + dedicated `/welding` page (on-site emphasis).

## Local dev
```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & run (Docker, matches VPS infra)
```bash
docker compose up -d --build      # serves on 127.0.0.1:3000
```
Then point your existing nginx server block at it (see `nginx.conf.example`).
Cloudflare stays proxied + SSL (Full mode). 

## Add town pages
Add a town string to `towns[]` in `lib/data.ts` → rebuild → new static page at `/<town-slug>`.

## TODO before launch
- Set the email env vars so the lead forms deliver: `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS`, `LEAD_FROM`, and `LEAD_TO` (comma-separated recipients — include the desk, and optionally Carlos). `LeadForm` posts to the in-app `/api/lead` route, which emails the lead via Nodemailer (delivery is isolated in `lib/sendLead.ts` so it can be swapped for SMS/automation later). Until the SMTP vars are set, `/api/lead` returns 500 and the forms show the bilingual call-us error.
- Add real job photos (welding/fab gallery sells the on-site differentiator).
- Confirm NAP (address/phone) — must match GBP exactly.
- Add AWS welding cert badge + NY inspection license # when available.
