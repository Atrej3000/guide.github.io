import { initReadingProgress } from '../modules/progress.js';
import { initManualSidebar } from '../modules/sidebar.js';
import { initActiveSectionTracking } from '../modules/active-section.js';
import { initManualSearch } from '../modules/search.js';
import { initLightbox } from '../modules/lightbox.js';

export async function initManualPage() {
  initReadingProgress();
  initManualSidebar();
  initActiveSectionTracking();
  await initManualSearch();
  initLightbox();
}
