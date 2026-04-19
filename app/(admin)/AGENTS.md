# Admin Rules

These rules apply to files under `app/(admin)/`.

## visual direction

- Admin surfaces should feel like an operational control room.
- Favor clarity, data density, and fast scanning over decorative layout.
- Use the same brand kit as storefront, but with tighter spacing and stronger table/grid structure.

## product and ops behavior

- Product creation must begin from an explicit source choice: manual upload or API fetch.
- Draft, live, removed, and unavailable product states must remain explicit in admin UI.
- Imports, scans, and sync flows must expose recoverable errors and job progress.
- BI views should prioritize drilldowns and filters over decorative charts.

## security and data handling

- Secrets are env-only. Admin screens may show status, but never raw secret values.
- Use explicit role guards around admin routes.
- Keep internal notes and operational metadata separate from any customer-visible state.
