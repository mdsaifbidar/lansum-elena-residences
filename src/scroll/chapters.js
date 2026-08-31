/**
 * Scene map — derived from complete.mp4 (1920x1080, 30fps, ~4:16).
 * The re-encoded walkthrough is trimmed to 240s (the tail is the film's own
 * end card, replaced here by the HTML finale).
 *
 * Every chapter's time window, title and observed details come from what is
 * actually on screen in that range. Nothing about areas, orientation, floor
 * levels, materials or brands is asserted — the film does not state them.
 *
 * `dwell` = how many viewport-heights of scrolling that chapter occupies,
 * INDEPENDENT of how long its footage is.
 *
 * The source film is a montage that cuts every ~2-2.5s, so dwell is set high
 * enough (~180px of scroll per second of footage) that a single scroll gesture
 * stays inside one shot instead of skipping through several. Total ~53
 * viewport-heights of scrolling — it is a long, deliberate page by design.
 * Halve every value here (or set PACE to 0.5) for a quicker walkthrough.
 */

export const VIDEO_DURATION = 240; // trimmed just before the film's own end card
export const PACE = 1.0; // global multiplier on every chapter's dwell

export const CHAPTERS = [
  {
    id: 'arrival',
    title: 'Arrival',
    kicker: 'Prologue',
    start: 0,
    end: 15,
    dwell: 3.0,
    line: 'First light over the city — an invitation to slow down.',
    observed: ['Sunrise skyline', 'Flight over the city', 'A tree-lined approach'],
    hotspots: [],
  },
  {
    id: 'towers',
    title: 'The Towers',
    kicker: 'Chapter 01',
    start: 15,
    end: 43,
    dwell: 5.4,
    line: 'Two towers rise from the canopy, framed by old trees.',
    observed: ['Twin residential towers', 'Timber screen with the Elena mark', 'Landscaped forecourt'],
    hotspots: [
      { at: 24.5, x: 50, y: 55, label: 'The Elena monogram, set into a timber screen' },
    ],
  },
  {
    id: 'court',
    title: 'Arrival Court',
    kicker: 'Chapter 02',
    start: 43,
    end: 50.5,
    dwell: 1.5,
    line: 'A slow turn around the architecture.',
    observed: ['Sculpted tower facade', 'Arrival driveway', 'Aerial orbit of the massing'],
    hotspots: [],
  },
  {
    id: 'oasis',
    title: 'An Oasis of Calm',
    kicker: 'Chapter 03',
    start: 50.5,
    end: 63.5,
    dwell: 2.7,
    line: 'Water held quietly between the wings of the building.',
    observed: ['Reflecting water court', 'Flowering planting', 'A canopy of tall trees'],
    hotspots: [
      { at: 55.5, x: 50, y: 66, label: 'A still reflecting pool between the wings' },
    ],
  },
  {
    id: 'nature',
    title: 'Nature & Wellness',
    kicker: 'Chapter 04',
    start: 63.5,
    end: 82,
    dwell: 3.9,
    line: 'Trails through the trees, and room to move in the open air.',
    observed: ['Timber nature boardwalk', 'Open-air fitness deck under a canopy', 'Garden lawns'],
    hotspots: [
      { at: 71, x: 50, y: 58, label: 'An open-air training deck beneath a tensile canopy' },
    ],
  },
  {
    id: 'lounges',
    title: 'The Lounges',
    kicker: 'Chapter 05',
    start: 82,
    end: 91,
    dwell: 1.9,
    line: 'Sheltered places to sit, read and look out over the green.',
    observed: ['Sun-loungers on a garden terrace', 'A covered reading pavilion', 'Perforated art screens'],
    hotspots: [],
  },
  {
    id: 'living',
    title: 'Living Room',
    kicker: 'Chapter 06',
    start: 91,
    end: 103,
    dwell: 3.3,
    line: 'Where light, proportion and openness meet.',
    observed: ['Full-height glazing', 'A fluted room divider', 'Framed artwork and a ceiling fan'],
    hotspots: [
      { at: 97.5, x: 68, y: 52, label: 'A blue fluted screen divides living from dining' },
    ],
  },
  {
    id: 'dining',
    title: 'Dining',
    kicker: 'Chapter 07',
    start: 103,
    end: 115,
    dwell: 3.3,
    line: 'A table set beneath a soft, circular light.',
    observed: ['Stone-topped dining table', 'A round wall mirror', 'Panelled walls, fresh tulips'],
    hotspots: [
      { at: 109, x: 44, y: 40, label: 'A round mirror above the sideboard' },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    kicker: 'Chapter 08',
    start: 115,
    end: 120,
    dwell: 1.5,
    line: 'The heart of the home — bright and unfussy.',
    observed: ['A central island', 'Pale cabinetry', 'A breakfast setting by the window'],
    hotspots: [
      { at: 117.5, x: 50, y: 60, label: 'A central island anchors the kitchen' },
    ],
  },
  {
    id: 'bedroom',
    title: 'Master Bedroom',
    kicker: 'Chapter 09',
    start: 120,
    end: 130.5,
    dwell: 2.9,
    line: 'Rest and recharge, wrapped in quiet colour.',
    observed: ['A textured accent wall', 'Suspended bedside lights', 'A low, wide bed'],
    hotspots: [
      { at: 123.5, x: 40, y: 40, label: 'Slim pendant lights in place of bedside lamps' },
    ],
  },
  {
    id: 'bath',
    title: 'The Bath',
    kicker: 'Chapter 10',
    start: 130.5,
    end: 133,
    dwell: 1.0,
    line: 'A calm, well-lit place to begin the day.',
    observed: ['A twin vanity', 'A round mirror', 'A glazed walk-in shower'],
    hotspots: [],
  },
  {
    id: 'gardens',
    title: 'Gardens & Pavilions',
    kicker: 'Chapter 11',
    start: 133,
    end: 161,
    dwell: 5.8,
    line: 'Between the buildings, a landscape to wander.',
    observed: ['A hanging chair among the trees', 'Sculpted tree planters', 'A pergola walk and glass-and-timber pavilions'],
    hotspots: [
      { at: 136, x: 62, y: 52, label: 'A woven hanging chair, set into the garden' },
    ],
  },
  {
    id: 'play-water',
    title: 'Play & Water',
    kicker: 'Chapter 12',
    start: 161,
    end: 187,
    dwell: 5.3,
    line: 'A court to play on, and water to sit beside.',
    observed: ['A multi-sport court', 'A lily pond in bloom', 'Fountains in a reflecting basin'],
    hotspots: [
      { at: 172, x: 50, y: 62, label: 'Lotus on a still lily pond' },
    ],
  },
  {
    id: 'pool',
    title: 'The Pool',
    kicker: 'Chapter 13',
    start: 187,
    end: 200.5,
    dwell: 3.0,
    line: 'The water turns to glass as the light drops.',
    observed: ['An edge-lit pool', 'The towers at dusk', 'A deck opening to the skyline'],
    hotspots: [
      { at: 194, x: 50, y: 58, label: 'An infinity edge facing the city' },
    ],
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour',
    kicker: 'Chapter 14',
    start: 200.5,
    end: 214.5,
    dwell: 3.0,
    line: 'A moment to stand still and watch the city glow.',
    observed: ['A gilded stag sculpture', 'The pool against the skyline', 'Warm, low sun'],
    hotspots: [
      { at: 205, x: 40, y: 55, label: 'A gilded stag beneath a tree by the water' },
    ],
  },
  {
    id: 'after-dark',
    title: 'After Dark',
    kicker: 'Chapter 15',
    start: 214.5,
    end: 232.5,
    dwell: 3.7,
    line: 'Low light, soft seating, the garden lit like a room.',
    observed: ['Curved outdoor seating', 'Candlelit planting', 'Lanterns among the leaves'],
    hotspots: [],
  },
  {
    id: 'stars',
    title: 'Under the Stars',
    kicker: 'Chapter 16',
    start: 231,
    end: 240,
    dwell: 2.0,
    line: 'A terrace for looking up — and the lake set adrift with light.',
    observed: ['Telescopes on a viewing deck', 'City lights below', 'Lanterns rising over the lake'],
    hotspots: [
      { at: 238, x: 55, y: 50, label: 'Telescopes on the stargazing terrace' },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Non-linear scroll <-> video-time mapping.

   Each chapter owns a *band* of scroll (its `dwell`, in viewport-heights).
   Scroll position within a band maps linearly onto that chapter's footage
   time range. So a 5s clip can be spread over ~2 screens of slow scrolling.
   --------------------------------------------------------------------------- */

export function buildBands(viewportH, scale = 1) {
  let acc = 0;
  const bands = CHAPTERS.map((ch) => {
    const px = Math.max(1, ch.dwell) * PACE * scale * viewportH;
    const b = { ch, startPx: acc, endPx: acc + px };
    acc += px;
    return b;
  });
  return { bands, totalPx: acc };
}

export function scrollPxToTime(px, bands) {
  const last = bands[bands.length - 1];
  for (const b of bands) {
    if (px < b.endPx || b === last) {
      const span = b.endPx - b.startPx || 1;
      const local = Math.max(0, Math.min(1, (px - b.startPx) / span));
      return b.ch.start + local * (b.ch.end - b.ch.start);
    }
  }
  return 0;
}

export function timeToScrollPx(t, bands) {
  const last = bands[bands.length - 1];
  for (const b of bands) {
    if (t < b.ch.end || b === last) {
      const span = b.ch.end - b.ch.start || 1;
      const local = Math.max(0, Math.min(1, (t - b.ch.start) / span));
      return b.startPx + local * (b.endPx - b.startPx);
    }
  }
  return 0;
}

/** video time (s) -> the chapter index it falls in */
export function timeToChapterIndex(t) {
  for (let i = CHAPTERS.length - 1; i >= 0; i -= 1) {
    if (t >= CHAPTERS[i].start) return i;
  }
  return 0;
}
