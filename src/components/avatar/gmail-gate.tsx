"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

type GateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "returning"; accessedAt?: string }
  | { status: "granted"; email: string };

export function GmailGate({ onGranted }: { onGranted: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<GateState>({ status: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/avatar/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.ok) {
        setState({ status: "error", message: data.error ?? "Could not verify email." });
        return;
      }

      if (data.isNew) {
        setState({ status: "granted", email });
        // Small delay so the user reads the success state before the avatar mounts.
        setTimeout(() => onGranted(data.email), 1100);
      } else {
        setState({
          status: "returning",
          accessedAt: data.accessedAt,
        });
      }
    } catch {
      setState({
        status: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{ background: "rgba(5,5,12,0.85)", backdropFilter: "blur(18px)" }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-card p-8"
        style={{
          boxShadow:
            "0 0 60px var(--brand-accent-soft), 0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Top glow strip */}
        <div
          className="absolute -top-px left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--brand-accent), transparent)",
          }}
        />
        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-3 h-3 border-l border-t" style={{ borderColor: "var(--brand-accent)" }} />
        <div className="absolute top-3 right-3 w-3 h-3 border-r border-t" style={{ borderColor: "var(--brand-accent)" }} />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b" style={{ borderColor: "var(--brand-accent)" }} />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b" style={{ borderColor: "var(--brand-accent)" }} />

        <AnimatePresence mode="wait">
          {(state.status === "idle" || state.status === "loading" || state.status === "error") && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: "var(--brand-accent-soft)" }}
                >
                  <Sparkles size={16} style={{ color: "var(--brand-accent)" }} />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Live Avatar Access
                  </div>
                  <div className="font-display text-base font-bold">CS_Media&Prod</div>
                </div>
              </div>

              <h2 className="mt-6 font-display text-2xl font-extrabold uppercase tracking-tight leading-tight">
                Talk to the{" "}
                <span className="text-gradient-accent">CS Media Avatar.</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground text-pretty">
                One conversation per email. The avatar will walk you through our
                services, proof of work, and pricing — and answer anything you want
                to ask before booking a paid discovery sprint.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-3">
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state.status === "error") setState({ status: "idle" });
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--brand-accent)] focus:bg-white/[0.05]"
                  />
                </div>

                {state.status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400"
                  >
                    {state.message}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={state.status === "loading"}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                  style={{ background: "var(--brand-accent)" }}
                >
                  {state.status === "loading" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Start Avatar Session
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck size={12} style={{ color: "var(--brand-accent)" }} />
                One session per email. We log the email + timestamp only — no password,
                no spam.
              </div>
            </motion.div>
          )}

          {state.status === "granted" && (
            <motion.div
              key="granted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--brand-accent-soft)" }}
              >
                <ShieldCheck size={28} style={{ color: "var(--brand-accent)" }} />
              </motion.div>
              <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight">
                Access granted
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Bringing the avatar online for{" "}
                <span className="text-foreground font-medium">{state.email}</span>…
              </p>
              <div className="mt-4 flex justify-center">
                <Loader2 size={18} className="animate-spin text-muted-foreground" />
              </div>
            </motion.div>
          )}

          {state.status === "returning" && (
            <motion.div
              key="returning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--brand-accent-soft)" }}
              >
                <Sparkles size={26} style={{ color: "var(--brand-accent)" }} />
              </motion.div>
              <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight">
                You&apos;ve already met the avatar.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground text-pretty">
                Each email gets one live avatar session. Yours was on{" "}
                {state.accessedAt
                  ? new Date(state.accessedAt).toLocaleString()
                  : "a previous visit"}
                . You can still explore the full site below — or book a paid
                discovery sprint to take it further.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href="#engine"
                  className="rounded-xl px-5 py-3 text-center text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                  style={{ background: "var(--brand-accent)" }}
                >
                  Explore the site
                </a>
                <a
                  href="#pricing"
                  className="rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-semibold text-foreground hover:bg-white/[0.06] transition-colors"
                >
                  Book paid discovery
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
