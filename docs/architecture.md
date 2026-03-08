# Architecture

This project uses a static-site enterprise structure based on HTML, CSS, and JavaScript only.

## Layers
- `assets/css/core`: tokens, base, utilities
- `assets/css/layout`: shared structural layout
- `assets/css/components`: reusable UI patterns
- `assets/css/pages`: page-specific styles
- `assets/js/core`: DOM and utility helpers
- `assets/js/modules`: reusable behavior modules
- `assets/js/pages`: page orchestration
- `assets/data`: TOC/search metadata

## Bootstrap
All pages load `assets/js/app.js` as the single module entrypoint and declare page identity via `body[data-page]`.


## Component templating layer

The project now uses a static build layer based on `src/pages/` and `partials/`. Shared fragments such as the site header, page footers, the manual sidebar, and the print toolbar are authored once in `partials/` and assembled into deploy-ready root HTML files by `tools/build-pages.js`. This keeps the stack strictly HTML, CSS, and JavaScript while removing duplicated page chrome.

Build flow:

1. Edit source pages in `src/pages/`.
2. Edit shared fragments in `partials/`.
3. Run `npm run build:pages` or `npm run build`.
4. Validate with `npm run check`.
