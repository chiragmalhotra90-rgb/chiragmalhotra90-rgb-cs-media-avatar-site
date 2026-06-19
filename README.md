# CS Media & Production — Avatar Website

AI-powered marketing site for CS Media & Production (Navi Mumbai).
Features a 3D particle avatar that talks to visitors, with ElevenLabs
voice + real-time Web Audio API lip-sync.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **3D:** Three.js via React Three Fiber
- **Animation:** Framer Motion
- **Database:** Prisma + SQLite (local) / Postgres (production)
- **Voice:** ElevenLabs (set `ELEVENLABS_API_KEY`) — falls back to browser TTS
- **LLM:** Grok (set `GROK_API_KEY`) — falls back to z-ai-web-dev-sdk

## Local Development

```bash
bun install
bun run db:push        # set up SQLite DB
cp .env.example .env   # then edit .env with your API keys
bun run dev
```

Open http://localhost:3000.

## Environment Variables

See `.env.example` for the full list. Required for production:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (Vercel Postgres, Neon, Supabase, etc.) |
| `LIVEAVATAR_API_KEY` | LiveAvatar.com API key (preferred — matches cs-media-next) |
| `LIVEAVATAR_AVATAR_ID` | LiveAvatar avatar ID |
| `LIVEAVATAR_CONTEXT_ID` | Optional — reuse an existing LiveAvatar context |
| `ELEVENLABS_API_KEY` | Studio-grade TTS for the particle avatar voice |
| `ELEVENLABS_VOICE_ID` | Voice ID (optional — defaults to Rachel) |
| `GROK_API_KEY` | Grok LLM (optional — defaults to z-ai SDK) |
| `GROK_MODEL` | Grok model name (optional — defaults to grok-2-latest) |

**Porting from `cs-media-next`?** Your existing Vercel env vars map directly:
- `LIVEAVATAR_API_KEY` ← same name (or `HEYGEN_API_KEY` as fallback)
- `LIVEAVATAR_AVATAR_ID` ← same name (or `HEYGEN_AVATAR_ID` as fallback)
- `ELEVENLABS_API_KEY` ← same name
- `GROK_API_KEY` ← if you used `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` in cs-media-next, get a separate Grok key from https://console.x.ai (or omit it — the site falls back to z-ai SDK which is already wired in)

## Deploy to Vercel

### Option A — One-click via GitHub (recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CS Media avatar site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cs-media.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Vercel auto-detects Next.js — leave defaults
   - **Add Environment Variables** in the Vercel dashboard:
     - `DATABASE_URL` — use Vercel Postgres (free tier) or Neon
     - `ELEVENLABS_API_KEY` — your ElevenLabs key
     - `ELEVENLABS_VOICE_ID` — optional
     - `GROK_API_KEY` — your Grok key
     - `GROK_MODEL` — optional
   - Deploy

3. **Set up the database:**
   - For Vercel Postgres: change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`, then run `bun run db:push` locally with the production `DATABASE_URL` to create tables.

### Option B — Vercel CLI direct deploy

```bash
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL
vercel env add ELEVENLABS_API_KEY
vercel env add GROK_API_KEY
vercel --prod
```

## Switching SQLite → Postgres for production

Vercel's serverless functions don't support SQLite file storage. Before deploying:

1. Create a Postgres database (Vercel Postgres, Neon, or Supabase — all have free tiers).
2. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` to your Postgres connection string.
4. Run `bun run db:push` locally with that connection string to create tables.
5. Commit + push.

## Features

- **3D particle avatar** (custom Three.js — no HeyGen dependency for the face itself)
- **Service marquee** scrolling behind the avatar
- **Real lip-sync** via Web Audio API amplitude analysis (ElevenLabs audio is fed through an AnalyserNode)
- **Color palette switcher** — 10 palettes extracted from client-supplied images
- **12 services** grouped into Craft / Growth / AI categories
- **Proof of work** — animated counters + filterable case-study grid
- **3-day onboarding** timeline
- **3 pricing tiers** + paid discovery sprint callout
- **Mood/palette engine** — palette is saved to localStorage and applied to every CSS variable

## Login gate (currently disabled)

The Gmail one-time-access gate is built but disabled in this iteration.
To re-enable, uncomment the gate in `src/components/avatar/avatar-hero.tsx`
and the auth check in `src/app/api/avatar/chat/route.ts`. The `AvatarSession`
table already exists in the schema.

## Project structure

```
src/
  app/
    api/avatar/
      access/route.ts    # POST: create one-time session (gate)
      chat/route.ts      # POST: LLM reply (Grok or z-ai)
      tts/route.ts       # POST: ElevenLabs TTS | GET: voices
    page.tsx             # main composition
    layout.tsx           # fonts + metadata
    globals.css          # theme + utilities
  components/
    avatar/
      particle-face.tsx     # 3D head
      service-marquee.tsx   # scrolling tags
      avatar-chat.tsx       # chat UI + TTS + amplitude analysis
      avatar-hero.tsx       # orchestrator
      gmail-gate.tsx        # disabled gate
    site/                   # marketing page sections
  lib/
    avatar/
      llm.ts                # Grok / z-ai wrapper
      system-prompt.ts      # full 12-service knowledge base
    site/
      content.ts            # services, case studies, pricing
      palettes.ts           # 10 color palettes
      palette-context.tsx   # palette provider
      mood-context.tsx      # legacy (unused, kept for reference)
```
