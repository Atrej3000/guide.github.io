/**
 * Export / download page logic. Typography normalization, image prep, toolbar (Close).
 */
(function () {
  'use strict';

  const SELECTORS = {
    contentRoot: '#main-content',
    image: '.chapter-image img',
    closeBtn: '[data-print-action="close"]',
  };

  const TYPOGRAPHY = [
    [/\.\.\./g, '…'],
    [/\u00A0/g, ' '],
    [/ - /g, ' — '],
    [/--/g, '—'],
  ];

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE']);
  const DEFAULT_ALT = 'Ілюстрація до посібника';
  const CLOSE_URL = 'manual.html';

  function getContentRoot() {
    return document.querySelector(SELECTORS.contentRoot) || document.body;
  }

  function normalizeTypography(root) {
    if (!root) return;
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walk.nextNode())) {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) continue;
      let value = node.nodeValue;
      const original = value;
      TYPOGRAPHY.forEach(([pattern, replacement]) => {
        value = value.replace(pattern, replacement);
      });
      if (value !== original) node.nodeValue = value;
    }
  }

  function prepareImages() {
    document.querySelectorAll(SELECTORS.image).forEach((img) => {
      img.loading = 'eager';
      img.decoding = 'sync';
      if (!img.alt) img.alt = DEFAULT_ALT;
    });
  }

  function initToolbar() {
    const closeBtn = document.querySelector(SELECTORS.closeBtn);
    if (closeBtn) closeBtn.addEventListener('click', () => { window.location.href = CLOSE_URL; });
  }

  function init() {
    const root = getContentRoot();
    normalizeTypography(root);
    prepareImages();
    initToolbar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
