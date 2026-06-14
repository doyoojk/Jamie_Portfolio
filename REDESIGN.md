# Portfolio Redesign — Context & Progress

Working context for the v1 redesign of this portfolio. Living doc — update as we go.

## Goal
Modernize the portfolio: clean/simple, smoother animations, fully responsive. Move from the
dark gradient + busy pacman-maze background to a **light graph-paper grid** with pacman kept
only as tasteful **accents**. Projects get a creative **pacman-maze gallery** treatment.

## Design source (Figma)
- File: `https://www.figma.com/design/VDgh8HjZYsWgP8zErSbtPz/Untitled`
- **Desktop** frame: node `4:2` (sections spaced into ~920px screen-height bands)
- **Mobile** frame: node `32:2` (390px; 2-col skills, zigzag mini-maze projects)
- Built via Figma MCP on the personal account (doyoojk@gmail.com, upgraded to Pro). The
  loop.com account can't edit this file.

## Design decisions (locked for v1)
- **Background:** light grey graph-paper grid (`#F6F7F9` bg, `#E2E6EC` lines, 48px).
- **Accents / palette:** pacman yellow `#FFC233`; ghost colors cyan `#14C7C7`, pink `#FF5FA2`,
  orange `#FF9F43`, red `#FF5B5B`; maze-wall blue `#3D5AF1`; violet `#8B5CF6` (creative).
- **Type:** Pixelify Sans (headings/accents) + Quicksand (body) in the mockup.
  - NOTE: user wants a dotty/LED font (**Bitcount Prop Single**, fallback Doto). Figma can't
    render those (too new), but they load fine via Google Fonts CDN in code. Finalize in code.
- **Sections:** Nav · Hero · Skills · Experience · Projects (maze) · Contact · Footer.
- **Content is resume-accurate** (see `~/Downloads/main.md`): Walmart SWE II, etc.
  - Skills = Languages, Frontend, Backend & Frameworks, Testing & CI/CD, Automation & Tools,
    Cloud Platforms, + featured **Creative & Media** (Processing, p5.js, Three.js, Figma,
    Photoshop, video editing).
- **Projects featured (6 visual):** Emotion Detection Art, Animated Kitty, Virtual Space Sim,
  Loop Subdivision, Cat-Fall, ATL Path-Finder.
- **Mobile:** compact (smaller type ~0.85, ~30px margins); projects = zigzag mini-maze (small
  rooms alternating across a pellet trail, pacman + ghost).

## Status
- [x] Desktop + mobile mockups (Figma)
- [x] **v2 shipped in code** (PR #2, merged): light grid theme, pacman maze gallery, Bitcount
      Prop Single font, curated `data/projects.json` + local GIFs (no more GitHub README
      scraping), resume-accurate Skills/Experience, fluid/responsive layout.
- [x] Deploy hotfix (PR #3, merged): `js/projects.js` was gitignored → 404 on the live site.

## TODO
- [ ] **Clean up the Pages deploy workflow** (`.github/workflows/static.yml`): remove the leftover
      v1 steps (*Setup Node.js*, *Fetch GitHub repos*, *Commit data*) that regenerate and
      re-commit the obsolete `repos.json` on every deploy, drop the `contents: write` permission,
      and delete `repos.json`. Requires a token with `workflow` scope (`gh auth refresh -s workflow`).
- [ ] **Mobile layout** (in progress — branch `feat/mobile-layout`): zigzag mini-maze for the
      projects section + compact mobile sizing. Also carries the closed-mobile-menu tap-interception
      fix (the menu kept `display:flex` and swallowed taps near the top of the page).
- [ ] Media optimization: convert project GIFs → mp4/webm to shrink the ~19MB payload
      (`scripts/optimize-media.py`, needs `ffmpeg`).
