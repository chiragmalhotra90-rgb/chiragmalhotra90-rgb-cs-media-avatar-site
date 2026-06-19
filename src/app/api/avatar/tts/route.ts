import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/avatar/tts
 * Body: { text: string, voice?: string }
 * Returns: audio/mpeg binary (ElevenLabs) OR audio fallback (Web Speech-style cue).
 *
 * Uses ElevenLabs if ELEVENLABS_API_KEY is set. Otherwise returns 404 so the
 * client can fall back to the browser's built-in Web Speech API.
 *
 * The client side plays this audio through a Web Audio AnalyserNode to
 * extract real-time amplitude → drives the 3D face lip-sync.
 */

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — ElevenLabs default female
const MODEL_ID = "eleven_turbo_v2_5"; // fast, low-latency, multilingual

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "ElevenLabs not configured. Set ELEVENLABS_API_KEY." },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const text = String(body.text ?? "").trim();
    const voiceId = String(body.voice ?? DEFAULT_VOICE_ID);

    if (!text) {
      return NextResponse.json({ ok: false, error: "Empty text." }, { status: 400 });
    }

    // Cap text length to keep latency predictable.
    const capped = text.slice(0, 600);

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: capped,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.35,
          use_speaker_boost: true,
        },
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      console.error("[avatar/tts] ElevenLabs error", upstream.status, errText);
      return NextResponse.json(
        { ok: false, error: `ElevenLabs error ${upstream.status}` },
        { status: 502 }
      );
    }

    const audioBuf = await upstream.arrayBuffer();
    return new NextResponse(audioBuf, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuf.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[avatar/tts] error", err);
    return NextResponse.json(
      { ok: false, error: "TTS failed." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/avatar/tts
 * Returns the list of available ElevenLabs voices (cached for the session).
 * The client uses this to populate a voice picker if desired.
 */
export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, voices: [] }, { status: 200 });
  }
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": apiKey },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, voices: [] }, { status: 200 });
    }
    const data = await res.json();
    const voices = (data.voices ?? []).slice(0, 12).map((v: any) => ({
      id: v.voice_id,
      name: v.name,
      category: v.category,
      previewUrl: v.preview_url,
    }));
    return NextResponse.json({ ok: true, voices });
  } catch {
    return NextResponse.json({ ok: false, voices: [] }, { status: 200 });
  }
}
