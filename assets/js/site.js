(function () {
  var STAGGER_STEP_MS = 80;
  var REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }

  function initReveal() {
    var revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    var reduced = prefersReducedMotion();
    if (reduced) {
      revealElements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var parentCounters = {};
    revealElements.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) return;
      var key = (parent.id || '') + (parent.className || '');
      var idx = parentCounters[key] !== undefined ? parentCounters[key] : 0;
      parentCounters[key] = idx + 1;
      var delay = idx * STAGGER_STEP_MS;
      el.style.setProperty('--reveal-delay', delay + 'ms');
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            } else {
              entry.target.classList.remove('visible');
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      revealElements.forEach(function (el) { observer.observe(el); });
    } else {
      revealElements.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  function initHeroParallax() {
    if (prefersReducedMotion()) return;
    var hero = document.querySelector('.hero');
    var grid = hero && hero.querySelector('.hero-grid');
    var lines = hero && hero.querySelectorAll('.hero-line');
    if (!hero || (!grid && (!lines || !lines.length))) return;

    var ticking = false;
    var lastY = 0;
    var lastX = 0;

    function update() {
      if (grid) {
        var y = lastY * 0.02;
        var x = lastX * 0.015;
        grid.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      }
      if (lines && lines.length > 1) {
        var o = 0.3 + Math.min(Math.abs(lastY) * 0.0005, 0.4);
        lines[1].style.opacity = String(o);
        if (lines[2]) lines[2].style.opacity = String(o * 0.9);
      }
      ticking = false;
    }

    function onMove(e) {
      lastX = e.clientX - window.innerWidth / 2;
      lastY = e.clientY - window.innerHeight / 2;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    if (window.innerWidth >= 1024) {
      document.addEventListener('mousemove', onMove, { passive: true });
    }
    window.addEventListener('resize', function () {
      if (window.innerWidth < 1024 && grid) grid.style.transform = '';
    });
  }

  function initSite() {
    var nav = document.getElementById('mainNav');
    var toggle = document.getElementById('mobileMenuToggle');
    var exportButtons = document.querySelectorAll('[data-export-trigger]');
    var scrollTopLinks = document.querySelectorAll('[data-scroll-top]');

    if (toggle && nav) {
      function setExpanded(state) {
        toggle.setAttribute('aria-expanded', String(state));
        nav.classList.toggle('open', state);
      }

      toggle.addEventListener('click', function () {
        setExpanded(!nav.classList.contains('open'));
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          if (window.innerWidth <= 768) setExpanded(false);
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setExpanded(false);
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    exportButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        window.open('print.html', '_blank', 'noopener');
      });
    });

    scrollTopLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    initHeaderScroll();
    initReveal();
    initHeroParallax();
  }

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var scrollThreshold = 24;
    function update() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite, { once: true });
  } else {
    initSite();
  }

  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  });
})();
