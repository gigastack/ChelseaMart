> Superseded: this file is now a reference input only. The implementation source of truth is `docs/superpowers/specs/2026-04-21-canonical-ui-redesign.md`.

# UI Specification: Part 4 - Admin Imports & Order Operations

## 1. The Import Engine
**Goal:** Handle massive batches seamlessly without blocking the UI.

* **Import Hub:**
    * **Action Area:** A massive text area supporting "Paste URLs (One per line)" with a "Fetch from API" button. A secondary "Upload CSV" dropzone.
    * **Batch UX:** When an admin drops 100+ URLs, the UI transitions to a progress state.
* **Job Processing UI:**
    * Visual progress bar indicating `Queued` -> `Fetching` -> `Deduplicating` -> `Draft Created`.
    * **Technical Log Panel:** A dark-mode block using `JetBrains Mono` outputting real-time API logs ("Success: ID 84920 - CNY Price Retained", "Failed: ID 9921 - Missing Price").
* **Validation UX:** If ELIM env variables are missing, the entire import area is grayed out with a prominent banner: "ELIM configuration missing in environment."

## 2. Order Management
**Goal:** High-speed manual transitions for the logistics lifecycle.

* **Orders Table:** Filters for the custom lifecycle statuses (especially `awaiting_warehouse` and `awaiting_shipping_payment`).
* **Order Detail View:**
    * **Customer & Consignee Card:** Details and chosen route.
    * **Ledger Card:** Splits the view into "Phase 1: Product Payment" (Calculated via `CNY -> NGN` rate) and "Phase 2: Logistics Payment" (Calculated via `USD -> NGN` rate).
    * **Warehouse Actions UX:**
        * When an order is `awaiting_warehouse`, a form is exposed to the admin: "Input Actual Weight (kg) / Volume (cbm)" and "Upload Warehouse Proof (Image)".
        * Submitting this form triggers the shipping invoice generation and shifts the status to `weighed` / `awaiting_shipping_payment`.
    * **Internal Notes:** A dedicated timeline thread. Visually distinct (e.g., pale yellow background) to denote it never hits the storefront.
