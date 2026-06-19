import { NextResponse } from "next/server";

/**
 * GET /api/avatar/heygen-avatars
 *
 * Returns the list of public HeyGen interactive avatars available for
 * streaming. Cached for 1 hour since the list rarely changes.
 *
 * Response: { ok: true, avatars: [{avatar_id, name, preview_image_url}] }
 */

export async function GET() {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, avatars: [] }, { status: 200 });
  }
  try {
    // List public streaming avatars
    const res = await fetch("https://api.heygen.com/v1/streaming.avatars", {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, avatars: [] }, { status: 200 });
    }
    const data = await res.json();
    const avatars = (data?.data?.avatars ?? []).map((a: any) => ({
      id: a.avatar_id,
      name: a.avatar_name,
      previewUrl: a.preview_image_url,
    }));
    return NextResponse.json({ ok: true, avatars });
  } catch {
    return NextResponse.json({ ok: false, avatars: [] }, { status: 200 });
  }
}
