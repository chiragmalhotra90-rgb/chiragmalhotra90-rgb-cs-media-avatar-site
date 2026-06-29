import { NextResponse } from "next/server";
import { extractSlides, buildPack } from "@/lib/presenter/pack";

/**
 * POST /api/presenter-builder/extract
 * multipart/form-data with a single `file` (.pptx, .txt, .md, .json, .yaml, .yml, .csv).
 * Extracts the deck text server-side and returns a generated presenter pack.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = ["pptx", "txt", "md", "json", "yaml", "yml", "csv"];
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file uploaded (field 'file')." }, { status: 400 });
    }

    const ext = (file.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]) ?? "";
    if (!ALLOWED.includes(ext)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported file type ".${ext}". Allowed: ${ALLOWED.join(", ")}.` },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "File too large (max 20 MB)." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const { slides, sourceKind } = await extractSlides(buffer, file.name);
    if (!slides.length) {
      return NextResponse.json(
        { ok: false, error: "Couldn't extract any text from this file." },
        { status: 422 },
      );
    }

    const pack = buildPack(slides, file.name);
    return NextResponse.json({ ok: true, fileName: file.name, sourceKind, slideCount: slides.length, slides, pack });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Extraction failed";
    console.error("[presenter-builder/extract]", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
