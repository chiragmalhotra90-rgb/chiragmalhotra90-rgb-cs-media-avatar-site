"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { MARQUEE_TAGS } from "@/lib/site/content";

/**
 * ServiceChips3D
 *
 * Continuous perspective chain of service tags flowing from the
 * viewer (foreground, large) toward the back of the avatar's skull
 * (background, small). Inspired by a reference image showing items
 * arranged in a vanishing-point corridor.
 *
 * Layout:
 *   - Two streams: one on the LEFT of the face, one on the RIGHT
 *   - Each stream is a chain of chips at increasing z-depth
 *   - Closest chips (z near camera) are largest
 *   - Farthest chips (z behind avatar) are smallest, fade out
 *   - Chips flow continuously from near → far, recycling when they
 *     pass the far threshold
 *   - Chips NEVER enter the central face area (a "no-fly zone"
 *     cylinder around the avatar)
 *   - All chips stay within the viewport bounds (clamped to a box)
 *   - Each chip is clickable → smooth-scrolls to its target section
 *
 * The chips are billboarded to always face the camera so the text
 * stays readable.
 */

const NEAR_Z = 1.5;       // closest chip position (in front of viewer)
const FAR_Z = -7;         // farthest chip position (behind avatar)
const FLOW_SPEED = 0.45;  // units/sec, slow drift into the distance
const CHIP_COUNT_PER_STREAM = 9;

// The face occupies a circle of radius ~1.4 in world units centered
// at the origin. Chips must stay outside this radius on the X axis.
const FACE_RADIUS_X = 1.55;

type ChipData = {
  id: number;
  label: string;
  href: string;
  emphasis: boolean;
  // Per-chip state
  z: number;            // current depth
  x: number;            // lateral position (left or right of face)
  y: number;            // vertical position
  baseX: number;        // anchor x (doesn't change)
  baseY: number;        // anchor y (doesn't change)
  rot: number;          // billboard rotation offset (slight tilt)
  hover: number;        // 0..1 hover lerp
  streamSide: "left" | "right";
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Build chip data for one stream (left or right).
 * Chips are distributed evenly between NEAR_Z and FAR_Z.
 */
function buildStream(
  side: "left" | "right",
  startIndex: number,
  viewportW: number,
  viewportH: number
): ChipData[] {
  const chips: ChipData[] = [];
  // X position: outside the face radius, biased toward the screen edge
  // but clamped to stay inside the viewport.
  const edgeBias = Math.min(viewportW * 0.42, 3.2);
  const baseX = side === "left" ? -FACE_RADIUS_X - 0.5 - edgeBias * 0.55 : FACE_RADIUS_X + 0.5 + edgeBias * 0.55;
  const clampedX = Math.max(-viewportW * 0.48, Math.min(viewportW * 0.48, baseX));

  // Pick a subset of tags for this stream
  const tags = MARQUEE_TAGS;
  for (let i = 0; i < CHIP_COUNT_PER_STREAM; i++) {
    const tagIdx = (startIndex + i) % tags.length;
    const tag = tags[tagIdx];
    // Evenly distribute z from near to far
    const zT = i / (CHIP_COUNT_PER_STREAM - 1);
    const z = lerp(NEAR_Z, FAR_Z, zT);
    // Slight vertical variation per chip for organic feel
    const y = lerp(-0.4, 0.4, (i * 0.37) % 1) * 0.7;
    chips.push({
      id: startIndex * 100 + i,
      label: tag.label,
      href: tag.href,
      emphasis: !!tag.emphasis,
      z,
      x: clampedX,
      y,
      baseX: clampedX,
      baseY: y,
      rot: (Math.random() - 0.5) * 0.08,
      hover: 0,
      streamSide: side,
    });
  }
  return chips;
}

function ChipsScene({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Build two streams (left + right) once.
  const allChips = useMemo<ChipData[]>(() => {
    const left = buildStream("left", 0, viewport.width, viewport.height);
    const right = buildStream("right", CHIP_COUNT_PER_STREAM, viewport.width, viewport.height);
    return [...left, ...right];
  }, [viewport.width, viewport.height]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);

    allChips.forEach((c) => {
      // Flow from near → far (deeper into the screen)
      c.z -= FLOW_SPEED * dt;

      // Recycle when past the far threshold
      if (c.z < FAR_Z - 0.5) {
        c.z = NEAR_Z + 0.5;
        // Shuffle to next tag so the chain feels infinite
        const idx = allChips.indexOf(c);
        const tagIdx = (idx + Math.floor(Math.random() * 3)) % MARQUEE_TAGS.length;
        const t = MARQUEE_TAGS[tagIdx];
        c.label = t.label;
        c.href = t.href;
        c.emphasis = !!t.emphasis;
      }

      // Hover lerp
      const targetHover = hoveredId === c.id ? 1 : 0;
      c.hover = lerp(c.hover, targetHover, 0.18);
    });

    if (groupRef.current) {
      // Subtle parallax with pointer
      groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, pointer.x * 0.05, 0.04);
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, -pointer.y * 0.03, 0.04);
    }
  });

  return (
    <group ref={groupRef}>
      {allChips.map((c) => (
        <Chip
          key={c.id}
          chip={c}
          onHover={(h) => setHoveredId(h ? c.id : null)}
          onClick={() => onNavigate(c.href)}
        />
      ))}
    </group>
  );
}

function Chip({
  chip,
  onHover,
  onClick,
}: {
  chip: ChipData;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    // Position: lateral x stays constant (anchored to the stream),
    // z is driven by the chip's flow state
    ref.current.position.set(chip.baseX, chip.baseY, chip.z);

    // Billboard: always face the camera
    ref.current.quaternion.copy(camera.quaternion);
    // Apply a tiny tilt for organic feel
    ref.current.rotateZ(chip.rot);

    // Perspective scale: closer = bigger, farther = smaller
    // Distance from camera (which is at z=6) to chip
    const dist = camera.position.z - chip.z;
    const perspectiveScale = 6 / Math.max(1, dist); // 1.0 at z=0, smaller as z→-7
    const hoverScale = 1 + chip.hover * 0.18;
    const emphasisScale = chip.emphasis ? 1.08 : 1.0;
    ref.current.scale.setScalar(perspectiveScale * hoverScale * emphasisScale);
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        onHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(false);
        onHover(false);
        document.body.style.cursor = "";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <ChipMesh chip={chip} hovered={hovered} />
    </group>
  );
}

function ChipMesh({ chip, hovered }: { chip: ChipData; hovered: boolean }) {
  const texture = useMemo(() => {
    return makeChipTexture(chip.label, chip.emphasis, hovered);
  }, [chip.label, chip.emphasis, hovered]);

  // Read brand accent as a real hex color (Three.js can't use CSS vars)
  const accentColor = useMemo(() => {
    if (typeof window === "undefined") return "#00f0ff";
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-accent")
        .trim() || "#00f0ff"
    );
  }, [hovered]);

  // Fade out chips as they get very far
  const fadeOpacity = useMemo(() => {
    const t = (chip.z - FAR_Z) / (NEAR_Z - FAR_Z);
    return Math.max(0.25, Math.min(1, t * 1.2));
  }, [chip.z]);

  // Chip dimensions
  const w = 1.2 * (chip.emphasis ? 1.08 : 1.0);
  const h = 0.42 * (chip.emphasis ? 1.05 : 1.0);

  // 3D extrusion — fewer, cleaner layers for a refined solid-block look.
  // The extrusion color is a DARKENED version of the chip's own color
  // so it reads as a proper depth shadow (not muddy gray).
  // - Emphasis chips (accent fill) → darker accent for extrusion
  // - Normal chips (dark fill) → even darker for extrusion
  const extrusionLayers = 4;
  const extrusionColor = chip.emphasis
    ? darkenHex(accentColor, 0.5)  // 50% darker accent
    : "#0a0a12";                    // near-black for dark chips

  return (
    <group>
      {/* Extrusion stack — 4 clean layers, tight offset for crisp depth */}
      {Array.from({ length: extrusionLayers }).map((_, i) => {
        const depth = (i + 1) * 0.018;
        return (
          <mesh
            key={`extrude-${i}`}
            position={[depth * 0.5, -depth * 0.8, -depth]}
          >
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial
              color={extrusionColor}
              transparent
              opacity={fadeOpacity * 0.92}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* Front face — the painted chip texture */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={fadeOpacity}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle drop shadow below the chip for grounding */}
      <mesh position={[0.05, -h / 2 - 0.04, -0.02]}>
        <planeGeometry args={[w * 0.95, 0.08]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={fadeOpacity * 0.5}
          depthWrite={false}
        />
      </mesh>

      {/* Hover glow */}
      {chip.hover > 0.05 && (
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[w + 0.12, h + 0.12]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.4 * chip.hover}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Darken a hex color by a factor (0..1, where 0 = black, 1 = original).
 * Used to derive the extrusion color from the chip's accent color so
 * the depth reads as a proper shadow rather than muddy gray.
 */
function darkenHex(hex: string, factor: number): string {
  const h = hex.replace("#", "");
  const r = Math.round(parseInt(h.substring(0, 2), 16) * factor);
  const g = Math.round(parseInt(h.substring(2, 4), 16) * factor);
  const b = Math.round(parseInt(h.substring(4, 6), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Build a canvas texture for a chip with a SOLID colored background
 * (not glassy/transparent). Matches the reference image's flat color
 * blocks. The chip's solid color depends on:
 *   - emphasis chips → brand accent fill with dark text
 *   - normal chips   → dark solid fill with white/accent text
 *   - hovered chips  → bright accent fill with white text
 */
function makeChipTexture(label: string, emphasis: boolean, hovered: boolean): THREE.CanvasTexture {
  const W = 768;
  const H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // Brand color
  const accent =
    (typeof window !== "undefined" &&
      getComputedStyle(document.documentElement)
        .getPropertyValue("--brand-accent")
        .trim()) ||
    "#00f0ff";

  // Rounded background — SOLID color, no transparency
  const r = 128;
  const padding = 8;
  ctx.beginPath();
  ctx.moveTo(padding + r, padding);
  ctx.arcTo(W - padding, padding, W - padding, H - padding, r);
  ctx.arcTo(W - padding, H - padding, padding, H - padding, r);
  ctx.arcTo(padding, H - padding, padding, padding, r);
  ctx.arcTo(padding, padding, W - padding, padding, r);
  ctx.closePath();

  // SOLID FILL — three states. Boosted contrast for readability.
  let fillColor: string;
  let strokeColor: string;
  let textColor: string;
  if (hovered) {
    fillColor = "#ffffff"; // bright white fill on hover for max pop
    strokeColor = accent;
    textColor = "#000000";
  } else if (emphasis) {
    fillColor = accent; // solid accent fill for premium services
    strokeColor = "#ffffff";
    textColor = "#000000";
  } else {
    fillColor = "#16161e"; // solid dark fill (deeper than before)
    strokeColor = "rgba(255,255,255,0.35)"; // brighter border for contrast
    textColor = "#ffffff";
  }
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Stroke (thicker for emphasis/hover to add definition)
  ctx.lineWidth = hovered ? 6 : emphasis ? 5 : 4;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();

  // (Removed the inner gloss — it made chips look busy/muddy.
  // Solid flat fills read cleaner at distance.)

  // Text — large, centered, bold
  ctx.fillStyle = textColor;
  // Auto-fit font size to label length
  const baseSize = emphasis ? 78 : 70;
  let fontSize = baseSize;
  ctx.font = `${emphasis ? 800 : 700} ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
  while (ctx.measureText(label).width > W - 80 && fontSize > 32) {
    fontSize -= 4;
    ctx.font = `${emphasis ? 800 : 700} ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 3D extruded text effect on the chip label itself — layered shadows
  // create depth, matching the reference image's embossed look.
  if (hovered || emphasis) {
    // Dark extrusion under accent-background chips
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    for (let i = 1; i <= 3; i++) {
      ctx.fillText(label, W / 2 + i * 0.8, H / 2 + 2 + i * 0.8);
    }
    ctx.fillStyle = textColor;
    ctx.fillText(label, W / 2, H / 2 + 2);
  } else {
    // Subtle shadow for normal chips
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillText(label, W / 2 + 1, H / 2 + 3);
    ctx.fillStyle = textColor;
    ctx.fillText(label, W / 2, H / 2 + 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export function ServiceChips3D() {
  const navigate = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Soft radial fade — keep the face area readable, fade chips
          slightly toward the screen edges so they don't clash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 55% at 50% 50%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, transparent 75%)",
        }}
      />
      <Canvas
        className="pointer-events-auto"
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ChipsScene onNavigate={navigate} />
      </Canvas>
    </div>
  );
}
