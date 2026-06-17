# Portfolio Redesign — Context & Progress

Working context for the v2 redesign of this portfolio. Living doc — update as we go.

## Goal
Modernize the portfolio: clean/simple, smoother animations, fully responsive. Moved from the
old dark gradient + busy pacman-maze background to a **light graph-paper grid** with Pac-Man
kept as tasteful **accents**. Projects get a creative **Pac-Man maze gallery** treatment.

**Status: v2 is shipped and live** at https://doyoojk.github.io/Jamie_Portfolio/.

## Design source (Figma)
- File: `https://www.figma.com/design/VDgh8HjZYsWgP8zErSbtPz/Untitled`
- **Desktop** frame: node `4:2` (sections spaced into ~920px screen-height bands)
- **Mobile** frame: node `32:2` (390px; 2-col skills, zigzag mini-maze projects)
- Built via Figma MCP on the personal account (doyoojk@gmail.com, upgraded to Pro). The
  loop.com account can't edit this file.

## Design decisions
- **Background:** light grey graph-paper grid (`#F6F7F9` bg, `#E2E6EC` lines, 48px).
- **Accents / palette:** Pac-Man yellow `#FFC233`; ghost colors cyan `#14C7C7`, pink `#FF5FA2`,
  orange `#FF9F43`, red `#FF5B5B`; violet `#8B5CF6` (creative). The maze wall now uses a subtle
  grey accent (`rgba(102,110,128,0.21)`) instead of the original blue.
- **Type:** Pixelify Sans (headings) + **Bitcount Prop Single** (arcade/LED accents) +
  Quicksand (body), all via Google Fonts. (Figma can't render Bitcount, so it was finalized in
  code.)
- **Sections:** Nav · Hero · Skills · Experience · Projects (maze) · About (arcade) · Contact.
- **Content is resume-accurate** (Walmart SWE II, etc.). Skills = Languages, Frontend, Backend &
  Frameworks, Testing & CI/CD, Automation & Tools, Cloud Platforms, + a featured **Creative &
  Media** card (Processing, p5.js, Three.js, Figma, Photoshop, video editing).
- **Projects featured (6 visual):** Emotion Detection Art, Animated Kitty, Virtual Space Sim,
  Loop Subdivision, Cat-Fall, ATL Path-Finder. Data-driven from `data/projects.json`; demos are
  local `mp4` (with image fallback), no more GitHub README scraping.

## Pac-Man maze gallery (projects)
- **Desktop:** 3×2 board of project "rooms" on a pellet trail, with Pac-Man + ghosts between
  rows, inside a maze wall.
- **Mobile:** vertical "descend the maze" stack — rooms centered, Pac-Man down the top, pellet
  and ghost connectors between cards.

## About — arcade cabinet
- An "About me" section styled as a playable arcade machine: cabinet with marquee, monitor
  bezel/screen, and a control deck (tilted joystick, buttons, coin slot).
- **Press-to-start intro:** clicking the screen plays a coin sliding into the slot →
  Pac-Man crossing the screen eating a pellet trail → the "player profile" powers on (socials,
  hobbies as ghosts, hi-score chips, a Creative Mode tile). Respects `prefers-reduced-motion`.
- **Desktop only for now** (`#about` is hidden under 860px).

## Status
- [x] Desktop + mobile mockups (Figma)
- [x] **v2 shipped** (PR #2): light grid theme, Pac-Man maze gallery, Bitcount Prop Single font,
      curated `data/projects.json`, resume-accurate Skills/Experience, fluid/responsive layout.
- [x] Deploy 404 hotfix (PR #3): `js/projects.js` was gitignored.
- [x] Mobile layout (PR #4): vertical descending maze + compact sizing; fixed the closed
      mobile-menu swallowing taps near the top.
- [x] Pages deploy workflow cleanup (PR #6): removed the steps that regenerated/committed the
      obsolete `repos.json`.
- [x] Media optimization (PR #7): project GIFs → mp4 (~19MB → ~2.6MB) via
      `scripts/optimize-media.py`.
- [x] **About arcade section** (PR #8): cabinet + press-to-start coin/Pac-Man intro; also fixed
      the Pac-Man shape site-wide (was square-cornered — `clip-path` overrode `border-radius`;
      now a `border-radius` circle with a `conic-gradient` wedge mouth).

## TODO
- [ ] **Mobile About layout** — the arcade cabinet is desktop-only; design a compact mobile
      version (currently hidden under 860px).
- [ ] Minor: the Emotion Detection Art poster (first video frame) is a bit dark.
