# Lib Rules

These rules apply to files under `lib/`.

## domain logic

- Keep pricing, imports, ELIM normalization, Paystack handling, BI query helpers, and auth utilities in focused modules.
- Prefer pure functions for calculations and normalization so they are easy to test.
- Access environment variables only through a typed config layer.
- Validate all external payloads with `zod` before using them.

## data safety

- Persist order snapshots so later configuration changes do not rewrite history.
- Preserve ELIM source linkage and source payload snapshots for API-linked products.
- Never silently overwrite live product content from automated jobs.
- Model buyer and consignee separately.

## framework boundaries

- Keep framework-specific code thin around service and utility layers.
- Avoid importing UI modules into domain/service code.
