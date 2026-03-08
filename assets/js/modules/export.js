import { qsa, on } from '../core/dom.js';

export function initExportButtons() {
  qsa('[data-export-trigger]').forEach((button) => {
    on(button, 'click', () => {
      window.open('print.html', '_blank', 'noopener');
    });
  });
}
