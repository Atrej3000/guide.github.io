import { initPrintToolbar, normalizePrintContent } from '../modules/print-tools.js';
export function initPrintPage() {
  normalizePrintContent();
  initPrintToolbar();
}
