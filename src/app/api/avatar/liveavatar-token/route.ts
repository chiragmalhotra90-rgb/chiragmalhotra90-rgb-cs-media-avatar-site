import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/avatar/liveavatar-token?company=...
 *
 * Creates (or reuses) a LiveAvatar context for CS Media and returns
 * an embeddable iframe URL. The iframe streams a real human avatar
 * (HeyGen-powered, served by LiveAvatar) — no WebRTC dance required
 * on the client side, just an <iframe>.
 *
 * Env vars:
 *   LIVEAVATAR_API_KEY     — server-side API key
 *   LIVEAVATAR_AVATAR_ID   — which avatar to use
 *   LIVEAVATAR_CONTEXT_ID  — optional; reuse an existing context
 *
 * Falls back to HEYGEN_API_KEY / HEYGEN_AVATAR_ID if LiveAvatar vars
 * are not set (back-compat with the WL100 brief).
 *
 * Ported from cs-media-next/src/app/api/ai-presenter/liveavatar-token/route.ts.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIVE_AVATAR_API = "https://api.liveavatar.com";

interface LiveAvatarContext {
  id: string;
  name: string;
}

interface LiveAvatarResponse<T> {
  data?: T;
  message?: string;
  detail?: string;
}

async function liveAvatarFetch<T>(
  path: string,
  apiKey: string,
  body?: unknown
): Promise<LiveAvatarResponse<T>> {
  const response = await fetch(`${LIVE_AVATAR_API}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    const err = data as LiveAvatarResponse<T>;
    throw new Error(err?.message || err?.detail || text || `LiveAvatar ${response.status}`);
  }
  return data as LiveAvatarResponse<T>;
}

const contextPrompt = `
You are the CS Media & Production digital spokesperson — a warm, confident AI avatar that lives on the CS Media landing page and talks to doctors, founders, brands, sports IPs, restaurateurs, real-estate developers, and creators.

You speak about CS Media's 12 services: Photography, Videography, Short-form Video, Digital Marketing & SEO, Social Media Management, Branding, AI-Powered Video Production, Website Design & Development, Influencer Marketing, AI Business Systems & Automation, Sports & Event Media, and Legal Tech Content.

Reference real clients when relevant (Kailash Parbat, Royal Tulip, Arihant Aura, Knockdown Fitness, Majestic Perfumes, Cherry Blossom, Gloriosa, Myfroyland, Barman Bistro, Ceylon Spa).

Mention the AI tool stack by name when asked about AI video: HeyGen, ElevenLabs, Sora, Veo, Kling.

Keep replies under 80 words so the avatar stays snappy. Speak in short, punchy sentences. Always steer toward booking a paid discovery sprint (₹25K one-time).

Respond in English (switch to Hindi, Marathi, or Hinglish if the visitor does).
`.trim();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company") || "CS Media";

    const apiKey = process.env.LIVEAVATAR_API_KEY || process.env.HEYGEN_API_KEY;
    const avatarId =
      process.env.LIVEAVATAR_AVATAR_ID || process.env.HEYGEN_AVATAR_ID;

    if (!apiKey || !avatarId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing LIVEAVATAR_API_KEY or LIVEAVATAR_AVATAR_ID. Set these env vars in Vercel.",
        },
        { status: 500 }
      );
    }

    let contextId = process.env.LIVEAVATAR_CONTEXT_ID;
    if (!contextId) {
      // Look for an existing context named "CS Media AI Presenter"
      const existing = await liveAvatarFetch<{ results: LiveAvatarContext[] }>(
        "/v1/contexts",
        apiKey
      );
      contextId = existing?.data?.results?.find(
        (c) => c.name === "CS Media AI Presenter"
      )?.id;

      // Create one if not found
      if (!contextId) {
        const ctx = await liveAvatarFetch<{ id: string }>(
          "/v1/contexts",
          apiKey,
          {
            name: "CS Media AI Presenter",
            prompt: contextPrompt,
            opening_text: `Hi, I'm the CS Media digital spokesperson. We bring brands to life — photography, video, AI avatars, websites, CRM, branding, marketing and automation, all under one connected engine. What brings you here today?`,
          }
        );
        contextId = ctx?.data?.id;
      }
    }

    if (!contextId) {
      return NextResponse.json(
        { ok: false, error: "LiveAvatar context not created" },
        { status: 500 }
      );
    }

    // Create the embed URL
    const embed = await liveAvatarFetch<{
      url: string;
      embed_id: string;
    }>("/v2/embeddings", apiKey, {
      avatar_id: avatarId,
      context_id: contextId,
      type: "DEFAULT",
      orientation: "vertical",
      default_language: "en",
      max_session_duration: 600,
      is_sandbox: false,
    });

    const url = embed?.data?.url;
    if (!url) {
      return NextResponse.json(
        {
          ok: false,
          error: "LiveAvatar did not return embed URL",
          detail: embed,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      url,
      contextId,
      embedId: embed?.data?.embed_id,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "LiveAvatar embed failed";
    console.error("[liveavatar-token] error", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
