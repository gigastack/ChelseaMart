# Canonical UI Redesign Specification

This document is the implementation source of truth for the approved UI redesign. It supersedes the split notes in `UI.md` through `UI5.md`, which remain as reference inputs only.

## Product Intent

Rebuild the storefront, customer account, and admin surfaces so the product no longer looks like a placeholder or MVP while preserving all current behavior:

- CNY-native catalog browsing
- NGN product settlement
- USD logistics invoices with NGN settlement
- MOQ enforcement
- route acceptance before product payment
- warehouse proof before shipping payment
- split product and shipping ledgers

This redesign is a full page-level UI replacement over stable routes and stable commerce logic. It does not include schema changes, API changes, webhook changes, auth changes, or payment-flow changes.

## Stable Boundaries

The redesign must preserve these routes and their behaviors:

- `/`
- `/catalog`
- `/search`
- `/products/[slug]`
- `/cart`
- `/checkout`
- `/account/orders`
- `/account/orders/[orderId]`
- `/account/consignees`
- `/admin`
- `/admin/products`
- `/admin/imports`
- `/admin/orders`
- `/admin/bi`
- `/admin/settings`
- `/api/paystack/webhook`

The redesign may replace page shells, page compositions, and shared visual primitives. It must not silently rewrite business rules or data contracts.

## Design Direction

### Tone

The visual direction is `premium marketplace`, not bargain-chaos and not overly sparse editorial minimalism.

- more energy, merchandising, density, and browse motion than the current build
- still calm, trust-heavy, and controlled
- clearly premium rather than generic ecommerce

### Brand System

Use one brand system across all surfaces with different operating modes:

- storefront: expressive, image-led, browse-heavy, conversion-oriented
- customer account: calmer service-center mode with strong logistics visibility
- admin: denser operational mode with sharper layout, faster scanning, and stronger hierarchy

Storefront, account, and admin must feel like the same product, not three separate brands.

### Imagery

This phase is `structure first`, not an asset-production pass.

- use current/local imagery and placeholders where needed
- use stronger composition, typography, spacing, surfaces, and color to carry the design
- do not block the redesign on a richer media library

## Typography And Motion

### Typography

Use:

- `General Sans` for headings, controls, interface copy, and standard paragraphs
- `JetBrains Mono` only for IDs, ledger values, rates, weights, CBM values, import logs, and order numbers

Do not keep the current font stack as the redesign baseline.

### Motion

Use Motion for React for:

- section reveals
- page/shell transitions where useful
- subtle state continuity
- layout transitions on lists and panels

Motion must remain reduced-motion-aware and restrained. Do not add Lenis or GSAP in this pass.

## Shared Shell Requirements

### Root Foundation

- Replace the current global visual foundation in `app/layout.tsx` and `app/globals.css`
- Establish the final token system for surfaces, borders, text, accents, radii, spacing feel, and typographic rhythm
- Build shell primitives that can support storefront, service-center, and admin modes without duplicating the brand

### Storefront Shell

- sticky header with stronger search/discovery presence
- visible CNY/NGN toggle, defaulting to CNY
- clearer account/cart utilities
- stronger footer that reinforces trust, support, policy, and the two-phase shipping model
- mobile shell must remain first-class, not desktop-only reduced

### Admin Shell

- true admin shell with sidebar and top bar
- sidebar includes Dashboard, Products, Imports, Orders, BI Suite, Settings
- top bar supports page context, faster orientation, and space for operational actions or signals
- admin should no longer feel like independent pages dropped into the public shell system

## Storefront Surface Requirements

### Home

Replace the current sparse landing page with a stronger browse-oriented front page:

- high-confidence hero with merchandise energy
- concise explainer of the two-phase product-plus-logistics model
- visible featured categories or curated discovery sections
- stronger use of product modules and section hierarchy

### Catalog And Search

- denser, more intentional product discovery layouts
- filters and browse controls must feel real, even if backed by current feature scope
- cards must clearly expose:
  - image
  - title
  - CNY-first price display
  - MOQ
  - deferred shipping truth

### Product Detail

- rebuild into a stronger product presentation with sticky purchase rail
- keep route and two-phase payment explanation obvious
- keep quantity controls visibly constrained by effective MOQ
- preserve current business logic and add-to-cart behavior

### Cart And Checkout

- cart must reinforce that the first payment is product-only
- cart should be presented as a drawer-like or tightly scoped summary surface, not a dead-end table
- cart must include an explicit acknowledgement that shipping is calculated and billed later
- checkout must preserve:
  - consignee selection
  - route selection
  - route acceptance
  - CNY reference with NGN settlement preview
- checkout should be presented as a clear staged flow:
  - identity and consignee
  - route selection
  - payment review
- route selection must use admin-managed routes and show ETA and formula copy without pretending to know the final shipping price yet
- payment review must show:
  - product subtotal in CNY
  - settlement preview in NGN using the active `CNY -> NGN` rate
  - shipping as an explicit deferred line item rather than a hidden omission
- shipping remains clearly deferred until warehouse measurement and proof upload

## Customer Account Requirements

Treat account as a service center rather than a plain order history.

### Orders List

- stronger logistics-oriented status visibility
- clearer split between product payment and logistics payment
- clearer warehouse-proof state and shipping-invoice readiness

### Order Detail

- make the order lifecycle highly legible
- emphasize:
  - product payment snapshot
  - route snapshot
  - warehouse proof
  - USD shipping invoice
  - NGN shipping-payment action
  - delivery state progression

### Consignees

- preserve current function
- present it as part of the broader service-center experience, not an orphan utility page

## Admin Requirements

### Dashboard

Replace the current semi-placeholder dashboard with an actual control room:

- stronger KPI strip or summary hierarchy
- queue-first prioritization
- operational posture and revenue split visibility
- direct paths into the highest-action areas

### Products

- keep current product behavior and editor capabilities
- redesign toward faster merchandising and publish-readiness scanning
- make CNY pricing, MOQ, and logistics readiness clearer in both table and editor views

### Imports

- keep import behavior and status logic
- redesign for clearer batch progress, queue state, and technical log visibility
- imports page must include:
  - large paste area for one-or-many source URLs
  - secondary batch entry path such as CSV upload or equivalent batch affordance
  - clear disabled state when ELIM env configuration is unavailable
- job progression should be visually legible through stages like:
  - queued
  - fetching
  - deduplicating
  - draft created
- technical logging should remain mono-styled and visible enough for operators to diagnose failures without leaving the page

### Orders

- redesign tables and detail view for warehouse operations
- preserve split-ledger visibility
- preserve warehouse measurement and proof workflows
- make the action hierarchy clearer for statuses that need human intervention

### BI

- present BI as a real analysis surface rather than a placeholder chart page
- preserve current metrics while improving controls, readability, and comparative context

### Settings

- preserve the two exchange-rate controls and global MOQ
- preserve route/config visibility
- redesign for clearer distinction between:
  - product economics
  - logistics economics
  - route definitions
  - env-managed integrations
- settings should be structured as a left-nav or strongly segmented control surface, not a single flat form
- the exchange-rate area must clearly separate:
  - `CNY -> NGN` for product checkout
  - `USD -> NGN` for logistics settlement
- each economic control area should be strong enough to read as an operational lever, not generic form input
- integration state for ELIM and Paystack must remain visibly env-managed, masked, and non-editable in the UI

## Implementation Constraints

- No backend or schema changes in this phase
- No route changes in this phase
- No payment provider changes in this phase
- No webhook contract changes in this phase
- No change to current order lifecycle semantics in this phase
- No image-generation or media-sourcing pass in this phase unless separately approved

## Acceptance Criteria

The redesign is complete only when:

- the old sparse page compositions are fully replaced
- storefront, customer account, and admin all reflect one coherent premium-marketplace system
- route paths and commerce behaviors remain intact
- CNY/USD/NGN logic still behaves exactly as before
- MOQ remains enforced anywhere quantity can change
- admin and customer Playwright flows still pass after the rebuild
