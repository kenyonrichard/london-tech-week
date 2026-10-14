# London Tech Week 2026 — Fact-Finding Report

Static Jekyll site (GitHub Pages), published at https://kenyonrichard.github.io/london-tech-week/ from `main`.

## Audit log

- **2026-10-14** — Site audited for performance, accessibility and SEO. Changes merged to `main` (PRs 3–5):
  - Shared layout `_layouts/default.html`; pages hold only front matter (title, description, `root`, `active`) plus body.
  - Pages serve resized copies from `images/web/` (max 1600px); originals in `images/` are used only by the lightbox. Gallery uses `images/thumbs/`.
  - Background video re-encoded (~1.6 MB) with poster; paused for reduced-motion users.
  - Nav dropdown, carousels and lightbox live in `js/site.js` (keyboard and ARIA support).
  - Meta description, Open Graph/Twitter tags, canonical URLs, `robots.txt`, `sitemap.xml`.
  - Inline styles moved to CSS classes; focus-visible and reduced-motion rules; footer wraps on mobile.
  - CSS/JS URLs carry a per-build `?v=` value (a stale cached stylesheet once broke the About, Event, VIP and Media pages).
  - `monogram.af` moved to `_source/` (not published).
- **Not done (deliberately):** CSS minification, Git LFS / history shrink (old 38 MB video remains in history), generating gallery tiles from a data file.

## Conventions

- Do not change page content (text, photos) when doing technical work.
- New images: add a resized copy to `images/web/`, reference it with `width`/`height`, keep the original in `images/`; gallery tiles also need a thumbnail in `images/thumbs/`.
- Check locally with `jekyll build` before merging; GitHub Pages builds from `main`.
