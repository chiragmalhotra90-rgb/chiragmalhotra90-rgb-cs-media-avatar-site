import ZAI, { ChatMessage } from "z-ai-web-dev-sdk";

/**
 * Unified LLM client. Picks Grok (xAI) if GROK_API_KEY is set,
 * otherwise falls back to z-ai-web-dev-sdk.
 *
 * Both return a plain string reply.
 */
export async function chatComplete(
  messages: ChatMessage[],
  opts?: { maxTokens?: number }
): Promise<string> {
  const grokKey = process.env.GROK_API_KEY;

  if (grokKey) {
    // Use xAI Grok via OpenAI-compatible API.
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${grokKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || "grok-2-latest",
        messages: messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
          content: m.content,
        })),
        max_tokens: opts?.maxTokens ?? 220,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[llm] Grok error", res.status, errText);
      // Fall through to z-ai fallback below.
    } else {
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
    }
  }

  // Fallback / default: z-ai-web-dev-sdk.
  const zai = await ZAI.create();
  const response = await zai.chat.completions.create({
    messages,
    stream: false,
    thinking: { type: "disabled" },
  });
  return response.choices?.[0]?.message?.content?.trim() ?? "";
}
