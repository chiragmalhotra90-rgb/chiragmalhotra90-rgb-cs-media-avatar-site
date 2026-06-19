"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * HeyGenAvatar (LiveAvatar iframe edition)
 *
 * Streams a real human avatar via LiveAvatar's embeddable iframe.
 * LiveAvatar is a HeyGen-powered service that gives us a hosted
 * embed URL — no WebRTC handshake, no SDK, no broken npm packages.
 *
 * Flow:
 *   1. On mount → GET /api/avatar/liveavatar-token?company=CS%20Media
 *      → returns { url, contextId, embedId }
 *   2. Render the URL in an <iframe> sized identically to the
 *      ParticleFace container
 *   3. The iframe handles everything: avatar video, voice, lip-sync,
 *      conversation context (set server-side via the contextPrompt)
 *
 * The avatar speaks for itself — no need for our chat component to
 * call speak(). The iframe has its own chat input where visitors can
 * type or speak to the avatar directly.
 *
 * Ported from cs-media-next/src/components/ai-presenter/AIPresenterViewer.tsx
 * (LiveAvatar embed pattern).
 */

type Props = {
  onSpeakingChange?: (speaking: boolean) => void;
  onError?: (msg: string) => void;
};

export function HeyGenAvatar({ onSpeakingChange, onError }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onSpeakingChangeRef = useRef(onSpeakingChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSpeakingChangeRef.current = onSpeakingChange;
    onErrorRef.current = onError;
  }, [onSpeakingChange, onError]);

  // Boot: fetch embed URL on mount
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setStatus("loading");
      try {
        const res = await fetch(
          "/api/avatar/liveavatar-token?company=" +
            encodeURIComponent("CS Media & Production")
        );
        const data = await res.json();
        if (cancelled) return;
        if (!data.ok) {
          throw new Error(data.error ?? "Could not get LiveAvatar embed URL.");
        }
        setEmbedUrl(data.url);
        setStatus("ready");
      } catch (e: any) {
        if (cancelled) return;
        console.error("[heygen/liveavatar] boot failed", e);
        const msg = e?.message ?? "Could not start the avatar stream.";
        setErrorMsg(msg);
        setStatus("error");
        onErrorRef.current?.(msg);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // The iframe fires postMessage events when the avatar starts/stops
  // talking — we listen for them to drive the HUD's LIVE/IDLE pill.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // LiveAvatar posts events with type fields like "avatar_start_talking"
      // / "avatar_stop_talking" — actual field names vary, so we match loosely.
      const data = event.data;
      if (typeof data !== "object" || data === null) return;
      const type: string =
        data.type || data.event || data.name || "";
      if (type.includes("start_talking") || type.includes("speaking_start")) {
        onSpeakingChangeRef.current?.(true);
      } else if (
        type.includes("stop_talking") ||
        type.includes("speaking_stop") ||
        type.includes("end")
      ) {
        onSpeakingChangeRef.current?.(false);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* The iframe — sized to fill the avatar container, masked into a
          circle so it matches the ParticleFace container shape */}
      {embedUrl && status === "ready" && (
        <motion.iframe
          ref={iframeRef}
          src={embedUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          allow="camera; microphone; autoplay; fullscreen; clipboard-write"
          className="w-full h-full rounded-full border-0"
          style={{
            // Soft brand glow around the avatar
            filter: "drop-shadow(0 0 60px var(--brand-accent-soft))",
            background: "#000",
          }}
          title="CS Media Avatar"
        />
      )}

      {/* Loading state */}
      {status === "loading" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="relative h-32 w-32">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: "var(--brand-accent)" }}
                initial={{ opacity: 0.3, scale: 0.7 + i * 0.15 }}
                animate={{
                  opacity: [0.5, 0, 0.5],
                  scale: [0.7 + i * 0.15, 1.2 + i * 0.15, 0.7 + i * 0.15],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full"
              style={{ background: "var(--brand-accent-soft)" }}
            >
              <Loader2
                size={24}
                className="animate-spin"
                style={{ color: "var(--brand-accent)" }}
              />
            </div>
          </div>
          <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center">
            Starting Live Avatar…
          </div>
          <div className="mt-1 text-[9px] text-muted-foreground/70 text-center max-w-[280px]">
            Connecting to LiveAvatar — this takes ~3 seconds
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
        >
          <AlertCircle size={28} className="text-red-400 mb-3" />
          <div className="text-sm font-semibold text-foreground/90 mb-1">
            Live Avatar unavailable
          </div>
          <div className="text-xs text-muted-foreground max-w-xs">
            {errorMsg || "Could not start the avatar stream."}
          </div>
          <div className="mt-3 text-[10px] text-muted-foreground font-mono">
            Set LIVEAVATAR_API_KEY + LIVEAVATAR_AVATAR_ID in Vercel env vars.
          </div>
        </motion.div>
      )}

      {/* Brand accent ring around the avatar */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 0 0 60px var(--brand-accent-soft), 0 0 80px var(--brand-accent-soft)",
          border: "2px solid var(--brand-accent-soft)",
        }}
      />
    </div>
  );
}
