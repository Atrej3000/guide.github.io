import { qsa } from '../core/dom.js';

export function initReveal() {
  const revealElements = qsa('.reveal');
  if (!revealElements.length) return;
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach((element) => observer.observe(element));
}
