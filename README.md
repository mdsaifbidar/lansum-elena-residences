# Lansum Elena Residences — Scroll Walkthrough

An immersive, scroll-driven walkthrough of Lansum Elena Residences. The entire
four-minute property film is controlled by scroll: scrolling forward advances
the camera through the towers, the grounds and the homes; scrolling back
reverses it. No framework — Vite + vanilla JS + GSAP/ScrollTrigger + Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # -> dist/
```

## How it works

- **`src/scroll/videoScrub.js`** — the `<video>` is never played; scroll
  position seeks it. A rAF loop eases `currentTime` toward the scroll target
  and clamps it to what has downloaded, so scrolling ahead of the buffer makes
  the film advance as it loads rather than freezing.
- **`src/scroll/chapters.js`** — the scene map, hand-derived from the film.
  Each chapter has a `dwell` (screen-heights of scroll) so you move slowly
  through a room the film only spends a few seconds on. `buildBands()` turns
  those into a non-linear scroll ↔ time map.
- **`src/sections/`** — chapter title cards + hotspots, and the progress rail.
- **`src/config.js`** — video quality tiers (`hd` / `sd` / `mobile`).
  `sd` is the default (loads fast). Switch with `?q=hd` in the URL,
  `elenaSetQuality('hd')` in the console, or by editing `DEFAULT_QUALITY`.

## Assets

`public/walkthrough-*.mp4` are re-encodes of the source film (short-GOP so
seeking is cheap), trimmed to 240s and served by device / quality tier.

## Content note

Section copy and metadata describe only what is visible on screen — no areas,
orientations, floor levels, materials or brands are asserted, since the film
does not state them.
