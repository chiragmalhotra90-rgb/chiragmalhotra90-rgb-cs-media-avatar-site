"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { PALETTES, DEFAULT_PALETTE_ID, Palette } from "@/lib/site/palettes";

type PaletteContextType = {
  palette: Palette;
  paletteId: string;
  setPaletteId: (id: string) => void;
};

const PaletteContext = createContext<PaletteContextType>({
  palette: PALETTES[0],
  paletteId: DEFAULT_PALETTE_ID,
  setPaletteId: () => {},
});

const STORAGE_KEY = "cs-palette-id";

export function PaletteProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage lazily so we don't trigger a cascading render.
  const [paletteId, setPaletteIdState] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_PALETTE_ID;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && PALETTES.some((p) => p.id === saved)) return saved;
    return DEFAULT_PALETTE_ID;
  });

  // Apply palette → CSS variables whenever it changes
  useEffect(() => {
    const p = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0];
    const root = document.documentElement;
    root.style.setProperty("--brand-accent", p.accent);
    root.style.setProperty("--brand-accent-2", p.accent2);
    root.style.setProperty("--brand-accent-3", p.accent3);
    root.style.setProperty("--brand-accent-soft", hexToRgba(p.accent, 0.18));
    document.body.style.backgroundColor = p.bg;
  }, [paletteId]);

  const setPaletteId = (id: string) => {
    setPaletteIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  };

  const palette = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0];

  return (
    <PaletteContext.Provider value={{ palette, paletteId, setPaletteId }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  return useContext(PaletteContext);
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
