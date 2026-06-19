"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Menu,
  Palette as PaletteIcon,
  Sparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/site/content";
import { PALETTES } from "@/lib/site/palettes";
import { usePalette } from "@/lib/site/palette-context";
import type { Mood } from "@/lib/avatar/mood-greetings";
import { cn } from "@/lib/utils";

const MOOD_STORAGE_KEY = "cs-mood";
const FIRST_VISIT_KEY = "cs-first-visit";

const MOOD_OPTIONS: {
  id: Mood;
  label: string;
  paletteId: string;
  Icon: LucideIcon;
}[] = [
  { id: "casual", label: "Casual", paletteId: "midnight-cyan", Icon: Sparkles },
  { id: "funny", label: "Funny", paletteId: "lemon-berry", Icon: Zap },
  {
    id: "professional",
    label: "Professional",
    paletteId: "charcoal-sandy-steel",
    Icon: Briefcase,
  },
];

function isMood(value: string | null): value is Mood {
  return value === "casual" || value === "funny" || value === "professional";
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [mood, setMood] = useState<Mood>("professional");
  const { paletteId, setPaletteId, palette } = usePalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedMood = window.localStorage.getItem(MOOD_STORAGE_KEY);
      if (isMood(savedMood)) setMood(savedMood);
    }, 0);

    const onMoodChange = (event: Event) => {
      const detail = (event as CustomEvent<{ mood?: unknown }>).detail;
      const nextMood = typeof detail?.mood === "string" ? detail.mood : null;
      if (isMood(nextMood)) setMood(nextMood);
    };

    window.addEventListener("cs-mood-change", onMoodChange);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("cs-mood-change", onMoodChange);
    };
  }, []);

  const selectMood = (nextMood: Mood) => {
    const moodConfig = MOOD_OPTIONS.find((option) => option.id === nextMood);
    if (!moodConfig) return;

    window.localStorage.setItem(MOOD_STORAGE_KEY, nextMood);
    if (!window.localStorage.getItem(FIRST_VISIT_KEY)) {
      window.localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
    }
    setMood(nextMood);
    setPaletteId(moodConfig.paletteId);
    setMoodOpen(false);
    window.dispatchEvent(
      new CustomEvent("cs-mood-change", {
        detail: { mood: nextMood, freshStart: true },
      })
    );
  };

  const currentMood =
    MOOD_OPTIONS.find((option) => option.id === mood) ?? MOOD_OPTIONS[2];
  const CurrentMoodIcon = currentMood.Icon;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-300",
            scrolled ? "glass-strong shadow-[0_8px_30px_rgba(0,0,0,0.45)]" : "border border-transparent"
          )}
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5">
            <div className="relative h-8 w-8">
              <div
                className="absolute inset-0 rounded-md"
                style={{ background: "var(--brand-accent)", opacity: 0.18 }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center font-display text-base font-extrabold"
                style={{ color: "var(--brand-accent)" }}
              >
                CS
              </div>
            </div>
            <div className="font-display text-sm font-extrabold uppercase tracking-tight leading-none">
              CS_Media
              <span style={{ color: "var(--brand-accent)" }}>&Prod</span>
            </div>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Palette switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3 relative">
            <div className="relative">
              <button
                onClick={() => {
                  setMoodOpen((o) => !o);
                  setPaletteOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-foreground/80 transition-colors hover:text-foreground hover:border-white/20"
                aria-label="Choose avatar mood"
              >
                <CurrentMoodIcon size={12} style={{ color: "var(--brand-accent)" }} />
                <span className="hidden xl:inline">{currentMood.label}</span>
              </button>
              <AnimatePresence>
                {moodOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-card p-2 shadow-2xl"
                  >
                    <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Avatar mood
                    </div>
                    {MOOD_OPTIONS.map((option) => {
                      const Icon = option.Icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => selectMood(option.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            mood === option.id
                              ? "bg-white/[0.06]"
                              : "hover:bg-white/[0.03]"
                          )}
                        >
                          <Icon
                            size={14}
                            className="shrink-0"
                            style={{ color: "var(--brand-accent)" }}
                          />
                          <span className="text-[12px] font-semibold text-foreground">
                            {option.label}
                          </span>
                          {mood === option.id && (
                            <span
                              className="ml-auto h-2 w-2 rounded-full"
                              style={{ background: "var(--brand-accent)" }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setPaletteOpen((o) => !o);
                  setMoodOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-foreground/80 transition-colors hover:text-foreground hover:border-white/20"
                aria-label="Choose color palette"
              >
                <PaletteIcon size={12} style={{ color: "var(--brand-accent)" }} />
                <span className="hidden xl:inline">{palette.name}</span>
                <span className="flex gap-0.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/20"
                    style={{ background: palette.accent }}
                  />
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/20"
                    style={{ background: palette.accent2 }}
                  />
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/20"
                    style={{ background: palette.accent3 }}
                  />
                </span>
              </button>
              <AnimatePresence>
                {paletteOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-card p-2 shadow-2xl z-50"
                  >
                    <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Color palette
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {PALETTES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setPaletteId(p.id);
                            setPaletteOpen(false);
                          }}
                          className={cn(
                            "w-full text-left rounded-xl px-3 py-2.5 transition-colors flex items-center gap-3",
                            paletteId === p.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                          )}
                        >
                          <div className="flex gap-1 shrink-0">
                            <span
                              className="h-6 w-6 rounded-md border border-white/20"
                              style={{ background: p.accent }}
                            />
                            <span
                              className="h-6 w-6 rounded-md border border-white/20 -ml-2"
                              style={{ background: p.accent2 }}
                            />
                            <span
                              className="h-6 w-6 rounded-md border border-white/20 -ml-2"
                              style={{ background: p.accent3 }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-semibold text-foreground truncate">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {p.description}
                            </div>
                          </div>
                          {paletteId === p.id && (
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ background: "var(--brand-accent)" }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a
              href="#pricing"
              className="rounded-full px-4 py-2 text-[13px] font-semibold text-black transition-transform hover:scale-[1.04]"
              style={{ background: "var(--brand-accent)" }}
            >
              Start Project
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden rounded-2xl glass-strong p-4"
            >
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-white/5"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              {/* Palette picker — mobile */}
              <div className="mt-3">
                <div className="px-1 mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Avatar mood
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {MOOD_OPTIONS.map((option) => {
                    const Icon = option.Icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          selectMood(option.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "rounded-lg border px-2 py-2.5 text-center transition-colors",
                          mood === option.id
                            ? "border-[var(--brand-accent)] bg-white/[0.06]"
                            : "border-white/10 bg-white/[0.02]"
                        )}
                      >
                        <Icon
                          size={15}
                          className="mx-auto"
                          style={{ color: "var(--brand-accent)" }}
                        />
                        <span className="mt-1 block text-[10px] font-medium text-foreground/80">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Palette picker — mobile */}
              <div className="mt-3">
                <div className="px-1 mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Color palette
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {PALETTES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPaletteId(p.id)}
                      className={cn(
                        "rounded-lg border px-2 py-2 flex items-center gap-2 text-left transition-colors",
                        paletteId === p.id
                          ? "border-[var(--brand-accent)] bg-white/[0.06]"
                          : "border-white/10 bg-white/[0.02]"
                      )}
                    >
                      <div className="flex gap-0.5 shrink-0">
                        <span
                          className="h-4 w-4 rounded-sm border border-white/20"
                          style={{ background: p.accent }}
                        />
                        <span
                          className="h-4 w-4 rounded-sm border border-white/20 -ml-1.5"
                          style={{ background: p.accent2 }}
                        />
                        <span
                          className="h-4 w-4 rounded-sm border border-white/20 -ml-1.5"
                          style={{ background: p.accent3 }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-foreground/80 truncate">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="mt-3 block rounded-full px-4 py-3 text-center text-sm font-semibold text-black"
                style={{ background: "var(--brand-accent)" }}
              >
                Start Project
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
