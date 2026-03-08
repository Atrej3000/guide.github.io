import { qs, qsa, on } from '../core/dom.js';

export function initManualSidebar() {
  const sidebar = qs('#sidebar');
  const overlay = qs('#sidebarOverlay');
  const toggle = qs('#sidebarToggle');
  const navLinks = qsa('.sidebar-nav a');
  if (!sidebar || !overlay || !toggle) return;

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openSidebar = () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  };

  on(toggle, 'click', () => {
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) closeSidebar(); else openSidebar();
  });
  on(overlay, 'click', closeSidebar);
  navLinks.forEach((link) => on(link, 'click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  }));
  on(document, 'keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });
}
