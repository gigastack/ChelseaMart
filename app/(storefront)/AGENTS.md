# Storefront Rules

These rules apply to files under `app/(storefront)/`.

## visual direction

- Keep the storefront premium, calm, fluid, and image-led.
- Use the fluid editorial token system:
  - ink and porcelain for structure
  - oxidized teal as the main brand accent
  - brass only for restrained premium emphasis
- Do not introduce ad hoc promo colors, discount-market styling, or dense dashboard card stacks.
- Product and catalog screens show product price only. Logistics belongs to the accepted-route and post-warehouse-payment flow.
- Catalog pricing is `CNY`-native, with `NGN` available as a display toggle and settlement preview.
- Logistics invoices are shown in `USD`, while payment messaging remains explicit that customers settle in `NGN`.

## ux behavior

- Guest browsing and guest cart are first-class.
- Search, collection browsing, and product detail flows must feel fast and uncluttered.
- The first viewport should read like an editorial composition, not a SaaS dashboard.
- Use fluid transitions for route changes, active filters, drawers, and cart state where they improve continuity.
- Avoid global smooth-scroll wrappers unless the experience is long-form and content-led. If introduced later, keep it storefront-only.
- Checkout must clearly separate buyer identity, consignee selection, route choice, and order review.
- MOQ must be clearly visible anywhere quantity can be changed, and quantities below the effective MOQ must be blocked.
- Customer order tracking is status-driven. Do not imply carrier-grade live tracking when it does not exist.
- Customer-facing pages must not expose design rationale, technical implementation notes, seeded-demo language, or internal catalog terminology.
- Click targets must be visually obvious.
- Cart behavior must support continued shopping rather than forcing an immediate route to checkout flow.

## implementation

- Prefer server-rendered data for catalog pages where possible, with client components reserved for toggles, cart state, and live form interactions.
- Keep pricing display logic separate from checkout pricing calculation logic.
- Storefront motion should default to `Motion for React` primitives such as `AnimatePresence`, `layout`, and shared layout IDs, not custom scroll hacks.
