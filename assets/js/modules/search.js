import { qs, qsa, on } from '../core/dom.js';
import { debounce, escapeHtml } from '../core/utils.js';

export async function initManualSearch() {
  const searchInput = qs('#searchInput');
  const searchResults = qs('#searchResults');
  const searchStatus = qs('#searchStatus');
  if (!searchInput || !searchResults) return;

  let searchIndex = [];
  try {
    const response = await fetch('assets/data/search-index.json');
    if (response.ok) searchIndex = await response.json();
  } catch (error) {
    searchIndex = qsa('.chapter').map((section) => ({
      id: section.id || '',
      title: section.querySelector('.chapter-title')?.textContent.trim() || 'Передмова',
      text: (section.textContent || '').replace(/\s+/g, ' ').trim(),
    }));
  }

  const highlight = (value, normalized) => {
    const escaped = escapeHtml(value);
    const safePattern = normalized.replace(/[.*+?^${}()|[\]\]/g, '\$&');
    return escaped.replace(new RegExp(`(${safePattern})`, 'ig'), '<mark class="search-highlight">$1</mark>');
  };

  const renderResults = (query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      searchResults.innerHTML = '';
      searchResults.hidden = true;
      if (searchStatus) searchStatus.textContent = 'Введіть пошуковий запит.';
      return;
    }

    const matches = searchIndex
      .filter((item) => item.text.toLowerCase().includes(normalized) || item.title.toLowerCase().includes(normalized))
      .slice(0, 8);

    if (searchStatus) searchStatus.textContent = `Знайдено: ${matches.length}`;

    if (!matches.length) {
      searchResults.innerHTML = '<div class="search-result-item">Нічого не знайдено.</div>';
      searchResults.hidden = false;
      return;
    }

    searchResults.innerHTML = matches.map((match) => {
      const index = match.text.toLowerCase().indexOf(normalized);
      const start = Math.max(0, index - 80);
      const end = index >= 0 ? Math.min(match.text.length, index + normalized.length + 120) : 180;
      const snippet = match.text.slice(start, end);
      const href = match.id ? `#${match.id}` : '#';
      return `
        <div class="search-result-item">
          <a href="${href}">${highlight(match.title, normalized)}</a>
          <div>${highlight(snippet, normalized)}${end < match.text.length ? '…' : ''}</div>
        </div>`;
    }).join('');

    searchResults.hidden = false;
  };

  searchInput.removeAttribute('oninput');
  on(searchInput, 'input', debounce((event) => renderResults(event.target.value), 100));
}
