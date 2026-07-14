# Content Library — the self-owned B-Roll Vault

`gallery/index.html` is a searchable, borderless content library styled to match the CS Media site.
It behaves like a private stock/B-roll site of **your own** work: you **view** here, and **download**
from Google Drive. This doc explains how it works today and exactly what to hand over to wire up Drive.

## Standalone project

Everything lives in this `gallery/` folder and is fully self-contained (`index.html`, `content.json`,
`vercel.json`, this doc). The original CS Media site is **not modified** except for one **Gallery** button
in its nav that links here. Deploy options:

- **Same domain (works now):** the main site serves the repo root, so `csmediaandproduction.in/gallery/`
  already resolves. Nothing else to do.
- **Its own Vercel project / domain:** create a new Vercel project from this repo and set **Root Directory =
  `gallery`**. It deploys independently of the main site. Then repoint the Gallery button's `href` to the new URL.

---

## What's built (the "basics", live now)

| Requirement | Status | Where |
|---|---|---|
| Categories: photo, text/font, animated, gif, 2D/3D, html, video, audio, print | ✅ | `CATS` in `gallery/index.html` |
| Hidden "Goof-Ups" section, request-only | ✅ | **Request Goof-Ups** button, or `portfolio.html?vault=1` |
| Seamless, borderless collage that keeps each item's original shape | ✅ | `.collage` CSS columns + aspect-ratio placeholders |
| No two neighbours of the same category (anti-repeat) | ✅ | `rankAntiRepeat()` |
| No duplicates / same thing repeated | ✅ | `ingest()` de-dupes by id + title signature |
| Categories kept separate | ✅ | one collage section per category |
| View-preference / placement algorithm | ✅ | `VIEW_PREFERENCE` + `score()` |
| Weekly re-scoring, easily adjustable | ✅ (hook) | `VIEW_PREFERENCE.refreshCron` + the automation below |
| Search / extract by keyword or topic | ✅ | search box + `matches()` |
| Master sheet, downloadable | ✅ | **↓ Master Sheet (CSV)** button + `master-sheet-template.csv` |
| View on site, download via Drive | ✅ | per-item Drive `download` link in the lightbox |
| Data sourced from Google Drive | ✅ initial sync done | folder **CS MEDIA AND PRODUCTION** → 52 items (50 photos + 2 docs) |

Everything reads from **one file: `content.json`** — the single source of truth (the "master sheet" as data).
It is now populated from the live Drive folder: types auto-detected from mime types, photos link to Drive
thumbnails, the Doc + deck embed via Drive preview, and every item carries a Drive read/download link.

### ⚠️ Drive sharing
The folder is currently shared **"Anyone with the link → Editor"**. That makes the files public (so the
portfolio renders), but *Editor* means anyone with the link could change or delete them. Change it to
**Viewer** in Drive → Share — the portfolio only needs view access.

### Automated weekly sync (service account)
`scripts/drive_sync.py` + `.github/workflows/drive-sync.yml` regenerate `content.json` from the Drive
folder every Monday (and on-demand via **Actions → Drive → Gallery sync → Run workflow**). It walks the
whole folder tree recursively, auto-detects types, builds view/embed + download links, de-dupes, and
**preserves your manual `featured` / `engagement` / `status` edits** across runs.

**One-time setup (your side):**
1. In Google Cloud (project of the service account), **enable the Google Drive API**.
2. Service account → **Keys → Add key → Create new key → JSON**, download it.
3. **Share the Drive folder** with the service-account email
   (`codex-google-drive-agent@…gserviceaccount.com`) as **Viewer** — this lets the sync read even private files.
4. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - `GDRIVE_SA_KEY` = paste the whole JSON key file
   - `GDRIVE_FOLDER_ID` = `1Yygagr6HoH9OCf4THy39hFH1bJ5gGAIi`
5. Run the workflow once (**Run workflow**) to verify. It commits a fresh `content.json` if anything changed.

> **Sync access vs. display access are different.** Sharing with the service account lets the *sync* read
> private files, but the *website* is fetched by each visitor's browser directly from Drive — so any file
> you want to **display** must also be **"Anyone with the link → Viewer"**. Files shared only with the SA
> will be indexed but appear blank on the public page. Keep truly-private material out of the showcase folder.

### Type detection & video
`drive_sync.py` maps mime types → categories: images→`photo` (gif→`gif`), `video/*`→`video`
(poster thumbnail + Drive player embed in the lightbox), `audio/*`→`audio`, PDFs/Docs/Slides→`research`,
PSD/AI/EPS→`design`, spreadsheets skipped. A folder named `_goofups` / `rejected` routes its files to the
Goof-Ups vault. Suggested video layout: `video/avatar`, `video/broll`, `video/3d`, `video/footage` — folder
names become search tags automatically.

### Re-syncing on request
No credentials yet? Just say **"re-sync the gallery"** and the current Drive contents are re-read in-session
and `content.json` regenerated + pushed.

---

## The master sheet / data model (`content.json`)

Each item is one row. Columns:

| field | meaning |
|---|---|
| `id` | stable unique id (keep it stable across weekly runs) |
| `title` | display title |
| `category` | `photo` · `text` · `animation` · `gif` · `design` (2D/3D) · `html` · `video` · `audio` · `print` · `research` |
| `type` | render hint (same set as category). `research` = a PDF/paper: shown as a page tile, opened/read via its Drive link |
| `topics` | `[]` of tags — used by **search** and **dedup** |
| `aspect` | `[w, h]` — keeps the original shape in the collage |
| `src` | Drive **preview/embed** URL for viewing (empty ⇒ a styled placeholder is drawn) |
| `download` | Drive **download** URL for that item |
| `status` | `published` or `rejected` (`rejected` ⇒ Goof-Ups vault) |
| `added` | `YYYY-MM-DD` — feeds recency in scoring |
| `engagement` | `0–100` signal from your tracking — feeds scoring |
| `featured` | `true` = curator pick — feeds scoring |

`master-sheet-template.csv` is the same shape as a spreadsheet, if you'd rather track in Sheets and
export/convert to `content.json`. The **↓ Master Sheet (CSV)** button on the page exports the current
library back to CSV any time.

---

## The view-preference (placement) algorithm

Score per item (all terms normalise to 0–1, weights auto-normalise):

```
score = recency·w1 + engagement·w2 + richness·w3 + curator·w4
```

- **recency** — exponential decay from `added` (half-life = `recencyHalfLifeDays`)
- **engagement** — `item.engagement / 100`
- **richness** — how "rich" the format reads to a scanning viewer (motion/interactive > flat stills), the global-market bias
- **curator** — `1` if `featured`, else `0`

Then **anti-repeat** reorders the ranked list so no two neighbours share a category.

**To tune:** edit the `VIEW_PREFERENCE` block at the top of the `<script>` in `gallery/index.html` —
weights, per-format `richness`, `recencyHalfLifeDays`, `curatedCount`, `antiRepeat` on/off. That's the
whole knob panel; the weekly automation can overwrite this block or the per-item scores in `content.json`.

---

## Wiring Google Drive (what to hand over)

Give me a Drive link with this kind of shape and I'll finish the pipeline:

```
📁 CS Media Library
   📁 photo      📁 video      📁 design(2D-3D)
   📁 animation  📁 gif        📁 html
   📁 audio      📁 text-font  📁 print
   📁 research   ← papers / PDFs (read + download via Drive)
   📁 _goofups   ← rejected / request-only
```

Sort content into topic subfolders (or tag file names). The weekly automation then:

1. **Reads** each folder via the Google Drive API (or a Make/Zapier scenario).
2. **Detects type** from the folder + file mime/extension.
3. **Dedupes** by file id and by title/topic signature (never adds the same thing twice).
4. **Scores** every item with the view-preference weights above.
5. **Writes** a fresh `content.json` (view `src` = Drive preview URL, `download` = Drive download URL).
6. **Commits** it — Vercel redeploys the static site automatically.

The site stays view-only; all downloads resolve to Drive, so your team gets access by Drive share, not by
scraping the page. A weekly cron (GitHub Action / Make schedule) drives step 1–6 on the `refreshCron` cadence.

**Next step:** hand over the Drive folder link and confirm the subfolder names, and I'll build the
sync + weekly automation on top of this foundation.
