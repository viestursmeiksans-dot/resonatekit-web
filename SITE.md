# SITE.md — resonatekit.com

The agent's map for this repo. Read this first, every job. This site is an **Eleventy (11ty)** project: edit `src/`, the build generates `_site/`, which is what Cloudflare Pages serves.

## Build
- Install: `npm ci`
- Build: `npm run build`  (Eleventy, `src/` → `_site/`)
- Output served to Pages: `_site/`
- **NEVER edit files in `_site/`** — they are generated. Edit `src/` only.

## Single source of truth — edit these, the build propagates
| To change…                | Edit this file                                   |
|---------------------------|--------------------------------------------------|
| Navigation / menu         | `src/_data/nav.json`                             |
| Footer                    | `src/_includes/footer.njk`                       |
| Brand name / contact / colors | `src/_data/site.json`                        |
| A blog's thumbnail/title/category/excerpt/readTime | `src/_data/posts.json` (one entry) |
| A blog's body text        | `src/blog/posts/<slug>.md`                       |
| Homepage sections         | `src/index.njk`                                  |
| Blog listing layout       | `src/blog/index.njk`                             |
| Corporate page            | `src/corporate-training.njk`                     |
| Shared `<head>` / fonts / analytics | `src/_includes/base.njk`               |
| Article page chrome (hero, CTA, breadcrumb) | `src/_includes/post.njk`       |

## Invariants (do not break)
- The nav appears on every page via `src/_includes/nav.njk`, rendered from `src/_data/nav.json`. There is ONE nav — never per-page copies. (The homepage renders the Contact item as a modal trigger; inner pages link to `/#kontakti`. nav.njk handles this with `page.url == "/"`.)
- Blog cards (homepage carousel + `/blog/` listing) are GENERATED from `posts.json` — never hardcode a card. The homepage carousel shows the first 5 entries; the listing shows all.
- Article pages (`post.njk`) pull their category, title, thumbnail, readTime, alt from the matching `posts.json` entry by slug — so changing one `posts.json` line updates the carousel, the listing card, AND the article hero at once.
- Tailwind is via CDN (`<script src="cdn.tailwindcss.com">` in base.njk + the homepage). No CSS build step.
- GA4 (`G-PML971EG2W`) and Meta Pixel (`2099771323910607`) are in `base.njk` (inner pages) and inline in `src/index.njk` (homepage). Do not duplicate.
- Images: prefer `src/assets/` (passthrough-copied to `/assets/`). Source new stock photos via Pexels (runtime `source_image` tool), then write the path into the ONE home for that slot (e.g. a `posts.json` thumbnail field) — never paste `<img>` into multiple files.
- `favicon.svg`, `robots.txt`, `sitemap.xml` live in `src/static/` (passthrough-copied to site root).

## Pages
- `/` (`src/index.njk`) — hero (video), logo marquee, category boxes, program selector + quote builder (interactive JS), coach, ask-a-question, testimonials, blog carousel, FAQ, footer, policy + contact modals. **Heavily interactive — keep its inline JS intact.**
- `/blog/` (`src/blog/index.njk`) — listing, loops over posts.json
- `/blog/<slug>/` (`src/blog/posts/<slug>.md` + `post.njk`) — 34 articles
- `/corporate-training/` (`src/corporate-training.njk`)

## Deploy
- `git push main` → GitHub Actions → `npm ci && npx @11ty/eleventy && wrangler pages deploy _site/` → resonatekit.com
- Do NOT run deploy manually; committing to `main` is the only trigger. One commit = one deploy.

## Known follow-ups (not yet done)
- Policy modals (Privacy/Terms/IP) and the contact modal exist only on the homepage. On inner pages the footer policy links point to `/#kontakti` and the nav Contact links to `/#kontakti`. To make modals work site-wide, extract them into a shared `modals.njk` + `modals.js` included by `base.njk`.
- `posts.json` `date` values are placeholders (`2026-01-01`) — real publish dates were not exposed in the source. Populate when known.
- `overcome-stage-fright` thumbnail in posts.json points to a local `/images/…webp` carried from the v1 site — confirm that asset is deployed or replace with a CDN/`src/assets/` image.
