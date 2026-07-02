#!/usr/bin/env node
/**
 * make-vo.mjs — generate the intro film's voiceover as four per-beat MP3s.
 *
 * Matches the presenter app's voice exactly: OpenAI `gpt-4o-mini-tts`, voice
 * "nova" (fitting — the orb is Nova). Writes vo/beat1.mp3 … vo/beat4.mp3, which
 * intro-video.html auto-plays at each beat's start.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/make-vo.mjs
 *
 * No dependencies — uses global fetch (Node 18+).
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "vo");

const VOICE = "nova";
const MODEL = "gpt-4o-mini-tts";
const INSTRUCTIONS =
  "Warm, confident, unhurried brand presenter named Nova. Cinematic and premium. " +
  "Slow and deliberate at first, with clear pauses on the em-dashes; lift the energy " +
  "through the middle, then settle and resolve on the final line. Never robotic.";

// One clip per beat — silences between beats are handled by the timeline gaps.
const BEATS = [
  { file: "beat1.mp3", text: "You spent weeks on the perfect pitch. You hit send… and then — silence. No idea if they even opened it." },
  { file: "beat2.mp3", text: "What if your pitch could present itself — and answer every question — the moment they're ready? Even at midnight. Even across the world." },
  { file: "beat3.mp3", text: "Send one link. They explore on their time, ask anything, and get answers instantly — in your voice. And you see exactly who's interested." },
  { file: "beat4.mp3", text: "Don't take our word for it — this entire pitch is an AI presenter. Go ahead. Ask it anything." },
];

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) {
  console.error("✗ Set OPENAI_API_KEY first:  OPENAI_API_KEY=sk-... node scripts/make-vo.mjs");
  process.exit(1);
}

async function tts(text) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, voice: VOICE, input: text, instructions: INSTRUCTIONS, response_format: "mp3" }),
  });
  if (!res.ok) throw new Error(`OpenAI TTS ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

await mkdir(OUT, { recursive: true });
for (const b of BEATS) {
  process.stdout.write(`→ ${b.file} … `);
  const mp3 = await tts(b.text);
  await writeFile(join(OUT, b.file), mp3);
  console.log(`${(mp3.length / 1024).toFixed(0)} KB`);
}
console.log("✓ Voiceover written to vo/. Open intro-video.html and press Play.");
