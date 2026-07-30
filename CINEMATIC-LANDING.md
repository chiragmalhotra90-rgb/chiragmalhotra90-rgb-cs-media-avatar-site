# Cinematic version (`cinematic.html`)

The fourth version of the CS Media site. Same content system as the
Professional version — every section, the case filter, the counters, the
chatbot — rendered as a trailer: blue→red gradient display type, extruded 3D
letters, volumetric smoke, lightning, film grain. Live at `/cinematic.html`.

One self-contained file. No build step and no framework; it shares only the
site's BendyButton stylesheet/engine and the `/api/chat` endpoint.

## The four versions

| Mode | URL | Switcher label |
| --- | --- | --- |
| AI Presenter | `/ai-presenter` | AI Presenter |
| Professional | `/professional.html` | Professional |
| **Cinematic** | `/cinematic.html` | Cinematic |
| Casual | `/` | Casual |

`localStorage.cs_mode` remembers the visitor's choice, and `/` forwards them
back to it. **Anyone arriving with no stored choice — organic search, a shared
link, a new device — lands on Professional.** The cinematic page also carries
`robots: noindex, follow` and a canonical pointing at `professional.html`, so
it is reachable and shareable but never the page search results surface.

## What it does

1. Plays three short title cards (`NO STUDIO` → `NO CREW` → `NO RESHOOTS`),
   letters rising out of the smoke one at a time.
2. Lands on the brand card — headline, sub-line, one sentence of copy and two
   calls to action — then the site scrolls on beneath it.
3. **Skip** ends the intro immediately; **Replay** runs it again.
4. Returning visitors in the same browsing session land straight on the brand
   card (`CONFIG.oncePerSession`).
5. Once the hero is behind you a scrim drops the weather back so the content
   sections stay readable; the smoke and storm keep running underneath.

## Sections

Ported verbatim from the Professional version — same copy, same numbers, same
prices: The Problem · Services (12) · Selected Work (counters + case filter) ·
Operating Workflow · Pricing (+ ₹999 trial) · Onboarding · Selected Clients ·
CTA · footer · AI chatbot. **The Knowledge Hub is deliberately not included**
and nothing on this page links to it.

## Changing the content

Everything editable sits in the `CONFIG` object at the top of the `<script>`:

```js
cards: [
  { lines: ['NO STUDIO'], hold: 1050 },          // hold = ms the card stays up
  …
  { lines: ['CS MEDIA'], sub: 'THE AVATAR ENGINE', final: true,
    kicker: '…', lede: '…',
    actions: [{ label: 'See the engine', href: '#work', primary: true }, …] }
]
```

- `lines` — one entry per line of the headline. Each line auto-sizes to fill the
  frame, so short and long cards read at the same optical weight.
- `final: true` — the card the sequence rests on. Only this one takes clicks.
- Point the `href`s at real sections; they are placeholders (`#work`, `#reel`).

Also update the `<h1 class="sr-only">` and the `<title>`/`description` meta —
that is the copy search engines and screen readers actually get.

## Changing the look

All design tokens are CSS custom properties in `:root`:

| Token | Controls |
| --- | --- |
| `--title-grad` | the blue → violet → red sweep across the type |
| `--blue` / `--red` / `--ink` | haze, smoke tint and background |
| `--extrude` / `--extrude-color` | depth and colour of the 3D extrusion |
| `--bar` | letterbox height (set to `0` to remove the bars) |
| `--title-font` / `--ui-font` | display and UI typefaces |
| `--cloud-a` / `--cloud-b` | the fractal-noise masks the drifting smoke is cut from |
| `--bank-a` / `--bank-b` | the higher-contrast masks the thick cloud banks are cut from |

Smoke density, parallax tilt, ember count and the storm live in `CONFIG`
(`smokePuffs`, `tilt`, `dust`, `sparks`, `storm`).

## The storm

`CONFIG.storm` controls the lightning:

| Key | |
| --- | --- |
| `on` | `false` removes lightning entirely |
| `gapMin` / `gapMax` | ms between strikes (default 6.5–15s) |
| `flashPeak` | hard ceiling on full-frame flash opacity |
| `flashGap` | minimum ms between the two flashes of one strike |
| `distantOdds` | share of strikes that stay behind the clouds — glow, no bolt |
| `sparksPerStrike` | embers thrown off along the bolt |

**The flash is deliberately restrained.** Each strike gets at most two
flashes, never closer together than `flashGap`, and peak opacity is capped —
a strobing hero is a photosensitivity hazard. Raising `flashPeak` or lowering
`flashGap` past the defaults takes it toward territory WCAG 2.3.1 exists to
prevent. Under `prefers-reduced-motion` the flash layer is removed outright
and no strikes are scheduled.

## How the effects are built

- **Gradient type** — each letter carries its own copy of `--title-grad`, sized
  to the whole line and offset by the letter's own position (`paintGradients`),
  so the sweep runs unbroken while every letter animates independently.
- **3D** — the letter itself is the extruded body (a generated `text-shadow`
  stack), `::before` is the gradient face on the front plane, `::after` prints a
  distress texture into it. The deck tilts on `pointermove` in a real 3D
  perspective.
- **Smoke** — three tiers: a canvas of additive soft sprites drifting and
  pulsing (GPU-blurred); two coloured gradients seen through animated
  fractal-noise masks for the billowing structure; and two *thick banks* — the
  same noise recipe at higher gamma, so it resolves into defined cloud rather
  than an even wash — pinned to the floor and ceiling of the frame and faded
  toward the middle, leaving the headline in clear air.
- **Lightning** — bolts are midpoint-displacement paths with 2–4 forks, drawn
  in three passes (wide halo, mid, white core) on a screen-blended canvas
  *behind* the type. Each strike also lights the cloud from within via a cached
  radial gradient, and throws embers off its lower run.
- **Sparks** — embers scatter along the bolt with staggered arrival, mixed
  speeds, gravity and a slow curl, drawn as pre-rendered glow sprites with
  clipped trails. Ambient embers rise continuously; `CONFIG.sparks: 0` stops
  them.
- **Film** — animated grain, scanlines, vignette, letterbox bars, corner marks.

## Buttons

Buttons go through the site's shared BendyButton 3D engine like every other
version. This version has its own theme — `[data-cs-bendy="cinematic"]` in
`csmedia-bendy.css`, feel entries in `csmedia-bendy-init.js` — so the keys
carry the trailer gradient instead of falling through to the casual lime.
The page sets `data-cs-bendy="cinematic"` on `<html>` so detection cannot
guess wrong.

Because the engine paints from `--b3d-*` custom properties, anything that
needs per-state colour has to express it through those vars at matching
specificity — see the case-study filters, where a plain `.active` background
was being overridden by the theme and every filter read as selected.

## Typography

Anton (SIL Open Font License 1.1) is the display face. The Latin subset is
embedded in the page as base64, so the headline renders instantly and offline;
the extended subset falls back to `fonts/anton-latin-ext.woff2`, then to Google
Fonts. Inter is loaded from Google Fonts for UI text and degrades to the system
UI stack if that request fails.

## Behaviour and support

- Chromium, Safari and Firefox — `background-clip: text`, CSS masks and
  `preserve-3d` are all prefixed or standard here.
- `prefers-reduced-motion: reduce` → no intro, no drifting smoke, one static
  smoke frame, brand card shown immediately.
- Parallax is pointer-only (`hover: hover`); touch devices get the static
  composition.
- The smoke loop pauses when the tab is hidden.
- The stage is a `100svh` hero section, not a fixed overlay — put your own
  sections directly after `</main>` and the page scrolls normally.

## Known limitations

- The blur/mask layers and the two canvases are GPU work. Hot paths avoid
  canvas `shadowBlur` (sprites and cached gradients instead), and phones get
  smaller blur radii, but on low-end devices drop `CONFIG.smokePuffs`,
  `CONFIG.sparks`, or set `CONFIG.storm.on = false` if you see frame drops.
- Headlines are single-line by design (`white-space: nowrap`); very long strings
  shrink rather than wrap — split them across `lines` instead.
- The CTA hrefs are placeholders until the target sections exist.
