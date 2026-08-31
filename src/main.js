import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { initVideoScrub } from './scroll/videoScrub.js';
import { CHAPTERS, VIDEO_DURATION, buildBands } from './scroll/chapters.js';
import { createChapterOverlay } from './sections/chapterOverlay.js';
import { createProgressNav } from './sections/progressNav.js';
import { VIDEO_TIERS, resolveQuality } from './config.js';
import { clamp } from './utils/dom.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const isMobile = window.matchMedia('(max-width: 860px)').matches;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const dom = {
  loader: document.getElementById('loader'),
  fill: document.getElementById('loader-fill'),
  film: document.getElementById('film'),
  stage: document.getElementById('stage'),
  video: document.getElementById('film'),
  intro: document.getElementById('intro'),
  cue: document.getElementById('cue'),
  buffering: document.getElementById('buffering'),
  chapters: document.getElementById('chapters'),
  rail: document.getElementById('rail'),
  track: document.getElementById('track'),
  finaleIndex: document.getElementById('finale-index'),
  mProgress: document.getElementById('m-progress'),
  mProgressFill: document.getElementById('m-progress-fill'),
  mProgressLabel: document.getElementById('m-progress-label'),
};

/* ---------------------------------------------------------------------------
   Smooth scroll
   ------------------------------------------------------------------------- */
const lenis = new Lenis({
  lerp: reduced ? 1 : 0.12,
  smoothWheel: !reduced,
  // leave touch scrolling to the browser — native momentum is compositor-thread
  // and far smoother on phones than JS-driven scroll. With the long pacing a
  // momentum coast only crosses ~one shot anyway.
  syncTouch: false,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------------------------------------------------------------------------
   Scroll height for the film
   ------------------------------------------------------------------------- */
const BAND_SCALE = isMobile ? 0.5 : 1;
function sizeTrack() {
  // height = sum of every chapter's dwell (viewport-heights), so each room
  // gets its own generous stretch of scroll regardless of footage length.
  const { totalPx } = buildBands(window.innerHeight, BAND_SCALE);
  dom.track.style.height = Math.round(totalPx) + 'px';
}
sizeTrack();

/* ---------------------------------------------------------------------------
   Overlays
   ------------------------------------------------------------------------- */
const overlay = createChapterOverlay(dom.chapters);
let scrub;
const nav = createProgressNav(dom.rail, (t) => scrub && scrub.scrollToTime(lenis, t));

// finale chapter index
dom.finaleIndex.innerHTML = CHAPTERS.map(
  (c, i) =>
    `<button class="finale__chapter" data-t="${c.start + 0.15}"><span>${String(
      i + 1
    ).padStart(2, '0')}</span>${c.title}</button>`
).join('');
dom.finaleIndex.querySelectorAll('.finale__chapter').forEach((b) =>
  b.addEventListener('click', () =>
    scrub.scrollToTime(lenis, parseFloat(b.dataset.t))
  )
);

document.querySelectorAll('[data-anchor]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) lenis.scrollTo(target, { offset: 0, duration: 1.2 });
  })
);

/* ---------------------------------------------------------------------------
   Per-frame overlay driving
   ------------------------------------------------------------------------- */
let cueGone = false;
let mProgressChapter = -1;
function onScrub(time, _p, waitingOnBuffer) {
  const p = clamp(time / VIDEO_DURATION);

  overlay.update(time);
  nav.update(time);

  dom.buffering.classList.toggle('is-active', !!waitingOnBuffer);

  // intro fades out across the first ~4.5s of film
  const introA = 1 - clamp(time / 4.5);
  gsap.set(dom.intro, {
    opacity: introA,
    y: (1 - introA) * -24,
    pointerEvents: introA < 0.05 ? 'none' : 'auto',
  });

  if (!cueGone && time > 1.4) {
    cueGone = true;
    dom.cue.classList.add('is-gone');
  } else if (cueGone && time < 0.6) {
    cueGone = false;
    dom.cue.classList.remove('is-gone');
  }

  // clear the rail + chapter card + mobile bar as the finale scrolls in.
  // Drive it off actual scroll position vs the track end, so it's fully gone
  // by the time the finale is on screen (video progress never quite hits 1).
  const trackEnd = dom.track.offsetHeight - window.innerHeight;
  const endFade = clamp((window.scrollY - (trackEnd - window.innerHeight * 0.6)) / (window.innerHeight * 0.6));
  gsap.set([dom.rail, dom.chapters], {
    opacity: 1 - endFade,
    pointerEvents: endFade > 0.5 ? 'none' : 'auto',
  });

  // mobile progress bar (stands in for the hidden rail)
  if (isMobile && dom.mProgress) {
    let ci = 0;
    for (let i = CHAPTERS.length - 1; i >= 0; i -= 1) {
      if (time >= CHAPTERS[i].start) {
        ci = i;
        break;
      }
    }
    dom.mProgressFill.style.width = (p * 100).toFixed(1) + '%';
    if (ci !== mProgressChapter) {
      mProgressChapter = ci;
      dom.mProgressLabel.innerHTML =
        `<b>${CHAPTERS[ci].kicker}</b>&nbsp; ${CHAPTERS[ci].title}`;
    }
    gsap.set(dom.mProgress, { opacity: 1 - endFade });
  }

  // very subtle breathing parallax on the film — desktop only. On phones a
  // per-frame transform on a full-screen <video> is pure compositor cost for
  // almost no payoff on a small screen, and it competes with touch scrolling.
  if (!reduced && !isMobile) {
    const idx = Math.min(
      CHAPTERS.length - 1,
      CHAPTERS.findIndex((c) => time < c.end)
    );
    const c = CHAPTERS[idx] || CHAPTERS[0];
    const local = clamp((time - c.start) / Math.max(0.001, c.end - c.start));
    const ease = Math.sin(local * Math.PI); // 0 -> 1 -> 0 across the chapter
    gsap.set(dom.video, {
      scale: 1.055 + ease * 0.03,
      yPercent: (0.5 - local) * 1.6,
    });
  }
}

/* ---------------------------------------------------------------------------
   Loader -> boot
   ------------------------------------------------------------------------- */
function startLoader() {
  let pct = 0;
  const id = setInterval(() => {
    pct = Math.min(92, pct + (92 - pct) * 0.12 + 1);
    dom.fill.style.width = pct + '%';
  }, 90);
  return () => {
    clearInterval(id);
    dom.fill.style.width = '100%';
    setTimeout(() => dom.loader.classList.add('is-done'), 200);
  };
}

function boot() {
  const endLoader = startLoader();

  const quality = resolveQuality();
  const tier = VIDEO_TIERS[quality];
  console.info(
    `[elena] video quality: ${quality} (${tier.w}x${tier.h}). ` +
      `Override with ?q=hd|sd|mobile or elenaSetQuality('hd').`
  );
  dom.video.src = tier.src;
  dom.video.load();

  // prime the decoder (iOS shows black until a play() has happened once)
  const prime = () => {
    dom.video.play().then(
      () => dom.video.pause(),
      () => {}
    );
    window.removeEventListener('pointerdown', prime);
    window.removeEventListener('touchstart', prime);
  };
  window.addEventListener('pointerdown', prime, { once: true });
  window.addEventListener('touchstart', prime, { once: true });

  let started = false;
  const begin = () => {
    if (started) return;
    started = true;
    prime();
    scrub = initVideoScrub({
      video: dom.video,
      track: dom.track,
      bandScale: BAND_SCALE,
      isMobile,
      onUpdate: onScrub,
      onReady: () => ScrollTrigger.refresh(),
    });
    onScrub(0);
    endLoader();
    ScrollTrigger.refresh();
  };

  // Reveal once there's a head start of footage buffered (or it can play
  // through, or we've waited long enough). Keeps the first scroll smooth.
  const HEAD_START = 12; // seconds
  const bootAt = performance.now();
  const check = () => {
    if (started) return;
    let buffered = 0;
    try {
      const b = dom.video.buffered;
      if (b.length) buffered = b.end(b.length - 1);
    } catch (e) {
      /* ignore */
    }
    if (
      dom.video.readyState >= 4 || // HAVE_ENOUGH_DATA
      buffered >= HEAD_START ||
      performance.now() - bootAt > 6000
    ) {
      begin();
    } else {
      requestAnimationFrame(check);
    }
  };
  dom.video.addEventListener('loadeddata', check);
  dom.video.addEventListener('canplaythrough', begin);
  check();
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    sizeTrack();
    scrub && scrub.resize();
    ScrollTrigger.refresh();
  }, 160);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
