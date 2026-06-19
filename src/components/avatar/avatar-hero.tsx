"use client";

import { useState, Suspense, lazy, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ServiceChips3D } from "./service-chips-3d";
import { AvatarChat } from "./avatar-chat";
import { AvatarSourceToggle } from "./avatar-source-toggle";
import { HeyGenAvatar } from "./heygen-avatar";
import { useAvatarSource } from "@/lib/avatar/avatar-source-context";
import { useVoiceCommand, ParsedCommand } from "@/lib/avatar/voice-commands";

// Lazy-load the 3D canvas so the rest of the page paints first.
const ParticleFace = lazy(() =>
  import("./particle-face").then((m) => ({ default: m.ParticleFace }))
);

/**
 * AvatarHero
 *
 * Orchestrates:
 *   - The 3D bouncing service chips behind the avatar
 *   - The avatar itself (Particle face OR HeyGen live stream — toggle)
 *   - The chat UI + LLM + TTS (passes LLM replies to whichever avatar
 *     is active so they're spoken by the right voice)
 *   - Voice commands (start/stop listening, navigate sections, switch avatar)
 *   - HUD overlay (corner brackets + LIVE/IDLE pill)
 */
export function AvatarHero({ heygenAvailable }: { heygenAvailable: boolean }) {
  const { source, setSource } = useAvatarSource();
  const [speaking, setSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const { onCommand } = useVoiceCommand();

  // Wire up voice command handler
  useEffect(() => {
    const unsub = onCommand((cmd: ParsedCommand) => {
      switch (cmd.type) {
        case "navigate": {
          const el = document.querySelector(cmd.href);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        }
        case "switch-avatar":
          setSource(cmd.source);
          break;
        // mute / unmute / unknown are handled by the chat component via
        // its own onCommand subscription.
      }
    });
    return unsub;
  }, [onCommand, setSource]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col items-center justify-center pt-28 pb-12 overflow-hidden"
    >
      {/* 3D bouncing service chips behind the face */}
      <ServiceChips3D />

      {/* Avatar — centered, on top of the chips */}
      <div className="relative z-10 w-full max-w-2xl aspect-square mx-auto">
        <AnimatePresence mode="wait">
          {source === "particle" ? (
            <motion.div
              key="particle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Suspense fallback={<FacePlaceholder loading />}>
                <ParticleFace talking={speaking} audioLevel={audioLevel} />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="heygen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <HeyGenAvatar
                onSpeakingChange={setSpeaking}
                onError={() => {
                  // Auto-fallback to particle on HeyGen failure
                  setSource("particle");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <FaceHud speaking={speaking} source={source} />
      </div>

      {/* Title + chat (below face) */}
      <div className="relative z-10 mt-4 w-full max-w-2xl px-4 text-center">
        {/* Status + source toggle row */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              {speaking && (
                <span
                  className="pulse-dot absolute inline-flex h-full w-full rounded-full"
                  style={{ color: "var(--brand-accent)" }}
                />
              )}
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--brand-accent)" }}
              />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {speaking ? "Avatar speaking…" : "Avatar online · ask anything"}
            </span>
          </motion.div>

          <AvatarSourceToggle />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 font-display font-extrabold uppercase leading-[0.9] tracking-tight text-balance"
        >
          <span className="block text-[clamp(2rem,7vw,4.5rem)] text-3d-white">
            Talk to the
          </span>
          <span className="block text-[clamp(2rem,7vw,4.5rem)] text-3d-accent">
            CS Media Avatar.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-3 max-w-xl text-base sm:text-lg text-3d-white text-pretty"
        >
          Photography, video, AI avatars, websites, CRM, branding, marketing &
          automation — bringing your brand to life under one connected engine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-7"
        >
          {/* When Live Avatar is active, hide the separate chat UI — the
              iframe has its own built-in chat. When particle is active,
              show our chat (which uses ElevenLabs/browser TTS). */}
          {source === "particle" && (
            <AvatarChat
              onSpeakingChange={setSpeaking}
              onAudioLevel={setAudioLevel}
            />
          )}
          {source === "heygen" && (
            <div className="text-xs text-muted-foreground text-center max-w-md mx-auto">
              The live avatar has its own chat — type or speak to it directly inside the frame above.
              Use voice commands (mic button bottom-right) to navigate the site.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 flex justify-center"
        >
          <a
            href="#services"
            className="group inline-flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Or explore the 12 services
            <ArrowDown size={12} className="animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function FacePlaceholder({ loading = false }: { loading?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-48 w-48 sm:h-64 sm:w-64 rounded-full">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: "var(--brand-accent)" }}
            initial={{ opacity: 0.3, scale: 0.7 + i * 0.15 }}
            animate={{ opacity: [0.4, 0, 0.4], scale: [0.7 + i * 0.15, 1.1 + i * 0.15, 0.7 + i * 0.15] }}
            transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle, var(--brand-accent-soft), transparent 70%)" }}
        />
      </div>
    </div>
  );
}

function FaceHud({ speaking, source }: { speaking: boolean; source: string }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 sm:inset-4">
        <Bracket position="tl" />
        <Bracket position="tr" />
        <Bracket position="bl" />
        <Bracket position="br" />
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div
          className="rounded-full px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] flex items-center gap-1.5"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: speaking ? "var(--brand-accent)" : "rgba(255,255,255,0.5)",
            border: `1px solid ${speaking ? "var(--brand-accent)" : "rgba(255,255,255,0.1)"}`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: speaking ? "var(--brand-accent)" : "rgba(255,255,255,0.3)" }}
          />
          {speaking ? "LIVE" : "IDLE"} · {source === "heygen" ? "HEYGEN" : "PARTICLE"}
        </div>
      </div>
    </>
  );
}

function Bracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "top-0 left-0 border-l-2 border-t-2",
    tr: "top-0 right-0 border-r-2 border-t-2",
    bl: "bottom-0 left-0 border-l-2 border-b-2",
    br: "bottom-0 right-0 border-r-2 border-b-2",
  }[position];
  return (
    <div
      className={`absolute h-5 w-5 ${cls}`}
      style={{ borderColor: "var(--brand-accent)", opacity: 0.5 }}
    />
  );
}
