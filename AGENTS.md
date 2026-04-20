
## codex rules

For Codex, the project rule source of truth is `AGENTS.md` in the repo tree. Keep shared rules in this root file, and add nested `AGENTS.md` files only inside real source directories once implementation creates them.

Planned nested placement once the app exists:
- `app/AGENTS.md` for route and layout rules shared across the app.
- `app/(storefront)/AGENTS.md` or the equivalent storefront route group for public shopping screens.
- `app/(admin)/AGENTS.md` or the equivalent admin route group for operations, imports, orders, BI, and settings.
- `components/AGENTS.md` for shared UI component conventions.
- `lib/AGENTS.md` for pricing, ELIM, Paystack, validation, and other domain/service logic.

## product and scope

- Build a `Next.js` commerce platform with a public storefront and an admin surface.
- `ELIM` is admin-only ingestion and sync. The storefront must never depend on live ELIM reads.
- Use the local database as the storefront source of truth.
- `USD` is display-only in `v1`. Checkout and payment are always `NGN`.
- The product price is shown on listing and detail pages. Shipping is accepted at checkout but paid later after warehouse measurement and proof upload.
- Checkout route choice comes from admin-managed shipping routes and route versions, not a hardcoded geography model.
- Product payment and shipping payment are separate ledgers, separate Paystack flows, and separate customer/admin states.
- Availability audits are admin-triggered.

## tech stack defaults

- Use `Next.js` App Router.
- Use `TypeScript` in strict mode.
- Use `Supabase` for Postgres, auth, and storage.
- Use `Drizzle ORM` as the typed schema and query layer for app-owned commerce data.
- Use `Paystack` as the only live `v1` payment provider.
- Use `Zod` for validation of user input, admin forms, and normalized external payloads.
- Use CSS variables/design tokens for the brand kit. Tailwind utility usage is fine, but design tokens remain the source of truth.

## coding style

- Prefer named exports over default exports.
- Use functional React components only.
- Default to server components; use client components only when hooks, browser APIs, or interactive state truly require them.
- Avoid `any`. Use `unknown` and narrow properly.
- Keep functions focused and small enough to read without scrolling through unrelated branches.
- Keep files single-purpose. Split files when they start mixing layout, business logic, and external integration logic.
- Use clear, domain-specific names over abbreviations.
- Add comments only when the intent or invariant is not obvious from the code.
- Do not leave `console.log` in production code.

## coding standards

- Keep business logic out of presentational components.
- Put pricing, currency, import normalization, payment handling, and order snapshot logic into dedicated server-side modules.
- Access environment variables through a typed config layer rather than scattering `process.env` reads everywhere.
- Validate all external API payloads and form inputs before using them.
- Once the hosted commerce schema is live, do not keep in-memory compatibility fallbacks in normal runtime paths. Fail clearly or block the workflow with actionable guidance.
- Persist snapshot values used for orders so later settings changes do not rewrite historical totals.
- Keep buyer and consignee as separate models.
- Keep ELIM source linkage and source snapshots for API-linked products.
- Never silently overwrite live catalog content from a sync job.
- Keep error states explicit and recoverable for imports, checkout, scans, and settings.

## design standards

- Use a fluid editorial brand system built from semantic tokens. Never hardcode ad hoc palette choices in components.
- Global palette direction:
  - `ink` foundation for structure and typography
  - `porcelain` and `linen` surfaces for warmth and calm
  - `oxidized teal` as the primary brand accent
  - `brass` as the restrained premium accent, never as a dominant fill
- Storefront UI must feel premium, calm, image-led, trust-heavy, and spatially fluid rather than boxed or card-stacked.
- Admin UI must feel like an operational control room with stronger data density, sharper alignment, and faster scanning.
- Avoid marketplace clutter, bargain-chaos styling, and generic dark-dashboard defaults.
- Prefer large layout planes, editorial spacing, and selective dividers over all-purpose card grids.
- Default motion framework is `Motion for React` for layout transitions, section reveals, and route presence effects. Prefer transform/opacity animation and shared layout transitions over heavy timelines.
- `Lenis` is optional and storefront-only for long-form browse experiences. Do not use smooth-scroll wrappers in admin.
- `GSAP` is not the default. Use it only for isolated art-direction cases that Motion cannot express cleanly.
- Use reduced-motion aware transitions. Motion should make state feel continuous, not dramatic.
- Design loading, empty, success, and error states for every major screen.
- Keep mobile first-class on storefront and acceptable for core admin tasks.

## security and config

- ELIM and Paystack secrets are env-only and must never appear in admin forms.
- UI may show configured, missing, invalid, and last-success status only.
- Missing env config must block affected workflows with clear guidance.
- Never log raw secrets or secret-bearing payloads.

## verification

- Run the most relevant checks after code changes: lint, test, typecheck, build, or other project-defined validations once they exist.
- If nested `AGENTS.md` files later define area-specific checks, run them for files in that scope.

## reference

- Product/design spec: `docs/superpowers/specs/2026-04-17-china-nigeria-commerce-design.md`
