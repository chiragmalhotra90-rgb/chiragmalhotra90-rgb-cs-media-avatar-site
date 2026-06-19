"use client";

import { ONBOARDING_DAYS } from "@/lib/site/content";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./problem";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function Onboarding() {
  return (
    <section id="onboarding" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <SectionEyebrow num="06" label="3-day onboarding" />
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
              A client communication system can be{" "}
              <span className="text-gradient-accent">onboarded fast.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              For dental and similar clients, the first implementation can move quickly once inputs
              are confirmed. Three days from intake to a live patient system — replacing four vendors
              with one brief.
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="mt-16 relative">
          {/* Connecting horizontal line */}
          <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4">
            {ONBOARDING_DAYS.map((d, i) => (
              <Reveal key={d.day} delay={i * 0.12}>
                <div className="relative">
                  {/* Node */}
                  <div className="flex items-center gap-3 lg:block">
                    <div
                      className="relative z-10 flex h-[88px] w-[88px] lg:mx-auto flex-col items-center justify-center rounded-full border-2 bg-background"
                      style={{ borderColor: "var(--brand-accent)" }}
                    >
                      <div
                        className="absolute inset-0 rounded-full opacity-20 blur-md"
                        style={{ background: "var(--brand-accent)" }}
                      />
                      <Zap
                        size={14}
                        className="relative"
                        style={{ color: "var(--brand-accent)" }}
                      />
                      <span
                        className="relative font-display text-base font-extrabold uppercase"
                        style={{ color: "var(--brand-accent)" }}
                      >
                        {d.day.replace("Day ", "D")}
                      </span>
                    </div>
                    <div className="lg:hidden flex-1 pb-2">
                      <h3 className="font-display text-xl font-bold">{d.title}</h3>
                    </div>
                  </div>

                  <div className="mt-5 lg:text-center">
                    <h3 className="hidden lg:block font-display text-xl font-bold uppercase tracking-tight">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground lg:mx-auto lg:max-w-[240px]">
                      {d.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5 lg:justify-center">
                      {d.deliverables.map((dv) => (
                        <span
                          key={dv}
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-foreground/70"
                        >
                          {dv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom band */}
        <Reveal delay={0.2}>
          <motion.div
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-7"
          >
            <BandStat stat="3 days" label="to a live patient system" />
            <BandStat stat="1 brief" label="replaces 4 vendors" />
            <BandStat stat="Day 3" label="go-live with the team" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function BandStat({ stat, label }: { stat: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="font-display text-3xl font-extrabold"
        style={{ color: "var(--brand-accent)" }}
      >
        {stat}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
