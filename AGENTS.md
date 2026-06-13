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

Live status: DNS A records (apex + www → `5.161.88.134`) were not yet added in
Cloudflare as of the last deploy log, so the public site may not be live until DNS
is configured. Verify before assuming it's reachable.

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
Deploy is manual on the VPS — there is no CI/CD pipeline (no `.github/` workflows).

The repo now has a GitHub remote (`github.com/afintech510/eastern-truck-repair`).
The sibling-project convention is `git pull --ff-only` + rebuild on the box, but the
VPS checkout's remote/branch state is not confirmed here — verify with
`ssh hampton-vps 'cd /opt/easterntruckrepair && git remote -v && git status'` first.

If the VPS dir is a git checkout of this remote:
```bash
ssh hampton-vps 'cd /opt/easterntruckrepair && git pull --ff-only && docker compose up -d --build'
```

Historical fallback (used before the remote existed — direct tarball push, per
`DEPLOY-PROGRESS.md`):
```bash
tar --exclude=node_modules --exclude=.next --exclude=.git --exclude='*.tar.gz' \
    --exclude=eastern-truck-repair.code-workspace -czf /tmp/etr.tar.gz .
scp /tmp/etr.tar.gz hampton-vps:/opt/easterntruckrepair/
ssh hampton-vps 'cd /opt/easterntruckrepair && tar -xzf etr.tar.gz && rm etr.tar.gz && docker compose up -d --build'
```
SMTP/LEAD env vars are runtime (not build-time), so changing only `.env` needs just
`docker compose up -d` (no rebuild). After an nginx/cert change: `docker exec hampton_nginx nginx -s reload`.

## Database
None. No database, no Supabase, no Prisma — all content is hard-coded in
`lib/data.ts`. Leads are delivered by email only (no persistence).

## Environment & secrets
Server-side only (never `NEXT_PUBLIC_*`). Defined in `.env.example`, consumed in
`lib/sendLead.ts`, passed through `docker-compose.yml`. Real values live ONLY in the
VPS `/opt/easterntruckrepair/.env` (gitignored) — never commit them.

Variable NAMES (values not shown):
- `SMTP_HOST`
- `SMTP_PORT` (default 587; 465 = implicit TLS)
- `SMTP_USER`
- `SMTP_PASS`
- `LEAD_FROM`
- `LEAD_TO` (comma-separated recipients)

If any required one (`SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/`LEAD_FROM`/`LEAD_TO`) is
unset, `/api/lead` returns 500 "email not configured" and the forms show the
bilingual call-us fallback.

Note: `DEPLOY-PROGRESS.md` mentions `NEXT_PUBLIC_FORM_ENDPOINT` and
`N8N_WEBHOOK_URL` — these are from earlier iterations and are NOT used by the current
code. The SMTP vars above are the live mechanism.

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
- `lib/sendLead.ts` — the swappable lead-delivery seam (Nodemailer/SMTP today).
- `app/api/lead/route.ts` — POST endpoint; honeypot, validation, 500/502 error contract.
- `app/[town]/page.tsx` — per-town SEO page generator.
- `app/page.tsx`, `app/welding/page.tsx`, `app/services/page.tsx`, `app/about/page.tsx`,
  `app/contact/page.tsx`, `app/quote/page.tsx` — core pages.
- `app/sitemap.ts`, `app/robots.ts` — SEO (hard-coded domain).
- `components/Lang.tsx` — EN/ES language context; `Nav.tsx`, `Footer.tsx`, `UI.tsx`.
- `Dockerfile`, `docker-compose.yml` — container build/run (shared-nginx convention).
- `.env.example` — env var names + docs.
- `nginx.conf.example` — stale example (host-nginx model); not the live setup.
- `DEPLOY-PROGRESS.md` — detailed deploy history/state (some env-var references are outdated).

## Gotchas / next steps
- `nginx.conf.example` does NOT match the live shared-dockerized-nginx convention; trust
  `DEPLOY-PROGRESS.md` and `docker-compose.yml` for how it actually runs.
- DEPLOY-PROGRESS references `NEXT_PUBLIC_FORM_ENDPOINT` / `N8N_WEBHOOK_URL` and "no GitHub
  remote" — both are stale. Current: SMTP vars + a real GitHub remote.
- NAP values in `lib/data.ts` are marked UNVERIFIED — confirm against the Google Business
  Profile before public launch (phone `(631) 939-1397`, `91 N Phillips Ave, Speonk, NY 11972`).
- Launch blocker: Cloudflare DNS A records (apex + www → `5.161.88.134`, Proxied) were not
  yet added; site isn't public until they are. Keep CF SSL mode = Full (self-signed origin cert).
- No tests and no CI — verify builds with `npm run build` before deploying.
- Lead forms degrade to a bilingual call-us message until SMTP vars are set on the VPS.
- TODO (from README): add real welding/fab job photos, AWS weld cert badge + NY inspection
  license # when available.
```
