"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor — a soft outline dot that lerps toward the mouse,
 * with a hover-grow state on interactive elements.
 * Hidden on touch devices via CSS media query.
 *
 * Implementation notes: all per-frame updates happen directly on the DOM
 * via refs (no React state), so we avoid setState-in-effect cascading renders.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let raf = 0;
    let hovering = false;
    let down = false;

    const applyHover = () => {
      cursor.style.width = hovering ? "44px" : "22px";
      cursor.style.height = hovering ? "44px" : "22px";
      cursor.style.background = hovering ? "var(--brand-accent-soft)" : "transparent";
      dot.style.opacity = hovering ? "0" : "1";
    };
    const applyDown = () => {
      cursor.style.transform = `translate(-50%, -50%) scale(${down ? 0.85 : 1})`;
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
      const t = e.target as HTMLElement;
      const interactive = !!t.closest(
        "a, button, [role='button'], input, textarea, select, label, .cursor-hover"
      );
      if (interactive !== hovering) {
        hovering = interactive;
        applyHover();
      }
    };
    const onDown = () => {
      down = true;
      applyDown();
    };
    const onUp = () => {
      down = false;
      applyDown();
    };

    applyHover();
    applyDown();

    const loop = () => {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.left = curX + "px";
      cursor.style.top = curY + "px";
      raf = requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.classList.add("hide-cursor");

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("hide-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden
        className="cs-cursor pointer-events-none fixed z-[9999]"
        style={{
          width: 22,
          height: 22,
          borderRadius: "9999px",
          border: "1.5px solid var(--brand-accent)",
          background: "transparent",
          mixBlendMode: "screen",
          transform: "translate(-50%, -50%)",
          transition: "transform 120ms ease, width 200ms ease, height 200ms ease, background 200ms ease",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="cs-cursor pointer-events-none fixed z-[9999]"
        style={{
          width: 5,
          height: 5,
          borderRadius: "9999px",
          background: "var(--brand-accent)",
          opacity: 1,
          transform: "translate(-50%, -50%)",
          transition: "opacity 200ms ease",
        }}
      />
      <style>{`
        @media (pointer: coarse) {
          .cs-cursor { display: none !important; }
        }
      `}</style>
    </>
  );
}
