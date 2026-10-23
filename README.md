# 0xyz-exe portfolio

Static, GitHub Pages-compatible portfolio. No build system or runtime dependencies are required.


Repository: https://github.com/0xyz-exe/0xyz-exe.github.io

## Screenshots

### Terminal Interface & Developer Hero
![Portfolio Hero](docs/screenshots/01_portfolio_hero.png)

### Featured Engineering Projects Showcase
![Projects Showcase](docs/screenshots/02_projects_showcase.png)

### Technical Skills & System Architecture Matrix
![Technical Skills](docs/screenshots/03_skills_matrix.png)

### Contact & Professional Coordinates
![Contact Coordinates](docs/screenshots/04_contact_coordinates.png)

## Preview locally

From this directory, run a local static server, for example:

```sh
python -m http.server 8000
```

Then open <http://localhost:8000/>. (Opening `index.html` directly also works, but browsers may limit API requests from `file://`.)

## Deploy

The site is served from the repository's `main` branch root on GitHub Pages. Publishing changes to `main` triggers the static site update; no build step is needed.

## GitHub data

On each visit, the page requests `https://api.github.com/users/0xyz-exe/repos?per_page=100&sort=updated`. It displays selected non-fork, non-archived repositories and uses descriptions, languages, stars, and links supplied by GitHub. A small localStorage copy is shown if available during refresh or when the public API is unavailable. API rate limits and GitHub's own update propagation mean this is near-real-time, not instantaneous. No token is embedded or required.

## HyperFrames

HyperFrames is an HTML-to-video composition and rendering tool, not a website animation framework. This portfolio uses CSS and browser-native APIs for its live interactions; HyperFrames is not installed or added to the production site. It could be used separately to render an optional showreel if desired.