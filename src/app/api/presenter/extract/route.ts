import { NextRequest, NextResponse } from "next/server";
import {
  buildPresenterPack,
  extractPresenterSource,
  MAX_PRESENTER_UPLOAD_BYTES,
  isSupportedPresenterFile,
} from "@/lib/presenter/presenter-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const projectName = String(formData.get("projectName") ?? "").trim();
    const audience = String(formData.get("audience") ?? "").trim();
    const purpose = String(formData.get("purpose") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Upload a PPTX or knowledge-base file." },
        { status: 400 }
      );
    }

    if (!isSupportedPresenterFile(file.name)) {
      return NextResponse.json(
        { ok: false, error: "Supported files: PPTX, TXT, MD, JSON, YAML, CSV." },
        { status: 400 }
      );
    }

    if (file.size > MAX_PRESENTER_UPLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, error: "File is too large. Keep uploads under 12 MB." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extracted = await extractPresenterSource(file.name, buffer);
    const presenter = await buildPresenterPack({
      projectName,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      bytes: file.size,
      slideCount: extracted.slideCount,
      sourceText: extracted.text,
      audience,
      purpose,
    });

    return NextResponse.json({ ok: true, presenter });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process upload.";
    console.error("[presenter/extract] error", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
