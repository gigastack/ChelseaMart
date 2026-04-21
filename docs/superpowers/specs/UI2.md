> Superseded: this file is now a reference input only. The implementation source of truth is `docs/superpowers/specs/2026-04-21-canonical-ui-redesign.md`.

# UI Specification: Part 2 - Storefront Conversion & Portal

## 1. Product Detail Page (PDP)
**Goal:** Drive conversion while making the logistics reality flawlessly clear to prevent downstream friction.

* **Layout:**
    * Left: Interactive 4:5 image gallery (thumbnails below or side).
    * Right: Sticky purchase panel.
* **Purchase Panel UX:**
    * **Title & Price:** Large typography. Price defaults to `CNY`. Updates instantly if the global currency toggle is switched to `NGN`.
    * **MOQ Callout:** Bold text enforcing the global/product MOQ. The quantity incrementer is disabled below this number.
    * **Variants:** Standard chips/dropdowns for color, size, etc.
    * **The Route Module:** A visually boxed-out section (using `brand.500` borders) clearly explaining the two-phase payment. "You are paying for the item now. Shipping costs will be invoiced after warehouse weighing."
    * **Action:** A vibrant, full-width `brand.600` "Add to Cart" button.

## 2. Cart & Checkout Flow
**Goal:** Frictionless checkout with absolute transparency on what is being paid for today.

* **Slide-out Cart:** Shows line items, subtotal (Product only in `CNY` default), and a required acknowledgement checkbox: "I understand shipping is calculated and billed later."
* **Checkout - Step 1: Identity & Consignee:**
    * Guest or Auth login.
    * Select or add a Consignee (Name, Phone, Hub destination).
* **Checkout - Step 2: Route Selection:**
    * Radio list of Admin-managed routes (e.g., "Air Express", "Sea Freight"). Displays ETA and formula, but NO price yet.
* **Checkout - Step 3: Payment (Paystack):**
    * Totals block shows: Product Subtotal (CNY) -> Settlement Preview (NGN) using the active Admin `CNY -> NGN` rate.
    * Clear zero-value line item for "Shipping (To Be Determined)".

## 3. Customer Dashboard
**Goal:** A self-serve hub that heavily indexes on post-purchase logistics tracking.

* **Navigation:** Orders, Consignees, Account Settings.
* **Orders List:** Replaces standard "Processing/Shipped" tags with the custom 2-phase lifecycle tags.
* **Order Detail UX:**
    * Visual progress bar: `Paid` -> `At Warehouse` -> `Weighed (Awaiting Payment)` -> `In Transit` -> `Delivered`.
    * When status is `awaiting_shipping_payment`, a bold action block appears showing the shipping invoice in USD, converted to NGN for final settlement. "Your items weigh X kg. Shipping invoice: $Y (₦Z). Pay Now."
