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
