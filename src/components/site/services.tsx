"use client";

import { SERVICES, Service } from "@/lib/site/content";
import { Reveal } from "./reveal";
import { SectionEyebrow } from "./problem";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function Services() {
  const craft = SERVICES.filter((s) => s.category === "craft");
  const growth = SERVICES.filter((s) => s.category === "growth");
  const ai = SERVICES.filter((s) => s.category === "ai");

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <SectionEyebrow num="03" label="Service architecture" />
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
              Twelve services.{" "}
              <span className="text-gradient-accent">One engine.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Old school craft meets new-era tech. Photography, film, branding,
              marketing, websites, CRM, AI avatars, automation — built as one
              connected system, not fragmented vendor relationships.
            </p>
          </div>
        </Reveal>

        {/* Craft services — traditional media */}
        <Reveal>
          <div className="mt-16 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Craft · Traditional media
            </span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-xs text-muted-foreground">{craft.length} / 12</span>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {craft.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.06}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>

        {/* Growth services */}
        <Reveal>
          <div className="mt-16 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Growth · Marketing & distribution
            </span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-xs text-muted-foreground">{growth.length} / 12</span>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {growth.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.06}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>

        {/* AI services — the new-era stack */}
        <Reveal>
          <div className="mt-16 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              AI · New-era production & automation
            </span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-xs text-muted-foreground">{ai.length} / 12</span>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ai.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.06}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>)[service.icon] ?? Icons.Sparkles;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7"
    >
      {/* Hover gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(500px circle at 50% 0%, var(--brand-accent-soft), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: "var(--brand-accent-soft)",
              border: "1px solid var(--brand-accent-soft)",
            }}
          >
            <Icon size={20} style={{ color: "var(--brand-accent)" }} />
          </div>
          <span
            className="font-mono text-[11px] uppercase tracking-wider px-2 py-1 rounded-md border border-white/10 text-muted-foreground"
          >
            {service.category === "craft" ? "Craft" : service.category === "growth" ? "Growth" : "AI"}
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span
            className="font-display text-2xl font-extrabold opacity-40"
            style={{ color: "var(--brand-accent)" }}
          >
            {service.no}
          </span>
          <h3 className="font-display text-xl font-bold leading-tight">{service.title}</h3>
        </div>

        <p className="mt-2 text-[13px] font-medium" style={{ color: "var(--brand-accent)" }}>
          {service.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.body}</p>

        <ul className="mt-5 space-y-2">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2 text-[13px] text-foreground/80">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full"
                style={{ background: "var(--brand-accent-soft)" }}
              >
                <span
                  className="text-[10px] font-bold"
                  style={{ color: "var(--brand-accent)" }}
                >
                  ✓
                </span>
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Included in retainers
          </span>
          <ArrowUpRight
            size={16}
            className="text-muted-foreground group-hover:text-foreground transition-colors"
          />
        </div>
      </div>
    </motion.div>
  );
}
