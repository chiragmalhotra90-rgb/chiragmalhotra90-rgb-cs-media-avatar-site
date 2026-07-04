# Real-Estate Campaign — AI Presenter for Mumbai Developers

Four 9:16 ad videos built per `docs/Social_Media_Creative_Design_Standards.md` and
`docs/Creative_Flow_and_Meta_Compliance_Blueprint.md` (L2 Hook layer, New-Product
playbook, real-estate niche = trust/aspiration, medium energy).

| File | Concept | Length | Style |
|---|---|---|---|
| `re-brochure-30.html` | Your Brochure Can't Answer Back. | 30s | Brand cyan/green |
| `re-brochure-15.html` | Your Brochure Can't Answer Back. | 15s | Brand cyan/green |
| `re-sitevisit-30.html` | The Site Visit Starts Online. | 30s | Brand cyan/green |
| `re-sitevisit-15.html` | The Site Visit Starts Online. | 15s | Brand cyan/green |
| `re-speed-30.html` | Mumbai Is Fast. Your Follow-Up Should Be Faster. | 30s | **Wet-emblem** (crimson/steel on gloss black) |
| `re-pdf-30.html` | Stop Sending the Same PDF to Everyone. | 30s | **Futuristic Elegance** (porcelain serif / cosmic violet / solar flare) |

The two newest files use the sequential full-screen-beat architecture from the
client's reference comp (`ad_c1_30.html`): one message at a time, generous
holds, flash-cut transitions on downbeats, product beat at 13.79s, CTA hold
from 20.64s. They are **fully deterministic** — `window.__seek(t)` /
`window.__duration` / `window.__ready` — so they can be frame-rendered to real
MP4s (`?render=1`, frame sequences swap in for the logo videos).

**Logo-background rule (applies to all six):** the orb clip and the CS graffiti
clip both live on pure black, so during those two scenes the entire stage
becomes black with a soft glow sampled from that logo's own palette — the
video-box edge is invisible.

Shared system: real client track (post-2:00 section, 143.6 BPM, drop at ~5.22s =
the product reveal), orb video = **AI Presenter product logo** (hero), graffiti
animation = **CS Media logo** (CTA section, Grok watermark cropped out per the
blueprint's watermark protocol), persistent contact footer, cuts on detected
beats, static CTA end-hold, burned-in text designed sound-off-first.

**Footer on every creative:** `AI Presenter · 📞 7755883886 · ✉️ info@csmediaandproduction.in`

---

## Post captions (paste into the caption/primary-text field — NOT on the image, per the ≤20% text rule)

### Brochure concept
> A brochure shows information. AI Presenter turns it into a real conversation.

`#RealEstateMarketing #MumbaiDevelopers #AIPresenter #PropertyTech #SalesAutomation`

### Site-visit concept
> Location, amenities, layouts, prices and payment plans—explained before the buyer books a site visit.

`#SiteVisit #MumbaiRealEstate #AIPresenter #PropertySales #RealEstateLeads`

### Speed concept (Mumbai Is Fast)
> In a competitive market, speed matters. AI Presenter keeps every enquiry moving.

`#MumbaiPropertyMarket #RealEstateSales #AIPresenter #SalesAutomation #LeadConversion`

### Same-PDF concept (personalisation)
> AI Presenter gives buyers relevant answers based on what they actually need.

`#PersonalisedSales #MumbaiRealEstate #AIPresenter #PropertyMarketing #RealEstateTech`

---

## Export

Open a file → `C` (clean mode) → `Space` (play) → screen-record the stage with
tab/system audio ON → export MP4 (H.264, ≤1 GB). The videos are the 9:16
masters; derive other ratios by **reframing, never stretching** (Standards §4.4).

---

# "Sparky Explains AI Presenter" — 3:06 kid-simple explainer film

`explainer-ai-presenter.html` — 16:9 master (1080p render in `renders/`), 8 scenes,
flat cartoon style, original playful marimba score (`assets/kids-track.mp3`,
scene-change chimes baked in at 18/42/62/92/118/140/162s). Cast: **Rohan the
builder**, **Snoozy the sleepy brochure**, and **SPARKY** — the AI-Presenter orb
as a friendly character. Ends on the real orb + brand card + contact.

## Voiceover script (per scene, warm kid-narrator voice, ~112 wpm, playful)

Generate one file per scene (ElevenLabs or `gpt-4o-mini-tts`), drop them at
`assets/vo/exp-s1.mp3 … exp-s8.mp3` — the HTML auto-plays them per scene.
To bake VO into the MP4: `ffmpeg -i film.mp4 -i s1.mp3 … -filter_complex "adelay…amix" out.mp4`
(or simply concatenate the 8 files with the silences below and amix with the music track).

| Scene | Window | Narration |
|---|---|---|
| S1 Meet Rohan | 0:00–0:18 | "This is Rohan. Rohan builds homes — big, beautiful homes! He worked very, very hard on his new building. Now he wants to show it to everyone." |
| S2 Sleepy brochure | 0:18–0:42 | "So Rohan sends everyone a brochure. But a brochure is just paper… and paper can't talk! At night, when people have questions… the brochure just sleeps. 'Hello? How much does it cost?' …nothing. And Rohan never knows who even opened it." |
| S3 Meet Sparky | 0:42–1:02 | "But wait… who's that? Meet Sparky! Sparky is an AI Presenter. He lives inside your web browser. No downloads. No installing. And he NEVER sleeps!" |
| S4 Powers | 1:02–1:32 | "Tap a button — and Sparky talks! He shows the building, tells the price, and answers every single question. At midnight? Yes! On a phone? Yes! And when you tap 'Talk to Maya', a real presenter appears — and talks with you, live!" |
| S5 Magic map | 1:32–1:58 | "Sparky also has a magic map — the Project Navigator. 'Where's the school?' — twelve minutes! 'The hospital?' — right there! 'The metro?' — just ten minutes away! Buyers see the home, the roads… and the whole journey." |
| S6 Everywhere | 1:58–2:20 | "And Sparky doesn't just help builders! He helps shops, and hospitals, and schools, and hotels too — one platform… many friends!" |
| S7 Remembers | 2:20–2:42 | "Best of all… Sparky remembers. He tells Rohan who visited, what they asked, and who really liked it! So Rohan calls the right people first." |
| S8 Get Sparky | 2:42–3:06 | "Now Rohan doesn't send paper… he sends a conversation! AI Presenter — by CS Media and Production. Call or WhatsApp seven seven five five eight eight three eight eight six — and get your own Sparky today!" |

The on-screen captions mirror this script line-by-line (muted-first compliant).
