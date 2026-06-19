#!/usr/bin/env python3
"""Split a tall screenshot into vertical sections for VLM analysis."""
from PIL import Image
import sys
import os

src = sys.argv[1]
out_dir = sys.argv[2]
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src)
w, h = img.size
print(f"Source: {w}x{h}")

section_h = 3000
sections = (h + section_h - 1) // section_h
print(f"Splitting into {sections} sections")

for i in range(sections):
    top = i * section_h
    bottom = min(top + section_h, h)
    crop = img.crop((0, top, w, bottom))
    out = os.path.join(out_dir, f"section-{i+1:02d}.png")
    crop.save(out, optimize=True)
    print(f"  -> {out} ({w}x{bottom-top})")
