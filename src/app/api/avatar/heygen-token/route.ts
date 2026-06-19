import { NextResponse } from "next/server";

/**
 * POST /api/avatar/heygen-token
 *
 * Exchanges HEYGEN_API_KEY for a one-time HeyGen access token that the
 * client SDK uses to open a streaming avatar session.
 *
 * Tokens are one-time use, so the client must call this endpoint once
 * per session (not on every render).
 */

export async function POST() {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "HEYGEN_API_KEY not configured." },
      { status: 503 }
    );
  }
  try {
    const res = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[heygen-token] error", res.status, errText);
      return NextResponse.json(
        { ok: false, error: `HeyGen error ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const token = data?.data?.token;
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "HeyGen returned no token." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("[heygen-token] exception", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}
