#!/usr/bin/env python3
"""One-time helper: convert the fetched project GIFs into small looping videos
(mp4 + webm) plus a poster frame, and rewire data/projects.json to use them.

Requires ffmpeg:  brew install ffmpeg
Run from the repo root:  python3 scripts/optimize-media.py

Videos are typically 5-10x smaller than the source GIFs and play more smoothly.
The original .gif files are kept as a fallback source; remove them once happy.
"""
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_JSON = os.path.join(ROOT, "data", "projects.json")
ASSETS = os.path.join(ROOT, "assets", "projects")


def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def main():
    if not shutil.which("ffmpeg"):
        print("ffmpeg not found. Install it first:  brew install ffmpeg")
        return 1

    with open(PROJECTS_JSON) as f:
        data = json.load(f)

    for p in data["projects"]:
        src = p.get("media", "")
        if not src.lower().endswith(".gif"):
            continue  # leave static images (e.g. .png) as-is
        abs_src = os.path.join(ROOT, src)
        if not os.path.exists(abs_src):
            print(f"  ✗ {p['id']}: missing {src}")
            continue

        base = os.path.join(ASSETS, p["id"])
        even = "scale=trunc(iw/2)*2:trunc(ih/2)*2"

        # mp4 (h264)
        run(["ffmpeg", "-y", "-i", abs_src, "-movflags", "+faststart",
             "-pix_fmt", "yuv420p", "-vf", even, "-an", f"{base}.mp4"])
        # webm (vp9)
        run(["ffmpeg", "-y", "-i", abs_src, "-c:v", "libvpx-vp9",
             "-b:v", "0", "-crf", "34", "-vf", even, "-an", f"{base}.webm"])
        # poster (first frame)
        run(["ffmpeg", "-y", "-i", abs_src, "-vframes", "1", f"{base}.jpg"])

        p["video"] = {
            "mp4": f"assets/projects/{p['id']}.mp4",
            "webm": f"assets/projects/{p['id']}.webm",
        }
        p["poster"] = f"assets/projects/{p['id']}.jpg"
        print(f"  ✓ {p['id']}: mp4 + webm + poster")

    with open(PROJECTS_JSON, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")
    print("Updated data/projects.json (now prefers video sources)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
