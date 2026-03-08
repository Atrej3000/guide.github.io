
# Hybrid premium + enterprise build

This package preserves the premium visual/runtime bundle as the live website while also keeping the enterprise architecture layer for maintainability.

Production-stable runtime files currently used by the pages:
- assets/css/main.css
- assets/css/landing.css
- assets/css/manual.css
- assets/css/appendices.css
- assets/css/print.css
- assets/js/site.js
- assets/js/manual.js
- assets/js/print.js

Enterprise architecture layer included in parallel:
- assets/css/core/
- assets/css/layout/
- assets/css/components/
- assets/css/pages/
- assets/js/core/
- assets/js/modules/
- assets/js/pages/
- assets/js/app.js
- assets/data/
- docs/
- partials/
- tools/

This keeps the current polished UI intact while retaining the stronger architectural decisions for future refactors.

---

# guide.github.io

## Refactor notes

- shared interaction logic moved to `assets/js/site.js`;
- manual-specific behavior moved to `assets/js/manual.js`;
- appendices page styles moved to `assets/css/appendices.css`;
- content, wording, and document structure were preserved while improving semantics and maintainability.
