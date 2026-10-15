# Changelog

## Unreleased

## 1.4.0 - 2026-10-15

- Updated project card statuses: Questify is now `Live`; EdgeLedger and Dink are now `Demo` (new status).
- Added a `Beta` card for Phantom, a location-based alternate reality game with capture-the-flag mechanics and a cosmic horror theme (Expo, Convex, Fastify).
- Project cards under **Things I've built** are now ordered by status: Live, then Beta, Demo, Early Signup, In Progress.
- Open source contributions now render as a single row carousel with prev/next controls and snap scrolling instead of a two-column grid. The row repeats and loops endlessly in both directions.

## 1.3.0 - 2026-10-15

- Added an **Open Source Contributions** section (`src/data/contributions.ts`, `src/components/Contributions.tsx`) surfacing upstream pull requests (merged and in review), starting with grafana/k6#6238, grafana/k6#6249 and open-webui/open-webui#27571. Linked from the home page and nav. (#10)
- Marked grafana/k6#6249 as merged (2026-10-15), linked its merge commit, and rewrote its description to reflect the final CI-workflow approach adopted in review. (#10)

- Updated the contact email from `hello@sdaichendt.dev` to `me@sdaichendt.com` across the contact section and booking page.

- Added a `/schedule` booking page with a Cal.com inline embed and three meeting types (15-min quick chat, 30-min intro call, 60-min deep dive). (#8)
- Linked the booking page from the hero CTA, nav, contact section, and footer.
- Added OG/Twitter metadata for `/schedule` and documented Cal.com setup in the README.
- Added a `NEXT_DIST_DIR` env override for the build output directory (useful for CI/sandboxed builds).

## 1.2.0 - 2026-05-27

- Added The Grasscast to the creative projects list and site copy.
- Updated Dink to `Beta` and linked it to `https://dink-beta.vercel.app`.

## 1.1.0 - 2026-05-25

- Updated location copy from Toronto to the Windsor/Detroit area in page metadata, the hero intro, and the about highlight.
- Replaced the site favicon with an `SD` initials icon.
- Added Vercel Web Analytics to the root layout.
- Removed GitHub links from project cards and project data.
- Updated project card links and statuses:
  - Adeso is tagged as `Early Signup`.
  - Questify links to `https://questify.co` and remains tagged as `Beta`.
  - Farsi Flash links to `https://farsi-flash.vercel.app/` and is tagged as `Beta`.
  - EdgeLedger links to `https://edge-ledger-app.vercel.app/` and is tagged as `Beta`.
- Updated the current-work list to show only software consulting for Parallel42, linked to `https://www.p42systems.com/`.
- Added a new in-progress game card for Hollow Castle.
- Added an Elarya Studio game-dev brand card and itch.io links for Threshold and Hollow Castle.
- Added a markdown-backed résumé source and dynamic PDF download route for the résumé button.
- Updated the contact form and email link to use `hello@sdaichendt.dev`.
- Hardened the résumé markdown parser against unsupported heading syntax.
