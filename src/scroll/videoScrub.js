import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  VIDEO_DURATION,
  buildBands,
  scrollPxToTime,
  timeToScrollPx,
} from './chapters.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-controlled video playback.
 *
 * The <video> is never played — it is a decode surface we seek. Scroll
 * position maps *non-linearly* onto video time via per-chapter bands
 * (chapters.js), so you dwell in a room the film only spends 5s on. A rAF
 * loop eases currentTime toward the target so the camera move feels connected
 * to the scroll.
 *
 * The eased playhead is clamped to what has actually downloaded, so scrolling
 * ahead of the buffer makes the film advance as fast as it loads instead of
 * freezing on an un-seekable frame. Scrolling back is always instant.
 *
 * @param {Object}   o
 * @param {HTMLVideoElement} o.video
 * @param {HTMLElement}      o.track   the tall element the scroll is measured against
 * @param {(t:number, p:number)=>void} [o.onUpdate]  called each frame with (time, 0..1)
 * @param {()=>void}         [o.onReady]
 */
export function initVideoScrub({
  video,
  track,
  onUpdate,
  onReady,
  bandScale = 1,
  isMobile = false,
}) {
  let duration = VIDEO_DURATION;
  let targetTime = 0;
  let easedTime = 0;
  let ready = false;
  let lastSeek = -1;

  let { bands, totalPx } = buildBands(window.innerHeight, bandScale);

  video.pause();
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';

  // end of the downloaded range that currently contains the playhead
  function bufferedEnd() {
    try {
      const b = video.buffered;
      for (let i = 0; i < b.length; i += 1) {
        if (video.currentTime >= b.start(i) - 0.25 && video.currentTime <= b.end(i) + 0.25) {
          return b.end(i);
        }
      }
      return b.length ? b.end(b.length - 1) : 0;
    } catch (e) {
      return duration;
    }
  }

  function markReady() {
    if (ready) return;
    ready = true;
    duration = Number.isFinite(video.duration) ? video.duration : VIDEO_DURATION;
    onReady && onReady();
  }

  if (video.readyState >= 1) markReady();
  video.addEventListener('loadedmetadata', markReady);
  video.addEventListener('canplay', markReady);

  const st = ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      targetTime = scrollPxToTime(self.progress * totalPx, bands);
    },
  });

  const MIN_SEEK_DELTA = 1 / 30; // don't bother seeking for a sub-frame move
  // steady seek cadence beats waiting for each 'seeked' event: the browser
  // coalesces an in-flight seek when a new currentTime is set, so issuing on a
  // fixed interval keeps the picture tracking the scroll instead of stop-go.
  const SEEK_INTERVAL = isMobile ? 45 : 28;
  let lastSeekAt = 0;
  let waitingOnBuffer = false;

  function tick() {
    // never let the eased playhead outrun what's downloaded (forward only —
    // backward is always in the buffer). Small margin off the ragged edge.
    const cap = ready ? Math.max(0.1, bufferedEnd() - 0.3) : 0.1;
    const goal = Math.min(targetTime, cap);
    waitingOnBuffer = targetTime - goal > 0.5;

    const diff = goal - easedTime;
    if (Math.abs(diff) < 0.01) easedTime = goal;
    else if (Math.abs(diff) > 6) easedTime += diff * 0.5; // chapter jump / catch-up
    else easedTime += diff * (isMobile ? 0.22 : 0.16);
    easedTime = Math.max(0, Math.min(easedTime, duration - 0.05, cap));

    const now = performance.now();
    if (
      ready &&
      now - lastSeekAt >= SEEK_INTERVAL &&
      Math.abs(easedTime - lastSeek) >= MIN_SEEK_DELTA
    ) {
      lastSeekAt = now;
      lastSeek = easedTime;
      try {
        if ('fastSeek' in video) video.fastSeek(easedTime);
        else video.currentTime = easedTime;
      } catch (e) {
        /* ignore — next tick retries */
      }
    }

    onUpdate && onUpdate(easedTime, duration ? easedTime / duration : 0, waitingOnBuffer);
  }
  gsap.ticker.add(tick);

  return {
    scrollTrigger: st,
    get duration() {
      return duration;
    },
    get totalPx() {
      return totalPx;
    },
    /** recompute band pixel sizes for a new viewport height */
    resize() {
      ({ bands, totalPx } = buildBands(window.innerHeight, bandScale));
    },
    /** smooth-scroll so the video sits at time `t` (seconds) */
    scrollToTime(lenis, t) {
      const y = timeToScrollPx(t, bands);
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    },
    destroy() {
      gsap.ticker.remove(tick);
      st.kill();
    },
  };
}
