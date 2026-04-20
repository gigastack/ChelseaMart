# China-Nigeria Commerce V1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready version of the China-to-Nigeria commerce platform with a premium storefront, a full admin surface, ELIM-backed product ingestion, NGN-only checkout, Paystack payments, BI reporting, and Codex-visible project rules.

**Architecture:** Implement a single `Next.js` App Router application with route groups for storefront and admin, `Supabase` for auth/data/storage, a DB-backed job model for imports and source-availability audits, and a token-driven design system shared across public and admin surfaces. Keep the storefront fully local-data driven; external systems are only touched through server-side services and background-like admin workflows.

**Tech Stack:** Next.js App Router, React, TypeScript (strict), Tailwind CSS + design tokens, Supabase Auth/Postgres/Storage, Zod, Paystack, Vitest, Testing Library, Playwright.

---

## File Structure

The repo is effectively empty, so implementation should create the structure below and keep these boundaries stable.

- `package.json` — app scripts, dependencies, lint/test/build commands.
- `tsconfig.json` — strict TypeScript config.
- `next.config.ts` — Next.js configuration.
- `postcss.config.mjs` — Tailwind/PostCSS wiring.
- `app/layout.tsx` — root HTML shell and providers.
- `app/globals.css` — token definitions, global reset, base typography.
- `app/AGENTS.md` — shared rules for all app routes.
- `app/(storefront)/layout.tsx` — storefront shell.
- `app/(storefront)/page.tsx` — home page.
- `app/(storefront)/catalog/page.tsx` — catalog grid.
- `app/(storefront)/search/page.tsx` — search results.
- `app/(storefront)/products/[slug]/page.tsx` — product detail.
- `app/(storefront)/cart/page.tsx` — guest cart.
- `app/(storefront)/checkout/page.tsx` — checkout flow.
- `app/(storefront)/auth/sign-in/page.tsx` — sign in.
- `app/(storefront)/auth/sign-up/page.tsx` — sign up.
- `app/(storefront)/account/layout.tsx` — customer dashboard shell.
- `app/(storefront)/account/orders/page.tsx` — order list.
- `app/(storefront)/account/orders/[orderId]/page.tsx` — order detail/timeline.
- `app/(storefront)/account/consignees/page.tsx` — consignee management.
- `app/(storefront)/payment/success/page.tsx` — payment success.
- `app/(storefront)/payment/pending/page.tsx` — payment pending.
- `app/(storefront)/payment/failed/page.tsx` — payment failed.
- `app/(storefront)/AGENTS.md` — storefront UI rules.
- `app/(admin)/admin/layout.tsx` — admin shell and guard.
- `app/(admin)/admin/page.tsx` — admin dashboard.
- `app/(admin)/admin/products/page.tsx` — product list tabs.
- `app/(admin)/admin/products/new/page.tsx` — create-product entry screen.
- `app/(admin)/admin/products/[productId]/page.tsx` — shared product editor.
- `app/(admin)/admin/imports/page.tsx` — imports landing and job list.
- `app/(admin)/admin/imports/[jobId]/page.tsx` — import job detail/logs.
- `app/(admin)/admin/orders/page.tsx` — orders list.
- `app/(admin)/admin/orders/[orderId]/page.tsx` — admin order detail.
- `app/(admin)/admin/bi/page.tsx` — BI suite.
- `app/(admin)/admin/settings/page.tsx` — settings.
- `app/(admin)/AGENTS.md` — admin UI rules.
- `app/api/paystack/webhook/route.ts` — Paystack webhook endpoint.
- `app/api/internal/scheduled-sync/route.ts` — cron-callable sync runner.
- `components/AGENTS.md` — component-level rules.
- `components/ui/*` — base primitives and tokenized shared controls.
- `components/storefront/*` — public shell, cards, search, product detail, cart, checkout.
- `components/admin/*` — admin shell, tables, editors, charts, logs, settings forms.
- `components/providers/*` — auth, query, theme/session wrappers if needed.
- `lib/AGENTS.md` — business-logic and service rules.
- `lib/config/env.ts` — typed env parsing.
- `lib/supabase/server.ts` — server Supabase client.
- `lib/supabase/client.ts` — browser Supabase client.
- `lib/auth/*` — auth guards and helpers.
- `lib/validation/*` — Zod schemas for forms, API normalization, and settings.
- `lib/catalog/*` — products, categories, variants, source linkage, lifecycle helpers.
- `lib/pricing/*` — currency conversion, logistics math, MOQ enforcement, order totals.
- `lib/imports/*` — ELIM client, URL parsing, normalization, job runner, availability scan runner.
- `lib/orders/*` — order creation, snapshots, status transitions, receipt data.
- `lib/payments/*` — Paystack init, verify, webhook signature validation.
- `lib/bi/*` — BI queries, filters, date-range helpers, exports.
- `lib/utils/*` — formatting, dates, class helpers, shared small utilities.
- `supabase/migrations/*.sql` — schema, indexes, policies, BI views.
- `tests/unit/*` — Vitest domain/service tests.
- `tests/components/*` — UI component tests.
- `tests/e2e/*` — Playwright happy-path and failure-path coverage.

## Chunk 1: Foundation, Tooling, and Global Rules

### Task 1: Bootstrap the Next.js application skeleton

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Test: `tests/unit/smoke/app-shell.test.tsx`

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import { RootLayout } from "@/app/layout";

describe("RootLayout", () => {
  it("renders the global app shell", () => {
    render(
      <RootLayout>
        <div>app-child</div>
      </RootLayout>,
    );

    expect(screen.getByText("app-child")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/smoke/app-shell.test.tsx`
Expected: FAIL because the app skeleton and test config do not exist yet.

- [ ] **Step 3: Create the app skeleton and test harness**

Implementation:
- Create `package.json` with `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e` scripts.
- Install runtime deps: `next`, `react`, `react-dom`, `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `react-hook-form`, `@hookform/resolvers`, `recharts`, `date-fns`.
- Install dev deps: `typescript`, `eslint`, `eslint-config-next`, `tailwindcss`, `postcss`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `playwright`.
- Create the minimum `app/layout.tsx` and `app/globals.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/smoke/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Run baseline verification**

Run:
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json next.config.ts postcss.config.mjs app/layout.tsx app/globals.css tests/unit/smoke/app-shell.test.tsx
git commit -m "chore: bootstrap nextjs commerce app"
```

### Task 2: Install the global brand kit and shared UI primitives

**Files:**
- Modify: `app/globals.css`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/skeleton.tsx`
- Create: `components/ui/table.tsx`
- Test: `tests/components/ui/brand-kit.test.tsx`

- [ ] **Step 1: Write the failing brand-kit test**

```tsx
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("brand tokens", () => {
  it("renders primary button with tokenized classes", () => {
    const { getByRole } = render(<Button>Shop</Button>);
    expect(getByRole("button")).toHaveClass("bg-brand-600");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/ui/brand-kit.test.tsx`
Expected: FAIL because the tokenized components do not exist.

- [ ] **Step 3: Create token-driven CSS and base primitives**

Implementation:
- Define CSS variables for the deep blue-green palette, neutrals, status colors, spacing, radius, and elevation.
- Map variables into utility classes or Tailwind theme tokens.
- Build reusable primitives that never hardcode ad hoc colors.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/ui/brand-kit.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/globals.css components/ui tests/components/ui/brand-kit.test.tsx
git commit -m "feat: add tokenized brand kit primitives"
```

### Task 3: Create Codex-visible nested rule files as the app tree appears

**Files:**
- Modify: `AGENTS.md`
- Create: `app/AGENTS.md`
- Create: `app/(storefront)/AGENTS.md`
- Create: `app/(admin)/AGENTS.md`
- Create: `components/AGENTS.md`
- Create: `lib/AGENTS.md`
- Test: none

- [ ] **Step 1: Add the nested AGENTS files**

Implementation:
- Put app-wide route/layout rules in `app/AGENTS.md`.
- Put storefront-specific UI rules in `app/(storefront)/AGENTS.md`.
- Put admin-specific UI, BI, and imports rules in `app/(admin)/AGENTS.md`.
- Put component design-token and composition rules in `components/AGENTS.md`.
- Put pricing, imports, payments, and snapshot integrity rules in `lib/AGENTS.md`.

- [ ] **Step 2: Verify rule placement**

Run: `git diff -- app/AGENTS.md app/(storefront)/AGENTS.md app/(admin)/AGENTS.md components/AGENTS.md lib/AGENTS.md`
Expected: files exist with scoped instructions only, no duplicated long-form spec dump.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md app/AGENTS.md app/(storefront)/AGENTS.md app/(admin)/AGENTS.md components/AGENTS.md lib/AGENTS.md
git commit -m "docs: add scoped codex rules for app directories"
```

## Chunk 2: Auth, Config, and Database Foundation

### Task 4: Create typed env config and Supabase clients

**Files:**
- Create: `lib/config/env.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/client.ts`
- Create: `.env.example`
- Test: `tests/unit/config/env.test.ts`

- [ ] **Step 1: Write the failing env test**

```ts
import { getEnv } from "@/lib/config/env";

describe("getEnv", () => {
  it("requires ELIM and Paystack secrets to be present", () => {
    expect(() => getEnv({} as NodeJS.ProcessEnv)).toThrow(/ELIM_API_KEY/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/config/env.test.ts`
Expected: FAIL because `getEnv` is missing.

- [ ] **Step 3: Implement typed env parsing**

Implementation:
- Parse public Supabase URL/key, service-role key, ELIM API key, Paystack secret/public keys, webhook secret, and any internal job secret through one Zod-backed loader.
- Export safe public config separately from secret config.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/config/env.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/config/env.ts lib/supabase/server.ts lib/supabase/client.ts .env.example tests/unit/config/env.test.ts
git commit -m "feat: add typed environment and supabase clients"
```

### Task 5: Define the initial database schema and BI views

**Files:**
- Create: `supabase/migrations/0001_init.sql`
- Create: `supabase/migrations/0002_bi_views.sql`
- Create: `lib/validation/database.ts`
- Test: `tests/unit/database/schema-shape.test.ts`

- [ ] **Step 1: Write a schema-shape test**

```ts
import { tableNames } from "@/lib/validation/database";

describe("database schema", () => {
  it("includes the core commerce tables", () => {
    expect(tableNames).toEqual(
      expect.arrayContaining([
        "products",
        "product_sources",
        "orders",
        "order_items",
        "consignees",
        "import_jobs",
      ]),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/database/schema-shape.test.ts`
Expected: FAIL because the schema manifest does not exist.

- [ ] **Step 3: Write the schema**

Implementation:
- Create tables for `profiles`, `consignees`, `categories`, `products`, `product_images`, `product_variants`, `product_sources`, `currency_pairs`, `shipping_configs`, `pricing_rules`, `orders`, `order_items`, `order_status_events`, `import_jobs`, `import_job_items`, `catalog_alerts`, `paystack_events`.
- Add indexes for slugs, status fields, source IDs, job states, created dates.
- Add BI SQL views for revenue, route split, product performance, import throughput, and unavailable-product trends.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/database/schema-shape.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations lib/validation/database.ts tests/unit/database/schema-shape.test.ts
git commit -m "feat: add commerce schema and bi views"
```

### Task 6: Wire Supabase auth and route protection

**Files:**
- Create: `middleware.ts`
- Create: `lib/auth/guards.ts`
- Create: `app/(storefront)/auth/sign-in/page.tsx`
- Create: `app/(storefront)/auth/sign-up/page.tsx`
- Create: `app/(admin)/admin/layout.tsx`
- Test: `tests/unit/auth/guards.test.ts`

- [ ] **Step 1: Write the failing auth guard test**

```ts
import { canAccessAdmin } from "@/lib/auth/guards";

describe("canAccessAdmin", () => {
  it("allows only the configured admin account", () => {
    expect(canAccessAdmin({ email: "admin@example.com" }, "admin@example.com")).toBe(true);
    expect(canAccessAdmin({ email: "user@example.com" }, "admin@example.com")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/auth/guards.test.ts`
Expected: FAIL because guards are missing.

- [ ] **Step 3: Implement auth shell**

Implementation:
- Create Supabase auth pages for email/password and Google.
- Guard admin routes by matching the configured single-admin account.
- Preserve guest cart until checkout.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/auth/guards.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add middleware.ts lib/auth app/(storefront)/auth app/(admin)/admin/layout.tsx tests/unit/auth/guards.test.ts
git commit -m "feat: add auth flow and admin guard"
```

## Chunk 3: Catalog Domain, Imports, and Admin Product Management

### Task 7: Build the pricing and logistics domain module

**Files:**
- Create: `lib/pricing/calculate-display-price.ts`
- Create: `lib/pricing/calculate-logistics.ts`
- Create: `lib/pricing/calculate-order-summary.ts`
- Create: `lib/pricing/index.ts`
- Test: `tests/unit/pricing/calculate-order-summary.test.ts`

- [ ] **Step 1: Write the failing pricing test**

```ts
import { calculateOrderSummary } from "@/lib/pricing";

describe("calculateOrderSummary", () => {
  it("adds line logistics in NGN while keeping checkout currency fixed", () => {
    const summary = calculateOrderSummary({
      route: "air",
      items: [
        { unitPriceNgn: 20000, quantity: 2, weightKg: 1.5, routeRateNgnPerKg: 3000 },
      ],
    });

    expect(summary.currency).toBe("NGN");
    expect(summary.logisticsTotalNgn).toBe(9000);
    expect(summary.grandTotalNgn).toBe(49000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pricing/calculate-order-summary.test.ts`
Expected: FAIL because pricing helpers do not exist.

- [ ] **Step 3: Implement pricing helpers**

Implementation:
- Keep `USD` display conversion separate from checkout currency.
- Calculate line logistics from stored product weight and chosen route config.
- Return immutable order summary snapshots.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/pricing/calculate-order-summary.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/pricing tests/unit/pricing/calculate-order-summary.test.ts
git commit -m "feat: add pricing and logistics domain helpers"
```

### Task 8: Build ELIM normalization and import job services

**Files:**
- Create: `lib/imports/elim-client.ts`
- Create: `lib/imports/parse-source-input.ts`
- Create: `lib/imports/normalize-elim-product.ts`
- Create: `lib/imports/run-import-job.ts`
- Create: `lib/imports/run-availability-scan.ts`
- Create: `lib/validation/imports.ts`
- Test: `tests/unit/imports/normalize-elim-product.test.ts`
- Test: `tests/unit/imports/parse-source-input.test.ts`

- [ ] **Step 1: Write the failing import normalization tests**

```ts
import { normalizeElimProduct } from "@/lib/imports/normalize-elim-product";

describe("normalizeElimProduct", () => {
  it("produces a local draft-ready product payload", () => {
    const normalized = normalizeElimProduct({
      productId: "1688-abc",
      title: "Raw supplier title",
      priceCny: 42,
      images: ["https://example.com/1.jpg"],
    });

    expect(normalized.sourceId).toBe("1688-abc");
    expect(normalized.status).toBe("draft");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/unit/imports`
Expected: FAIL because the import modules are missing.

- [ ] **Step 3: Implement ELIM import services**

Implementation:
- Normalize URL paste, keyword search, and CSV/bulk URL inputs.
- Dedupe by source identity.
- Create job + job-item processors that can handle `100+` URLs asynchronously.
- Mark imported products as local drafts and preserve source snapshots.
- Build availability scan logic that hides unavailable products and records alerts.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/unit/imports`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/imports lib/validation/imports.ts tests/unit/imports
git commit -m "feat: add elim import and availability job services"
```

### Task 9: Build admin product tabs, create-product chooser, and shared editor

**Files:**
- Create: `app/(admin)/admin/products/page.tsx`
- Create: `app/(admin)/admin/products/new/page.tsx`
- Create: `app/(admin)/admin/products/[productId]/page.tsx`
- Create: `components/admin/product-list-table.tsx`
- Create: `components/admin/create-product-source-picker.tsx`
- Create: `components/admin/product-editor.tsx`
- Create: `components/admin/product-publish-rail.tsx`
- Test: `tests/components/admin/create-product-source-picker.test.tsx`

- [ ] **Step 1: Write the failing source-picker test**

```tsx
import { render, screen } from "@testing-library/react";
import { CreateProductSourcePicker } from "@/components/admin/create-product-source-picker";

describe("CreateProductSourcePicker", () => {
  it("requires choosing manual or api before continuing", () => {
    render(<CreateProductSourcePicker />);
    expect(screen.getByText("Manual Upload")).toBeInTheDocument();
    expect(screen.getByText("Fetch from API")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/admin/create-product-source-picker.test.tsx`
Expected: FAIL because the admin components do not exist.

- [ ] **Step 3: Implement the admin products surface**

Implementation:
- Render `Live`, `Drafts`, `Removed`, `Unavailable` tabs.
- Start product creation with the explicit source-choice screen.
- Use one editor for manual and API-linked products.
- Block publish when weight, MOQ, or route config requirements are unmet.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/admin/create-product-source-picker.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(admin)/admin/products components/admin tests/components/admin/create-product-source-picker.test.tsx
git commit -m "feat: add admin product management flows"
```

### Task 10: Build admin imports UI and unavailable-products review flow

**Files:**
- Create: `app/(admin)/admin/imports/page.tsx`
- Create: `app/(admin)/admin/imports/[jobId]/page.tsx`
- Create: `components/admin/import-job-table.tsx`
- Create: `components/admin/import-log-panel.tsx`
- Create: `components/admin/unavailable-products-table.tsx`
- Test: `tests/components/admin/import-job-table.test.tsx`

- [ ] **Step 1: Write the failing import-job UI test**

```tsx
import { render, screen } from "@testing-library/react";
import { ImportJobTable } from "@/components/admin/import-job-table";

describe("ImportJobTable", () => {
  it("shows queued, imported, duplicate, failed, and needs review counts", () => {
    render(
      <ImportJobTable
        jobs={[
          {
            id: "job-1",
            queuedCount: 10,
            importedCount: 8,
            duplicateCount: 1,
            failedCount: 1,
            reviewCount: 0,
          },
        ]}
      />,
    );

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/admin/import-job-table.test.tsx`
Expected: FAIL because the import UI does not exist.

- [ ] **Step 3: Implement the imports surface**

Implementation:
- Support URL paste, keyword search, bulk URL paste, and CSV upload.
- Show import status cards, a structured progress table, and a mono log panel.
- Add the unavailable-products review area and retry/delete/restore actions.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/admin/import-job-table.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(admin)/admin/imports components/admin tests/components/admin/import-job-table.test.tsx
git commit -m "feat: add admin import jobs and unavailable review ui"
```

## Chunk 4: Storefront, Cart, Checkout, and Customer Dashboard

### Task 11: Build the storefront shell, home, catalog, search, and product detail

**Files:**
- Create: `app/(storefront)/layout.tsx`
- Create: `app/(storefront)/page.tsx`
- Create: `app/(storefront)/catalog/page.tsx`
- Create: `app/(storefront)/search/page.tsx`
- Create: `app/(storefront)/products/[slug]/page.tsx`
- Create: `components/storefront/header.tsx`
- Create: `components/storefront/footer.tsx`
- Create: `components/storefront/product-card.tsx`
- Create: `components/storefront/product-gallery.tsx`
- Create: `components/storefront/product-purchase-panel.tsx`
- Test: `tests/components/storefront/product-card.test.tsx`

- [ ] **Step 1: Write the failing product-card test**

```tsx
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/storefront/product-card";

describe("ProductCard", () => {
  it("shows the product price and the checkout logistics note", () => {
    render(
      <ProductCard
        product={{ id: "p1", slug: "slug", title: "Desk Lamp", priceDisplay: "NGN 20,000", imageUrl: "/lamp.jpg" }}
      />,
    );

    expect(screen.getByText("Desk Lamp")).toBeInTheDocument();
    expect(screen.getByText("Logistics added at checkout")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/storefront/product-card.test.tsx`
Expected: FAIL because storefront components do not exist.

- [ ] **Step 3: Implement the public browsing surface**

Implementation:
- Create the premium storefront shell.
- Implement the hero, collections, search, filters, 4:5 product cards, and product detail gallery.
- Keep `USD` as a display toggle only.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/storefront/product-card.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(storefront) components/storefront tests/components/storefront/product-card.test.tsx
git commit -m "feat: add storefront discovery and product detail pages"
```

### Task 12: Build guest cart, consignee flow, checkout, and Paystack integration

**Files:**
- Create: `app/(storefront)/cart/page.tsx`
- Create: `app/(storefront)/checkout/page.tsx`
- Create: `components/storefront/cart-list.tsx`
- Create: `components/storefront/checkout-route-selector.tsx`
- Create: `components/storefront/checkout-summary.tsx`
- Create: `lib/orders/create-order.ts`
- Create: `lib/payments/create-paystack-transaction.ts`
- Create: `lib/payments/verify-paystack-webhook.ts`
- Create: `app/api/paystack/webhook/route.ts`
- Test: `tests/unit/payments/verify-paystack-webhook.test.ts`
- Test: `tests/components/storefront/checkout-summary.test.tsx`

- [ ] **Step 1: Write the failing checkout summary and webhook tests**

```tsx
import { render, screen } from "@testing-library/react";
import { CheckoutSummary } from "@/components/storefront/checkout-summary";

describe("CheckoutSummary", () => {
  it("shows product subtotal, logistics total, and NGN grand total", () => {
    render(
      <CheckoutSummary
        summary={{
          currency: "NGN",
          itemsSubtotalNgn: 40000,
          logisticsTotalNgn: 9000,
          grandTotalNgn: 49000,
        }}
      />,
    );

    expect(screen.getByText("NGN 49,000")).toBeInTheDocument();
  });
});
```

```ts
import { verifyPaystackWebhook } from "@/lib/payments/verify-paystack-webhook";

describe("verifyPaystackWebhook", () => {
  it("rejects invalid signatures", async () => {
    await expect(
      verifyPaystackWebhook({
        rawBody: "{}",
        signature: "bad-signature",
        secret: "test-secret",
      }),
    ).rejects.toThrow(/signature/i);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
- `npm run test -- tests/components/storefront/checkout-summary.test.tsx`
- `npm run test -- tests/unit/payments/verify-paystack-webhook.test.ts`

Expected: FAIL because checkout and payment modules do not exist.

- [ ] **Step 3: Implement cart, checkout, order creation, and webhook handling**

Implementation:
- Keep cart guest-friendly and persist through auth.
- Require consignee selection and route choice at checkout.
- Create immutable order snapshots before payment handoff.
- Initialize Paystack transactions in `NGN`.
- Verify webhook signatures and update order/payment state safely.

- [ ] **Step 4: Run tests to verify they pass**

Run:
- `npm run test -- tests/components/storefront/checkout-summary.test.tsx`
- `npm run test -- tests/unit/payments/verify-paystack-webhook.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(storefront)/cart app/(storefront)/checkout app/api/paystack/webhook lib/orders lib/payments components/storefront tests/components/storefront/checkout-summary.test.tsx tests/unit/payments/verify-paystack-webhook.test.ts
git commit -m "feat: add checkout and paystack payment flow"
```

### Task 13: Build customer dashboard, order tracking, and consignee management

**Files:**
- Create: `app/(storefront)/account/layout.tsx`
- Create: `app/(storefront)/account/orders/page.tsx`
- Create: `app/(storefront)/account/orders/[orderId]/page.tsx`
- Create: `app/(storefront)/account/consignees/page.tsx`
- Create: `components/storefront/order-status-timeline.tsx`
- Create: `components/storefront/consignee-form.tsx`
- Test: `tests/components/storefront/order-status-timeline.test.tsx`

- [ ] **Step 1: Write the failing timeline test**

```tsx
import { render, screen } from "@testing-library/react";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";

describe("OrderStatusTimeline", () => {
  it("renders the order statuses in sequence", () => {
    render(<OrderStatusTimeline currentStatus="processing" />);
    expect(screen.getByText("processing")).toBeInTheDocument();
    expect(screen.getByText("shipped")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/storefront/order-status-timeline.test.tsx`
Expected: FAIL because dashboard components do not exist.

- [ ] **Step 3: Implement the customer dashboard**

Implementation:
- Create dashboard shell with `Orders`, `Consignees`, and `Account`.
- Render order lists and order detail pages with receipts and status timeline.
- Add consignee create/edit/delete flows.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/storefront/order-status-timeline.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(storefront)/account components/storefront tests/components/storefront/order-status-timeline.test.tsx
git commit -m "feat: add customer dashboard and consignee management"
```

## Chunk 5: Admin Orders, BI, Settings, and Hardening

### Task 14: Build admin orders management

**Files:**
- Create: `app/(admin)/admin/orders/page.tsx`
- Create: `app/(admin)/admin/orders/[orderId]/page.tsx`
- Create: `components/admin/order-status-panel.tsx`
- Create: `lib/orders/update-order-status.ts`
- Test: `tests/unit/orders/update-order-status.test.ts`

- [ ] **Step 1: Write the failing order-status test**

```ts
import { updateOrderStatus } from "@/lib/orders/update-order-status";

describe("updateOrderStatus", () => {
  it("records an audit event and returns the new status", async () => {
    const result = await updateOrderStatus({
      orderId: "order-1",
      nextStatus: "shipped",
      actorId: "admin-1",
    });

    expect(result.status).toBe("shipped");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/orders/update-order-status.test.ts`
Expected: FAIL because order status transitions are missing.

- [ ] **Step 3: Implement admin order operations**

Implementation:
- Build order list/detail UI.
- Add auditable manual status changes.
- Keep internal notes separate from customer-facing events.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/orders/update-order-status.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(admin)/admin/orders components/admin/order-status-panel.tsx lib/orders/update-order-status.ts tests/unit/orders/update-order-status.test.ts
git commit -m "feat: add admin order operations"
```

### Task 15: Build the BI suite

**Files:**
- Create: `app/(admin)/admin/bi/page.tsx`
- Create: `components/admin/bi-filter-bar.tsx`
- Create: `components/admin/bi-kpi-grid.tsx`
- Create: `components/admin/bi-sales-chart.tsx`
- Create: `components/admin/bi-drilldown-table.tsx`
- Create: `lib/bi/get-bi-dashboard.ts`
- Test: `tests/unit/bi/get-bi-dashboard.test.ts`

- [ ] **Step 1: Write the failing BI query test**

```ts
import { getBiDashboard } from "@/lib/bi/get-bi-dashboard";

describe("getBiDashboard", () => {
  it("returns executive, sales, catalog, operations, and payment sections", async () => {
    const dashboard = await getBiDashboard({
      from: "2026-01-01",
      to: "2026-01-31",
    });

    expect(dashboard.executive).toBeDefined();
    expect(dashboard.sales).toBeDefined();
    expect(dashboard.catalog).toBeDefined();
    expect(dashboard.operations).toBeDefined();
    expect(dashboard.payments).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/bi/get-bi-dashboard.test.ts`
Expected: FAIL because the BI query layer does not exist.

- [ ] **Step 3: Implement BI data and UI**

Implementation:
- Query BI views with date ranges and comparison windows.
- Build KPI cards, charts, and drilldown tables.
- Support exports from the table layer.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/bi/get-bi-dashboard.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(admin)/admin/bi components/admin lib/bi tests/unit/bi/get-bi-dashboard.test.ts
git commit -m "feat: add admin bi suite"
```

### Task 16: Build admin settings and config status pages

**Files:**
- Create: `app/(admin)/admin/settings/page.tsx`
- Create: `components/admin/settings/currency-pairs-form.tsx`
- Create: `components/admin/settings/shipping-config-form.tsx`
- Create: `components/admin/settings/pricing-rules-form.tsx`
- Create: `components/admin/settings/integration-status-card.tsx`
- Test: `tests/components/admin/settings/integration-status-card.test.tsx`

- [ ] **Step 1: Write the failing integration-status test**

```tsx
import { render, screen } from "@testing-library/react";
import { IntegrationStatusCard } from "@/components/admin/settings/integration-status-card";

describe("IntegrationStatusCard", () => {
  it("shows status without exposing secret values", () => {
    render(
      <IntegrationStatusCard
        name="Paystack"
        status="configured"
        lastSuccessAt="2026-04-17T10:00:00.000Z"
      />,
    );

    expect(screen.getByText("Paystack")).toBeInTheDocument();
    expect(screen.queryByText(/sk_/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/admin/settings/integration-status-card.test.tsx`
Expected: FAIL because the settings components do not exist.

- [ ] **Step 3: Implement settings UI**

Implementation:
- Add grouped sections for currency pairs, shipping configs, pricing rules, sync controls, payment status, and admin security.
- Keep ELIM/Paystack views status-only for secrets.
- Add configuration previews and validation summaries where appropriate.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/admin/settings/integration-status-card.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/(admin)/admin/settings components/admin/settings tests/components/admin/settings/integration-status-card.test.tsx
git commit -m "feat: add admin settings and integration status"
```

### Task 17: Add E2E coverage and final verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/storefront-browse.spec.ts`
- Create: `tests/e2e/checkout-route-pricing.spec.ts`
- Create: `tests/e2e/admin-import-job.spec.ts`
- Modify: `package.json`
- Test: `tests/e2e/*`

- [ ] **Step 1: Write the first failing E2E spec**

```ts
import { test, expect } from "@playwright/test";

test("checkout updates NGN total when route changes", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByRole("radio", { name: /air/i }).check();
  await expect(page.getByText("Grand total")).toBeVisible();
});
```

- [ ] **Step 2: Run the E2E spec to verify it fails**

Run: `npm run test:e2e -- tests/e2e/checkout-route-pricing.spec.ts`
Expected: FAIL until the app and config are fully wired.

- [ ] **Step 3: Add E2E config and finish all missing wiring**

Implementation:
- Configure Playwright for local runs.
- Add seeded fixtures or test doubles for storefront product data, import jobs, and checkout.
- Close any remaining gaps uncovered by E2E.

- [ ] **Step 4: Run the full verification suite**

Run:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts package.json tests/e2e
git commit -m "test: add end-to-end coverage and final verification"
```

## Execution Notes

- Execute chunks in order. Each chunk leaves the app in a coherent, testable state.
- Prefer minimal implementations that satisfy tests before adding polish.
- Keep server-side business logic in `lib/*`; do not bury domain rules in route components.
- Add nested `AGENTS.md` files immediately after the related directories are created so subsequent work inherits the scoped rules.
- If the hosting target changes later, keep job runners callable through internal HTTP endpoints so they can be driven by any cron provider or VPS scheduler.

Plan complete and saved to `docs/superpowers/plans/2026-04-17-china-nigeria-commerce-v1.md`. Ready to execute?
