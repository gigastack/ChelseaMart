> Superseded: this earlier product/design spec has been replaced for UI implementation by `docs/superpowers/specs/2026-04-21-canonical-ui-redesign.md`. Keep this file as historical product context only.

# China-Nigeria Commerce Platform Design

## Summary

This product is a `Next.js` commerce platform for curated China-sourced products aimed at Nigerians globally. Customers browse a local catalog priced natively in `CNY`, can toggle display between `CNY` and `NGN`, and always pay in `NGN`. Logistics invoices are generated later in `USD` after warehouse measurement and proof upload, then settled in `NGN`. The admin controls imports, catalog lifecycle, route management, warehouse operations, split payments, BI, and order statuses. `ELIM` is used only by admin flows, and the storefront never depends on live ELIM reads.

## Goals And Locked Scope

- Build a premium, trust-heavy storefront rather than a noisy marketplace clone.
- Support `guest browsing`, `guest cart`, `email/password + Google` auth, and a customer dashboard.
- Use `Paystack` as the only live payment provider in `v1`.
- Support `Manual Upload` and `Fetch from API` as equal product creation paths.
- Support `100+ URL` batch imports asynchronously.
- Keep product pricing native in `CNY` and logistics invoicing native in `USD`.
- Maintain exactly two live exchange rates in admin:
  - `CNY -> NGN` for product-payment settlement
  - `USD -> NGN` for shipping-payment settlement
- Use a two-phase logistics model: product payment first, then shipping payment after warehouse measurement and proof upload.
- Enforce MOQ everywhere through a global default plus optional product-level override.
- Keep secrets env-only for ELIM and Paystack.

Deferred to `v2`:
- Customer-facing live ELIM search.
- Multi-admin roles and permissions.
- Additional payment gateways.
- Additional destination and lane expansion beyond the admin-managed route table.
- Last-mile delivery management.

## Architecture And Core Data Flow

- One `Next.js` app with `storefront` and `admin` surfaces.
- `Supabase` provides Postgres, auth, and storage.
- `Paystack` handles `NGN` checkout.
- `ELIM` is used only by admin import, resync, and availability audit workflows.
- Storefront reads only local database records.

Product creation:
- Admin starts with `Manual Upload` or `Fetch from API`.
- Both paths end in one shared local product editor.
- API-imported products also keep source linkage metadata and the latest source snapshot.
- API imports land in `draft` first.

Catalog health:
- Admin-triggered availability scans re-check stored source IDs.
- If a source item becomes unavailable, the product is auto-hidden from storefront and moved into the `Unavailable` review tab.
- Admin can keep the product hidden in DB, restore it later, or delete it permanently.

## Domain Rules

### Pricing, Currency, And Logistics

- Imported source pricing stays in `CNY`. There is no import-time currency conversion.
- Storefront browsing defaults to `CNY`, with an `NGN` display toggle.
- Product checkout currency is always `NGN`, using the active admin-managed `CNY -> NGN` rate.
- Product and listing pages show product price only.
- Product pages show product price only, while checkout captures route acceptance and terms.
- Customer chooses an admin-managed shipping route and accepts its formula, ETA, and terms before product payment.
- Product payment and shipping payment are separate flows and separate ledgers.
- Final shipping is calculated only after warehouse measurement using the accepted route version.
- Logistics invoices are shown to customers in `USD`, then settled in `NGN` using the active admin-managed `USD -> NGN` rate.
- Product `weight` and `volume` are warehouse and pricing inputs, because air uses KG and sea uses CBM.
- `MOQ` is admin-configurable through a global default plus optional product-level override, and it is enforced in cart and checkout.

### Buyer And Consignee Model

- Signed-in account owner is the buyer.
- Consignee records are separate from buyer identity.
- Customers can save multiple consignee records for Nigeria hub/contact handling.
- The service covers arrival into Nigeria hubs, not last-mile home delivery.

### Product Lifecycle

- States: `Draft`, `Live`, `Removed`, `Unavailable`.
- `Live` appears on storefront.
- `Draft` is hidden until admin publishes.
- `Removed` is intentionally taken off-stage by admin.
- `Unavailable` is auto-hidden due to source checks and reviewed separately.

## Brand Kit And Visual System

The UI is driven by a tokenized brand kit, not hardcoded colors.

Brand color range:
- `brand.950 = #042F2E`
- `brand.800 = #0B5F5B`
- `brand.600 = #0D9488`
- `brand.500 = #14B8A6`

Neutrals:
- `surface.base = #FCFCFB`
- `surface.alt = #F5F7F7`
- `surface.card = #FFFFFF`
- `text.primary = #0F172A`
- `text.secondary = #475569`
- `border.subtle = #E5E7EB`

Typography:
- `General Sans` or `Plus Jakarta Sans` for headings and UI.
- `JetBrains Mono` only for IDs, logs, weights, MOQs, and technical data.

Visual split:
- `Storefront`: premium trust commerce, editorial spacing, restrained accents, strong 4:5 product imagery.
- `Admin`: operational power-station, tighter grids, sharper tables, bento BI, import logs, and denser control panels.

## Storefront UX

### Shared Shell

- Header includes logo slot, search, category navigation, `CNY/NGN` display toggle, account, and cart.
- Mobile uses a compact top bar and drawer-based navigation.
- Footer includes trust links, support, FAQ, and policy pages.

### Home, Catalog, Search

- Home should lead with trust, then discovery.
- Featured collections and categories should feel curated, not promo-stacked.
- Catalog and search pages use clean filter bars and 4:5 product cards.
- Product cards show image, title, product price, MOQ, and a subtle note that logistics is invoiced later after warehouse proof.

### Product Detail

- Gallery-led layout with sticky purchase panel on desktop.
- Purchase panel includes title, summary, price, MOQ, variants, quantity, and add-to-cart.
- A visible route module explains that the customer pays for products first and pays shipping later after warehouse proof is uploaded.
- Customer content should be polished local content, not raw supplier noise.

### Cart, Checkout, Dashboard

- Guest cart is supported.
- Cart shows product subtotal only and explains that logistics is invoiced later after warehouse measurement.
- Checkout flow: sign in, choose consignee, choose an admin-managed route, accept route terms, review product-only totals, pay with Paystack.
- Checkout shows product subtotal in `CNY`, settlement preview in `NGN`, and no logistics charge in the first payment.
- Customer dashboard includes `Orders`, `Consignees`, and `Account`, but the order area is treated as a service center for product receipts, warehouse proof, and logistics invoices.
- Order tracking follows the two-phase lifecycle: `route_selected`, `paid_for_products`, `awaiting_warehouse`, `arrived_at_warehouse`, `weighed`, `awaiting_shipping_payment`, `shipping_paid`, `in_transit`, `arrived_destination`, `out_for_delivery`, `delivered`, `cancelled`.

## Admin UX

### Shared Shell

- Left sidebar with logo slot, primary navigation, and system state badges.
- Top bar with page title, global search, notifications, sync status, and admin profile.
- Sections: `Dashboard`, `Products`, `Imports`, `Orders`, `BI Suite`, `Settings`.

### Dashboard

- KPI strip for live products, drafts, unavailable products, pending orders, revenue, and import queue.
- Bento-style cards for sales overview, catalog health, import activity, order funnel, alerts, and recent activity.
- Every major metric should deep-link into filtered underlying data.

### Products

- Main tabs: `Live`, `Drafts`, `Removed`, `Unavailable`.
- Table-first management with filters, bulk actions, and preview actions.
- Product editor sections: basic info, media, descriptions/specs, pricing, logistics, variants, visibility, and source metadata.
- Sticky side rail shows publish readiness and validation issues.

### Imports

- Support URL paste, keyword search, bulk URL paste, and optional CSV upload.
- Batch imports must support `100+ URLs`.
- Import jobs run asynchronously with dedupe, queueing, and retries.
- Import screens show structured progress plus a technical mono log panel.
- Missing ELIM env config disables API import actions with clear messaging.

### Orders

- Manual operations surface with fast status updates.
- Order detail includes buyer, consignee, route, payment state, line items, totals, notes, and receipt/invoice export.
- Internal notes never appear on customer surfaces.

### BI Suite

- Full BI product, not lightweight analytics.
- Areas: executive overview, sales intelligence, catalog intelligence, operations intelligence, payment intelligence.
- Required features: date filtering, compare periods, exports, drilldowns, stale-data warnings, and consistent chart semantics.

### Settings

- Grouped sections for integration health, `CNY -> NGN`, `USD -> NGN`, default MOQ, route ledger visibility, payment posture, sync controls, and admin security.
- ELIM and Paystack secrets are env-only and never editable in UI.
- Settings show health, configured/missing state, validation results, and last-success metadata.

## Codex Rule Placement

The active Codex rule source of truth should be `AGENTS.md` files in the repository tree.

Current placement:
- Root `AGENTS.md` holds shared product, design, coding style, coding standards, security, and verification rules.

Planned nested placement once implementation creates real source directories:
- `app/AGENTS.md` for route and layout rules that apply across the application.
- `app/(storefront)/AGENTS.md` or the equivalent storefront route group for customer-facing shopping UI.
- `app/(admin)/AGENTS.md` or the equivalent admin route group for operations, imports, orders, BI, and settings.
- `components/AGENTS.md` for shared UI component and token usage rules.
- `lib/AGENTS.md` for pricing, ELIM, Paystack, normalization, validation, and other domain/service code.

This keeps Codex-compatible rules in the file placement Codex can actually load, while still allowing tighter scope through nested `AGENTS.md` files as the codebase grows.

## Acceptance Criteria

- Product creation starts with `Manual Upload` or `Fetch from API`.
- Storefront reads only local DB products and never ELIM directly.
- Imported products land in `Draft` first.
- Batch import handles `100+ URLs` asynchronously with dedupe and progress visibility.
- Product publish is blocked if weight or required route config is missing.
- Checkout always pays in `NGN`, even when storefront display mode is `CNY` or `NGN`.
- Checkout captures route acceptance and charges product totals only.
- Shipping payment becomes available only after warehouse measurement and proof upload.
- Product prices remain stored in `CNY`, logistics invoices remain stored in `USD`, and both payment phases preserve native-currency plus settlement-currency snapshots.
- Global default MOQ and product-level MOQ override both affect live cart and checkout validation.
- Unavailable-source products are auto-hidden from storefront and listed in the dedicated review tab.
- BI supports date filters, drilldowns, and exports.
- Secrets are env-only and never editable in UI.
- UI follows the approved deep blue-green token system and section-specific design rules.

## Assumptions

- `Paystack` remains the only live `v1` payment gateway.
- Route geography is admin-managed rather than hardcoded into the repository rules.
- Availability scans are admin-triggered, even if scheduled refresh exists for other import jobs.
- The repo will use root and nested `AGENTS.md` files as the Codex-visible rule system as real source directories are created.
