"use client";

import { Reveal } from "./reveal";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Globe, MessageCircle } from "lucide-react";

export function CTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-14 text-center"
            style={{
              background:
                "radial-gradient(1000px circle at 50% 0%, var(--brand-accent-soft), transparent 65%)",
            }}
          >
            {/* Decorative grid */}
            <div className="absolute inset-0 grid-bg opacity-30 mask-fade-b pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="pulse-dot absolute inline-flex h-full w-full rounded-full"
                    style={{ color: "var(--brand-accent)" }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--brand-accent)" }}
                  />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Booking paid discovery sprints · Q2 2026
                </span>
              </div>

              <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] text-balance">
                Ready to let AI build your{" "}
                <span className="text-gradient-accent">growth system?</span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground text-pretty">
                Book a 1-week paid discovery sprint. We audit your business, map your growth system,
                and hand you a roadmap you can act on — whether or not you continue with us.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:media.production.cs@gmail.com?subject=Paid%20Discovery%20Sprint"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                  style={{ background: "var(--brand-accent)" }}
                >
                  Book Discovery Sprint — ₹25K
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#proof"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/[0.08]"
                >
                  Review the proof of work first
                </a>
              </div>

              {/* Quick contact options */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
                <a
                  href="https://csmediaandproduction.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Globe size={13} /> csmediaandproduction.in
                </a>
                <a
                  href="mailto:media.production.cs@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Mail size={13} /> media.production.cs@gmail.com
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle size={13} /> WhatsApp-ready onboarding
                </span>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="relative h-8 w-8">
                <div
                  className="absolute inset-0 rounded-md"
                  style={{ background: "var(--brand-accent)", opacity: 0.18 }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center font-display text-base font-extrabold"
                  style={{ color: "var(--brand-accent)" }}
                >
                  CS
                </div>
              </div>
              <div className="font-display text-sm font-extrabold uppercase tracking-tight">
                CS_Media
                <span style={{ color: "var(--brand-accent)" }}>&Prod</span>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              The Autonomous Production House. AI-powered content, video, websites, CRM, AI presenters
              and branded growth assets — built under one connected engine for doctors, founders,
              brands and sports IPs.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Navigate
            </h4>
            <ul className="mt-4 space-y-2.5">
              {[
                ["Engine", "#engine"],
                ["Services", "#services"],
                ["Workflow", "#workflow"],
                ["Proof of Work", "#proof"],
                ["Pricing", "#pricing"],
              ].map(([l, h]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://csmediaandproduction.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Globe size={12} /> csmediaandproduction.in
                </a>
              </li>
              <li>
                <a
                  href="mailto:media.production.cs@gmail.com"
                  className="text-foreground/70 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail size={12} /> media.production.cs@gmail.com
                </a>
              </li>
              <li className="text-foreground/70 inline-flex items-center gap-1.5">
                <MessageCircle size={12} /> WhatsApp onboarding
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} CS Media & Production. All rights reserved.</div>
          <div className="font-mono uppercase tracking-wider">
            Built in under 90 days · 410 records · 8 case studies
          </div>
        </div>
      </div>
    </footer>
  );
}
