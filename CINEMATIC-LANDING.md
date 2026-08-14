# Cinematic version (`cinematic.html`)

The fourth version of the CS Media site: a **scroll-driven fly-through** of the
brand world. Scrolling scrubs a continuous camera flight through five scenes;
a conventional page (services, explore links, contact) sits after the flight.
Live at `/cinematic.html`, reachable from the shared menu on every version.

This replaced the earlier storm/smoke trailer build, which ran continuous
canvas render loops. The flight has **zero idle cost** — every frame of motion
is a pure function of scroll position, computed only when the scroll position
actually changes. No timers, no free-running `requestAnimationFrame`, no
canvases, no images: the whole page is ~50 KB plus the shared menu.

## The five scenes

| # | Scene | What happens |
| --- | --- | --- |
| 1 | The Title | smoke void; the CS MEDIA monolith passes the camera |
| 2 | The Claims | NO STUDIO / NO CREW / NO RESHOOTS slabs fly past in sequence |
| 3 | The Engine | the AI orb station — Maya, the presenter that never sleeps |
| 4 | The Numbers | a wall of stat panels (12 services · 4 experiences · 2 countries · 24/7) |
| 5 | Touchdown | clear air, START A PROJECT, and the page scrolls on |

Scene timing lives in the `WIN` array in the scrub script — each scene owns a
window of global progress `p ∈ [0,1]` with ~4% overlaps for crossfades. The
progress rail on the right shows where you are and jumps on click.

## How the motion works

- `#flight` is a tall (560vh) section with a sticky, viewport-sized stage.
- Each scene is a stack of `.layer` elements with a `data-depth` factor;
  depth controls how fast a layer grows toward the lens (parallax).
- A layer with `data-win="a,b"` animates inside a sub-window of its scene —
  that's how the three claim slabs fly past one after another.
- Growth is squared (`fly²`) so scenes stay readable through their middle and
  accelerate past the camera only on the way out.
- The smoke is two gradient sheets cut by an inline SVG fractal-noise mask —
  pure CSS, no canvas.
- Gradient type takes its depth from `drop-shadow`, never `text-shadow`
  (a `background-clip:text` glyph has a transparent fill).

## Palette and type (locked)

`--title-grad` — the blue → violet → red trailer sweep. Ink background
`#05060c`. Anton (SIL OFL 1.1) for display — latin subset embedded base64 so
the title renders instantly and offline; Inter for UI.

## Accessibility and fallbacks

- `prefers-reduced-motion: reduce` → the `static` class renders the five
  scenes as stacked stills, full height, no transforms, rail hidden.
- The page carries an `sr-only` h1 with the real copy; every fact in the
  flight also exists as text in the sections below it.
- `robots: noindex, follow` with a canonical to `/ai-presenter` — this is an
  alternate experience, not the page search should surface.

## Navigation

The shared `csmedia-menu.js` burger (top right) carries the whole site.
The nav bar keeps three section links and a Start-a-project CTA. After the
flight: Services (six chips), Explore (links to AI Presenter, Professional,
Real Estate), and the contact band.
