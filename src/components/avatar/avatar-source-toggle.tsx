"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { useAvatarSource } from "@/lib/avatar/avatar-source-context";
import { cn } from "@/lib/utils";

/**
 * AvatarSourceToggle
 *
 * Small pill switch in the hero area that flips between:
 *   - Particle (built-in 3D digital-code face)
 *   - HeyGen   (live human avatar stream)
 *
 * Only renders if both sources are available. If HeyGen isn't
 * configured, the toggle is hidden and the particle face is the
 * only option.
 */
export function AvatarSourceToggle() {
  const { source, setSource, heygenAvailable } = useAvatarSource();

  if (!heygenAvailable) return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
      <button
        onClick={() => setSource("particle")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
          source === "particle" ? "text-black" : "text-muted-foreground hover:text-foreground"
        )}
        style={source === "particle" ? { background: "var(--brand-accent)" } : undefined}
      >
        <Sparkles size={11} />
        Particle
      </button>
      <button
        onClick={() => setSource("heygen")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
          source === "heygen" ? "text-black" : "text-muted-foreground hover:text-foreground"
        )}
        style={source === "heygen" ? { background: "var(--brand-accent)" } : undefined}
      >
        <User size={11} />
        Live HeyGen
      </button>
    </div>
  );
}
