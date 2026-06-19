import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ isReturning: false, lastSeenAt: null });
  }

  // TODO: Wire this in when login is re-enabled — call from `useVisitorStatus`
  // to detect returning visitors across devices.
  const session = await db.avatarSession.findUnique({
    where: { email },
    select: { accessedAt: true },
  });

  return NextResponse.json({
    isReturning: Boolean(session),
    lastSeenAt: session?.accessedAt.toISOString() ?? null,
  });
}
