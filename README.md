# CS Media & Production Static Website

Single-file static website for CS Media & Production.

## Files

- `index.html` — full website: fixed 3D corridor hero, chroma picker, AI orb, marketing sections, page 3 placeholder, and footer.
- `intro-video.html` — self-contained ~46s AI-Presenter intro film, built as a code-driven **HyperFrame** motion piece (kinetic typography + the Nova orb, no footage). Runs a tight, continuous timeline (no dead holds) you can screen-record to export. Toggles 9:16 (presenter gate / Reels) ↔ 1:1 (LinkedIn / IG feed), burns in captions for muted-first viewing. **Sound:** a layered WebAudio score (sub-bass + drone, a pad that opens at the Shift, a rising arpeggio resolving on the CTA) plays from the first Play; record with tab/system audio on. **Optional voiceover** auto-syncs per beat when `vo/beat1..4.mp3` exist — generate them with `OPENAI_API_KEY=sk-... node scripts/make-vo.mjs` (OpenAI `gpt-4o-mini-tts`, voice "nova"), or drop in ElevenLabs/HeyGen renders. Open it, press `C` for Clean mode, then record the stage. `Space` play/pause · `R` restart · `S` sound.
- `scripts/make-vo.mjs` — generates the four per-beat voiceover MP3s into `vo/`.
- `funky/` — a second, deliberately different pass: fast-cut, colorful, beat-synced kinetic-typography videos with upbeat WebAudio scores (no plain white text, music on by default). Two full 30s intro versions (Neon Glitch / Bold Pop Poster) + 3 short vertical teasers. See `funky/README.md`.
- `vercel.json` — disables builds and serves the repo root as static output.

## Deploy

Vercel serves this repo as a static site with no build step.
