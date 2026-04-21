> Superseded: this file is now a reference input only. The implementation source of truth is `docs/superpowers/specs/2026-04-21-canonical-ui-redesign.md`.

# UI Specification: Part 5 - Admin BI, Settings & Token System

## 1. BI Suite
**Goal:** A full executive product for data analysis.

* **Global Controls:** Sticky top bar with Date Picker (e.g., "Last 30 Days"), Compare Toggle ("vs. Previous Period"), and an "Export Report" button.
* **UX Pattern:** If data is older than 12 hours (e.g., cached aggregation), display a subtle "Stale Data" warning with a manual refresh icon.
* **Dashboards:**
    * **Sales Intelligence:** Revenue charts plotted in NGN (Product vs. Logistics splits).
    * **Operations Intelligence:** Average time from `paid_for_products` to `arrived_at_warehouse`.
    * **Catalog Intelligence:** Top performing categories, highest refund rates.

## 2. Platform Settings
**Goal:** Secure, centralized control over the platform's economic levers.

* **Layout:** Left-side vertical tabs for setting categories.
* **Exchange Rates UX:**
    * **Two prominent, distinct rate control cards:**
        1. **`CNY to NGN` Rate:** Explicitly labeled "For Product Sections". This converts the baseline CNY catalog prices into Naira at checkout.
        2. **`USD to NGN` Rate:** Explicitly labeled "For Payment/Logistics Sections". This converts the USD warehouse logistics invoices into Naira for the final shipping settlement.
    * Input fields for manual rate overriding. Shows "Last updated: [Date] by [Admin]".
* **Logistics & Routes:**
    * Table to Add/Edit routes (e.g., "Lagos Air"). Inputs for Name, Base Formula, ETA string, and Terms.
* **Security/Env UX:**
    * A section for "API Integrations" (ELIM, Paystack).
    * Fields display as `••••••••••••` and are strictly disabled. Hover text reads: "Managed via environment variables only."

## 3. Global Design System & Token Integration
**Goal:** Strict adherence to the brand kit to guide Codex styling generation.

* **Storefront Palette Implementation:**
    * Use `surface.base` (#FCFCFB) for page backgrounds to keep it bright and authentic.
    * Use `brand.500` (#14B8A6) for primary conversion buttons (Add to Cart, Checkout).
    * Use `brand.950` (#042F2E) for high-contrast typography and footers.
* **Admin Palette Implementation:**
    * Use `surface.alt` (#F5F7F7) heavily to distinguish functional sections.
    * Use `text.secondary` (#475569) for table headers and labels.
* **Typography Rules for Codex:**
    * Apply `font-family: 'General Sans', sans-serif;` to all `h1`-`h6` tags, buttons, and standard paragraph text.
    * Apply `font-family: 'JetBrains Mono', monospace;` strictly to SKU numbers, ELIM IDs, order numbers, weight/CBM readouts, and import terminal logs.
