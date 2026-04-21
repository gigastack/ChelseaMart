# Admin Rules

These rules apply to files under `app/(admin)/`.

## visual direction

- Admin surfaces should feel like an operational control room.
- Favor clarity, data density, and fast scanning over decorative layout.
- Use the same token system as storefront, but with tighter spacing, cooler surfaces, stronger table/grid structure, and less accent saturation.
- Motion in admin should be fast and structural: panel reveals, tab/state transitions, optimistic status changes. No ambient smooth-scroll, floating glass, or hero theatrics.

## product and ops behavior

- Product creation must begin from an explicit source choice: manual upload or API fetch.
- Draft, live, removed, and unavailable product states must remain explicit in admin UI.
- Imports, scans, and sync flows must expose recoverable errors and job progress.
- BI views should prioritize drilldowns and filters over decorative charts.
- Dashboard, BI, settings, imports, orders, and products must read real persisted data or real env/config state.
- Do not keep fake health states, fake timestamps, seeded badges, or hardcoded summary values in admin UI.
- If an admin capability is not wired yet, show a truthful disabled state or empty state instead of placeholder controls or operator theater.

## security and data handling

- Secrets are env-only. Admin screens may show status, but never raw secret values.
- Use explicit role guards around admin routes.
- Keep internal notes and operational metadata separate from any customer-visible state.
- Missing schema or integration state must fail visibly with guidance, not with hidden in-memory fallback behavior.
