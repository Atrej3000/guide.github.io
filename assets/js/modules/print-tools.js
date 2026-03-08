/**
 * Print logic (module). Used when app runs with data-page="print".
 * Typography normalization, image prep, toolbar (Print / Close).
 */
import { qs, qsa, on } from '../core/dom.js';

const TYPOGRAPHY = [
  [/ -- /g, ' — '],
  [/--/g, '—'],
  [/\.\.\./g, '…'],
  [/\u00A0/g, ' '],
];

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE']);
const IMAGE_SELECTOR = '.chapter-image img, .chapter img';
const CLOSE_URL = 'manual.html';

function getPrintRoot() {
  if (document.body.classList.contains('print-body')) return document.body;
  return qs('.print-content');
}

export function normalizePrintContent() {
  const root = getPrintRoot();
  if (!root) return;

  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  while (walk.nextNode()) {
    const node = walk.currentNode;
    const parent = node.parentElement;
    if (!parent || SKIP_TAGS.has(parent.tagName)) continue;
    let value = node.nodeValue;
    TYPOGRAPHY.forEach(([pattern, replacement]) => {
      value = value.replace(pattern, replacement);
    });
    node.nodeValue = value;
  }

  qsa(IMAGE_SELECTOR).forEach((img) => {
    img.loading = 'eager';
    img.decoding = 'sync';
    if (!img.alt) img.alt = '';
  });
}

export function initPrintToolbar() {
  const printBtn = qs('[data-print-action="print"]');
  const closeBtn = qs('[data-print-action="close"]');
  if (printBtn) on(printBtn, 'click', () => window.print());
  if (closeBtn) {
    on(closeBtn, 'click', () => {
      if (window.history.length > 1) window.close();
      else window.location.href = CLOSE_URL;
    });
  }
}
