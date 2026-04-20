# App Rules

These rules apply to all files under `app/` and refine the repo root `AGENTS.md`.

## routes and layouts

- Keep route files thin. Move reusable UI into `components/` and domain logic into `lib/`.
- Default to server components for pages and layouts. Add `"use client"` only where interactivity or browser APIs require it.
- Shared layouts must consume the tokenized brand system from `app/globals.css` and shared UI primitives from `components/ui`.
- Shared layouts must preserve the new fluid layout language: broad visual planes, restrained chrome, and continuous spacing rhythm instead of stacked utility cards.
- Route groups should preserve the product split:
  - storefront for customer browsing, cart, checkout, and dashboard
  - admin for operations, imports, products, orders, BI, and settings

## data boundaries

- Read data through typed server-side helpers or service modules rather than embedding raw fetch logic directly in pages.
- Never call ELIM directly from public storefront routes.
- Keep auth checks, redirects, and protected-route logic explicit at the route boundary.

## ui states

- Every major route must define loading, empty, and error states.
- Preserve mobile-first behavior on storefront routes and desktop-first clarity on admin routes.
- When motion is used, prefer Motion layout transitions or presence transitions that reinforce structure changes. Avoid ornamental motion that delays task completion.
