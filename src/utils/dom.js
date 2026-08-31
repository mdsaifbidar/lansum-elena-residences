export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export const lerp = (a, b, t) => a + (b - a) * t;

/** smooth 0->1 ramp centred on a window */
export function windowAlpha(x, start, end, feather) {
  if (x <= start - feather || x >= end + feather) return 0;
  if (x < start) return clamp((x - (start - feather)) / feather);
  if (x > end) return clamp(1 - (x - end) / feather);
  return 1;
}

export function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
