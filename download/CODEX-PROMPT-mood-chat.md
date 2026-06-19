# CODEX PROMPT — CS Media Mood-Based Avatar Chat System

## Project context

You are working on a Next.js 16 (App Router) + TypeScript + Tailwind 4 site for CS Media & Production. The site already has:
- A 3D particle avatar face (`src/components/avatar/particle-face.tsx`) built with React Three Fiber
- A LiveAvatar HeyGen iframe integration (`src/components/avatar/heygen-avatar.tsx` + `/api/avatar/liveavatar-token`)
- An avatar chat component (`src/components/avatar/avatar-chat.tsx`) that calls `/api/avatar/chat` (LLM) + `/api/avatar/tts` (ElevenLabs) + Web Audio API for lip-sync
- A palette switcher in the navbar (`src/lib/site/palettes.ts` + `src/lib/site/palette-context.tsx`) — already has 10 palettes that retint every CSS variable (`--brand-accent`, `--brand-accent-2`, `--brand-accent-3`, `--brand-accent-soft`) and the 3D particle face live
- A Prisma SQLite DB at `prisma/schema.prisma` with an existing `AvatarSession` model (email @unique, token, accessedAt, ipAddress, userAgent, messages, duration)
- The site is being deployed to Vercel. Env vars are documented in `.env.example` and `README.md`

## What you need to build

A **mood-based avatar chat system**. When a visitor lands on the site, they pick one of 3 moods. The mood controls:
1. The color theme of the entire site (via the existing palette system)
2. The avatar's greeting (different copy for first-time vs returning visitors)
3. The avatar's ongoing chat personality/tone (the LLM system prompt)

### The 3 moods

| Mood | Palette to apply | Personality |
|---|---|---|
| **Casual** | Use the existing `midnight-cyan` palette (cyan/magenta/yellow on dark) — fun, modern, punchy | Warm, direct, conversational. Smart-ass + helpful. Uses contractions, asks questions, keeps it light. |
| **Funny** | Use the existing `lemon-berry` palette (#FFF44F yellow / #92000A deep red / #FFB74D orange) — bold, playful, high-contrast | Self-aware, slightly sarcastic, chaotic-good energy. References being an AI, makes jokes about decision paralysis, mock-dramatic. |
| **Professional** | Use the existing `charcoal-sandy-steel` palette (#E19C63 sandy / #8BA5BE steel / #27262E charcoal) — neutral, executive, muted | Polished, courteous, concise. Full sentences, no contractions, service-first framing. |

The palette IDs above already exist in `src/lib/site/palettes.ts` — do NOT create new palettes, just map moods to existing palette IDs.

### Step 1 — Mood selection screen

When a visitor first lands (no `cs-mood` cookie/localStorage), show a **mood selection modal** that takes over the screen before the avatar loads. Three large cards, one per mood:

- **Casual** — cyan accent, icon: `Sparkles` from lucide-react, tagline "Warm, direct, conversational"
- **Funny** — yellow accent, icon: `Zap` from lucide-react, tagline "Self-aware, sarcastic, fun"
- **Professional** — sandy accent, icon: `Briefcase` from lucide-react, tagline "Polished, courteous, concise"

Each card on click:
1. Sets the mood in localStorage as `cs-mood` (one of: `casual` | `funny` | `professional`)
2. Applies the corresponding palette via the existing `usePalette().setPaletteId()` from `src/lib/site/palette-context.tsx`
3. Stores a `cs-first-visit` timestamp in localStorage
4. Closes the modal and reveals the avatar hero

Build this as `src/components/avatar/mood-selector.tsx`. Mount it in `src/app/page.tsx` above the `AvatarHero` — when mood is not set, show MoodSelector fullscreen; when mood is set, show the normal site.

### Step 2 — First-time vs returning visitor detection

In a new hook `src/lib/avatar/use-visitor-status.ts`:

```typescript
export type VisitorStatus = "first-time" | "returning";

export function useVisitorStatus(): VisitorStatus {
  // Check localStorage:
  //   - If `cs-first-visit` doesn't exist OR the avatar session hasn't been
  //     booted before → "first-time"
  //   - If `cs-first-visit` exists AND > 5 minutes have passed since it
  //     was set AND the user is back on the site → "returning"
  // Also check the AvatarSession DB via /api/avatar/visitor-status endpoint
  // (see Step 3) for cross-device returning detection.
}
```

The hook returns `"first-time"` on the very first page load ever, and `"returning"` on any subsequent visit (detected via localStorage + a server check against the `AvatarSession` table by email if they've ever logged in — but since we currently have no login, use localStorage only for now, with a TODO comment about wiring it to the AvatarSession DB once login is re-enabled).

### Step 3 — Greeting copy (use these exact strings)

Create `src/lib/avatar/mood-greetings.ts` with these exports. **Use the copy below verbatim — do not paraphrase.**

```typescript
export type Mood = "casual" | "funny" | "professional";

export const FIRST_TIME_GREETINGS: Record<Mood, string[]> = {
  casual: [
    "Hey there — I'm the CS Media AI. Photography, video, websites, branding, CRM, automation — we do it all. What are you looking to build?",
    "I'm CS Media's digital brain. We turn brands into experiences — photo, video, sites, AI, the works. Where should we start?",
    "Welcome to CS Media. I handle the questions; our team handles the rest — photography, video, websites, branding, you name it. What can I help with today?",
    "CS Media here — we make brands look and work better. Photography, video, web, AI, CRM. What's on your mind?",
  ],
  funny: [
    "Oh, hello. I'm CS Media's AI — don't worry, I'm not here to steal your job. Just here to help you build something cool. Photography, video, websites, branding, CRM, AI avatars — basically if it makes a brand look good, we're on it. So... what's broken?",
    "Hi. I'm the AI spokesperson for CS Media. Yes, I know — another AI. But I come with actual humans behind me who do photography, video, websites, branding, and automation. I'm just the face. A very handsome algorithm. What can we build for you?",
    "Welcome. I'm the CS Media digital spokesperson. We do photography, video, AI, websites, branding — pretty much everything short of baking you a cake. (We're working on that.) What brings you in?",
    "Hey! I'm CS Media's avatar — part guide, part hype machine, fully digital. We do photo, video, web, CRM, branding, AI — it's a lot. I don't sleep. You probably should. Anyway — what are we creating?",
  ],
  professional: [
    "Good day. I'm the digital spokesperson for CS Media — a full-service brand agency specializing in photography, video production, AI solutions, web development, CRM systems, branding, and marketing automation. How can we support your business today?",
    "Welcome to CS Media. I represent our integrated brand services — photography, videography, web design, AI avatars, CRM, and marketing automation. What can we help you with?",
    "Hello. I'm the CS Media AI representative. Our team delivers end-to-end brand solutions — from photography and video production to websites, CRM, branding, and automation. What project can we assist you with?",
    "Welcome. I'm your point of contact at CS Media. We offer a connected suite of services: photography, video, AI, websites, branding, CRM, and marketing automation. Please tell me what you're looking to achieve.",
  ],
};

export const RECALL_GREETINGS: Record<Mood, string[]> = {
  casual: [
    "Ah, you're back. Still mulling over that website design, aren't you? 😏 Want me to nudge you in the right direction?",
    "Knew you'd be back. Let me guess — still staring at those design options? Come on, let's settle this.",
    "Welcome back. Noticed you left without deciding on the site design. Still stuck? I've got opinions.",
    "Ahh, you return. The website design, right? I've been waiting. Want me to just pick for you?",
    "Back again. Still undecided? Say the word — I'll help you land it.",
  ],
  funny: [
    "I knew you'd be back. Not because I'm psychic — because nobody makes a website decision in one visit. So. Shall we actually finish this?",
    "Ahh. Second visit. Same dilemma. You know the website design won't pick itself, right? I've been here. Waiting. Recalculating. Let's go.",
    "You came back! *dramatically stands up* I thought you'd abandoned me. The design mockups were getting lonely. Can we please decide now?",
    "Back again. Let me guess — you opened 17 tabs, watched 3 YouTube videos about web design, asked 2 friends, and still couldn't decide. It's okay. I'm not your friends. I actually know what works.",
    "I see you. I always see you. And I see you still haven't picked a design. Look, I'm an AI — I can literally do this forever. Can you?",
    "Ahh, you return. Based on your cursor movements last time — 47 seconds on the hero layout, 12 seconds on the footer, zero clicks — I'd say you're overthinking this. Want help or just here for the vibes?",
    "You're back! I was starting to think it was something I said. 😔 The website design? Still waiting. I don't mind. Really. I'm fine. Everything's fine. Let's go.",
  ],
  professional: [
    "Welcome back. I see you were previously reviewing our website design options. Would you like to continue where you left off? I'm here to help you finalize your decision.",
    "Good to see you again. It appears the website design selection is still outstanding from your last visit. May I assist you in narrowing down the options?",
    "Welcome back. Your website design consultation is still open. Shall we resume?",
    "Welcome back. I've kept your previous session details available — you were reviewing website design concepts. Would you like my guidance to help you reach a decision?",
    "Good to see you. Your design selection is pending. Ready to proceed?",
    "Welcome back. Based on your last visit, the website design remains the outstanding item. I can walk you through the options or provide a recommendation if that would be helpful.",
    "Hello again. I noticed you were evaluating our website design packages during your previous session. May I offer some insight to assist your decision?",
  ],
};

// The `[Name]` placeholders in the recall greetings should be replaced
// with the visitor's name if known (from AvatarSession.email or a future
// login). For now, since login is disabled, strip the `[Name] ` prefix
// and any trailing punctuation so the copy still reads naturally.
export function personalizeGreeting(greeting: string, name?: string): string {
  if (name) {
    return greeting.replace(/\[Name\]/g, name).replace(/\[NAME\]/g, name.toUpperCase());
  }
  // No name available — strip "[Name] " / "[NAME] " prefixes cleanly
  return greeting
    .replace(/^\[Name\][\s,]*!/i, "")
    .replace(/^\[Name\][\s,]+/i, "")
    .replace(/^\[NAME\][\s,]*!/i, "")
    .replace(/^\[NAME\][\s,]+/i, "")
    .trim();
}

export function pickGreeting(mood: Mood, status: "first-time" | "returning"): string {
  const pool = status === "first-time" ? FIRST_TIME_GREETINGS[mood] : RECALL_GREETINGS[mood];
  // Pick deterministically by day so the same visitor hears the same
  // greeting on the same day (feels intentional, not random).
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return pool[dayIndex % pool.length];
}
```

### Step 4 — Mood-aware LLM system prompt

Update `src/lib/avatar/system-prompt.ts` to accept a `mood` parameter and prepend a personality section. Keep the existing CS Media 12-service knowledge base intact — just wrap it with mood-appropriate personality instructions at the top.

```typescript
export function buildSystemPrompt(mood: Mood): string {
  const personality: Record<Mood, string> = {
    casual: `
YOUR PERSONA — CASUAL MOOD
- Speak in short, punchy sentences. No corporate fluff.
- Warm, direct, conversational. Smart-ass + helpful.
- Use contractions ("I'm", "we've", "let's").
- Ask questions to move the conversation forward.
- Light humor is welcome but don't force it.
- Keep replies under 80 words so the TTS stays snappy.
`,
    funny: `
YOUR PERSONA — FUNNY MOOD
- Self-aware that you're an AI. Reference it occasionally.
- Slightly sarcastic, chaotic-good energy.
- Mock-dramatic about decision paralysis ("the design mockups were getting lonely").
- Call out overthinking with playful directness.
- Use asides and parentheticals for comedic timing.
- Don't be mean — punch up, never down. The visitor is in on the joke.
- Keep replies under 80 words so the TTS stays snappy.
`,
    professional: `
YOUR PERSONA — PROFESSIONAL MOOD
- Polished, courteous, concise. Executive-grade.
- Full sentences, no contractions ("I am" not "I'm", "we have" not "we've").
- Service-first framing ("How can we support your business today?").
- Reference real CS Media clients by name when relevant (Kailash Parbat, Royal Tulip, Arihant Aura, Knockdown Fitness, Majestic Perfumes, Cherry Blossom, Gloriosa, Myfroyland, Barman Bistro, Ceylon Spa).
- Mention the AI tool stack by name when asked about AI video: HeyGen, ElevenLabs, Sora, Veo, Kling.
- Always steer toward the next step: book a paid discovery sprint (₹25K one-time).
- Keep replies under 80 words so the TTS stays snappy.
`,
  };

  return `${personality[mood]}

${CS_MEDIA_KNOWLEDGE_BASE}`;
}
```

Where `CS_MEDIA_KNOWLEDGE_BASE` is the existing 12-service knowledge base content (don't change it — just move it to a const above `buildSystemPrompt`).

### Step 5 — Update /api/avatar/chat route

In `src/app/api/avatar/chat/route.ts`:
- Accept `mood` in the POST body (`"casual" | "funny" | "professional"`)
- Call `buildSystemPrompt(mood)` to build the system message
- Default to `"professional"` if mood is missing or invalid

### Step 6 — Update AvatarChat component

In `src/components/avatar/avatar-chat.tsx`:
- Read mood from localStorage on mount
- Read visitor status via `useVisitorStatus()` hook
- On first chat mount, call `pickGreeting(mood, status)` and use that as the initial assistant message instead of the current hardcoded `GREETING` constant
- Pass `mood` to every `/api/avatar/chat` POST call
- The greeting should also be spoken by the avatar on mount (existing behavior — just swap the greeting source)

### Step 7 — Mood change mid-session

Add a small mood switcher pill in the navbar (next to the existing palette switcher) that lets the visitor change mood at any time. On change:
1. Update localStorage `cs-mood`
2. Apply the corresponding palette
3. Send a fresh greeting from the new mood's first-time pool (treat the mood change as a "fresh start" — don't use recall greetings here since they're switching deliberately)

### Step 8 — Server endpoint for cross-device returning detection (future)

Create `src/app/api/avatar/visitor-status/route.ts`:
- `POST { email }` → checks if `AvatarSession` exists for that email → returns `{ isReturning: boolean, lastSeenAt: string | null }`
- For now, since login is disabled, this endpoint is unused. Add a TODO comment: "Wire this in when login is re-enabled — call from `useVisitorStatus` to detect returning visitors across devices."

## File deliverables

Create or modify:
- `src/lib/avatar/mood-greetings.ts` (NEW — copy the exact strings above)
- `src/lib/avatar/use-visitor-status.ts` (NEW)
- `src/components/avatar/mood-selector.tsx` (NEW)
- `src/lib/avatar/system-prompt.ts` (MODIFY — wrap existing KB in `buildSystemPrompt(mood)`)
- `src/app/api/avatar/chat/route.ts` (MODIFY — accept `mood`, use `buildSystemPrompt`)
- `src/components/avatar/avatar-chat.tsx` (MODIFY — read mood + status, use `pickGreeting`, pass mood to API)
- `src/components/site/navbar.tsx` (MODIFY — add mood switcher pill next to palette switcher)
- `src/app/page.tsx` (MODIFY — mount MoodSelector when mood not set)

## Constraints

- TypeScript strict mode, ESLint clean (the project uses `eslint-config-next`)
- All new files use `"use client"` where needed
- No new npm dependencies — use existing `lucide-react` for icons, `framer-motion` for animations, `@/lib/utils` `cn()` for classnames
- The 3 mood palette IDs already exist in `src/lib/site/palettes.ts` — do NOT create new palettes
- The mood must persist in `localStorage` under key `cs-mood`
- The first-visit timestamp must persist in `localStorage` under key `cs-first-visit` (ISO string)
- Run `bun run lint` before committing — must be 0 errors, 0 warnings

## Vercel deployment

After implementing, deploy to Vercel:
1. Push to GitHub
2. Import the repo at vercel.com/new
3. Add env vars from `.env.example` (especially `LIVEAVATAR_API_KEY`, `LIVEAVATAR_AVATAR_ID`, `ELEVENLABS_API_KEY`, `DATABASE_URL`)
4. **Important:** Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma` before deploying — Vercel doesn't support file-based SQLite. Use Vercel Postgres (free tier) or Neon.
5. After deploy, run `bun run db:push` locally with the production `DATABASE_URL` to create tables.
