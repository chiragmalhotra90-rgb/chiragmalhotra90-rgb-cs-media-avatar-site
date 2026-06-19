"use client";

import { PAIN_STATS } from "@/lib/site/content";
import { Reveal } from "./reveal";
import { motion } from "framer-motion";

export function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <SectionEyebrow num="01" label="The problem" />
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
              Agencies sell hours.{" "}
              <span className="text-gradient-accent">You buy outcomes.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Every business we meet has the same complaint — their last agency delivered posts, reels,
              and a website, but no system. No follow-up loop. No CRM. No way to know if a single reel
              converted a single customer. The work stops at the asset, the value never compounds.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PAIN_STATS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(600px circle at 50% 0%, var(--brand-accent-soft), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <div
                    className="font-display text-6xl sm:text-7xl font-extrabold leading-none text-gradient-accent"
                  >
                    {p.stat}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-foreground/90">{p.label}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div
              className="hidden sm:block font-display text-5xl font-extrabold"
              style={{ color: "var(--brand-accent)" }}
            >
              ✕
            </div>
            <p className="text-base sm:text-lg text-foreground/90 text-pretty">
              <span className="font-semibold">CS Media does not stop at asset creation.</span>{" "}
              The work moves from strategy to production, then into the website, CRM, communication and
              reporting layer — so every reel, landing page and follow-up is built to convert, not just
              to look good.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono text-xs font-medium px-2 py-1 rounded-md"
        style={{
          color: "var(--brand-accent)",
          background: "var(--brand-accent-soft)",
          border: "1px solid var(--brand-accent-soft)",
        }}
      >
        {num}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
