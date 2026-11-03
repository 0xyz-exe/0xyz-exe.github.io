# INSTRUMENTAL — portfolio implementation

Instrumental is precise in structure, human in tone, experimental only where it helps. Decoration must clarify structure, state, or action. The portfolio uses an editorial engineering layout: type-led introduction, evidence-based project list, restrained labels, and fine dividers. No fake telemetry, skill percentages, stock imagery, external fonts, or decorative animation.

## Foundations

Runtime source: `assets/design/tokens/colors.css` + `assets/design/tokens/design.css`. Dark is primary; light mapping is available with `data-theme="light"`. Semantic variables: `--ink`, `--graphite`, `--panel`, `--panel-raised`, `--line`, `--text`, `--muted`, `--signal`, `--ember`, `--info`, `--success`, `--warning`, `--danger`, `--focus`.

Canonical dark palette: canvas `#101312`, surface `#191e1b`, raised `#202723`, border `#3b4740`, text `#f0f3ee`, muted `#a5b0a8`, primary signal `#c6f36a`, information `#91c8ff`, ember `#ff7458`, success `#a5e58d`, warning `#f1cb72`, focus `#e0ff9d`. Light theme uses semantic equivalents with readable contrast; do not hard-code colors into components.

Typography: system sans for UI/body; system condensed fallback for display; system monospace only for brief labels, metadata, identifiers. Space aligns to 4px rhythm: 4, 8, 12, 16, 24, 32, 48, 64px. Borders are 1px; surfaces stay flat unless elevation communicates an overlay.

## Components and behavior

- Sticky header: wordmark, section links, mobile toggle, theme control.
- Buttons/links: minimum 44px controls, visible focus, clear destination/action.
- Project entries: indexed metadata, evidence-based description, stack tags, status, direct source/demo links.
- Timeline: dates and facts without unsupported outcomes.
- Contact: email and GitHub links; no pretend form.
- Theme: localStorage preference when available; otherwise first visit follows OS; no preference failure breaks page.

Motion is limited to brief hover feedback. Respect `prefers-reduced-motion`. Semantic landmarks and headings, image alt, keyboard access, and non-color labels are required.

## Responsive rules

Content max-width 70rem, flexible viewport gutters. Two-column hero/projects and profile reflow to one column under 40rem. Navigation collapses to an operable menu; touch targets remain accessible. Avoid fixed-width content and overflow. Verify at 1440, 1280, 1024, 768, 390, and 360px, plus 200% zoom.

## Maintenance

Use tokens; preserve factual content, Jekyll compatibility, accessibility, and no paid/runtime dependencies. Project status must distinguish starter, prototype, internship, and public repository; verify links before adding. Test theme switching/persistence, menu keyboard operation, section anchors, and browser console after changes. Never claim screenshot QA unless screenshots were captured and inspected.