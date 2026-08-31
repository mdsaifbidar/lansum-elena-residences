import { CHAPTERS, VIDEO_DURATION, timeToChapterIndex } from '../scroll/chapters.js';
import { el } from '../utils/dom.js';

/**
 * Minimal vertical progress rail. Every chapter is a tick; the active one
 * grows and shows its label. Clicking a tick scrolls the film to that chapter.
 */
export function createProgressNav(root, onSeek) {
  const items = CHAPTERS.map((ch, i) => {
    const item = el('button', 'rail__item');
    item.type = 'button';
    item.innerHTML = `
      <span class="rail__label">${ch.title}</span>
      <span class="rail__tick"></span>`;
    item.addEventListener('click', () => onSeek(ch.start + 0.15));
    root.appendChild(item);
    return { i, ch, item };
  });

  let current = -1;
  function update(time) {
    const idx = timeToChapterIndex(Math.min(time, VIDEO_DURATION - 0.01));
    if (idx === current) return;
    current = idx;
    items.forEach(({ i, item }) => item.classList.toggle('is-active', i === idx));
  }

  return { update };
}
