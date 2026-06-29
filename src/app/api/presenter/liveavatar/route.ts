import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIVE_AVATAR_API = "https://api.liveavatar.com";
const MAX_PROMPT_CHARS = 28000;
const MAX_OPENING_CHARS = 400;

type LiveAvatarResponse<T> = {
  data?: T;
  message?: string;
  detail?: string;
};

type LiveAvatarContext = {
  id: string;
  name: string;
};

async function liveAvatarFetch<T>(
  path: string,
  apiKey: string,
  body?: unknown
): Promise<LiveAvatarResponse<T>> {
  const response = await fetch(`${LIVE_AVATAR_API}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
      accept: "application/json",
    },
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const projectName = cleanText(body.projectName, 90) || "AI Presenter";
    const prompt = cleanText(body.presenterPrompt, MAX_PROMPT_CHARS);
    const openingText =
      cleanText(body.openingText, MAX_OPENING_CHARS) ||
      `Hi, I am your AI presenter for ${projectName}. What would you like to explore?`;

    if (!prompt || prompt.length < 300) {
      return NextResponse.json(
        { ok: false, error: "Generate a presenter prompt before launching the avatar." },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEAVATAR_API_KEY || process.env.HEYGEN_API_KEY;
    const avatarId =
      cleanText(body.avatarId, 120) ||
      process.env.LIVEAVATAR_AVATAR_ID ||
      process.env.HEYGEN_AVATAR_ID;

    if (!apiKey || !avatarId) {
      return NextResponse.json(
        {
          ok: false,
          error: "LiveAvatar is not configured. Set LIVEAVATAR_API_KEY and LIVEAVATAR_AVATAR_ID.",
        },
        { status: 500 }
      );
    }

    const contextName = `CS Presenter - ${projectName}`.slice(0, 90);
    const existing = await liveAvatarFetch<{ results: LiveAvatarContext[] }>(
      "/v1/contexts",
      apiKey
    );
    const contextId =
      existing?.data?.results?.find((context) => context.name === contextName)?.id ||
      (
        await liveAvatarFetch<{ id: string }>("/v1/contexts", apiKey, {
          name: contextName,
          prompt,
          opening_text: openingText,
        })
      )?.data?.id;

    if (!contextId) {
      return NextResponse.json(
        { ok: false, error: "LiveAvatar context was not created." },
        { status: 500 }
      );
    }

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
        { ok: false, error: "LiveAvatar did not return an embed URL.", detail: embed },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      url,
      contextId,
      embedId: embed?.data?.embed_id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "LiveAvatar launch failed.";
    console.error("[presenter/liveavatar] error", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
