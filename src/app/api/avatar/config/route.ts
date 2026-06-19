import { NextResponse } from "next/server";

/**
 * GET /api/avatar/config
 *
 * Returns client-safe avatar configuration:
 *   - heygenAvailable (bool) — true if LIVEAVATAR_API_KEY or HEYGEN_API_KEY is set
 *   - elevenLabsAvailable (bool)
 *   - llmProvider — "grok" | "zai"
 *
 * This lets the client know which avatar sources are actually usable
 * before trying to boot HeyGen.
 */
export async function GET() {
  const liveavatarAvailable = !!(
    process.env.LIVEAVATAR_API_KEY ||
    process.env.HEYGEN_API_KEY
  );
  return NextResponse.json({
    ok: true,
    heygenAvailable: liveavatarAvailable,
    elevenLabsAvailable: !!process.env.ELEVENLABS_API_KEY,
    llmProvider: process.env.GROK_API_KEY ? "grok" : "zai",
  });
}
