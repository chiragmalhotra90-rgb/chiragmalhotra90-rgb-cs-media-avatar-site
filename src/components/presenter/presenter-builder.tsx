"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Copy,
  FileUp,
  Loader2,
  Play,
  Sparkles,
  UploadCloud,
  Wand2,
  XCircle,
} from "lucide-react";
import type { PresenterBuild } from "@/lib/presenter/presenter-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BuildResponse = {
  ok: boolean;
  presenter?: PresenterBuild;
  error?: string;
};

type AvatarResponse = {
  ok: boolean;
  url?: string;
  contextId?: string;
  embedId?: string;
  error?: string;
};

const ACCEPTED_TYPES = ".pptx,.txt,.md,.markdown,.json,.yaml,.yml,.csv";

export function PresenterBuilder() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [audience, setAudience] = useState("investors, customers, and website visitors");
  const [purpose, setPurpose] = useState("interactive AI presenter for a website or pitch page");
  const [presenter, setPresenter] = useState<PresenterBuild | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<"extract" | "avatar" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = !!file && !busy;
  const fileMeta = useMemo(() => {
    if (!file) return null;
    return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }, [file]);

  const generatePresenter = async () => {
    if (!file) return;
    setBusy("extract");
    setError(null);
    setAvatarUrl(null);
    setCopied(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectName", projectName);
    formData.append("audience", audience);
    formData.append("purpose", purpose);

    try {
      const response = await fetch("/api/presenter/extract", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as BuildResponse;
      if (!response.ok || !data.ok || !data.presenter) {
        throw new Error(data.error || "Could not generate presenter.");
      }
      setPresenter(data.presenter);
      if (!projectName.trim()) setProjectName(data.presenter.projectName);
    } catch (err) {
      setPresenter(null);
      setError(err instanceof Error ? err.message : "Could not generate presenter.");
    } finally {
      setBusy(null);
    }
  };

  const launchAvatar = async () => {
    if (!presenter) return;
    setBusy("avatar");
    setError(null);

    try {
      const response = await fetch("/api/presenter/liveavatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: presenter.projectName,
          presenterPrompt: presenter.presenterPrompt,
          openingText: presenter.openingText,
        }),
      });
      const data = (await response.json()) as AvatarResponse;
      if (!response.ok || !data.ok || !data.url) {
        throw new Error(data.error || "Could not launch live avatar.");
      }
      setAvatarUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not launch live avatar.");
    } finally {
      setBusy(null);
    }
  };

  const copyPrompt = async () => {
    if (!presenter) return;
    await navigator.clipboard.writeText(presenter.presenterPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute inset-0 grid-bg mask-fade-b" />
        <div
          className="absolute left-1/2 top-0 h-[520px] w-[min(820px,90vw)] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "var(--brand-accent-soft)" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="inline-flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.04] font-display text-sm font-extrabold text-primary">
              CS
            </span>
            <span className="font-display text-sm font-extrabold uppercase tracking-tight">
              CS_Media<span className="text-primary">&Prod</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/#services"
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Services
            </a>
            <a
              href="/#contact"
              className="rounded-full px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-[1.02]"
              style={{ background: "var(--brand-accent)" }}
            >
              Build with CS Media
            </a>
          </div>
        </header>

        <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="glass-strong h-fit rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                  <Sparkles size={12} className="text-primary" />
                  AI presenter builder
                </div>
                <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-none tracking-tight">
                  Upload knowledge. Launch a presenter.
                </h1>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "group flex min-h-[150px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-center transition-colors hover:border-primary/60 hover:bg-white/[0.05]",
                  file && "border-primary/50 bg-primary/5"
                )}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept={ACCEPTED_TYPES}
                  className="hidden"
                  onChange={(event) => {
                    const nextFile = event.target.files?.[0] ?? null;
                    setFile(nextFile);
                    setPresenter(null);
                    setAvatarUrl(null);
                    setError(null);
                    if (nextFile && !projectName.trim()) {
                      setProjectName(nextFile.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
                    }
                  }}
                />
                <UploadCloud
                  size={28}
                  className="mb-3 text-muted-foreground transition-colors group-hover:text-primary"
                />
                <span className="text-sm font-semibold">
                  {file ? file.name : "Drop in a PPTX or knowledge file"}
                </span>
                <span className="mt-2 text-xs text-muted-foreground">
                  {file ? fileMeta : "PPTX, Markdown, text, JSON, YAML, or CSV under 12 MB"}
                </span>
              </button>

              <div className="space-y-3">
                <label className="space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Project name
                  </span>
                  <Input
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="World Legends 100, Sunwa.AI, Clinic Growth System"
                    className="h-11 rounded-xl border-white/10 bg-white/[0.04]"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Audience
                  </span>
                  <Input
                    value={audience}
                    onChange={(event) => setAudience(event.target.value)}
                    className="h-11 rounded-xl border-white/10 bg-white/[0.04]"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Use case
                  </span>
                  <Textarea
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    className="min-h-24 rounded-xl border-white/10 bg-white/[0.04]"
                  />
                </label>
              </div>

              <Button
                type="button"
                disabled={!canGenerate}
                onClick={generatePresenter}
                className="h-12 w-full rounded-xl text-sm font-extrabold uppercase tracking-[0.16em] text-black"
                style={{ background: "var(--brand-accent)" }}
              >
                {busy === "extract" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 />
                )}
                Generate presenter
              </Button>

              {error && (
                <div className="flex gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
                  <XCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </aside>

          <section className="grid min-h-[680px] gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="glass rounded-2xl p-5">
              {!presenter ? (
                <EmptyState />
              ) : (
                <div className="flex h-full flex-col gap-5">
                  <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                          Ready
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                          {presenter.slideCount ? `${presenter.slideCount} slides` : "knowledge base"}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
                          {presenter.charCount.toLocaleString()} chars
                        </span>
                      </div>
                      <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight">
                        {presenter.projectName}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {presenter.oneLine}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={copyPrompt}
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      >
                        {copied ? <CheckCircle2 /> : <Copy />}
                        {copied ? "Copied" : "Copy prompt"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <OutputPanel title="Opening line" icon={<Bot size={16} />}>
                      <p className="text-sm leading-relaxed text-foreground/85">
                        {presenter.openingText}
                      </p>
                    </OutputPanel>

                    <OutputPanel title="Suggested questions" icon={<FileUp size={16} />}>
                      <ul className="space-y-2 text-sm text-foreground/85">
                        {presenter.suggestedQuestions.map((question) => (
                          <li key={question} className="flex gap-2">
                            <ArrowRight size={14} className="mt-1 shrink-0 text-primary" />
                            <span>{question}</span>
                          </li>
                        ))}
                      </ul>
                    </OutputPanel>
                  </div>

                  <OutputPanel title="Guardrails" icon={<CheckCircle2 size={16} />}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {presenter.guardrails.map((rule) => (
                        <div
                          key={rule}
                          className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-relaxed text-foreground/80"
                        >
                          {rule}
                        </div>
                      ))}
                    </div>
                  </OutputPanel>

                  <OutputPanel title="Generated knowledge base" icon={<Sparkles size={16} />}>
                    <Textarea
                      value={presenter.knowledgeBase}
                      readOnly
                      className="min-h-[280px] rounded-xl border-white/10 bg-black/30 font-mono text-xs leading-relaxed"
                    />
                  </OutputPanel>
                </div>
              )}
            </div>

            <aside className="glass-strong flex min-h-[680px] flex-col rounded-2xl p-5">
              <div className="border-b border-white/10 pb-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  <Bot size={12} className="text-primary" />
                  Live preview
                </div>
                <h2 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-tight">
                  Avatar version
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Uses the generated presenter context with the site LiveAvatar account.
                </p>
              </div>

              <div className="mt-5 flex flex-1 flex-col">
                {!avatarUrl ? (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-black/20 p-5 text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
                      <Play size={22} className="text-primary" />
                    </div>
                    <p className="mt-5 text-sm font-semibold">
                      {presenter ? "Launch the generated avatar" : "Generate a presenter first"}
                    </p>
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
                      The preview opens in-place once LiveAvatar returns an embed URL.
                    </p>
                  </div>
                ) : (
                  <div className="min-h-[520px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <iframe
                      src={avatarUrl}
                      title="Generated AI presenter live avatar"
                      allow="camera; microphone; autoplay; fullscreen; clipboard-write"
                      className="h-full min-h-[520px] w-full border-0"
                    />
                  </div>
                )}

                <Button
                  type="button"
                  disabled={!presenter || busy === "avatar"}
                  onClick={launchAvatar}
                  className="mt-5 h-12 rounded-xl text-sm font-extrabold uppercase tracking-[0.16em] text-black"
                  style={{ background: "var(--brand-accent)" }}
                >
                  {busy === "avatar" ? <Loader2 className="animate-spin" /> : <Play />}
                  {avatarUrl ? "Restart avatar" : "Launch live avatar"}
                </Button>
              </div>
            </aside>
          </section>
        </section>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[620px] flex-col items-center justify-center px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <Wand2 size={28} className="text-primary" />
      </div>
      <h2 className="mt-6 font-display text-3xl font-extrabold uppercase tracking-tight">
        Presenter pack appears here
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Upload a PPTX or knowledge base to produce the presenter opening, guardrails,
        suggested questions, and LiveAvatar-ready training prompt.
      </p>
    </div>
  );
}

function OutputPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      {children}
    </section>
  );
}
