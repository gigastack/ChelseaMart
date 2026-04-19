# Storefront Rules

These rules apply to files under `app/(storefront)/`.

## visual direction

- Keep the storefront premium, calm, and image-led.
- Use the deep blue-green token system. Do not introduce ad hoc promo colors or bargain-market styling.
- Product and catalog screens show product price only. Logistics belongs to checkout.
- `USD` may affect display only. Checkout and payment messaging must remain `NGN`-first.

## ux behavior

- Guest browsing and guest cart are first-class.
- Search, collection browsing, and product detail flows must feel fast and uncluttered.
- Checkout must clearly separate buyer identity, consignee selection, route choice, and order review.
- Customer order tracking is status-driven. Do not imply carrier-grade live tracking when it does not exist.

## implementation

- Prefer server-rendered data for catalog pages where possible, with client components reserved for toggles, cart state, and live form interactions.
- Keep pricing display logic separate from checkout pricing calculation logic.
