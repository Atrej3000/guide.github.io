import { qs, qsa, on } from '../core/dom.js';

export function initLightbox() {
  const lightbox = qs('#lightbox');
  const lightboxImage = qs('#lightboxImg');
  const chapterImages = qsa('.chapter-image');
  if (!lightbox || !lightboxImage || !chapterImages.length) return;

  const openLightbox = (container) => {
    const image = container?.querySelector('img');
    if (!image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  chapterImages.forEach((container) => {
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    on(container, 'click', () => openLightbox(container));
    on(container, 'keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(container);
      }
    });
  });

  on(lightbox, 'click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  on(document, 'keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}
