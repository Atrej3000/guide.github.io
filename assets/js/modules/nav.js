import { qs, qsa, on } from '../core/dom.js';

export function initNav() {
  const nav = qs('#mainNav');
  const toggle = qs('#mobileMenuToggle');
  if (!nav || !toggle) return;

  const setExpanded = (state) => {
    toggle.setAttribute('aria-expanded', String(state));
    nav.classList.toggle('open', state);
  };

  on(toggle, 'click', () => setExpanded(!nav.classList.contains('open')));
  qsa('a', nav).forEach((link) => on(link, 'click', () => {
    if (window.innerWidth <= 768) setExpanded(false);
  }));
  on(document, 'keydown', (event) => {
    if (event.key === 'Escape') setExpanded(false);
  });
  on(window, 'resize', () => {
    if (window.innerWidth > 768) setExpanded(false);
  });
}
