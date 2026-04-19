# Components Rules

These rules apply to files under `components/`.

## shared ui

- Reuse tokenized primitives before creating one-off component styling.
- Shared components must take className overrides and remain composable.
- Keep visual decisions aligned to semantic tokens from `app/globals.css`, not raw hex values.
- Avoid mixing domain logic into presentational components.

## accessibility and behavior

- Interactive components must have visible focus states and accessible labels/semantics.
- Prefer semantic HTML first, then layer styling and behavior.
- Keep loading, empty, and status components generic enough for reuse across storefront and admin.
