(function () {
  'use strict';

  // Elements
  const elements = {
    manualContent: document.getElementById('manualContent'),
    progressBar: document.getElementById('progressBar'),
    sections: Array.from(document.querySelectorAll('.chapter')),
    navLinks: Array.from(document.querySelectorAll('.sidebar-nav a')),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    lightbox: document.getElementById('lightbox'),
    lightboxImage: document.getElementById('lightboxImg'),
    chapterImages: Array.from(document.querySelectorAll('.chapter-image'))
  };

  // 1. Reading Progress Indicator
  const syncProgress = () => {
    if (!elements.manualContent || !elements.progressBar) return;
    const rect = elements.manualContent.getBoundingClientRect();
    const scrolled = -rect.top;
    const total = elements.manualContent.scrollHeight - window.innerHeight;
    const percent = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
    elements.progressBar.style.width = `${percent}%`;
  };

  window.addEventListener('scroll', syncProgress, { passive: true });
  window.addEventListener('resize', syncProgress);
  syncProgress();

  // 2. Intersection Observer for Sidebar Links
  if ('IntersectionObserver' in window && elements.sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          
          elements.navLinks.forEach((link) => link.classList.remove('active'));
          
          const activeId = entry.target.id || '';
          const activeLink = document.querySelector(`.sidebar-nav a[data-section="${CSS.escape(activeId)}"]`);
          if (activeLink) activeLink.classList.add('active');
        });
      },
      { threshold: 0.1, rootMargin: '-80px 0px -70% 0px' }
    );

    elements.sections.forEach((section) => activeObserver.observe(section));
  }

  // 3. Mobile Sidebar Toggle
  const closeSidebar = () => {
    if (!elements.sidebar || !elements.sidebarOverlay) return;
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('active');
    if (elements.sidebarToggle) elements.sidebarToggle.setAttribute('aria-expanded', 'false');
  };

  const openSidebar = () => {
    if (!elements.sidebar || !elements.sidebarOverlay) return;
    elements.sidebar.classList.add('open');
    elements.sidebarOverlay.classList.add('active');
    if (elements.sidebarToggle) elements.sidebarToggle.setAttribute('aria-expanded', 'true');
  };

  if (elements.sidebarToggle) {
    elements.sidebarToggle.addEventListener('click', () => {
      const isOpen = elements.sidebar?.classList.contains('open');
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (elements.sidebarOverlay) {
    elements.sidebarOverlay.addEventListener('click', closeSidebar);
  }

  elements.navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // 4. Lightbox functionality for chapter images
  const openLightbox = (container) => {
    const image = container?.querySelector('img');
    if (!image || !elements.lightbox || !elements.lightboxImage) return;
    
    elements.lightboxImage.src = image.currentSrc || image.src;
    elements.lightboxImage.alt = image.alt || '';
    elements.lightbox.classList.add('active');
    elements.lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    if (!elements.lightbox) return;
    elements.lightbox.classList.remove('active');
    elements.lightbox.setAttribute('aria-hidden', 'true');
  };

  elements.chapterImages.forEach((container) => {
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    container.addEventListener('click', () => openLightbox(container));
    container.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(container);
      }
    });
  });

  if (elements.lightbox) {
    elements.lightbox.addEventListener('click', (event) => {
      if (event.target === elements.lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
      closeLightbox();
    }
  });

  // 5. Sidebar Search Functionality
  const buildSearchIndex = () => elements.sections.map((section) => ({
    id: section.id || '',
    title: section.querySelector('.chapter-title')?.textContent.trim() || 'Передмова',
    text: (section.textContent || '').replace(/\s+/g, ' ').trim(),
  }));

  const searchIndex = buildSearchIndex();

  const renderSearchResults = (query) => {
    if (!elements.searchResults) return;
    
    const normalized = query.trim().toLowerCase();
    
    if (!normalized) {
      elements.searchResults.innerHTML = '';
      elements.searchResults.hidden = true;
      return;
    }

    const matches = searchIndex
      .filter((item) => item.text.toLowerCase().includes(normalized) || item.title.toLowerCase().includes(normalized))
      .slice(0, 8);

    if (!matches.length) {
      elements.searchResults.innerHTML = '<div class="search-result-item">Нічого не знайдено.</div>';
      elements.searchResults.hidden = false;
      return;
    }

    const escapeHtml = (value) => value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const highlight = (value) => {
      const escaped = escapeHtml(value);
      const pattern = new RegExp(`(${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
      return escaped.replace(pattern, '<mark class="search-highlight">$1</mark>');
    };

    elements.searchResults.innerHTML = matches.map((match) => {
      const index = match.text.toLowerCase().indexOf(normalized);
      const snippetStart = Math.max(0, index - 80);
      const snippetEnd = index >= 0 ? Math.min(match.text.length, index + normalized.length + 120) : 180;
      const snippet = match.text.slice(snippetStart, snippetEnd);
      const href = match.id ? `#${match.id}` : '#';
      
      return `
        <div class="search-result-item">
          <a href="${href}">${highlight(match.title)}</a>
          <div>${highlight(snippet)}${snippetEnd < match.text.length ? '…' : ''}</div>
        </div>
      `;
    }).join('');

    elements.searchResults.hidden = false;
    
    elements.searchResults.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        elements.searchResults.hidden = true;
        if (window.innerWidth <= 768) closeSidebar();
      });
    });
  };

  if (elements.searchInput) {
    elements.searchInput.removeAttribute('oninput');
    elements.searchInput.addEventListener('input', (event) => renderSearchResults(event.target.value));
  }
})();