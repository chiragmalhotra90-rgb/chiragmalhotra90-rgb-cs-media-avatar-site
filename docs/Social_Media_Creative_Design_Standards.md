# Social Media Creative Design Standards

**Purpose:** A platform-agnostic rulebook for producing on-brand, ad-compliant, mobile-legible creatives — image posts, animated posts, text graphics, and any visual for a digital platform. Written to be read by a designer **and** parsed by an AI creative-generation model as reference.

**Scope:** Every static and motion creative, paid or organic.
**Golden rule:** *No creative ships until it passes the Pre-Flight Checklist (Section 8).*

---

## 0. How To Use This Document

- Sections 1–4 are **hard rules** (compliance, safety, sizing, layout). Do not override.
- Section 5 is the **playbook** — pick the recipe that matches the post's intent.
- Section 6 tunes tone by **brand/niche**.
- Sections 7–9 cover motion, QA, and a one-screen cheat sheet.

**The four failures this document exists to prevent:**
1. Text too small to read in-feed.
2. Text touching or running out of the frame.
3. The main message not clearly the most prominent thing.
4. Treatment mismatched to intent (a flash sale designed like an educational post).

If a creative has any of these, it is wrong regardless of how good it looks.

---

## 1. Platform & Ad Compliance

### 1.1 The Text-in-Image Rule (the "20% Principle")

Meta **officially removed** the hard 20%-text rule and the old Text Overlay checking tool. Ads are **no longer auto-rejected** for text. **But the delivery algorithm still internally scores text density and quietly throttles text-heavy creatives** — lower reach and higher cost.

**Rule for anything paid or boosted:** keep visible text under **~20% of the image area**. The tool is gone; the algorithm's preference is not.

### 1.2 Why "Bigger/Bolder Text Costs More" — the real mechanism

It is **not the font size itself** that Meta charges for. It is the **share of the image covered by text**. Large, bold, tightly-packed type simply *covers more area*, which pushes the text-density score up. High density → the algorithm limits reach → **you pay a higher CPM for the same offer** (reported in 2026 as roughly **30–50% higher CPM** on text-heavy vs. text-light versions of the same ad).

**Practical takeaway for boosted creatives:**
- Let **one** short line be big and bold (the hook / offer / product name).
- Push detailed copy into the **caption / primary text field**, not onto the image.
- Headline on image: **5–7 words max.**

### 1.3 The 20% Check (do this mentally on every paid creative)

Imagine a **5×5 grid** (25 cells) over the canvas. If text touches **more than 5 cells (20%)**, it reads as "heavy." Reduce it. *Logos with text and text printed on real products count too — keep them light.*

### 1.4 Canvas Sizes That Cover ~90% of Delivery

| Format | Pixels | Ratio | Use |
|---|---|---|---|
| **Square** | 1080 × 1080 | 1:1 | Feed, carousel, Marketplace, right column |
| **Portrait** | 1080 × 1350 | 4:5 | Feed — **best mobile real estate (~20% more screen, higher CTR)** |
| **Vertical** | 1080 × 1920 | 9:16 | Stories, Reels |

- Design at **1080 × 1350** and **1080 × 1920** to cover almost everything.
- Carousel cards must **all** be the same ratio (1:1).
- Don't rely on one asset auto-cropped across placements for anything high-stakes — export per ratio.

### 1.5 Safe Zones (do not put key content here)

**Feed (1:1, 4:5):** keep a clean inner margin (Section 4.1). No UI overlaps, but edges still get visually cramped.

**Stories / Reels (9:16, 1080 × 1920):** platform UI covers the edges.
- **Top ~250 px (~14%)** → profile name, "Sponsored" tag.
- **Bottom ~250–380 px (~20–35%)** → caption, CTA button, controls, native captions.
- **Keep every logo, headline, face, product, and CTA inside the central band `y = 250 → 1670` (a 1080 × 1420 safe area).** Treat top and bottom as bleed.

### 1.6 Resolution & File Rules

- **Minimum 1080 px** on the short side. Below **600 px** = low-res flag + throttled delivery.
- **Images:** JPG or PNG. (GIF/WebP/HEIC get rejected or converted with quality loss.)
- **Video:** MP4 or MOV, H.264, 30 fps. Keep under ~1 GB for reliable processing.
- **Always caption video** — most feed video is watched **sound-off**.

### 1.7 Cross-Platform Quick Notes

| Platform | Watch for |
|---|---|
| **Google Display / PMax** | Text-heavy image assets score poorly; responsive assets crop hard — keep text centered and short. |
| **LinkedIn** | 1200 × 1200 or 1200 × 628; professional tone, more copy tolerated, but hierarchy still rules. |
| **X (Twitter)** | 1600 × 900 (16:9) in-timeline; text gets small — headline only. |
| **YouTube thumbnail** | 1280 × 720; ≤ 4–5 words, huge, high-contrast (viewed tiny). |
| **WhatsApp status / broadcast** | 1080 × 1920; treat like Stories; no UI overlap but keep text centered. |

*The typography and layout rules in Sections 3–4 are universal — only the safe zones and ad-text sensitivity change by platform.*

---

## 2. The 10 Universal Safety Rules

These are non-negotiable and map directly to the failures in Section 0.

1. **Margin lock.** No text or key element inside the outer **6% of canvas width** (Section 4.1). Nothing touches the edge.
2. **Minimum size floor.** No text below the floor for the canvas (Section 3.4). If copy won't fit above the floor, **cut copy — never shrink below it.**
3. **One focal point.** Exactly one element is clearly dominant. The **money message** (offer / hook / product name) is the largest and highest-contrast thing on the canvas.
4. **Match treatment to intent.** Use the correct Section 5 playbook. A sale is not an essay; an education post is not a countdown.
5. **Contrast is measured, not guessed.** Body ≥ **4.5:1**, large/display ≥ **3:1**. On photos, always add a scrim/plate/blur behind text.
6. **Squint test.** Blur the design 50%. The main message must still be readable. If it disappears, the hierarchy is wrong.
7. **Thumb test.** View at ~40% scale on an actual phone. If the smallest *essential* text isn't legible, it's too small.
8. **Text stays inside its box.** Every text block sits within a defined container with padding. No clipping, no overflow, no letters kissing the frame.
9. **Legal present when required.** Any offer, claim, price, or discount carries **T&C** on the creative (small but legible — never below the floor).
10. **Nothing lands on the focal subject.** Text never covers a face, product hero, or logo focal point.

---

## 3. Typography Hierarchy System

### 3.1 The Six Text Tiers

Every creative uses some subset of these. Never more than **3–4 tiers visible at once** — more than that kills hierarchy.

| # | Tier | Job |
|---|---|---|
| 1 | **Logo / Wordmark** | Brand signature. Present, never competing. |
| 2 | **Title / Headline** | The one message. The hook. Read first. |
| 3 | **Subtitle** | Supports/qualifies the title. Read second. |
| 4 | **Communication (Body)** | Core explanatory copy. |
| 5 | **Detail / Caption** | Features, dates, steps, small print that still matters. |
| 6 | **T&C / Legal** | Disclaimers, validity, codes. Smallest, still legible. |

### 3.2 Proportional System — works on ANY canvas

Size everything as a **% of canvas width (W)**. This scales to any dimension, any platform.

| Tier | Size (% of width) | Weight | Case |
|---|---|---|---|
| Logo | height **5–8%** | brand asset | — |
| Title / Headline | **9–16%** (single-word punch up to 18–22%) | Bold / Black | ALL-CAPS or Title Case |
| Subtitle | **5–7%** | Medium / Semibold | Title / Sentence |
| Communication | **3.2–4.5%** | Regular / Medium | Sentence |
| Detail | **2.4–3.2%** | Regular | Sentence |
| T&C | **1.7–2.2%** (floor 1.6%) | Regular / Light | Sentence |

**Scaling formula:** `target_px = percentage × your_canvas_width`
- 1200 W, body at 3.5% → 42 px.
- 720 W, title at 12% → 86 px.

### 3.3 Concrete Sizes — 1080 px width baseline

Because all three standard formats share **1080 px width**, these values hold for 1:1, 4:5, **and** 9:16. (On 9:16 you *may* scale the Title up +10–15% to use the extra height.)

| Tier | Min px | Max px | Notes |
|---|---|---|---|
| Logo (height) | 54 | 86 | Corner placement standard |
| Title / Headline | 100 | 175 | Punch word can exceed |
| Subtitle | 54 | 76 | — |
| Communication | 35 | 49 | — |
| Detail | 26 | 35 | — |
| **T&C** | **18** | 24 | **Never below 18 px on a 1080 canvas** |

### 3.4 Minimum Floors (the anti-"too small" rule)

Feed compresses a 1080 post to roughly **40–50%** on a phone. That's why floors exist.

- **1080 canvas:** absolute floor **18 px** for any text. Body should sit **≥ 32 px.**
- **Any canvas:** floor = **1.6% of width.** Below this = illegible when compressed.
- If required copy can't fit above the floor → **the canvas is overloaded. Cut copy, split into a carousel, or move detail to the caption.** Do not shrink.

### 3.5 Weight, Case, Spacing, Line Rules

- **Bold = spotlight.** One bold element per visual zone. If everything's bold, nothing is.
- **ALL-CAPS** only for the Title/hook or short labels — never for body (it's slower to read).
- **Line length:** headlines **≤ 6–9 words per line**; body chunked, never a wall.
- **Line height:** display **1.05–1.2**; body **1.3–1.45**.
- **Letter-spacing:** large display slightly tight (−1% to −3%); small caps labels slightly open (+2% to +6%).
- **Max 2 typefaces** per creative (one display, one text) unless brand system says otherwise.

### 3.6 Contrast & Legibility (anti-"unreadable on a busy image")

- Never place text directly on busy imagery. Use one of: **solid plate**, **gradient scrim**, **blur-behind**, or a **duotone/darkened photo**.
- Verify the contrast **number** (4.5:1 body / 3:1 large). Don't eyeball light-on-light or color-on-color.
- Add a subtle shadow/stroke **only** as insurance, not as a substitute for real contrast.

---

## 4. Layout & Spacing

### 4.1 Margins / Safe Padding (anti-"out of box")

- **Standard safe margin: 6% of canvas width on all sides** (≈ **64 px** on 1080). No text or key element crosses into that band.
- Text blocks get **internal padding** so glyphs never touch the container edge.
- **Story/Reel:** obey the `y = 250 → 1670` central safe area from Section 1.5 *in addition to* side margins.

### 4.2 Focal Point & the 3-Second Rule

- A viewer decides in **~1–3 seconds** while scrolling. The **one message** must land in that window.
- Build a clear path: **Focal element → supporting line → CTA/brand.** Size, contrast, and whitespace create the order — not just position.
- Whitespace is a tool. A crowded canvas reads as low-value; breathing room reads as premium.

### 4.3 Logo Sizing & Placement

- **Size:** height **5–8% of width** (≈ 54–86 px on 1080). Present, never fighting the message.
- **Placement:** a corner inside the safe margin (default), or centered for festival/brand-signature posts.
- **Clear space:** keep empty space of **≥ 0.5× the logo height** around it.
- **Legibility floor:** never so small the wordmark can't be read. If it's unreadable, it's decoration, not branding.

### 4.4 Master-First Reframing (9:16 → every other ratio)

**9:16 (1080 × 1920) is the sovereign master.** Vertical-first: it is the most-consumed format and the safest source to derive from. Always design the master at full detail first, then derive smaller/wider ratios *down* from it.

**The never-stretch law:** you never scale a creative non-uniformly to fit a new ratio. Stretching distorts logos, faces, and products — it looks cheap and breaks the brand. To change ratio you **reframe**: reposition, uniformly rescale, and re-flow elements into the new safe area. The design is *rebuilt into* the new canvas, never squashed into it.

**What each element does during a reframe:**
- **Logo & product/photo:** aspect ratio is *locked forever*. Only the canvas and layout around them change. Recrop background or rescale uniformly — never distort.
- **Title:** stays the hero; may drop one size band when vertical room is tight; re-wrap lines to the new width.
- **Body / Detail:** first to compress, move to the caption, or drop when space tightens.
- **T&C:** stays present; relocates to the footer of the new frame.

**Derivation ladder (from the 9:16 master):**

| Target | Pixels | Reframe action |
|---|---|---|
| **9:16 (MASTER)** | 1080 × 1920 | Full detail, all tiers, richest layout. Build here first. |
| 2:3 | 1080 × 1620 | Minor vertical trim; keep layout, tighten spacing. |
| 4:5 | 1080 × 1350 | Trim top/bottom breathing room; keep all key tiers. |
| 1:1 | 1080 × 1080 | Compress the vertical stack; drop 1 tier if crowded; recenter focal point. |
| 16:9 | 1920 × 1080 | Re-flow to **horizontal** — text beside the visual, not stacked; drop the detail tier; logo to a corner. |

*Rule: derive, don't redraw from scratch — but derive by reframing, never by stretching. If an element can't fit its ratio at legal size, it gets cut or moved to caption, not shrunk below the floor or distorted.*

### 4.5 Responsive Step-Down (simplify as the canvas shrinks)

Smaller canvases need **fewer elements and proportionally larger text** — not the same layout scaled down. Linear shrinking makes small formats illegible.

| Canvas (short side) | Max visible tiers | Text handling |
|---|---|---|
| **≥ 1080** (full social) | 3–4 | Standard size bands. |
| **600–1080** (previews, small placements) | 2–3 | Bump body **+1 size band**; move Detail/T&C to the caption. |
| **< 600** (thumbnails, chips, ad previews) | 1–2 | **Hook + logo only.** Everything else lives outside the frame. |

**Principle:** as it shrinks — **fewer, bigger.** As it grows — more detail is allowed. The message survives at every size because you removed elements, not because you made them tiny.

---

## 5. Creative Variable Playbooks

Pick the recipe that matches the post's **intent**. Each defines the emphasis order, energy, density, palette, and a sample layout. **Core principle (Rule 4, §2): the treatment must signal the intent before a single word is read.**

### 5.1 Education / Tips / How-To
- **Goal:** teach, build authority, earn saves/shares.
- **Emphasis order:** Title (the promise/topic) → structured Body (steps) → CTA/save.
- **Energy:** LOW–MEDIUM. Calm, clean, authoritative.
- **Text density:** HIGH is acceptable — but **must be structured** (numbered/bulleted, chunked). Readers expect to read.
- **Palette:** restrained, brand colors, generous whitespace. **No countdown/urgency colors.**
- **Layout:** grid/list; **carousel-friendly** (cover → step cards → CTA).
- **Do:** consistent spacing, clear numbering, one idea per card.
- **Don't:** giant "SALE" energy, neon urgency, clutter.
- **Sample (carousel):** `Cover: topic promise` → `Cards 1–5: one step each` → `Final: CTA + save prompt + logo`.

### 5.2 New Product / Product Launch
- **Goal:** reveal, create desire, communicate *what* + *why*.
- **Emphasis order:** Product hero visual → Product name (Title) → key benefit (Subtitle) → 2–3 features (Detail) → CTA.
- **Energy:** MEDIUM. Aspirational, premium, confident.
- **Text density:** LOW–MEDIUM. Let the product breathe.
- **Palette:** brand-forward; clean background so the product is hero.
- **Layout:** product-dominant; optional "New / Launching" badge.
- **Do:** big product shot, one clear benefit line.
- **Don't:** tiny product, feature dump, cluttered background.
- **Sample:** `Product centered` · `Name top or bottom` · `One-line benefit` · `Small CTA + logo` · optional `NEW badge`.

### 5.3 Sales Offer / Flash Sale / Discount
- **Goal:** communicate the deal clearly and fast. **This is where "flash sale ≠ education" is enforced.**
- **Emphasis order:** **THE OFFER (biggest element on the canvas)** → what it applies to → validity → code → CTA → T&C (small, present).
- **Energy:** HIGH. Direct, high-contrast, exciting.
- **Text density:** LOW–MEDIUM. **The discount figure dominates everything.**
- **Palette:** high-contrast sale colors (on-brand), big numbers.
- **Layout:** giant offer figure, supporting details stacked below, T&C footer.
- **Do:** make the number/percentage the single largest thing. One glance = "there's a deal."
- **Don't:** paragraphs, calm palette, buried discount, education-style structure.
- **Sample:** `50% OFF` (huge) → `on all [category]` → `Use code SAVE50` → `Valid till 30 June` → `CTA button` → `tiny T&C line`.

### 5.4 FOMO / Urgency / Scarcity
- **Goal:** trigger immediate action.
- **Emphasis order:** **Urgency hook (huge)** — "Only 2 left" / "Ends tonight" / "Last chance" → what → deadline → CTA.
- **Energy:** HIGH. Punchy, scarcity-driven; motion if animated.
- **Text density:** LOW. One dominant message.
- **Palette:** high-contrast, accent/alert color (kept on-brand).
- **Layout:** bold centered hook + deadline chip + CTA; offer/product secondary.
- **Do:** deadline or quantity front and center.
- **Don't:** explain too much, small hook, bury the urgency.
- **Sample:** `ENDS TONIGHT` (bold, centered) → `[offer] on [product]` → `⏳ deadline chip` → `CTA button`.

### 5.5 Festival / Greeting / Occasion
- **Goal:** emotional connection, brand warmth, shareability.
- **Emphasis order:** Greeting (Title) → short warm message (Body) → brand sign-off (logo prominent) → optional soft offer.
- **Energy:** MEDIUM–HIGH, but *festival-appropriate* (traditional/festive palette).
- **Text density:** LOW. Greeting + one short line.
- **Palette:** festive/occasion colors; motifs as texture, not clutter.
- **Layout:** festive visual, greeting centered, brand mark prominent.
- **Do:** keep it warm; **if it's a festival *offer*, separate the greeting and the offer into two clear zones.**
- **Don't:** hard-sell inside a pure greeting; drown the message in ornamentation.
- **Sample:** `Festive background/motif` → `Happy [Festival]` (large) → `short warm line` → `logo + brand name`.

### 5.6 Announcement / Event / Webinar *(bonus, common)*
- **Emphasis order:** What (event/name) → When & Where → Who (speakers) → **CTA (register)** → details.
- **Energy:** MEDIUM. **Date/time must be prominent.**
- **Layout:** structured; date block treated as a key visual element.

### 5.7 Testimonial / Social Proof *(bonus, common)*
- **Emphasis order:** the quote (hero) → attribution (name/role) → brand → soft CTA.
- **Energy:** LOW–MEDIUM, credible.
- **Do:** keep the quote short and legible; star rating optional. **Don't** shrink the attribution to nothing.

### Playbook Comparison Matrix

| Post type | Hero element | Energy | Text density | Palette |
|---|---|---|---|---|
| Education | Title + structured body | Low–Med | High (structured) | Restrained / brand |
| New product | Product visual | Medium | Low–Med | Brand, clean bg |
| Sales offer | **The discount figure** | High | Low–Med | High-contrast sale |
| FOMO | **Urgency hook** | High | Low | Contrast + alert accent |
| Festival | Greeting + brand mark | Med–High | Low | Festive |
| Announcement | Event name + date | Medium | Medium | Brand |
| Testimonial | The quote | Low–Med | Low | Restrained |

---

## 6. Niche / Brand Communication Map

Before styling, place the brand on four axes, then apply the niche defaults.

**Voice axes:** Formal ↔ Casual · Calm ↔ High-energy · Minimal ↔ Information-rich · Corporate ↔ Personal.

| Niche | Tone | Font direction | Color energy | Text density | Logo treatment |
|---|---|---|---|---|---|
| **Real estate / property** | Trust, aspiration, clarity | Clean sans, confident | Medium | Med (data-forward) | Corner, understated |
| **Legal / professional services** | Authoritative, precise | Restrained serif/sans; readability first | Low | Med, highly structured | Small, formal |
| **Luxury / jewellery / premium** | Editorial, elegant | High-contrast serif or refined sans | Low | **Very low** (product breathes) | Subtle, generous clear space |
| **Healthcare / dental** | Reassuring, trustworthy | Soft, rounded, clean | Low–Med (calm) | Low–Med | Clean corner |
| **Sports / franchise** | Bold, energetic | Heavy condensed, dynamic | **High** | Low | Prominent, strong |
| **Finance / fintech** | Credible, clear | Structured sans | Low–Med (conservative) | Med, structured | Formal, consistent |
| **Lifestyle / F&B / Gen-Z** | Vibrant, playful | Trend-forward, expressive | High | Low–Med | Flexible, can be playful |

**Rule:** the niche sets the *default* energy; the Section 5 playbook can push it up or down for a specific post — but a luxury brand's flash sale is still restrained-premium, not neon. Brand system always overrides these defaults where one exists.

---

## 7. Animated / Motion Rules

Motion multiplies the mistakes if timing is wrong. On top of all rules above:

- **Read-time per element:** hold each text line long enough to read — **minimum ~2–2.5 s** for a short line; longer for a sentence (budget ~0.3–0.4 s per word). If text flashes faster than it can be read, it doesn't exist.
- **Hook in the first ~1.5–3 seconds.** Feed autoplays; the main message or a curiosity hook must land immediately.
- **Design sound-off first.** Text/captions must carry the full meaning without audio. Add captions to any spoken content.
- **Keep text on screen, not strobing.** No rapid flashing of key info.
- **Stay in the safe zone the whole time** — animated elements must not drift into the Story/Reel UI bands or off-frame.
- **Loop cleanly** for short-form; the last frame should flow back to the first.
- **End card:** finish on a static hold with the offer/CTA + logo so a paused viewer still gets the message.

---

## 8. Pre-Flight QA Checklist

**Every creative must pass all applicable items before it ships.** (AI models: run this as a validation gate on generated output.)

**Compliance**
- [ ] Correct size/ratio for the placement (1080×1080 / 1080×1350 / 1080×1920).
- [ ] ≥ 1080 px; JPG/PNG (or MP4/MOV, captioned) as required.
- [ ] For paid/boosted: visible text ≤ ~20% of image area; headline ≤ 5–7 words.
- [ ] Story/Reel: all key elements inside `y = 250 → 1670`.
- [ ] Derived from the 9:16 master by **reframing, not stretching** — no distorted logos/products.
- [ ] Tier count obeys the step-down rule for the canvas size.
- [ ] **No platform-injected watermark** left uncovered (see Blueprint watermark protocol); if present, flagged for the final editor.

**Safety & legibility**
- [ ] All text inside the 6% safe margin; nothing touches the edge.
- [ ] Smallest text ≥ floor (≥ 18 px on 1080 / ≥ 1.6% of width).
- [ ] Every text block sits inside its container — no clipping/overflow.
- [ ] Contrast ≥ 4.5:1 body / 3:1 large; scrim used on photos.
- [ ] Squint test passes (main message survives 50% blur).
- [ ] Thumb test passes (legible at ~40% on a phone).

**Hierarchy & intent**
- [ ] Exactly one dominant focal element.
- [ ] The money message (offer / hook / product name) is the largest, highest-contrast item.
- [ ] Treatment matches the intent (correct Section 5 playbook — sale ≠ education).
- [ ] ≤ 3–4 text tiers visible; ≤ 2 typefaces.

**Brand & legal**
- [ ] Logo present, legible, in safe zone with clear space.
- [ ] Tone matches the niche/brand map.
- [ ] T&C present if any offer/price/claim is made.
- [ ] Spelling, currency, dates, and promo codes verified.

**Motion (if animated)**
- [ ] Each text line held long enough to read; hook in first ~3 s.
- [ ] Readable sound-off; captions present; loops/ends cleanly on a CTA hold.

---

## 9. Quick-Reference Cheat Sheet

*One-screen summary for fast recall or model injection.*

```
SIZES (% of canvas width)      MIN FLOOR: 1.6% of width (18px on 1080)
  Logo ...... 5–8%  (height)   SAFE MARGIN: 6% of width all sides
  Title ..... 9–16% (punch 18–22%)
  Subtitle .. 5–7%             CANVAS: 1080²(1:1) · 1080×1350(4:5) · 1080×1920(9:16)
  Body ...... 3.2–4.5%         STORY/REEL SAFE BAND: y = 250 → 1670
  Detail .... 2.4–3.2%
  T&C ....... 1.7–2.2%         PAID TEXT: ≤ 20% of area · headline ≤ 5–7 words

TIERS VISIBLE: ≤ 3–4     TYPEFACES: ≤ 2     BOLD: one per zone
CONTRAST: 4.5:1 body / 3:1 large     TEST: squint (blur 50%) + thumb (40% on phone)

MASTER: 9:16 (1080×1920) → derive 2:3 · 4:5 · 1:1 · 16:9   NEVER STRETCH — REFRAME
STEP-DOWN: ≥1080 = 3–4 tiers · 600–1080 = 2–3 (body +1) · <600 = hook+logo only
WATERMARK: flag any platform-injected mark → editor covers/crops → stamp own logo

INTENT → TREATMENT
  Education → structured, calm, high (structured) density
  New product → product hero, medium, low density
  Sales/Flash → DISCOUNT is biggest, high energy, low copy
  FOMO → urgency hook biggest, high energy, one message
  Festival → greeting + brand mark, festive, low copy

THE 4 THINGS THAT MEAN IT'S WRONG:
  1) text too small   2) text out of box
  3) main message not dominant   4) treatment ≠ intent
```

---

*Compliance figures reflect Meta ad policy as of mid-2026 (hard 20% rule retired; text-density delivery penalty and safe zones still active). Re-verify Meta's official Ads Guide quarterly, as placements and specs change. Typography, layout, and playbook rules are platform-independent and stable.*
