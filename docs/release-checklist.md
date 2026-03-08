# Release Checklist

- Rebuild the search index: `npm run build:search-index`
- Run all validations: `npm run check`
- Verify desktop, tablet, and mobile navigation
- Verify print output in A4 preview
- Check appendix images and lightbox behavior
- Confirm all export buttons open `print.html`
- Review changelog and bump version in `package.json` if needed

- Run `npm run build` before release to regenerate root HTML pages and the search index.
- Confirm that shared fragments in `partials/` render correctly on `index.html`, `manual.html`, `appendices.html`, and `print.html`.
