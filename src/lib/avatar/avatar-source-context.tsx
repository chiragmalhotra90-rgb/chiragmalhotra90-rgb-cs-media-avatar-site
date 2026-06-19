"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/**
 * AvatarSourceProvider
 *
 * Tracks which avatar the visitor is currently viewing:
 *   - "particle" : the built-in 3D particle face (always available, zero cost)
 *   - "heygen"   : the HeyGen streaming avatar (requires HEYGEN_API_KEY)
 *
 * Defaults to "particle". Visitors can switch via:
 *   1. The toggle in the hero (AvatarSourceToggle component)
 *   2. Voice command "switch to heygen" / "switch to particle"
 *
 * Selection persists in localStorage so a returning visitor sees the
 * same avatar they last chose.
 */

export type AvatarSource = "particle" | "heygen";

type Ctx = {
  source: AvatarSource;
  setSource: (s: AvatarSource) => void;
  toggle: () => void;
  heygenAvailable: boolean;
};

const AvatarSourceContext = createContext<Ctx>({
  source: "particle",
  setSource: () => {},
  toggle: () => {},
  heygenAvailable: false,
});

const STORAGE_KEY = "cs-avatar-source";

export function AvatarSourceProvider({
  children,
  heygenAvailable,
}: {
  children: ReactNode;
  heygenAvailable: boolean;
}) {
  const [source, setSourceState] = useState<AvatarSource>(() => {
    if (typeof window === "undefined") return "particle";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "heygen" || saved === "particle") return saved;
    return "particle";
  });

  // If HeyGen becomes unavailable while heygen is selected, fall back to particle.
  // Use lazy state initializer pattern — recompute source on every render if
  // conditions change. Avoids setState-in-effect cascading renders.
  const effectiveSource: AvatarSource =
    source === "heygen" && !heygenAvailable ? "particle" : source;

  const setSource = (s: AvatarSource) => {
    if (s === "heygen" && !heygenAvailable) return;
    setSourceState(s);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, s);
    }
  };

  const toggle = () =>
    setSource(effectiveSource === "particle" ? "heygen" : "particle");

  return (
    <AvatarSourceContext.Provider
      value={{
        source: effectiveSource,
        setSource,
        toggle,
        heygenAvailable,
      }}
    >
      {children}
    </AvatarSourceContext.Provider>
  );
}

export function useAvatarSource() {
  return useContext(AvatarSourceContext);
}
