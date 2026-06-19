"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ParticleFace
 *
 * A stylized "digital code" head made of ~5,000 particles arranged on
 * an ellipsoid (head shape), with two brighter eye clusters and a
 * subtle nose ridge. Particles oscillate continuously (idle breath),
 * and oscillate harder around the mouth area when the avatar is
 * "talking" (driven by the `talking` prop, which is a 0..1 intensity).
 *
 * All particles use the brand-accent CSS variable color so they
 * retint automatically when the mood engine switches.
 */

type ParticleFaceProps = {
  talking: boolean; // is the avatar currently speaking?
  audioLevel?: number; // 0..1, optional real-time audio amplitude for lip-sync
};

const HEAD_HEIGHT = 2.4;
const HEAD_WIDTH = 1.6;
const HEAD_DEPTH = 1.7;
const PARTICLE_COUNT = 5200;

function headShape(u: number, v: number, target: THREE.Vector3) {
  // u in [0, 2π], v in [0, π]
  // Standard ellipsoid, then nudge to suggest a face.
  const theta = u;
  const phi = v;

  let x = HEAD_WIDTH * Math.sin(phi) * Math.cos(theta);
  let y = HEAD_HEIGHT * Math.cos(phi);
  let z = HEAD_DEPTH * Math.sin(phi) * Math.sin(theta);

  // Chin taper (narrower at the bottom)
  const chinTaper = THREE.MathUtils.clamp(
    (y + HEAD_HEIGHT * 0.5) / HEAD_HEIGHT,
    0.55,
    1
  );
  x *= chinTaper;
  z *= chinTaper * 0.95;

  // Slightly flatten the back of the head
  if (z < 0) z *= 0.92;

  // Forehead bulge
  if (y > 0.4 && z > 0) {
    z += 0.08 * (1 - Math.abs(y - 0.7));
  }

  target.set(x, y, z);
}

function fibonacciSpherePoints(n: number): { pos: THREE.Vector3; isEye: boolean; isMouth: boolean; isEdge: boolean }[] {
  const points: { pos: THREE.Vector3; isEye: boolean; isMouth: boolean; isEdge: boolean }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2; // 1 → -1
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;

    // Map (y, theta) to (u, v) for headShape
    const v = Math.acos(THREE.MathUtils.clamp(y, -1, 1)); // 0..π
    const u = theta % (Math.PI * 2); // 0..2π

    const pos = new THREE.Vector3();
    headShape(u, v, pos);

    // Eye positions: two clusters around y≈0.25, z≈+1.0, x≈±0.45
    const eyeY = 0.25;
    const eyeZ = HEAD_DEPTH * 0.6;
    const eyeX = 0.45;
    const eyeRadius = 0.22;

    const distLeftEye = Math.hypot(pos.x - (-eyeX), pos.y - eyeY, pos.z - eyeZ);
    const distRightEye = Math.hypot(pos.x - eyeX, pos.y - eyeY, pos.z - eyeZ);
    const isEye =
      (distLeftEye < eyeRadius && pos.z > 0.4) ||
      (distRightEye < eyeRadius && pos.z > 0.4);

    // Mouth area: a horizontal band below the eyes on the front
    const isMouth =
      pos.y > -0.55 &&
      pos.y < -0.2 &&
      pos.z > HEAD_DEPTH * 0.55 &&
      Math.abs(pos.x) < 0.45;

    // Edge particles (silhouette emphasis) — particles near the profile plane
    const isEdge = Math.abs(pos.z) < 0.18 && Math.abs(pos.x) > HEAD_WIDTH * 0.7;

    points.push({ pos, isEye, isMouth, isEdge });
  }
  return points;
}

function FaceMesh({ talking, audioLevel = 0 }: ParticleFaceProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const eyeRef = useRef<THREE.Points>(null);
  const eyeMatRef = useRef<THREE.PointsMaterial>(null);
  const { viewport } = useThree();

  // Generate particle geometry once.
  const { positions, basePositions, flags, eyePositions, wirePositions } = useMemo(() => {
    const pts = fibonacciSpherePoints(PARTICLE_COUNT);
    const positions = new Float32Array(pts.length * 3);
    const basePositions = new Float32Array(pts.length * 3);
    const flags = new Float32Array(pts.length); // 0 = normal, 1 = mouth, 2 = edge

    const eyePts: THREE.Vector3[] = [];

    pts.forEach((p, i) => {
      positions[i * 3 + 0] = p.pos.x;
      positions[i * 3 + 1] = p.pos.y;
      positions[i * 3 + 2] = p.pos.z;
      basePositions[i * 3 + 0] = p.pos.x;
      basePositions[i * 3 + 1] = p.pos.y;
      basePositions[i * 3 + 2] = p.pos.z;

      if (p.isMouth) flags[i] = 1;
      else if (p.isEdge) flags[i] = 2;
      else flags[i] = 0;

      if (p.isEye) eyePts.push(p.pos.clone());
    });

    // Wireframe geometry — connect each particle to its 3 nearest neighbours
    // (subset only, to keep it readable).
    const wirePositions: number[] = [];
    const sampleStride = 12;
    for (let i = 0; i < pts.length; i += sampleStride) {
      const a = pts[i].pos;
      // Find 2 nearest neighbours ahead of i
      const candidates: { j: number; d: number }[] = [];
      for (let j = i + 1; j < Math.min(pts.length, i + 200); j++) {
        const b = pts[j].pos;
        const d = a.distanceTo(b);
        if (d < 0.45) candidates.push({ j, d });
      }
      candidates.sort((x, y) => x.d - y.d);
      for (let k = 0; k < Math.min(2, candidates.length); k++) {
        const b = pts[candidates[k].j].pos;
        wirePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }

    // Eye particles: brighter, fewer
    const eyePositions = new Float32Array(eyePts.length * 3);
    eyePts.forEach((p, i) => {
      eyePositions[i * 3 + 0] = p.x;
      eyePositions[i * 3 + 1] = p.y;
      eyePositions[i * 3 + 2] = p.z;
    });

    return {
      positions,
      basePositions,
      flags,
      eyePositions: eyePositions,
      wirePositions: new Float32Array(wirePositions),
    };
  }, []);

  // Read brand color from CSS variable so the mood engine retints the face.
  const brandColor = useMemo(() => {
    if (typeof window === "undefined") return new THREE.Color("#00f0ff");
    const css = getComputedStyle(document.documentElement)
      .getPropertyValue("--brand-accent")
      .trim();
    return new THREE.Color(css || "#00f0ff");
  }, []);

  // Re-read color when document becomes visible again (mood might have changed)
  useEffect(() => {
    const update = () => {
      if (matRef.current && eyeMatRef.current) {
        const css = getComputedStyle(document.documentElement)
          .getPropertyValue("--brand-accent")
          .trim();
        if (css) {
          const c = new THREE.Color(css);
          matRef.current.color = c;
          eyeMatRef.current.color = c;
        }
      }
    };
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, []);

  // Per-frame animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pts = pointsRef.current;
    if (!pts) return;

    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    // Talk intensity: combine `talking` flag + audioLevel + a synthetic mouth envelope
    const talkEnvelope = talking
      ? 0.5 + 0.5 * Math.abs(Math.sin(t * 18)) + audioLevel * 0.4
      : 0;

    const breath = 0.5 + 0.5 * Math.sin(t * 1.2);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const bx = basePositions[i * 3 + 0];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];
      const flag = flags[i];

      // Idle noise — every particle drifts slightly
      const driftAmp = flag === 2 ? 0.012 : 0.006; // edge particles drift more
      const dx = Math.sin(t * 0.7 + i * 0.13) * driftAmp;
      const dy = Math.cos(t * 0.9 + i * 0.21) * driftAmp;
      const dz = Math.sin(t * 0.6 + i * 0.17) * driftAmp;

      let nx = bx + dx;
      let ny = by + dy;
      let nz = bz + dz;

      // Mouth area: oscillate more when talking (lip-sync-ish)
      if (flag === 1) {
        const mouthOsc = talkEnvelope * 0.08 * Math.sin(t * 22 + i * 0.5);
        ny += mouthOsc;
        nz += mouthOsc * 0.5;
      }

      // Breath: subtle whole-head scale on Y
      ny += breath * 0.012 * (flag === 1 ? 1.5 : 1);

      arr[i * 3 + 0] = nx;
      arr[i * 3 + 1] = ny;
      arr[i * 3 + 2] = nz;
    }
    posAttr.needsUpdate = true;

    // Whole head subtle rotation
    pts.rotation.y = Math.sin(t * 0.18) * 0.18;
    pts.rotation.x = Math.sin(t * 0.13) * 0.05 - 0.02;
    if (wireRef.current) {
      wireRef.current.rotation.copy(pts.rotation);
      // Wireframe geometry follows particle positions
      const wireArr = wireRef.current.geometry.attributes.position.array as Float32Array;
      // Note: wireframe stays static for performance; only rotation matches.
      wireRef.current.geometry.attributes.position.needsUpdate = false;
    }

    // Eye particles: pulsate when talking
    if (eyeRef.current && eyeMatRef.current) {
      const pulse = talking ? 0.6 + 0.4 * Math.sin(t * 8) : 0.85 + 0.15 * Math.sin(t * 2);
      eyeMatRef.current.opacity = pulse;
      eyeRef.current.rotation.copy(pts.rotation);
    }
  });

  return (
    <group>
      {/* Main particle cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          color={brandColor}
          size={0.028}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Wireframe overlay (digital-code feel) */}
      <lineSegments ref={wireRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={wirePositions.length / 3}
            array={wirePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={brandColor}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Eye cluster */}
      <points ref={eyeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={eyePositions.length / 3}
            array={eyePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={eyeMatRef}
          color={brandColor}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function MouseRig({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  // Subtle parallax: rotate the face group toward the pointer instead of
  // moving the camera (which the immutability lint rule refuses).
  const { pointer } = useThree();
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y += (pointer.x * 0.25 - g.rotation.y) * 0.05;
    g.rotation.x += (-pointer.y * 0.15 - g.rotation.x) * 0.05;
  });
  return null;
}

export function ParticleFace({ talking, audioLevel }: ParticleFaceProps) {
  const groupRef = useRef<THREE.Group>(null);
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, 2]} intensity={0.4} color="#ff0066" />
      <group ref={groupRef}>
        <FaceMesh talking={talking} audioLevel={audioLevel} />
      </group>
      <MouseRig groupRef={groupRef} />
    </Canvas>
  );
}
