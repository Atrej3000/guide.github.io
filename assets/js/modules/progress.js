import { qs, on } from '../core/dom.js';

export function initReadingProgress() {
  const manualContent = qs('#manualContent');
  const progressBar = qs('#progressBar');
  if (!manualContent || !progressBar) return;

  const syncProgress = () => {
    const rect = manualContent.getBoundingClientRect();
    const scrolled = -rect.top;
    const total = manualContent.scrollHeight - window.innerHeight;
    const percent = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
    progressBar.style.width = `${percent}%`;
  };

  on(window, 'scroll', syncProgress, { passive: true });
  on(window, 'resize', syncProgress);
  syncProgress();
}
