"use client";

import { useCallback, useRef, useState, type DragEvent, type ReactNode } from "react";
import type { PresenterPack } from "@/lib/presenter/pack";

type ExtractResponse = {
  ok: boolean;
  error?: string;
  fileName?: string;
  sourceKind?: string;
  slideCount?: number;
  pack?: PresenterPack;
};

const ACCEPT = ".pptx,.txt,.md,.json,.yaml,.yml,.csv";

export function PresenterBuilderClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [slideCount, setSlideCount] = useState<number>(0);
  const [pack, setPack] = useState<PresenterPack | null>(null);

  const [launching, setLaunching] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarError, setAvatarError] = useState<string>("");

  const handleFile = useCallback(async (file: File) => {
    setBusy(true);
    setError("");
    setPack(null);
    setAvatarUrl("");
    setAvatarError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/presenter-builder/extract", { method: "POST", body: fd });
      const data: ExtractResponse = await res.json();
      if (!res.ok || !data.ok || !data.pack) throw new Error(data.error || "Extraction failed");
      setFileName(data.fileName || file.name);
      setSlideCount(data.slideCount || 0);
      setPack(data.pack);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const launchAvatar = useCallback(async () => {
    if (!pack) return;
    setLaunching(true);
    setAvatarError("");
    setAvatarUrl("");
    try {
      const res = await fetch("/api/presenter-builder/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pack.title,
          openingLine: pack.openingLine,
          liveAvatarPrompt: pack.liveAvatarPrompt,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.url) throw new Error(data.error || "Avatar launch failed");
      setAvatarUrl(data.url);
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : "Avatar launch failed");
    } finally {
      setLaunching(false);
    }
  }, [pack]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 text-zinc-100">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">CS Media · AI Presenter</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">AI Presenter Builder</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Upload a deck or notes and we&rsquo;ll generate a Maya-style presenter pack — opening line, knowledge base,
          guardrails, and suggested questions — then launch a live avatar that presents it.
        </p>
      </header>

      {/* Upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
          dragging ? "border-violet-400 bg-violet-500/10" : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-500"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <p className="text-sm font-medium">{busy ? "Analysing…" : "Drop a file here, or click to upload"}</p>
        <p className="mt-1 text-xs text-zinc-500">.pptx · .txt · .md · .json · .yaml · .csv — max 20 MB</p>
        {fileName && !busy && <p className="mt-3 text-xs text-violet-300">{fileName} · {slideCount} section(s)</p>}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      {/* Generated pack */}
      {pack && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card title="Opening line">
            <p className="text-sm leading-relaxed text-zinc-300">{pack.openingLine}</p>
          </Card>

          <Card title="Suggested questions">
            <div className="flex flex-wrap gap-2">
              {pack.suggestedQuestions.length ? pack.suggestedQuestions.map((q) => (
                <span key={q} className="rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-300">{q}</span>
              )) : <span className="text-xs text-zinc-500">None derived.</span>}
            </div>
          </Card>

          <Card title={`Knowledge base · ${pack.knowledgeBase.length} section(s)`} className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {pack.knowledgeBase.map((k, i) => (
                <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  <p className="text-sm font-semibold text-zinc-100">{k.heading}</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-zinc-400">
                    {k.points.slice(0, 6).map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Guardrails">
            <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-400">
              {pack.guardrails.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </Card>

          <Card title="LiveAvatar prompt">
            <textarea
              readOnly
              value={pack.liveAvatarPrompt}
              className="h-40 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 font-mono text-[11px] leading-relaxed text-zinc-400"
            />
          </Card>

          {/* Launch */}
          <div className="lg:col-span-2">
            {!avatarUrl ? (
              <button
                onClick={launchAvatar}
                disabled={launching}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
              >
                {launching ? "Launching avatar…" : "▶ Launch live avatar"}
              </button>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                <iframe
                  src={avatarUrl}
                  allow="microphone; autoplay"
                  title="AI Presenter Avatar"
                  className="mx-auto block aspect-[9/16] w-full max-w-sm border-0"
                />
              </div>
            )}
            {avatarError && (
              <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                {avatarError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 ${className}`}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}
