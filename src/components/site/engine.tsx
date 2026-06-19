"use client";

import { ENGINE_STEPS } from "@/lib/site/content";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./problem";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Engine() {
  return (
    <section id="engine" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <SectionEyebrow num="02" label="The CS Media engine" />
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
              One brief.{" "}
              <span className="text-gradient-accent">One engine.</span>{" "}
              A full client-facing system.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Three connected stages turn a brief into a complete growth system. Each stage feeds the
              next — strategy shapes production, production feeds infrastructure, infrastructure
              captures the demand.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {ENGINE_STEPS.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.15}>
              <div className="relative h-full">
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 h-full">
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-[0.08] blur-2xl"
                    style={{ background: "var(--brand-accent)" }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <span
                        className="font-display text-5xl font-extrabold opacity-30"
                        style={{ color: "var(--brand-accent)" }}
                      >
                        {s.no}
                      </span>
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{
                          background: "var(--brand-accent-soft)",
                          border: "1px solid var(--brand-accent)",
                        }}
                      >
                        <ArrowRight size={16} style={{ color: "var(--brand-accent)" }} />
                      </div>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-foreground/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Outcome band */}
        <Reveal delay={0.2}>
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="mt-10 relative overflow-hidden rounded-2xl p-8 sm:p-10"
            style={{
              background:
                "linear-gradient(120deg, var(--brand-accent-soft), transparent 60%)",
              border: "1px solid var(--brand-accent-soft)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-2">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  The outcome
                </div>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-bold leading-tight text-balance">
                  Every reel, every landing page, and every follow-up message is built to{" "}
                  <span style={{ color: "var(--brand-accent)" }}>convert</span>, not just to look good.
                </p>
              </div>
              <div className="flex sm:justify-end">
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                  style={{ background: "var(--brand-accent)" }}
                >
                  See what we build
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
