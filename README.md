# Jamie Kim — Portfolio

Personal portfolio site. **Live:** https://doyoojk.github.io/Jamie_Portfolio/

A hand-built, dependency-free static site with a light "graph-paper grid" theme and
Pac-Man accents throughout — including a projects gallery laid out as a Pac-Man maze and
an About section styled as a playable arcade cabinet.

## Tech

- Vanilla **HTML / CSS / JS** — no framework, no build step.
- Fonts via Google Fonts: **Pixelify Sans** (headings) + **Bitcount Prop Single** (arcade
  accents) + **Quicksand** (body).
- Hosted on **GitHub Pages**, deployed by GitHub Actions.

## Sections

`Hero · Skills · Experience · Projects · About · Contact`

- **Projects** — a Pac-Man "maze" gallery: project rooms on a pellet trail with ghosts
  between rows. Each room plays a short demo clip on hover. On mobile it becomes a vertical
  "descend the maze" stack.
- **About** — an arcade cabinet (desktop only for now). Press the screen and a coin slides
  into the slot, Pac-Man crosses the screen eating the pellet trail, then a "player profile"
  powers on (socials, hobbies as ghosts, hi-score chips). Respects `prefers-reduced-motion`.

## Structure

```
index.html              # all markup
css/
  styles.css            # base theme, layout, grid background, Pac-Man accents
  maze.css              # projects maze gallery
  about.css             # About arcade cabinet
js/
  script.js             # nav, scroll-spy, reveals, About arcade sequence
  projects.js           # renders project rooms from data/projects.json
data/projects.json      # curated project list + media references
assets/projects/        # project demo media (mp4 / image)
scripts/                # media helpers (fetch + optimize, require ffmpeg)
.github/workflows/      # GitHub Pages deploy
```

## Run locally

No build step — serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000/
```

## Projects & media

Project cards are data-driven from `data/projects.json` (title, tag, links, and a media
file). Demo clips live in `assets/projects/` as `mp4` (with an image fallback); the renderer
prefers a `<video>` and falls back to an image. `scripts/optimize-media.py` converts source
GIFs/clips to compact mp4 (needs `ffmpeg`).

## Deploy

Pushing to `main` triggers `.github/workflows/static.yml`, which publishes the site to
GitHub Pages. No manual step required.
