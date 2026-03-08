import { qsa } from '../core/dom.js';

export function initActiveSectionTracking() {
  const sections = qsa('.chapter');
  const navLinks = qsa('.sidebar-nav a');
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const setCurrent = (activeId) => {
    navLinks.forEach((link) => {
      const matches = link.dataset.section === activeId;
      link.classList.toggle('active', matches);
      if (matches) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id) setCurrent(entry.target.id);
    });
  }, { threshold: 0.1, rootMargin: '-80px 0px -70% 0px' });

  sections.forEach((section) => observer.observe(section));
}
