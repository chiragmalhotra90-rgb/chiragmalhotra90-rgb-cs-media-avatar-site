# CEO Film v2 — "Family Experience Edition" · BUILD PLAN

**Status: PLANNED, NOT BUILT.** This document is the complete handoff for the build
session (any model). Read top-to-bottom before writing any code. The v1 film
(`funky/maya-ceo-film.html`, `funky/renders/maya-ceo-film_16x9_v1.mp4`) was rejected by
the client as too sterile — **v2 must be led by the client's own 3D-animated character
renders** (Kling clips in his Drive folder), not by code-drawn UI alone.

## 1. What the client asked for (verbatim intent)

> "i genuinely expected an animated version … showing animated characters, families
> sitting together and turning on their tv and having a full viewing experience with
> proper 3d animated characters — u didn't use even one image or render video from the
> documents i had added in the drive"

Translation into direction:
- The **hero visuals are his Kling 3D character renders** — families, living rooms,
  TV-viewing moments. The film opens and breathes with these.
- The code-drawn product-UI scenes from v1 are still useful, but demoted to
  **inserts** — what the family sees ON the TV / phone — not the whole film.
- Use **Katya_BlackSuit.png** as the human presenter image where a presenter face
  helps (she is an avatar/presenter render; treat like the Maya slot).
- Keep: the cinematic score (`funky/assets/ceo-score.mp3`, 148s, sections at scene
  bounds, resolve at 137.5s), the blueprint's compliance details, MAYA as the AI
  identity, the end card with the real orb.
- Duration target unchanged: **2:10–2:25, 16:9, 1080p30**.

## 2. Asset acquisition — PROVEN pipeline (do this first)

Direct `drive.google.com` HTTP is **blocked** by the sandbox proxy (CONNECT 403). Do
NOT waste time on curl. The working path, verified this session:

1. Call MCP tool `mcp__Google_Drive__download_file_content` with the `fileId`.
2. The result overflows the token limit and is **saved to disk** at
   `/root/.claude/projects/-home-user/<session>/tool-results/mcp-Google_Drive-download_file_content-<ts>.txt`
   as JSON `{content: <base64>, ...}`. The error message gives the exact path.
3. Decode: `jq -r '.content' <that-file> | base64 -d > out.mp4 && file out.mp4`

Verified working for the 310 KB PNG (1280×720 RGBA decoded clean). A 3.6 MB video
produced a 4.2 M-char tool-result file the same way — decode was interrupted by the
user (budget), not by any failure. Expect ~5–10 MB per video; do them one at a time,
`file`-check each, delete each tool-result txt after decode to save disk.

### Complete Drive inventory (folder `140wZmQXWJ4cl4iwL8XbAu38a9byvy6Pv`)

Docs (already vendored in `docs/`, skip): Design Standards MD, Creative Flow MD.

Images:
| File | ID | Size |
|---|---|---|
| Katya_BlackSuit.png (presenter, 1280×720) | `11b5bRv1EgAqmE6JXE2RwE54VIwO7oTST` | 310 KB · **already decoded once** |
| Image (11).png | `1LsJi04jXuYk1RluWa-zIiaFBEYJMGSYy` | 230 KB |
| Image (12).png | `1Q9AtN5EwPLE4gSRuS6S-K3RoA2VfSStU` | 814 KB |

Videos (unique — the folder also holds duplicate IDs of several, listed after):
| Clip | ID | Size |
|---|---|---|
| kling …1912_0.mp4 | `1NtZJUnH659UVJvZdePICRXwBNKS-kKGv` | 4.1 MB |
| kling …1915_0.mp4 | `1FE2pSecZ3yk3eSaoir7VRGv8YqZtL2M-` | 4.8 MB |
| kling …1949_0.mp4 | `1s05abjmk2IOSlpoR-fJnT2zik2rQWtHO` | 4.2 MB |
| kling …2056_0.mp4 | `19paKyFlZVEolffLrEH-VydbqzZ0qzlYg` | 4.8 MB |
| kling …2062_0.mp4 | `12Sm5W0f6tuU0LVwao2SA0W7LhAYAekxD` | 3.7 MB |
| kling …2082_0.mp4 | `173O6-lFBs_o7L29-me39s2GwbE7rp6zx` | 4.3 MB |
| kling …2090_0.mp4 | `13KYkVs-alhUkuz0-72Hk2ij51ot9Fa7v` | 3.7 MB |
| kling …2132_0.mp4 | `11byAOfEI5EEE4t9NV4AC_f5gtjoThzN_` | 3.6 MB |
| kling …2134_0.mp4 | `1o_ueHN8uYLuCl4z-mnRNWmqrvSziiTw6` | 3.2 MB |
| kling Text_to_Video Ultra_real 5318 | `1MyT8GhV3c7HQC1_l1QON0uXBttmu65ah` | 5.4 MB |
| kling Text_to_Video Finished 5392 | `116ZMxOzz125B0K7X5GNOyOwq_iSxlakc` | 5.1 MB |
| kling 20260324 Ultra_real 3667 (biggest) | `1zqqL5UYTS2DEmRsX7BTMed65iyY2VMXW` | 12.0 MB |
| grok-video-76578370…-2.mp4 | `1diJy0WlBmUKvG9uwUQ4yPQlZVS_QbmB9` | 4.0 MB |

Duplicate IDs (same title+size as above, skip): `1229QBX3AgYHZ9yKg0XIjzEz6fzn2gdNT`,
`1yQWqB8R9Q3hX2RNC-WIVH3RCqtruv-Df`, `1GG6kbJijO5URFHU8eMaRtsoKRoSIMiED`,
`13QqZWcCAFYbvdIGowAFxqfKzBnaX8e2H`, `1naTPjCWYOCipmSJH49dZASeR02qLdo-d`,
`17oBK1s_J3xPMWGpb7kSbr1_wL2iir_cc`.

## 3. Footage review (before designing scenes)

For every decoded clip: `ffprobe` (duration/resolution) + extract 4 evenly-spaced
poster frames (`ffmpeg -ss T -frames:v 1`) and **view them** (Read tool renders JPEGs).
Build a shot log: what's in the clip (family on sofa? TV on? presenter? reactions?
watermarks?), usable in/out points. **Watermark protocol** (client blueprint Part D):
if a Grok/Kling watermark is present → crop it off, never stretch (v1 precedent:
`crop=600:560:180:70` for the orb, `crop=960:876:0:0` for the CS logo).

Pick 5–7 best clips. Expect the "family turns on the TV" moment to be the opener.

## 4. Film structure (target ~135–145s)

Narrative: *a family's full viewing experience of an AI Presenter session at home.*

| Act | ~Time | Content | Source |
|---|---|---|---|
| 1. Home | 0–15 | Family settles on sofa, turns on TV — warm, cinematic | Kling clips full-screen |
| 2. The session begins | 15–35 | TV/screen shows AI Presenter loading → MAYA greets (reuse v1 s3/s4 UI scenes as the "on-screen" content, intercut with family watching) | Kling + v1 HTML scenes |
| 3. Explore together | 35–70 | Floor plans, prices, 2AM voice Q&A — intercut family reactions (pointing at screen, kids, discussion) | v1 s5/s6 + Kling reactions |
| 4. Trust | 70–100 | CS Project Navigator route draw + RERA/finance verify scenes | v1 s7/s8 (keep — they were good) |
| 5. Decision | 100–125 | Buyer-first comparison + qualified-lead card; family nods/relaxes | v1 s9/s10 + Kling |
| 6. Close | 125–144 | Katya/presenter beat if a clip supports it → orb end card: "AI Presenter — powered by MAYA" + CTA footer | Kling/Katya + v1 s11 |

Intercut style: **full-screen cuts on score section boundaries** (score sections were
composed at v1 scene bounds: 10/23/34/48/62/74/93/111/124/136). Only attempt
inside-the-TV compositing (corner-pin) if a clip has a big flat static TV screen;
otherwise don't — full-screen intercuts are safer and more cinematic.

## 5. Technical build (all patterns proven in this repo)

- Start from `funky/maya-ceo-film.html` — keep the engine: `apply(t)`, `__seek/__duration/__ready`,
  `?render=1`, POPS with `data-tx` (transform-clobber fix), narration `#nar` band, `.ost` at
  `bottom:18%` (do NOT lower it back — v1 had caption collisions).
- **Kling clips inside the deterministic render**: `<video>.currentTime` seeking is
  unreliable in headless Chromium. Use the established `__FRAMEBASE` pattern: extract
  each used clip to JPEGs (`ffmpeg -i clip.mp4 -q:v 3 frames/<name>/f%04d.jpg`, note fps)
  and in `__seek(t)` swap an `<img>` src per frame (see v1's orb end-card handling).
  For interactive browser playback keep the real `<video>` elements (frames only under `?render=1` + `__FRAMEBASE`).
- Render: playwright-core (`npm i playwright-core@1.49.0` in scratchpad), executable
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, flags `--no-sandbox`,
  viewport 960×540 @ deviceScaleFactor 2 → 1080p JPEG frames, 30 fps ×144s = 4320 frames
  (~8 min). Run via Bash `run_in_background` (2-min foreground timeout kills it otherwise).
- Encode: `ffmpeg -framerate 30 -i f%05d.jpg -i funky/assets/ceo-score.mp3 -t 144
  -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -b:a 192k -af "afade=t=out:st=141.5:d=2.5"
  -movflags +faststart out.mp4` (use apt ffmpeg, not Playwright's stripped one).
- **QA before delivering** (v1 lesson): seek-screenshot ≥6 spread timestamps from the
  encoded MP4 and LOOK at them. Watch for: text behind phones/props, badges covering
  text, kickers vs caption band, watermarks visible.
- Deliver: `SendUserFile` (files param is a JSON array) + copy MP4 to `funky/renders/` +
  commit + push. Interactive link base:
  `https://chiragmalhotra90-rgb-git-495f9d-chiragmalhotra90-5758s-projects.vercel.app/`.

## 6. Environment constraints (do not rediscover these)

- Branch: `claude/cs-media-hyperframe-video-nexekt` only. PR #1 is open — don't create a new one.
- Vercel posts a FAILED status for duplicate project `cs-media-avatar-site` on every
  push — known noise, primary project deploys Ready, ignore it.
- No outbound: drive.google.com (use MCP pipeline above), vercel.app, Google Fonts
  (renders fall back to Liberation fonts — fine). Never disable TLS / unset HTTPS_PROXY.
- Model identifiers must not appear in committed artifacts.
- Client contact footer for end card: `csmediaandproduction.in · Call / WhatsApp 7755883886 · DM for Demo`.

## 7. Still wanted from the client (ask only when relevant)

- Maya photo as a real file attachment → `funky/assets/maya.jpg` (auto-fills `.mphoto`).
- HeyGen/ElevenLabs key or recorded VO → narration captions in the film are the exact
  VO script; mix over the score and re-render.
