import { NextResponse } from "next/server";

/**
 * POST /api/presenter-builder/launch
 * body: { title, openingLine, liveAvatarPrompt }
 *
 * Mints a LiveAvatar embed iframe URL (the official /v2/embeddings flow, same as
 * src/app/api/avatar/liveavatar-token) using the GENERATED presenter pack as the
 * avatar's context. Server-only key. Avatar defaults to the account's Katya.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIVE_AVATAR_API = "https://api.liveavatar.com";
// Katya in Black Suit — the avatar present in this LiveAvatar account. Override
// with LIVEAVATAR_AVATAR_ID. Must be an avatar that belongs to LIVEAVATAR_API_KEY's
// account, or /v2/embeddings returns "Bad request".
const DEFAULT_AVATAR = "26393b8e-e944-4367-98ef-e2bc75c4b792";

interface LaResp<T> { data?: T; message?: string; detail?: string }

async function la<T>(path: string, apiKey: string, body?: unknown): Promise<LaResp<T>> {
  const res = await fetch(`${LIVE_AVATAR_API}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const e = data as LaResp<T>;
    throw new Error(e?.message || e?.detail || text || `LiveAvatar ${res.status}`);
  }
  return data as LaResp<T>;
}

export async function POST(req: Request) {
  try {
    const { title, openingLine, liveAvatarPrompt } = (await req.json()) as {
      title?: string;
      openingLine?: string;
      liveAvatarPrompt?: string;
    };
    if (!liveAvatarPrompt?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing liveAvatarPrompt — generate a pack first." }, { status: 400 });
    }

    const apiKey = process.env.LIVEAVATAR_API_KEY || process.env.HEYGEN_API_KEY;
    const avatarId = process.env.LIVEAVATAR_AVATAR_ID || process.env.HEYGEN_AVATAR_ID || DEFAULT_AVATAR;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "LiveAvatar not configured — set LIVEAVATAR_API_KEY (and LIVEAVATAR_AVATAR_ID) in Vercel." },
        { status: 503 },
      );
    }

    const contextName = `AI Presenter — ${(title || "Untitled").slice(0, 60)}`;
    let contextId: string | undefined;

    const existing = await la<{ results: { id: string; name: string }[] }>("/v1/contexts", apiKey);
    contextId = existing?.data?.results?.find((c) => c.name === contextName)?.id;

    if (!contextId) {
      const created = await la<{ id: string }>("/v1/contexts", apiKey, {
        name: contextName,
        prompt: liveAvatarPrompt,
        opening_text: openingLine || "Hi, I'm Maya — your AI presenter. What would you like to know?",
      });
      contextId = created?.data?.id;
    }
    if (!contextId) {
      return NextResponse.json({ ok: false, error: "LiveAvatar context not created." }, { status: 502 });
    }

    const embed = await la<{ url: string; embed_id: string }>("/v2/embeddings", apiKey, {
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
      return NextResponse.json({ ok: false, error: "LiveAvatar did not return an embed URL." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "LiveAvatar launch failed";
    console.error("[presenter-builder/launch]", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
