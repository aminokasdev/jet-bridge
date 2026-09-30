import { reviews, renderReview } from './reviews';

/**
 * Слайдер отзывов: стрелки, свайп, клавиатура.
 * Шаг — одна карточка (ширина + gap), последняя позиция — когда последняя карточка
 * прижата к правому краю контейнера.
 */
export function initSlider(): void {
  const root = document.querySelector<HTMLElement>('[data-slider]');
  if (!root) return;

  const track = root.querySelector<HTMLElement>('[data-slider-track]')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-slider-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-slider-next]')!;

  track.innerHTML = reviews.map(renderReview).join('');
  const slides = Array.from(track.children) as HTMLElement[];

  let index = 0;

  const step = (): number => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return (slides[0]?.offsetWidth ?? 0) + gap;
  };

  const maxIndex = (): number => {
    const visible = Math.max(1, Math.floor((root.clientWidth + 20) / step()));
    return Math.max(0, slides.length - visible);
  };

  const update = (): void => {
    index = Math.min(Math.max(index, 0), maxIndex());
    track.style.transform = `translateX(${-index * step()}px)`;
    prev.disabled = index === 0;
    next.disabled = index >= maxIndex();
    slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i < index)));
  };

  prev.addEventListener('click', () => { index -= 1; update(); });
  next.addEventListener('click', () => { index += 1; update(); });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { index -= 1; update(); }
    if (e.key === 'ArrowRight') { index += 1; update(); }
  });

  // свайп
  let startX = 0;
  let dragging = false;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; dragging = true; });
  window.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) { index += dx < 0 ? 1 : -1; update(); }
  });

  window.addEventListener('resize', update);
  update();
}
