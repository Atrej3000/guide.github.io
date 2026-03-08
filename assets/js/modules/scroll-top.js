import { qsa, on } from '../core/dom.js';

export function initScrollTop() {
  qsa('[data-scroll-top]').forEach((link) => {
    on(link, 'click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}
