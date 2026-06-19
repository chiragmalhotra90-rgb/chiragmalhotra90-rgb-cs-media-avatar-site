"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from "react";

/**
 * VoiceCommandProvider
 *
 * Global voice command listener. Listens for navigation + control commands
 * and executes them site-wide. Triggered by:
 *   1. The floating mic button (VoiceCommandButton component)
 *   2. Optional wake word "hey CS" (off by default to avoid mic permission prompt)
 *
 * Supported commands:
 *   Navigation:
 *     "open services" / "show services" / "go to services" → #services
 *     "open pricing" / "show pricing"                     → #pricing
 *     "open proof" / "show proof"                         → #proof
 *     "open onboarding" / "show onboarding"               → #onboarding
 *     "open workflow" / "show workflow"                   → #workflow
 *     "open engine" / "show engine"                       → #engine
 *     "go to top" / "back to top"                         → #top
 *   Control:
 *     "stop talking" / "mute"                             → mute avatar
 *     "start talking" / "unmute"                          → unmute avatar
 *     "switch to heygen" / "use heygen"                   → toggle avatar source
 *     "switch to particle" / "use particle"               → toggle avatar source
 */

type VoiceState = {
  listening: boolean;
  supported: boolean;
  lastTranscript: string;
  lastCommand: string;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  /** Register a handler for custom commands. Returns an unsubscribe fn. */
  onCommand: (handler: (cmd: ParsedCommand) => void) => () => void;
};

export type ParsedCommand =
  | { type: "navigate"; href: string; raw: string }
  | { type: "mute"; raw: string }
  | { type: "unmute"; raw: string }
  | { type: "switch-avatar"; source: "particle" | "heygen"; raw: string }
  | { type: "unknown"; raw: string };

const VoiceContext = createContext<VoiceState>({
  listening: false,
  supported: false,
  lastTranscript: "",
  lastCommand: "",
  start: () => {},
  stop: () => {},
  toggle: () => {},
  onCommand: () => () => {},
});

const COMMAND_PATTERNS: { test: (s: string) => boolean; parse: (s: string) => ParsedCommand }[] = [
  // Navigation
  { test: (s) => /\b(services?|service)\b/.test(s) && /\b(open|show|go to|take me to|view)\b/.test(s),
    parse: (s) => ({ type: "navigate", href: "#services", raw: s }) },
  { test: (s) => /\b(pricing|plans?|packages?)\b/.test(s) && /\b(open|show|go to|take me to|view)\b/.test(s),
    parse: (s) => ({ type: "navigate", href: "#pricing", raw: s }) },
  { test: (s) => /\b(proof|portfolio|case stud)/i.test(s) && /\b(open|show|go to|take me to|view)\b/.test(s),
    parse: (s) => ({ type: "navigate", href: "#proof", raw: s }) },
  { test: (s) => /\b(onboarding|onboard)\b/.test(s) && /\b(open|show|go to|take me to|view)\b/.test(s),
    parse: (s) => ({ type: "navigate", href: "#onboarding", raw: s }) },
  { test: (s) => /\b(workflow|process)\b/.test(s) && /\b(open|show|go to|take me to|view)\b/.test(s),
    parse: (s) => ({ type: "navigate", href: "#workflow", raw: s }) },
  { test: (s) => /\b(engine)\b/.test(s) && /\b(open|show|go to|take me to|view)\b/.test(s),
    parse: (s) => ({ type: "navigate", href: "#engine", raw: s }) },
  { test: (s) => /\b(top|home|start|hero)\b/.test(s) && /\b(go to|back to|take me to|scroll to)\b/.test(s),
    parse: (s) => ({ type: "navigate", href: "#top", raw: s }) },
  // Mute
  { test: (s) => /\b(stop talking|stop speaking|mute|shut up|quiet)\b/i.test(s),
    parse: (s) => ({ type: "mute", raw: s }) },
  // Unmute
  { test: (s) => /\b(start talking|start speaking|unmute|talk to me)\b/i.test(s),
    parse: (s) => ({ type: "unmute", raw: s }) },
  // Avatar source
  { test: (s) => /\b(heygen|hey gen|real avatar|live avatar|human avatar)\b/i.test(s) && /\b(switch|use|show|change to)\b/i.test(s),
    parse: (s) => ({ type: "switch-avatar", source: "heygen", raw: s }) },
  { test: (s) => /\b(particle|digital|code avatar|3d avatar)\b/i.test(s) && /\b(switch|use|show|change to)\b/i.test(s),
    parse: (s) => ({ type: "switch-avatar", source: "particle", raw: s }) },
];

export function parseCommand(transcript: string): ParsedCommand {
  const s = transcript.toLowerCase().trim();
  for (const p of COMMAND_PATTERNS) {
    if (p.test(s)) return p.parse(s);
  }
  return { type: "unknown", raw: transcript };
}

export function VoiceCommandProvider({ children }: { children: ReactNode }) {
  const [listening, setListening] = useState(false);
  // Lazy-initialize supported from window — avoids setState-in-effect.
  const [supported] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SR;
  });
  const [lastTranscript, setLastTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const recogRef = useRef<any>(null);
  const handlersRef = useRef<Set<(cmd: ParsedCommand) => void>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = true;
    r.maxAlternatives = 1;

    let finalBuffer = "";

    r.onstart = () => setListening(true);
    r.onend = () => {
      // Auto-restart if user is still in listening mode (Chrome stops after pauses)
      if (listening) {
        try { r.start(); } catch {}
      } else {
        setListening(false);
      }
    };
    r.onerror = (e: any) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      if (e.error === "not-allowed") {
        setListening(false);
        return;
      }
    };
    r.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalBuffer += t + " ";
        } else {
          interim += t;
        }
      }
      const full = (finalBuffer + " " + interim).trim();
      setLastTranscript(full);

      // Try to parse on every update — once we match a command, fire + reset
      const cmd = parseCommand(full);
      if (cmd.type !== "unknown") {
        setLastCommand(cmd.raw);
        handlersRef.current.forEach((h) => h(cmd));
        finalBuffer = "";
        // Stop listening briefly so the avatar can respond
        try { r.stop(); } catch {}
      }
    };

    recogRef.current = r;

    return () => {
      try { r.stop(); } catch {}
    };
  }, [listening]);

  const start = useCallback(() => {
    if (!recogRef.current) return;
    try {
      recogRef.current.start();
    } catch {}
  }, []);

  const stop = useCallback(() => {
    if (!recogRef.current) return;
    try {
      recogRef.current.stop();
    } catch {}
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  const onCommand = useCallback((handler: (cmd: ParsedCommand) => void) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        listening,
        supported,
        lastTranscript,
        lastCommand,
        start,
        stop,
        toggle,
        onCommand,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoiceCommand() {
  return useContext(VoiceContext);
}
