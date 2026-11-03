# Repository guidance

## Stack and architecture

- Static Jekyll site, GitHub Pages compatible. Preserve `_config.yml`, `_projects/`, `_layouts/`, and existing plugin assumptions.
- Main page: `index.html`; page styling: `assets/css/site.css`; interaction: `assets/js/main.js`.
- Canonical Instrumental runtime tokens: `assets/design/tokens/`. No framework, package manager, build system, remote fonts, or external stats API.
- Keep scripts small and dependency-free. Use static HTML for project content; no fake API success or contact submission.

## Design constraints

Read `DESIGN.md` before UI changes. Preserve Instrumental's semantic palette, 4px spacing, calibrated contrast, minimal surfaces, responsive layout, reduced motion, and focus states. Do not introduce generic component-kit appearance, decorative telemetry, fake metrics, gradients/glows, skill bars, or unsupported profile claims.

## Content integrity

Use primary public repositories for project names, stack, status, and links. Distinguish prototypes/starters from built applications. Do not invent employment outcomes, certification identifiers, public stats, deployments, performance claims, or LinkedIn URL. Keep personal facts aligned with supplied profile materials.

## Accessibility and responsive behavior

Use semantic landmarks/headings, descriptive image alt, keyboard-operable controls, accessible names, visible focus, non-color status text, and 44px primary touch targets. Mobile menu must work at narrow widths. Respect `prefers-reduced-motion`. Test 1440/1280/1024/768/390/360px and check horizontal overflow.

## Verification workflow

1. Inspect Git status and diff; preserve unrelated changes.
2. Run `node --check assets/js/main.js`; validate token JSON.
3. Run `bundle exec jekyll build` where Ruby/Bundler exist; this environment may not provide Ruby.
4. Serve locally, exercise theme toggle + persistence, menu, anchors, email/repo links; inspect console and responsive overflow in a real browser.
5. Capture and inspect screenshots before reporting visual verification.
6. Review the final diff. Do not commit, push, merge, or deploy without explicit authorization.