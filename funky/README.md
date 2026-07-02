# ⭐ ap-intro-v1.html — the current flagship (real assets, real music)

`ap-intro-v1.html` is the newest, most product-accurate cut and supersedes the
synthesized batch below. It uses **real assets** in `assets/`:

- `assets/orb.mp4` / `assets/orb.webm` — the actual AI-Presenter swirl-orb clip
  (Grok render, cropped to remove its baked-in text/watermark), masked to a soft
  circle and screen-blended so it composites on any background.
- `assets/track.mp3` — your supplied music, trimmed to the segment **after 2:00**.
- `assets/maya.jpg` — **drop Maya's headshot here** and it auto-fills her avatar
  (the file is optional; without it the avatar shows the ✦ placeholder).

What's different from the batch below:
- Recreates the **actual product UI** from the app (header, topic pills around the
  orb, the "AI Presenter" wordmark, and Maya's chat panel with the "Talk to Maya"
  button, welcome bubble, and "Ask Maya about AI Presenter…" input bar).
- Plays your **real track** (143.6 BPM). The beats were detected with librosa and
  **every cut/effect lands on a real beat**; the orb throbs on every beat.
- Strict layer ordering so **text is never hidden behind the orb/props**.
- ~30s, vertical 9:16. `Space` play/pause · `R` restart · `S` mute · `C` clean mode.

---

# Funky batch — upbeat, beat-synced cuts (earlier, synthesized-audio versions)

A second, deliberately different pass at the intro: fast-cut, colorful, funky
typography instead of the moody cinematic style in `../intro-video.html`.
Every transition is quantized to the music's beat grid, music plays from the
first Play (no opt-in), and no headline ever uses plain flat white text.

All vertical (9:16). Open any file, press **`C`** for clean mode, then
`Space` to play and screen-record (with tab/system audio on to capture the
music). `R` restart · `S` sound toggle.

| File | Length | Flavor | Notes |
|------|--------|--------|-------|
| `intro-30-v1-neon.html` | 30s · 128 BPM | **Neon Glitch** — RGB chromatic-aberration split text, animated neon gradients, glitch wipes on the beat | Full intro, same 4-beat story as the cinematic cut (Pain → Shift → Loop → CTA), told fast and electric |
| `intro-30-v2-pop.html` | 30s · 120 BPM | **Bold Pop Poster** — chunky outlined/stroke type, hard color-block wipes, confetti bursts, bouncy elastic pop-ins | Same story structure as v1, totally different visual execution — pick whichever vibe fits |
| `teaser-pain.html` | 9s · 120 BPM | Neon Glitch | Standalone trailer for v1 — the silence/no-read-receipt hook, ends on a cliffhanger "WHAT IF…" |
| `teaser-shift.html` | 9s · 120 BPM | Bold Pop Poster | Standalone trailer for v2 — the deck "comes alive" transformation moment |
| `teaser-cta.html` | 9s · 120 BPM | **Holographic Chrome** (new, capstone-only flavor) — iridescent foil text, chrome specular sweeps, whip-pan cuts | The tagline reveal: "Don't send a deck. Send a conversation." |

Each file is fully self-contained (inline CSS/JS, no external deps besides an
optional Google Fonts `<link>` that degrades gracefully).
