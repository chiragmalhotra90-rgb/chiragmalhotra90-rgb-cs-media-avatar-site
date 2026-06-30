# CS Media & Production Static Website

Single-file static website for CS Media & Production.

## Files

- `index.html` — full website: fixed 3D corridor hero, chroma picker, AI orb, marketing sections, page 3 placeholder, and footer.
- `intro-video.html` — self-contained 60s AI-Presenter intro film, built as a code-driven **HyperFrame** motion piece (kinetic typography + the Nova orb, no footage). Runs a deterministic 60s timeline you can screen-record to export. Toggles 9:16 (presenter gate / Reels) ↔ 1:1 (LinkedIn / IG feed), burns in captions for muted-first viewing, and has an optional WebAudio score. Open it, click **Clean mode** (or press `C`) to hide the chrome, then screen-record the stage. `Space` play/pause · `R` restart · `S` sound.
- `vercel.json` — disables builds and serves the repo root as static output.

## Deploy

Vercel serves this repo as a static site with no build step.
