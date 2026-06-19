import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/avatar/access
 * Body: { email: string }
 *
 * Behaviour:
 *  - Validates the email (must be a gmail / google workspace address).
 *  - Checks if a session already exists for that email.
 *  - If first visit: creates a new AvatarSession, returns { token, isNew: true }.
 *  - If returning: returns { isNew: false } so the client can show the
 *    "you've already experienced the live avatar" view.
 *
 * The token is stored in an httpOnly cookie on the client and used to
 * authenticate subsequent /api/avatar/chat calls.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Allow any Google-hosted email (gmail.com + google workspace domains).
    // For demo / first iteration we accept any email — tighten this when
    // you wire up real Google OAuth.
    const domain = email.split("@")[1] ?? "";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const ua = req.headers.get("user-agent") ?? "unknown";

    const existing = await db.avatarSession.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        ok: true,
        isNew: false,
        email,
        accessedAt: existing.accessedAt,
        domain,
      });
    }

    const session = await db.avatarSession.create({
      data: {
        email,
        ipAddress: ip,
        userAgent: ua,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2h chat window
      },
    });

    const res = NextResponse.json({
      ok: true,
      isNew: true,
      email,
      token: session.token,
      domain,
    });
    // Cookie the client so chat requests can be authenticated.
    res.cookies.set("cs_avatar_token", session.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("[avatar/access] error", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
