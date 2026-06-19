"use client";

import { WORKFLOW_STEPS } from "@/lib/site/content";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./problem";
import { motion } from "framer-motion";

export function Workflow() {
  return (
    <section id="workflow" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <SectionEyebrow num="04" label="Operating workflow" />
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
              One brief becomes a{" "}
              <span className="text-gradient-accent">full client-facing system.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Five connected phases. Each phase has a clear deliverable and feeds the next. No
              random asset generation — every output is intentional and tied to the loop.
            </p>
          </div>
        </Reveal>

        {/* Desktop horizontal track */}
        <div className="mt-16 hidden lg:block">
          <div className="relative">
            {/* Track line */}
            <div className="absolute top-[42px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="grid grid-cols-5 gap-4">
              {WORKFLOW_STEPS.map((s, i) => (
                <Reveal key={s.no} delay={i * 0.12}>
                  <div className="relative">
                    <div className="flex flex-col items-center">
                      {/* Node */}
                      <div
                        className="relative z-10 flex h-[84px] w-[84px] items-center justify-center rounded-full border bg-background"
                        style={{ borderColor: "var(--brand-accent)" }}
                      >
                        <div
                          className="absolute inset-0 rounded-full opacity-20 blur-md"
                          style={{ background: "var(--brand-accent)" }}
                        />
                        <span
                          className="relative font-display text-2xl font-extrabold"
                          style={{ color: "var(--brand-accent)" }}
                        >
                          {s.no}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-base font-bold uppercase tracking-tight text-center">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground text-center max-w-[220px]">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile vertical track */}
        <div className="mt-12 lg:hidden space-y-4">
          {WORKFLOW_STEPS.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.08}>
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-background"
                    style={{ borderColor: "var(--brand-accent)" }}
                  >
                    <span
                      className="font-display text-base font-extrabold"
                      style={{ color: "var(--brand-accent)" }}
                    >
                      {s.no}
                    </span>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 my-2" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <h3 className="font-display text-base font-bold uppercase tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Summary band */}
        <Reveal delay={0.2}>
          <motion.div
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <SummaryCell title="Strategy → Production" body="Positioning, scripts and visual direction locked before any asset generation begins." />
            <SummaryCell title="Production → Infrastructure" body="Every video, deck and visual connects to a website, CRM pipeline and follow-up flow." />
            <SummaryCell title="Infrastructure → Loop" body="Inquiries, actions and content performance tracked so the next round improves." />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function SummaryCell({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--brand-accent)" }}>
        {title}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
