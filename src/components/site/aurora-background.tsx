"use client";

/**
 * Fixed full-viewport aurora background — three blurred gradient blobs
 * that drift slowly. Sits behind everything (z -10).
 * Color follows the active mood via CSS variables.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Base radial wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 50% -10%, rgba(255,255,255,0.04), transparent 60%), radial-gradient(800px 600px at 100% 100%, var(--brand-accent-soft), transparent 60%)",
        }}
      />

      {/* Drifting blobs */}
      <div className="aurora-blob aurora-blob-1" style={{ width: 540, height: 540, top: "-10%", left: "-5%" }} />
      <div className="aurora-blob aurora-blob-2" style={{ width: 620, height: 620, bottom: "-15%", right: "-10%" }} />
      <div className="aurora-blob aurora-blob-3" style={{ width: 420, height: 420, top: "40%", left: "50%" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40 mask-fade-b" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
