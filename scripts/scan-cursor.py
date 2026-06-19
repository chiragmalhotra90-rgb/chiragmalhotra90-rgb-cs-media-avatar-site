"""Hover across a grid of points and report where cursor becomes pointer."""
import subprocess
import time

# Grid: x from 50 to 700 (left + center-left), y from 200 to 700
hits = []
for y in range(250, 750, 40):
    for x in range(40, 700, 30):
        subprocess.run(["agent-browser", "mouse", "move", str(x), str(y)], capture_output=True)
        time.sleep(0.02)
        result = subprocess.run(["agent-browser", "eval", "document.body.style.cursor"], capture_output=True, text=True)
        cursor = result.stdout.strip()
        if "pointer" in cursor.lower():
            hits.append((x, y))
            print(f"  HIT at ({x}, {y})")

print(f"\nTotal hits: {len(hits)}")
print(f"First 10: {hits[:10]}")
