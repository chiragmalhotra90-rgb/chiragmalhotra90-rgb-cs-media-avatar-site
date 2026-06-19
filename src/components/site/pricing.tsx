"use client";

import { PLANS, DISCOVERY } from "@/lib/site/content";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./problem";
import { motion } from "framer-motion";
import { Check, ArrowRight, Calendar } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <SectionEyebrow num="07" label="Packages" />
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
              Three ways to{" "}
              <span className="text-gradient-accent">engage CS Media.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Every engagement starts with a paid discovery sprint. After that, pick the retainer or
              partner model that fits your stage. No hourly billing, no surprises.
            </p>
          </div>
        </Reveal>

        {/* Plans grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </div>

        {/* Discovery sprint callout */}
        <Reveal delay={0.15}>
          <motion.div
            className="mt-8 relative overflow-hidden rounded-2xl border p-6 sm:p-8"
            style={{
              borderColor: "var(--brand-accent-soft)",
              background:
                "linear-gradient(120deg, var(--brand-accent-soft), transparent 60%)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: "var(--brand-accent)" }} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    Step 1 · Before anything else
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
                  {DISCOVERY.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground text-pretty max-w-2xl">
                  {DISCOVERY.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {DISCOVERY.bullets.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:text-right">
                <div className="flex items-baseline gap-2 justify-start lg:justify-end">
                  <span
                    className="font-display text-5xl font-extrabold"
                    style={{ color: "var(--brand-accent)" }}
                  >
                    {DISCOVERY.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{DISCOVERY.unit}</span>
                </div>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                  style={{ background: "var(--brand-accent)" }}
                >
                  Book Discovery Sprint
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
            All prices INR · ex-GST · retainers billed monthly · cancel with 30-day notice
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative h-full overflow-hidden rounded-2xl border p-7 flex flex-col ${
        plan.featured
          ? "border-[var(--brand-accent)]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
      style={
        plan.featured
          ? {
              background: "linear-gradient(180deg, var(--brand-accent-soft), transparent 50%)",
              boxShadow: "0 0 40px var(--brand-accent-soft)",
            }
          : undefined
      }
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black"
            style={{ background: "var(--brand-accent)" }}
          >
            {plan.badge}
          </span>
        </div>
      )}

      <div className="relative flex-1">
        <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

        <div className="mt-6 flex items-baseline gap-2">
          <span
            className="font-display text-4xl sm:text-5xl font-extrabold"
            style={{ color: plan.featured ? "var(--brand-accent)" : "var(--foreground)" }}
          >
            {plan.price}
          </span>
          <span className="text-xs text-muted-foreground">{plan.unit}</span>
        </div>

        <div className="mt-6 h-px bg-white/10" />

        <ul className="mt-5 space-y-3">
          {plan.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2.5 text-sm">
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--brand-accent-soft)" }}
              >
                <Check
                  size={10}
                  style={{ color: "var(--brand-accent)" }}
                  strokeWidth={3}
                />
              </span>
              <span
                className={
                  inc.endsWith(":")
                    ? "font-semibold text-foreground"
                    : "text-foreground/80"
                }
              >
                {inc}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#contact"
        className={`relative mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02] ${
          plan.featured ? "text-black" : "border border-white/15 text-foreground hover:bg-white/[0.06]"
        }`}
        style={plan.featured ? { background: "var(--brand-accent)" } : undefined}
      >
        {plan.cta}
        <ArrowRight size={14} />
      </a>
    </motion.div>
  );
}
