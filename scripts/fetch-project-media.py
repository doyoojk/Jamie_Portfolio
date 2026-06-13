#!/usr/bin/env python3
"""One-time helper: pull the first demo image/GIF from each project's GitHub
README into assets/projects/, and update data/projects.json `media` paths.

Run from the repo root:  python3 scripts/fetch-project-media.py

The live site does NOT call GitHub — this just bakes the assets in locally.
"""
import base64
import json
import os
import re
import sys
import urllib.request
from posixpath import dirname

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_JSON = os.path.join(ROOT, "data", "projects.json")
ASSETS_DIR = os.path.join(ROOT, "assets", "projects")
OWNER = "doyoojk"
UA = {"User-Agent": "jamie-portfolio-media-fetch"}

IMG_RE = re.compile(
    r"!\[[^\]]*\]\(([^)\s]+\.(?:gif|png|jpe?g|webp))\)"
    r"|<img[^>]+src=[\"']([^\"']+?\.(?:gif|png|jpe?g|webp))[\"']",
    re.IGNORECASE,
)


def repo_from_url(url):
    return url.rstrip("/").split("/")[-1]


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def to_raw(url, base):
    """Resolve a README image reference to an absolute raw URL."""
    if url.startswith("http"):
        return url.replace("https://github.com", "https://raw.githubusercontent.com").replace("/blob/", "/")
    return base.rstrip("/") + "/" + url.lstrip("./")


def pick_image(markdown, base):
    urls = [m[0] or m[1] for m in IMG_RE.findall(markdown)]
    urls = [u for u in urls if "shields.io" not in u and "badge" not in u.lower()]
    if not urls:
        return None
    gifs = [u for u in urls if u.lower().split("?")[0].endswith(".gif")]
    return to_raw(gifs[0] if gifs else urls[0], base)


def download(url, dest):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())


def main():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    with open(PROJECTS_JSON) as f:
        data = json.load(f)

    for p in data["projects"]:
        repo = repo_from_url(p["repoUrl"])
        try:
            meta = get_json(f"https://api.github.com/repos/{OWNER}/{repo}/readme")
            readme = base64.b64decode(meta["content"]).decode("utf-8", "replace")
            base = dirname(meta["download_url"])
            img = pick_image(readme, base)
            if not img:
                print(f"  ✗ {repo}: no image found in README")
                continue
            ext = img.lower().split("?")[0].rsplit(".", 1)[-1]
            rel = f"assets/projects/{p['id']}.{ext}"
            download(img, os.path.join(ROOT, rel))
            p["media"] = rel
            print(f"  ✓ {repo} -> {rel}")
        except Exception as e:
            print(f"  ✗ {repo}: {e}")

    with open(PROJECTS_JSON, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")
    print("Updated data/projects.json")


if __name__ == "__main__":
    sys.exit(main())
