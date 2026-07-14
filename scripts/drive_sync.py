#!/usr/bin/env python3
"""
Drive -> gallery/content.json sync (service-account, recursive).

Walks a Google Drive folder tree, auto-detects each file's type, builds the
gallery manifest (view/embed + download links), de-dupes, and preserves manual
curation (featured / engagement / status) across runs.

Env:
  GOOGLE_APPLICATION_CREDENTIALS  path to the service-account JSON key
  GDRIVE_FOLDER_ID                root folder id to index
Run locally:  GOOGLE_APPLICATION_CREDENTIALS=key.json GDRIVE_FOLDER_ID=... python scripts/drive_sync.py
"""
import os, re, json, sys
from datetime import datetime, timezone
from google.oauth2 import service_account
from googleapiclient.discovery import build

FOLDER_ID = os.environ.get("GDRIVE_FOLDER_ID", "1Yygagr6HoH9OCf4THy39hFH1bJ5gGAIi")
OUT = os.path.join(os.path.dirname(__file__), "..", "gallery", "content.json")
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

# Google-native → export/skip; everything else keyed by mime prefix/exact.
def detect(mime, name):
    n = name.lower()
    if mime.startswith("image/gif"): return "gif"
    if mime.startswith("image/"):    return "photo"
    if mime.startswith("video/"):    return "video"
    if mime.startswith("audio/"):    return "audio"
    if mime == "application/pdf":                                   return "research"
    if mime == "application/vnd.google-apps.document":              return "research"
    if mime == "application/vnd.google-apps.presentation":          return "research"
    if mime in ("image/vnd.adobe.photoshop","application/postscript","application/illustrator"): return "design"
    if mime == "application/vnd.google-apps.spreadsheet":           return None   # data, not portfolio content
    if mime == "application/vnd.google-apps.folder":               return "folder"
    return None  # unknown -> skip

def thumb(fid):    return f"https://drive.google.com/thumbnail?id={fid}&sz=w1600"
def dl(fid):       return f"https://drive.google.com/uc?export=download&id={fid}"
def file_preview(fid): return f"https://drive.google.com/file/d/{fid}/preview"
def doc_preview(fid):  return f"https://docs.google.com/document/d/{fid}/preview"
def slides_preview(fid): return f"https://docs.google.com/presentation/d/{fid}/preview"

def shot_date(name, fallback):
    m = re.search(r"(20\d{6})", name)
    if m:
        s = m.group(1)
        return f"{s[0:4]}-{s[4:6]}-{s[6:8]}"
    return fallback

def slug_tags(path_parts):
    tags = []
    for p in path_parts:
        for w in re.split(r"[\s_\-/]+", p.lower()):
            w = w.strip()
            if w and w not in tags and not w.isdigit() and len(w) > 1:
                tags.append(w)
    return tags[:8]

def build_item(f, path_parts):
    fid, name, mime = f["id"], f["name"], f["mimeType"]
    cat = detect(mime, name)
    if cat in (None, "folder"):
        return None
    modified = (f.get("modifiedTime") or "")[:10] or "2024-01-01"
    # aspect from Drive metadata when available
    im = f.get("imageMediaMetadata") or {}
    vm = f.get("videoMediaMetadata") or {}
    w = im.get("width") or vm.get("width")
    h = im.get("height") or vm.get("height")
    aspect = [int(w), int(h)] if w and h else ([16, 9] if cat == "video" else [4, 3])
    # rejected vault if any ancestor folder is a goof-ups bin
    rejected = any(p.lower().lstrip("_") in ("goofups", "goof-ups", "rejected", "goofup") for p in path_parts)

    item = {
        "id": "gd-" + fid,
        "title": re.sub(r"\.[a-z0-9]{2,4}$", "", name, flags=re.I),
        "category": cat, "type": cat,
        "topics": slug_tags(path_parts + [re.sub(r"\.[a-z0-9]{2,4}$", "", name, flags=re.I)]),
        "aspect": aspect,
        "src": "", "poster": "", "download": dl(fid),
        "status": "rejected" if rejected else "published",
        "added": shot_date(name, modified),
        "engagement": 50, "featured": False,
    }
    if cat == "video":
        item["poster"] = thumb(fid); item["src"] = file_preview(fid)
    elif cat == "research":
        if mime == "application/vnd.google-apps.document":     item["src"] = doc_preview(fid)
        elif mime == "application/vnd.google-apps.presentation": item["src"] = slides_preview(fid)
        else:                                                  item["src"] = file_preview(fid)
        item["download"] = f"https://drive.google.com/file/d/{fid}/view"
    else:  # photo / gif / design
        item["src"] = thumb(fid)
    return item

def walk(svc, folder_id, path_parts, out):
    page = None
    while True:
        resp = svc.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            fields="nextPageToken, files(id,name,mimeType,modifiedTime,imageMediaMetadata,videoMediaMetadata)",
            pageSize=1000, pageToken=page,
            supportsAllDrives=True, includeItemsFromAllDrives=True,
        ).execute()
        for f in resp.get("files", []):
            if f["mimeType"] == "application/vnd.google-apps.folder":
                walk(svc, f["id"], path_parts + [f["name"]], out)
            else:
                it = build_item(f, path_parts)
                if it: out.append(it)
        page = resp.get("nextPageToken")
        if not page:
            break

def main():
    creds = service_account.Credentials.from_service_account_file(
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"], scopes=SCOPES)
    svc = build("drive", "v3", credentials=creds, cache_discovery=False)

    items = []
    walk(svc, FOLDER_ID, [], items)

    # de-dup by id
    seen, clean = set(), []
    for it in items:
        if it["id"] in seen: continue
        seen.add(it["id"]); clean.append(it)

    # preserve manual curation (featured / engagement / status) from the previous manifest
    try:
        old = {i["id"]: i for i in json.load(open(OUT)).get("items", [])}
        for it in clean:
            o = old.get(it["id"])
            if o:
                it["featured"] = o.get("featured", it["featured"])
                it["engagement"] = o.get("engagement", it["engagement"])
                if o.get("status") == "rejected": it["status"] = "rejected"
    except Exception:
        pass

    out = {
        "_readme": "MASTER MANIFEST — auto-generated by scripts/drive_sync.py from the Drive folder. "
                   "Types detected from mime; photos/gifs use Drive thumbnails, videos use a poster + Drive player embed, "
                   "docs/decks/pdfs embed via Drive preview. Manual featured/engagement/status are preserved across runs.",
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "driveFolder": "https://drive.google.com/drive/folders/" + FOLDER_ID,
        "items": clean,
    }
    with open(OUT, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    from collections import Counter
    print(f"synced {len(clean)} items ->", os.path.normpath(OUT))
    print("by category:", dict(Counter(i["category"] for i in clean)))

if __name__ == "__main__":
    main()
