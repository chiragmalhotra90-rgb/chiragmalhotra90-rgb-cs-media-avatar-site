import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chatComplete } from "@/lib/avatar/llm";
import { SYSTEM_PROMPT } from "@/lib/avatar/system-prompt";
import { ChatMessage } from "z-ai-web-dev-sdk";

/**
 * POST /api/avatar/chat
 * Body: { message: string, history: ChatMessage[], sessionToken?: string }
 *
 * Returns: { reply: string }
 *
 * NOTE: Login gate is currently disabled — the avatar is open to all
 * visitors. When the gate is re-enabled, the client will pass a
 * `sessionToken` and we'll re-validate it here.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body.message ?? "").trim();
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
    const sessionToken = body.sessionToken ? String(body.sessionToken) : undefined;

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Empty message." },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-8).map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: String(m.content ?? ""),
      })),
      { role: "user", content: message },
    ];

    const reply = await chatComplete(messages, { maxTokens: 220 });

    // Best-effort: increment message counter if a session token was passed.
    if (sessionToken) {
      await db.avatarSession
        .update({
          where: { token: sessionToken },
          data: { messages: { increment: 1 } },
        })
        .catch(() => undefined);
    }

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error("[avatar/chat] error", err);
    return NextResponse.json(
      { ok: false, error: "Avatar is warming up. Please try again." },
      { status: 500 }
    );
  }
}
