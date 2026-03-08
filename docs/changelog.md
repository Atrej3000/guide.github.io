## 1.2.0

- added a static component templating layer with `src/pages/` and `partials/`
- added `tools/build-pages.js` to assemble deploy-ready root HTML pages
- converted shared header, footer, manual sidebar, and print toolbar into reusable partials
- updated build and release scripts to include page generation before validation

# Changelog

## 1.1.0 — Governance and validation pass
- Added Node-based validation scripts for headings, links, and search index integrity.
- Added deterministic search-index rebuild tool.
- Added `package.json` scripts for local serving, quality checks, and release preparation.
- Added GitHub Actions workflow for automated validation on push and pull request.

## 1.0.0 — Enterprise static baseline
- Introduced layered CSS and modular JS architecture.
- Added metadata-driven TOC and client-side search index.
- Added governance documentation for architecture, content, accessibility, print, and release.
