> Superseded: this file is now a reference input only. The implementation source of truth is `docs/superpowers/specs/2026-04-21-canonical-ui-redesign.md`.

# UI Specification: Part 1 - Storefront Global Shell & Discovery

## 1. Global Storefront Shell
**Goal:** Create an authentic, vibrant, and highly active marketplace feel that builds immediate trust without feeling sterile.

### Header (Sticky)
* **Visuals:** `surface.card` background with a subtle `border.subtle` bottom shadow.
* **Elements:**
    * **Logo Slot:** Left-aligned.
    * **Global Search:** Prominent, wide search bar with a "marketplace" energy (e.g., placeholder text pulsing with popular categories).
    * **Navigation Links:** Categories (Electronics, Fashion, etc.) with energetic hover states using `brand.600`.
    * **Currency Toggle:** A highly visible pill-shaped toggle between `CNY` and `NGN`. **Default state is always `CNY`.**
    * **Utility Icons:** Account/Sign-in, Cart (with numeric badge in `brand.500`).
* **Mobile UX:** Consolidates into a hamburger menu opening a drawer. The Search bar remains fully visible on the mobile header. The Currency Toggle moves to the top of the mobile drawer.

### Footer
* **Visuals:** Uses `brand.950` as the background with `surface.base` text for high contrast and trust.
* **Elements:** 4-column layout covering Trust/Policy links, Support/FAQ, Categories, and Logistics Explainer (reiterating the 2-phase shipping model).

## 2. Home Page
**Goal:** Hook the user with vibrant discovery while instantly educating them on the unique import model.

* **Hero Section:** Dynamic, vibrant banner carousels showcasing top categories or curated hauls. Avoid excessive whitespace; make it feel like a bustling, authentic local market translated to digital.
* **How It Works (Micro-section):** A visually engaging 3-step timeline: "1. Buy Product (Prices in CNY/NGN) -> 2. We Receive & Weigh -> 3. Pay Shipping & Get it Delivered."
* **Featured Categories:** Grid of category cards with edge-to-edge imagery and bold typography (`General Sans`).
* **Curated Feeds:** Horizontal scrolling sections for "Trending Now" or "New Arrivals".

## 3. Catalog & Search Results
**Goal:** Efficient filtering and clear expectation setting on price and volume.

* **Filter Sidebar (Desktop) / Drawer (Mobile):** Categories, Price Range, In-Stock status.
* **Product Grid:** Dense, vibrant masonry or strict grid using 4:5 image aspect ratios.
* **Product Card UX:** * Bold product image.
    * Title (truncated to 2 lines).
    * **Price:** Displayed in `CNY` by default (reacts if the user specifically toggles to `NGN`).
    * **Crucial UX:** A small, visually distinct badge (e.g., using `surface.alt` and `text.secondary`) stating the MOQ (Minimum Order Quantity) and a persistent icon indicating "+ Shipping later".
