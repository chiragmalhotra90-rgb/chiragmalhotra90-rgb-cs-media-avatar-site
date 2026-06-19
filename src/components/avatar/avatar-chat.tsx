"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Volume2, VolumeX, Mic, Square } from "lucide-react";
import {
  personalizeGreeting,
  pickGreeting,
  type Mood,
} from "@/lib/avatar/mood-greetings";
import {
  useVisitorStatus,
  type VisitorStatus,
} from "@/lib/avatar/use-visitor-status";

type Msg = { role: "user" | "assistant"; content: string };

const MOOD_STORAGE_KEY = "cs-mood";
const DEFAULT_MOOD: Mood = "professional";

function isMood(value: string | null): value is Mood {
  return value === "casual" || value === "funny" || value === "professional";
}

function getGreeting(mood: Mood, status: VisitorStatus) {
  return personalizeGreeting(pickGreeting(mood, status));
}

/**
 * AvatarChat
 *
 * Chat input + LLM responses + ElevenLabs TTS (with browser fallback) +
 * real-time amplitude analysis for lip-sync.
 *
 * Voice pipeline:
 *   1. User submits a message → POST /api/avatar/chat → reply string
 *   2. Client POSTs the reply to /api/avatar/tts → MP3 audio bytes
 *      (falls back to browser Web Speech API if TTS route returns 503)
 *   3. Audio is decoded into a Web Audio API AudioBuffer, played through
 *      an AnalyserNode which exposes real-time amplitude data
 *   4. The amplitude is passed up via `onAudioLevel` every frame so the
 *      3D face can deform its mouth particles in sync with the actual
 *      voice — true lip-sync, not synthetic oscillation
 */
export function AvatarChat({
  onSpeakingChange,
  onAudioLevel,
}: {
  onSpeakingChange: (speaking: boolean) => void;
  onAudioLevel?: (level: number) => void;
}) {
  const visitorStatus = useVisitorStatus();
  const initialGreeting = getGreeting(DEFAULT_MOOD, "first-time");
  const [mood, setMood] = useState<Mood>(DEFAULT_MOOD);
  const [greetingVersion, setGreetingVersion] = useState(0);
  const [currentGreeting, setCurrentGreeting] = useState(initialGreeting);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: initialGreeting },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsMode, setTtsMode] = useState<"elevenlabs" | "browser" | "unknown">("unknown");
  const [sttSupported, setSttSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);
  const spokenGreetingRef = useRef<string | null>(null);
  const forceFirstTimeGreetingRef = useRef(false);

  // Web Audio API nodes for amplitude analysis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number>(0);
  const dataArrRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Check on mount which TTS backend is available
  useEffect(() => {
    fetch("/api/avatar/tts", { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.voices?.length) {
          setTtsMode("elevenlabs");
        } else {
          // No voices means no API key — fall back to browser TTS.
          setTtsMode("browser");
        }
      })
      .catch(() => setTtsMode("browser"));

    // STT check
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) setSttSupported(true);

    return () => {
      stopAllAudio();
      if (recogRef.current) {
        try {
          recogRef.current.stop();
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    const savedMood = window.localStorage.getItem(MOOD_STORAGE_KEY);
    if (isMood(savedMood)) setMood(savedMood);

    const onMoodChange = (event: Event) => {
      const detail = (event as CustomEvent<{ mood?: unknown }>).detail;
      const nextMood = typeof detail?.mood === "string" ? detail.mood : null;
      if (!isMood(nextMood)) return;

      forceFirstTimeGreetingRef.current = true;
      spokenGreetingRef.current = null;
      setMood(nextMood);
      setGreetingVersion((version) => version + 1);
    };

    window.addEventListener("cs-mood-change", onMoodChange);
    return () => window.removeEventListener("cs-mood-change", onMoodChange);
  }, []);

  useEffect(() => {
    const status = forceFirstTimeGreetingRef.current
      ? "first-time"
      : visitorStatus;
    const nextGreeting = getGreeting(mood, status);

    forceFirstTimeGreetingRef.current = false;
    setCurrentGreeting(nextGreeting);
    setMessages((existing) => {
      if (
        existing.length <= 1 &&
        (existing.length === 0 || existing[0].role === "assistant")
      ) {
        return [{ role: "assistant", content: nextGreeting }];
      }
      return existing;
    });
  }, [greetingVersion, mood, visitorStatus]);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // ---------- Web Audio setup ----------
  const ensureAudioGraph = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AC =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx: AudioContext = new AC();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      const gain = ctx.createGain();
      gain.gain.value = 1.0;
      analyser.connect(gain);
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      gainRef.current = gain;
      dataArrRef.current = new Uint8Array(
        new ArrayBuffer(analyser.frequencyBinCount)
      );
    } catch (e) {
      // Web Audio unavailable
    }
  }, []);

  const startAmplitudeLoop = useCallback(() => {
    const analyser = analyserRef.current;
    const arr = dataArrRef.current;
    if (!analyser || !arr) return;

    const tick = () => {
      analyser.getByteTimeDomainData(arr);
      // Compute RMS amplitude (0..1)
      let sumSq = 0;
      for (let i = 0; i < arr.length; i++) {
        const v = (arr[i] - 128) / 128;
        sumSq += v * v;
      }
      const rms = Math.sqrt(sumSq / arr.length);
      // Boost so even quiet speech reads visibly
      const level = Math.min(1, rms * 3.2);
      onAudioLevel?.(level);
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [onAudioLevel]);

  const stopAmplitudeLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    onAudioLevel?.(0);
  }, [onAudioLevel]);

  const stopAllAudio = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.onended = null;
        sourceRef.current.stop();
      } catch {}
      try {
        sourceRef.current.disconnect();
      } catch {}
      sourceRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    stopAmplitudeLoop();
    onSpeakingChange(false);
  }, [onSpeakingChange, stopAmplitudeLoop]);

  // ---------- ElevenLabs path ----------
  const speakWithElevenLabs = useCallback(
    async (text: string) => {
      ensureAudioGraph();
      const ctx = audioCtxRef.current;
      const analyser = analyserRef.current;
      if (!ctx || !analyser) return false;

      try {
        const res = await fetch("/api/avatar/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) return false;

        const arrayBuf = await res.arrayBuffer();
        // Resume context if suspended (Chrome autoplay policy)
        if (ctx.state === "suspended") {
          try {
            await ctx.resume();
          } catch {}
        }

        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        // Stop any existing playback
        if (sourceRef.current) {
          try {
            sourceRef.current.onended = null;
            sourceRef.current.stop();
            sourceRef.current.disconnect();
          } catch {}
        }
        const src = ctx.createBufferSource();
        src.buffer = audioBuf;
        src.connect(analyser);
        src.onended = () => {
          stopAmplitudeLoop();
          onSpeakingChange(false);
          try {
            src.disconnect();
          } catch {}
          sourceRef.current = null;
        };
        sourceRef.current = src;
        src.start(0);
        onSpeakingChange(true);
        startAmplitudeLoop();
        return true;
      } catch (e) {
        console.error("[avatar/tts] playback failed", e);
        return false;
      }
    },
    [ensureAudioGraph, onSpeakingChange, startAmplitudeLoop, stopAmplitudeLoop]
  );

  // ---------- Browser fallback (Web Speech API) ----------
  const speakWithBrowser = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return false;
      }
      window.speechSynthesis.cancel();

      const clean = text
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!clean) return false;

      const u = new SpeechSynthesisUtterance(clean);
      const voices = window.speechSynthesis.getVoices();
      const preferredNames = [
        "Google UK English Female",
        "Google US English",
        "Microsoft Aria Online (Natural) - English (United States)",
        "Microsoft Jenny Online (Natural) - English (United States)",
        "Samantha",
        "Karen",
      ];
      for (const name of preferredNames) {
        const v = voices.find((v) => v.name === name);
        if (v) {
          u.voice = v;
          break;
        }
      }
      u.rate = 1.02;
      u.pitch = 1.0;
      u.volume = 1.0;

      // Browser TTS doesn't give us amplitude data, so we synthesize a
      // pseudo-amplitude from utterance boundary events. Not as good as
      // real audio analysis but better than nothing.
      u.onstart = () => {
        onSpeakingChange(true);
        // Synthetic amplitude loop
        const tick = () => {
          if (!sourceRef.current) {
            // Still speaking — emit a noise-modulated level
            const t = performance.now() / 1000;
            const level = 0.4 + 0.4 * Math.abs(Math.sin(t * 14)) + Math.random() * 0.15;
            onAudioLevel?.(Math.min(1, level));
            rafRef.current = requestAnimationFrame(tick);
          }
        };
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      u.onend = () => {
        cancelAnimationFrame(rafRef.current);
        onAudioLevel?.(0);
        onSpeakingChange(false);
      };
      u.onerror = () => {
        cancelAnimationFrame(rafRef.current);
        onAudioLevel?.(0);
        onSpeakingChange(false);
      };
      window.speechSynthesis.speak(u);
      return true;
    },
    [onAudioLevel, onSpeakingChange]
  );

  const speak = useCallback(
    async (text: string) => {
      if (muted) return;
      stopAllAudio();
      // Try ElevenLabs first; fall back to browser TTS
      if (ttsMode === "elevenlabs") {
        const ok = await speakWithElevenLabs(text);
        if (ok) return;
      }
      speakWithBrowser(text);
    },
    [muted, ttsMode, stopAllAudio, speakWithElevenLabs, speakWithBrowser]
  );

  useEffect(() => {
    if (!currentGreeting || muted || ttsMode === "unknown") return;
    if (spokenGreetingRef.current === currentGreeting) return;

    const t = setTimeout(() => {
      spokenGreetingRef.current = currentGreeting;
      speak(currentGreeting);
    }, 900);

    return () => clearTimeout(t);
  }, [currentGreeting, muted, speak, ttsMode]);

  const toggleMute = () => {
    if (!muted) {
      stopAllAudio();
    }
    setMuted((m) => !m);
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setError(null);
    setInput("");

    const userMsg: Msg = { role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setSending(true);

    try {
      const res = await fetch("/api/avatar/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages,
          mood,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Avatar is unavailable. Try again.");
        return;
      }
      const reply: Msg = { role: "assistant", content: data.reply };
      setMessages((m) => [...m, reply]);
      if (!muted) speak(data.reply);
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setSending(false);
    }
  };

  // Mic toggle
  const toggleMic = () => {
    if (!sttSupported) return;
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      if (text) send(text);
    };
    recogRef.current = r;
    try {
      r.start();
    } catch {}
  };

  const suggestions = [
    "What services do you offer?",
    "Show me your portfolio",
    "Tell me about AI video",
    "I need a website + CRM",
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Chat transcript */}
      <div
        ref={scrollRef}
        className="h-[200px] sm:h-[220px] overflow-y-auto rounded-2xl border border-white/[0.06] bg-black/40 backdrop-blur p-4 space-y-3"
        style={{ scrollbarWidth: "thin" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-white/[0.06] text-foreground rounded-br-md"
                    : "text-foreground rounded-bl-md"
                }`}
                style={
                  m.role === "assistant"
                    ? {
                        background: "var(--brand-accent-soft)",
                        border: "1px solid var(--brand-accent-soft)",
                      }
                    : undefined
                }
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-3.5 py-2.5 text-[13px] flex items-center gap-2"
              style={{
                background: "var(--brand-accent-soft)",
                border: "1px solid var(--brand-accent-soft)",
              }}
            >
              <Loader2 size={12} className="animate-spin" style={{ color: "var(--brand-accent)" }} />
              <span className="text-muted-foreground">Avatar is thinking…</span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-[11px] text-red-400">{error}</div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={sending}
              className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-[var(--brand-accent)] transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening…" : "Ask the avatar anything…"}
            disabled={sending || listening}
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--brand-accent)] focus:bg-white/[0.05] disabled:opacity-60"
          />
          {sttSupported && (
            <button
              type="button"
              onClick={toggleMic}
              title="Voice input"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              {listening ? (
                <Square size={12} className="fill-current" style={{ color: "var(--brand-accent)" }} />
              ) : (
                <Mic size={14} className="text-muted-foreground" />
              )}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={toggleMute}
          title={muted ? "Unmute voice" : "Mute voice"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground hover:border-[var(--brand-accent)] transition-colors"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black transition-transform hover:scale-[1.06] disabled:opacity-50 disabled:hover:scale-100"
          style={{ background: "var(--brand-accent)" }}
        >
          <Send size={14} />
        </button>
      </form>

      <div className="mt-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        {muted
          ? "Voice muted — text chat only"
          : ttsMode === "elevenlabs"
            ? "Voice on — ElevenLabs lip-sync"
            : ttsMode === "browser"
              ? "Voice on — browser TTS (set ELEVENLABS_API_KEY for studio voice)"
              : "Initializing voice…"}
      </div>
    </div>
  );
}
