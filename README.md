# Daniel Achmad Farizki — Engineering Portfolio

Static, GitHub Pages-compatible portfolio built with Jekyll-compatible HTML, CSS, and vanilla JavaScript. Design foundation: INSTRUMENTAL, the original semantic design language in `assets/design/tokens/`.

## Preview locally

```sh
python -m http.server 8000
```

Open <http://localhost:8000/>. No JavaScript packages, API keys, paid services, or remote fonts required.

## Architecture

- `index.html`: one-page portfolio, project evidence, experience, metadata.
- `assets/css/site.css`: responsive layout and components.
- `assets/design/tokens/`: canonical semantic CSS tokens and themes.
- `assets/js/main.js`: theme preference and accessible mobile navigation.
- `_projects/`, `_layouts/`: existing Jekyll project detail pages retained.
- `assets/profile.png`: user-supplied portrait.

## Design language

Dark is default; the switch toggles light/dark and persists in local storage. First visit follows the OS color preference. Colors, spacing, type, motion, and surfaces follow INSTRUMENTAL. See `DESIGN.md` for implementation rules. Keep monospace for short metadata; use semantic tokens; honor reduced motion and visible keyboard focus.

## Content maintenance

Verify repository descriptions, links, stacks, and development status against the public source before changing project entries. Do not claim employment outcomes, personal ownership, metrics, certification IDs, or deployments without evidence. The contact action uses a real `mailto:` link; no form pretends to send messages. GitHub links are direct, with no live stats API.

## Build and deployment

The existing Jekyll/GitHub Pages architecture remains. Gemfile retains Jekyll 4.3, `jekyll-seo-tag`, and `jekyll-sitemap`; GitHub Pages publishes from the repository root on `main`. For local Jekyll builds, install Ruby/Bundler and run `bundle install && bundle exec jekyll build`. No publication or deployment is performed from this feature branch.

## Verification

Check `node --check assets/js/main.js`, validate token JSON, build with Jekyll when Ruby is available, then test theme persistence, keyboard navigation, mobile menu, responsive widths, links, and browser console in a real browser. Do not describe screenshot files as available unless captured and added.