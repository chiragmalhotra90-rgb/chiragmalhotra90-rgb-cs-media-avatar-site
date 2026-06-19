"use client";

import { ReactNode, useEffect, useState } from "react";
import { Briefcase, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { Mood } from "@/lib/avatar/mood-greetings";
import { usePalette } from "@/lib/site/palette-context";
import { cn } from "@/lib/utils";

const MOOD_STORAGE_KEY = "cs-mood";
const FIRST_VISIT_KEY = "cs-first-visit";

const MOOD_PALETTE: Record<Mood, string> = {
  casual: "midnight-cyan",
  funny: "lemon-berry",
  professional: "charcoal-sandy-steel",
};

const MOODS = [
  {
    id: "casual",
    label: "Casual",
    tagline: "Warm, direct, conversational",
    accent: "#00f0ff",
    Icon: Sparkles,
  },
  {
    id: "funny",
    label: "Funny",
    tagline: "Self-aware, sarcastic, fun",
    accent: "#FFF44F",
    Icon: Zap,
  },
  {
    id: "professional",
    label: "Professional",
    tagline: "Polished, courteous, concise",
    accent: "#E19C63",
    Icon: Briefcase,
  },
] satisfies {
  id: Mood;
  label: string;
  tagline: string;
  accent: string;
  Icon: typeof Sparkles;
}[];

function isMood(value: string | null): value is Mood {
  return value === "casual" || value === "funny" || value === "professional";
}

export function MoodSelector({ children }: { children: ReactNode }) {
  const { setPaletteId } = usePalette();
  const [ready, setReady] = useState(false);
  const [mood, setMood] = useState<Mood | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedMood = window.localStorage.getItem(MOOD_STORAGE_KEY);
      if (isMood(savedMood)) {
        setMood(savedMood);
        setPaletteId(MOOD_PALETTE[savedMood]);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [setPaletteId]);

  const selectMood = (nextMood: Mood) => {
    window.localStorage.setItem(MOOD_STORAGE_KEY, nextMood);
    if (!window.localStorage.getItem(FIRST_VISIT_KEY)) {
      window.localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
    }
    setPaletteId(MOOD_PALETTE[nextMood]);
    setMood(nextMood);
    window.dispatchEvent(
      new CustomEvent("cs-mood-change", {
        detail: { mood: nextMood, freshStart: true },
      })
    );
  };

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[200] bg-background" aria-hidden="true" />
    );
  }

  if (mood) return <>{children}</>;

  return (
    <section className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div
          className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--brand-accent-soft), transparent 68%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            CS Media Avatar
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-3d-white sm:text-6xl">
            Pick the mood.
          </h1>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {MOODS.map(({ id, label, tagline, accent, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectMood(id)}
              className={cn(
                "group min-h-56 rounded-lg border border-white/10 bg-white/[0.035] p-5 text-left transition-all duration-300",
                "hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/40"
              )}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg border"
                style={{
                  borderColor: `${accent}55`,
                  background: `${accent}18`,
                  color: accent,
                }}
              >
                <Icon size={22} />
              </div>
              <div className="mt-8 font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
                {label}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tagline}
              </div>
              <div className="mt-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
                <span
                  className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                  style={{ background: accent }}
                />
                Select
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
