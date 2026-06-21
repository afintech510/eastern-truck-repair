# CLAUDE.md — Eastern Truck & Equipment Repair & Welding

Read this file first. It is the operating guide for every AI session working on this codebase.

## What This Is

Bilingual (EN/ES) marketing and lead-generation website for a commercial truck, heavy equipment, and on-site welding shop in Speonk, NY. Client is Carlos. Engagement by BenchworksAI (Adam).

## Orient Yourself

1. Read this file (you're doing it).
2. Read `AGENTS.md` for stack, architecture, deploy, env vars, key files, and gotchas.
   - **Known stale claim:** AGENTS.md says "no CI/CD, deploy is manual" — false. Auto-deploys via GH Actions on push to main.
3. Check `~/.claude/projects/.../memory/MEMORY.md` for durable project context (SOW scope, deploy procedure, VPS access, etc.).
4. Do NOT duplicate AGENTS.md or memory content here. This file is for **rules and procedures**, not facts.

## Stack

Next.js 14 (App Router, `output: standalone`), React 18, TypeScript 5.5, Tailwind 3.4, Nodemailer, Twilio (SMS). Node 22 Alpine in Docker. No database — all content in `lib/data.ts`. No test framework — `npm run build` is the gate.

## Run Locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # the de-facto test — run before every commit
npm run lint
```

Docker requires the VPS's external network — use `npm run dev` on a laptop.

## Build Before You Commit

There is no test suite. `npm run build` is the only verification gate. **Never commit without a passing build.** If the build fails, fix it before committing.

## Deploy

**Auto-deploys on every push to `main`** via `.github/workflows/deploy.yml`.

Push → GH Actions SSHs to VPS → `git fetch && git reset --hard origin/main` → `docker compose up -d --build web` → health check (`/api/health`).

Do NOT manually deploy on the VPS unless the GH Action is broken. Just push to main.

## VPS Access

This workstation has SSH access: `ssh hampton-vps`. You are authorized to:
- Set env vars in `/opt/easterntruckrepair/.env`
- Restart/rebuild containers: `docker compose up -d [--build web]`
- Check logs: `docker compose logs --tail=50 web`
- Run health checks: `curl -fsS http://127.0.0.1:3010/api/health`

**Do NOT** delete containers belonging to other projects, modify nginx config, or touch anything outside `/opt/easterntruckrepair/`.

**Never echo `.env` contents in user-facing output** — it contains secrets.

## Env Vars

Runtime (server-side, passed via docker-compose.yml):
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Gmail SMTP
- `LEAD_FROM` — sender address for lead emails
- `LEAD_TO` — primary recipient(s), comma-separated
- `LEAD_CC` — CC recipients (avoids Gmail self-send dedup)
- `TWILIO_SID`, `TWILIO_AUTH`, `TWILIO_FROM`, `SMS_TO` — SMS lead notifications (optional, fire-and-forget)

Build-time (must be available during `docker compose build`):
- `NEXT_PUBLIC_GA_ID` — GA4 Measurement ID, passed as Docker build arg

If `NEXT_PUBLIC_GA_ID` changes, a rebuild is required (`--build`). SMTP/Twilio vars are runtime — restart is sufficient.

## Content Model

All business content lives in `lib/data.ts` (single source of truth):
- `business` — NAP, phone, hours, region
- `services` — 6 service definitions (slug, icon, bilingual name/blurb/bullets)
- `towns` / `townContent` — 14 service-area towns with optional rich content

Extended content:
- `lib/serviceDetails.ts` — per-service detail pages (process steps, FAQs)
- `lib/equipmentData.ts` — per-equipment-type pages (service lists, brands, FAQs)

To add a town: append a string to `towns[]` in `lib/data.ts`, optionally add `townContent[slug]`. Rebuild. New page appears at `/<town-slug>`.

To add a service or equipment type: add to the respective data file + the sitemap picks it up automatically.

## Key Architecture Decisions

- **Lead delivery seam:** `lib/sendLead.ts` is the ONE file to change when adding/changing lead delivery channels. Email + SMS today. The `/api/lead` route contract and forms never change.
- **i18n:** Client-side toggle via `components/Lang.tsx` (`<T en="..." es="..." />`). No URL routing for languages. Google indexes English only.
- **SEO pages are static:** Town, service, and equipment pages are pre-rendered at build time via `generateStaticParams()`. Adding pages = adding data + rebuilding.
- **No database:** If persistence is ever needed, the seam is `sendLead.ts` (add a write) or a new API route.

## Commit Conventions

- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Title = user-visible outcome, not implementation detail
- Push to `main` to deploy — there are no feature branches in use currently
- Use the `mcp__nimbalyst-mcp__developer_git_commit_proposal` tool when available

## Session Hygiene

When starting work:
1. Read this file and `AGENTS.md`.
2. Check memory (`MEMORY.md`) for SOW status, gotchas, and project context.
3. Run `git status` to see what's uncommitted.

When finishing work:
1. `npm run build` — verify it passes.
2. Commit with a descriptive message.
3. `git push origin main` — triggers auto-deploy.
4. If you changed VPS env vars, note what you changed in the commit message or tell the user.

## What NOT to Do

- Don't create new files when you can edit existing ones.
- Don't add dependencies without asking — this is a lightweight site.
- Don't commit `.env`, `twilio.txt`, or any file containing secrets.
- Don't modify `nginx.conf.example` — it's stale and not the live config.
- Don't touch DEPLOY-PROGRESS.md references to `NEXT_PUBLIC_FORM_ENDPOINT` or `N8N_WEBHOOK_URL` — those are dead.
- Don't add abstractions beyond what the task requires.
- Don't write comments explaining what code does — only why when non-obvious.

## SOW Context

This is a $1,600 Digital Foundation engagement for client Carlos. Key deliverables tracked in memory (`sow-scope-and-status.md`). Several items are blocked on client input (NAP confirmation, photos, certifications). Check memory for current status before making assumptions about what's done vs. pending.
