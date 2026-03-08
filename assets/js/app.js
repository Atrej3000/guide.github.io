import { initNav } from './modules/nav.js';
import { initExportButtons } from './modules/export.js';
import { initScrollTop } from './modules/scroll-top.js';
import { initHomePage } from './pages/home.js';
import { initManualPage } from './pages/manual.js';
import { initAppendicesPage } from './pages/appendices.js';
import { initPrintPage } from './pages/print.js';

async function bootstrap() {
  const page = document.body.dataset.page || 'default';
  initNav();
  initExportButtons();
  initScrollTop();

  if (page === 'home') initHomePage();
  if (page === 'manual') await initManualPage();
  if (page === 'appendices') initAppendicesPage();
  if (page === 'print') initPrintPage();
}

bootstrap();
