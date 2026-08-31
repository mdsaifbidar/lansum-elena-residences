import { gsap } from 'gsap';
import { CHAPTERS } from '../scroll/chapters.js';
import { clamp, windowAlpha, el } from '../utils/dom.js';

/**
 * Builds the chapter title cards + hotspots and drives them from video time.
 * Cards cross-fade with a short parallax as the film moves between rooms; a
 * card only shows for the middle of its window so transitions feel like the
 * camera moving through, not a slideshow.
 */
export function createChapterOverlay(root) {
  const cards = CHAPTERS.map((ch) => {
    const card = el('article', 'chapter');
    card.innerHTML = `
      <p class="chapter__kicker">${ch.kicker}</p>
      <h2 class="chapter__title">${ch.title}</h2>
      <p class="chapter__line">${ch.line}</p>
      ${
        ch.observed?.length
          ? `<ul class="chapter__observed">${ch.observed
              .map((o) => `<li>${o}</li>`)
              .join('')}</ul>`
          : ''
      }`;
    root.appendChild(card);

    const hotspots = (ch.hotspots || []).map((h) => {
      const node = el('div', 'hotspot');
      node.style.left = h.x + '%';
      node.style.top = h.y + '%';
      node.innerHTML = `
        <span class="hotspot__dot"></span>
        <span class="hotspot__panel">${h.label}</span>`;
      node.querySelector('.hotspot__dot').addEventListener('click', () => {
        node.classList.toggle('is-open');
      });
      root.appendChild(node);
      return { ...h, node };
    });

    return { ch, card, hotspots };
  });

  const shown = new Set();

  function update(time) {
    cards.forEach((entry, i) => {
      const { ch, card, hotspots } = entry;
      // only compute for cards whose window is anywhere near `time`
      const near = time > ch.start - 6 && time < ch.end + 6;
      if (!near) {
        if (shown.has(i)) {
          gsap.set(card, { opacity: 0 });
          hotspots.forEach((h) => h.node.classList.remove('is-live'));
          shown.delete(i);
        }
        return;
      }
      shown.add(i);

      const span = ch.end - ch.start;
      const inset = span * 0.16;
      const a = windowAlpha(
        time,
        ch.start + inset,
        ch.end - inset,
        Math.min(2.2, span * 0.28)
      );
      gsap.set(card, {
        opacity: a,
        y: (1 - a) * 26 * (time < (ch.start + ch.end) / 2 ? 1 : -1),
      });

      hotspots.forEach((h) => {
        const live = Math.abs(time - h.at) < 4.5 && a > 0.3;
        h.node.classList.toggle('is-live', live);
      });
    });
  }

  return { update, cards };
}
