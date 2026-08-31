/* ===========================================================================
   Walkthrough video quality

   Three encoded tiers live in /public. Which one loads is decided at runtime
   by resolveQuality() below. To change the DEFAULT for everyone, edit
   DEFAULT_QUALITY. To try another tier without touching code:
     • add ?q=hd  (or ?q=sd / ?q=mobile) to the URL, or
     • run  elenaSetQuality('hd')  in the browser console (persists, reloads)

   'sd' is the default: it downloads fast enough that the scrub never outruns
   the buffer. 'hd' is sharper but ~3x the bytes — the player clamps the eased
   playhead to what has downloaded, so 'hd' still won't freeze, it just
   advances as fast as it loads (with a small "loading ahead" hint).
   =========================================================================== */

export const DEFAULT_QUALITY = 'sd';

export const VIDEO_TIERS = {
  // 1280x720 · 20fps · crf26 · short GOP — sharpest, ~93MB
  hd: { src: '/walkthrough-hd.mp4', w: 1280, h: 720, label: 'HD' },
  // 960x540 · 16fps · crf30 · short GOP — default, ~32MB
  sd: { src: '/walkthrough-sd.mp4', w: 960, h: 540, label: 'SD' },
  // 854x480 · 20fps · crf31 — phones (hi-DPI friendly), ~22MB
  mobile: { src: '/walkthrough-mobile.mp4', w: 854, h: 480, label: 'Mobile' },
};

const TIER_KEYS = Object.keys(VIDEO_TIERS);
const STORAGE_KEY = 'elena:quality';

export function resolveQuality() {
  // 1 — explicit URL override, for quick comparison
  try {
    const q = new URLSearchParams(location.search).get('q');
    if (TIER_KEYS.includes(q)) return q;
  } catch (e) {
    /* ignore */
  }

  // 2 — a saved preference (set via elenaSetQuality)
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (TIER_KEYS.includes(saved)) return saved;
  } catch (e) {
    /* ignore */
  }

  // 3 — small screens always take the mobile encode
  if (window.matchMedia('(max-width: 860px)').matches) return 'mobile';

  // 4 — respect data-saver / thin devices / slow links
  const c = navigator.connection || {};
  const thin =
    c.saveData === true ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) ||
    /(^|\b)(slow-)?2g$/.test(c.effectiveType || '');
  if (thin) return 'sd';

  // 5 — default
  return DEFAULT_QUALITY;
}

export function setQuality(q) {
  if (!TIER_KEYS.includes(q)) {
    console.warn(`[elena] unknown quality "${q}" — use one of: ${TIER_KEYS.join(', ')}`);
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, q);
  } catch (e) {
    /* ignore */
  }
  location.reload();
}

export function clearQuality() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    /* ignore */
  }
  location.reload();
}

// expose a console handle for the owner
if (typeof window !== 'undefined') {
  window.elenaSetQuality = setQuality;
  window.elenaClearQuality = clearQuality;
}
