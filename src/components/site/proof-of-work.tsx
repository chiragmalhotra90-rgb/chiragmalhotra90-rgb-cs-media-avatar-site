"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROOF_STATS, PROOF_MIX, CASE_STUDIES, VERTICALS } from "@/lib/site/content";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./problem";
import { Counter } from "./counter";
import { ArrowUpRight } from "lucide-react";

export function ProofOfWork() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((c) => c.verticalKey === filter);

  return (
    <section id="proof" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <SectionEyebrow num="05" label="Proof of work" />
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
              The volume is already{" "}
              <span className="text-gradient-accent">real enough to sell.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              410 generation records, 8 case studies across 6 verticals — built inside a 69-day work
              window. Not a five-year pitch. A production habit, not a one-off experiment.
            </p>
          </div>
        </Reveal>

        {/* Stats grid */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PROOF_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="glass rounded-2xl p-5 sm:p-6 h-full">
                <div
                  className="font-display text-4xl sm:text-5xl font-extrabold leading-none"
                  style={{ color: "var(--brand-accent)" }}
                >
                  <Counter to={s.value} />
                </div>
                <div className="mt-2 text-sm font-medium text-foreground/90">{s.label}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{s.note}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Production mix breakdown bar */}
        <Reveal delay={0.15}>
          <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                Production mix by record count
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                N = 410 records
              </span>
            </div>

            {/* Stacked bar */}
            <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full">
              {PROOF_MIX.map((m, i) => {
                const total = PROOF_MIX.reduce((a, b) => a + b.count, 0);
                const pct = (m.count / total) * 100;
                return (
                  <motion.div
                    key={m.label}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: m.color }}
                    title={`${m.label} — ${m.count}`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {PROOF_MIX.map((m) => (
                <div key={m.label} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: m.color }}
                  />
                  <span className="text-foreground/80 flex-1">{m.label}</span>
                  <span className="font-mono text-muted-foreground">{m.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Case studies */}
        <Reveal>
          <div className="mt-16 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Case studies · 8 projects · 6 verticals
              </div>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
                The portfolio, at a glance.
              </h3>
            </div>
            <a
              href="#pricing"
              className="text-sm font-medium text-foreground/80 hover:text-foreground inline-flex items-center gap-1"
            >
              Start your own case study <ArrowUpRight size={14} />
            </a>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal>
          <div className="mt-6 flex flex-wrap gap-2">
            {VERTICALS.map((v) => (
              <button
                key={v.key}
                onClick={() => setFilter(v.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all border ${
                  filter === v.key
                    ? "text-black border-transparent"
                    : "text-muted-foreground border-white/10 bg-white/[0.02] hover:text-foreground hover:border-white/20"
                }`}
                style={filter === v.key ? { background: "var(--brand-accent)" } : undefined}
              >
                {v.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Case grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <CaseCard case={c} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ case: c }: { case: typeof CASE_STUDIES[number] }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
    >
      {/* Accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: c.accent }}
      />
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at 50% 0%, ${c.accent}22, transparent 60%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 rounded-md"
            style={{
              color: c.accent,
              background: `${c.accent}18`,
            }}
          >
            {c.vertical}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            CASE {c.no} / 08
          </span>
        </div>

        <h4 className="mt-4 font-display text-lg font-bold leading-snug text-balance">
          {c.title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4">
          {c.blurb}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {c.deliverables.slice(0, 4).map((d) => (
            <span
              key={d}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-foreground/70"
            >
              {d}
            </span>
          ))}
        </div>

        {c.result && (
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Outcome
            </div>
            <div className="mt-1 text-sm font-medium" style={{ color: c.accent }}>
              {c.result}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
