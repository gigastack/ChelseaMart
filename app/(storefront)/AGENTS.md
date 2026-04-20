# Storefront Rules

These rules apply to files under `app/(storefront)/`.

## visual direction

- Keep the storefront premium, calm, fluid, and image-led.
- Use the fluid editorial token system:
  - ink and porcelain for structure
  - oxidized teal as the main brand accent
  - brass only for restrained premium emphasis
- Do not introduce ad hoc promo colors, discount-market styling, or dense dashboard card stacks.
- Product and catalog screens show product price only. Logistics belongs to checkout.
- `USD` may affect display only. Checkout and payment messaging must remain `NGN`-first.

## ux behavior

- Guest browsing and guest cart are first-class.
- Search, collection browsing, and product detail flows must feel fast and uncluttered.
- The first viewport should read like an editorial composition, not a SaaS dashboard.
- Use fluid transitions for route changes, active filters, drawers, and cart state where they improve continuity.
- Avoid global smooth-scroll wrappers unless the experience is long-form and content-led. If introduced later, keep it storefront-only.
- Checkout must clearly separate buyer identity, consignee selection, route choice, and order review.
- Customer order tracking is status-driven. Do not imply carrier-grade live tracking when it does not exist.

## implementation

- Prefer server-rendered data for catalog pages where possible, with client components reserved for toggles, cart state, and live form interactions.
- Keep pricing display logic separate from checkout pricing calculation logic.
- Storefront motion should default to `Motion for React` primitives such as `AnimatePresence`, `layout`, and shared layout IDs, not custom scroll hacks.
