"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import { useVoiceCommand } from "@/lib/avatar/voice-commands";

/**
 * VoiceCommandButton
 *
 * Floating mic button at the bottom-right of the viewport. Toggles the
 * global voice command listener. Shows the live transcript in a small
 * bubble above the button while listening.
 *
 * Also handles permission errors gracefully with an inline message.
 */
export function VoiceCommandButton() {
  const { listening, supported, lastTranscript, toggle, lastCommand } = useVoiceCommand();
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!supported) return;
    // Check permission state
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((p) => {
          if (p.state === "denied") setDenied(true);
          p.onchange = () => setDenied(p.state === "denied");
        })
        .catch(() => {});
    }
  }, [supported]);

  if (!supported) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[120] flex flex-col items-end gap-2">
      {/* Transcript bubble while listening */}
      <AnimatePresence>
        {listening && (lastTranscript || lastCommand) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-w-xs rounded-2xl rounded-br-md border border-white/10 bg-card/90 backdrop-blur px-4 py-2.5 shadow-xl"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Listening…
            </div>
            <div className="text-[13px] text-foreground/90 leading-snug">
              {lastTranscript || "Say a command like 'open services'"}
            </div>
            {lastCommand && (
              <div className="mt-1.5 text-[10px] font-medium" style={{ color: "var(--brand-accent)" }}>
                ✓ {lastCommand}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission denied message */}
      <AnimatePresence>
        {denied && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="max-w-xs rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur px-4 py-2.5 text-xs text-red-200"
          >
            Microphone access blocked. Enable it in your browser settings to use voice commands.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command hints when listening but no transcript yet */}
      <AnimatePresence>
        {listening && !lastTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-right text-[10px] text-muted-foreground"
          >
            <div className="font-mono uppercase tracking-[0.2em] mb-1">Try saying</div>
            <div>"open services"</div>
            <div>"show pricing"</div>
            <div>"switch to heygen"</div>
            <div>"stop talking"</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The button */}
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 backdrop-blur transition-colors"
        style={{
          background: listening ? "var(--brand-accent)" : "rgba(0,0,0,0.6)",
          borderColor: listening ? "var(--brand-accent)" : "rgba(255,255,255,0.15)",
          color: listening ? "#000" : "var(--brand-accent)",
        }}
        aria-label={listening ? "Stop voice command" : "Start voice command"}
        title={listening ? "Listening — say a command" : "Click to give a voice command"}
      >
        {/* Pulse ring when listening */}
        {listening && (
          <motion.span
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: "var(--brand-accent)" }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {listening ? <Mic size={20} /> : <MicOff size={20} />}
      </motion.button>
    </div>
  );
}
