> Superseded: this file is now a reference input only. The implementation source of truth is `docs/superpowers/specs/2026-04-21-canonical-ui-redesign.md`.

# UI Specification: Part 3 - Admin Shell & Product Hub

## 1. Admin Global Shell
**Goal:** An operational power-station. High data density, sharp tables, and fast navigation.

* **Sidebar Navigation:** `brand.950` background. Links: Dashboard, Products, Imports, Orders, BI Suite, Settings. Includes a fixed system state badge (e.g., "ELIM Sync: Healthy").
* **Top Bar:** Page Title, Global Search (IDs, names, URLs), Actionable Notifications (e.g., "3 Products became Unavailable"), Admin Profile.

## 2. Admin Dashboard
**Goal:** At-a-glance health of the entire platform. Bento-box layout.

* **KPI Strip:** 6 uniform cards showing metrics (Live, Drafts, Pending Orders, 24h Revenue, Import Queue).
* **Bento UI Layout:**
    * **Catalog Health:** Pie chart of Live vs. Draft vs. Unavailable.
    * **Order Funnel:** Bar chart showing users stuck at "Awaiting Shipping Payment".
    * **Recent Activity:** A scrolling terminal-like feed of system actions (Imports finished, payments cleared). `JetBrains Mono` font for IDs.

## 3. Product Management (The Hub)
**Goal:** Table-first management with bulk capabilities.

* **Tabs:** `Live`, `Drafts`, `Removed`, `Unavailable` (Unavailable gets a red/warning dot indicator if items are pending review).
* **Data Table:** Columns for Image, Title, Source ID, Price (CNY), MOQ, Weight/Vol, Status. Checkboxes for bulk actions (Publish, Hide, Delete).
* **The Shared Editor UX (For both Manual & API products):**
    * **Main Column:** Basic Info, Media Uploader, Rich Text Description, Variants.
    * **Pricing & Logistics Card:** Inputs for **Price in CNY**. *(Crucial Rule: When fetched from API, there is no conversion. The raw CNY price populates here, but the Admin retains full ability to edit this CNY value before publishing)*, Weight (kg), Volume (cbm), and Product-level MOQ override.
    * **Source Metadata Panel:** Read-only data if fetched from ELIM API.
    * **Sticky Right Rail:** "Publish Readiness" checklist. Blocks publishing if Weight or MOQ is missing.
