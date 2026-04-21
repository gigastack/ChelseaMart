import { ProductListTable, type AdminProductRow } from "@/components/admin/product-list-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { listAdminProducts } from "@/lib/catalog/repository";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminProductsPage() {
  const demoProducts: AdminProductRow[] = await listAdminProducts();
  const productTabs = [
    { count: demoProducts.filter((product) => product.status === "live").length, label: "Live" },
    { count: demoProducts.filter((product) => product.status === "draft").length, label: "Drafts" },
    { count: demoProducts.filter((product) => product.status === "removed").length, label: "Removed" },
    { count: demoProducts.filter((product) => product.status === "unavailable").length, label: "Unavailable" },
  ];
  const manualCount = demoProducts.filter((product) => product.sourceType === "manual").length;
  const apiCount = demoProducts.filter((product) => product.sourceType === "api").length;
  const overrideCount = demoProducts.filter((product) => product.moqOverride !== null).length;
  const missingImageCount = demoProducts.filter((product) => product.coverImageUrl === null).length;

  return (
    <section className="space-y-8">
      <h2 className="sr-only">Products</h2>
      <div className="grid gap-6 border-b border-[rgba(var(--border-subtle),0.92)] pb-8 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
        <div className="space-y-3">
          <Badge>Catalog control</Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">
              Products
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgb(var(--text-secondary))]">
              Create, edit, and publish products from one place.
            </p>
          </div>
        </div>
        <Link className={cn(buttonVariants())} href="/admin/products/new">
          Create product
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {productTabs.map((tab) => (
          <article
            key={tab.label}
            className="grid gap-3 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-5"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">{tab.label}</p>
            <p className="text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--text-primary))]">{tab.count}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <article className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))]">
          <div className="grid gap-2 border-b border-[rgba(var(--border-subtle),0.92)] px-6 py-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Products list</p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Live, draft, removed, and unavailable products share one local catalog
            </h2>
          </div>
          <div className="px-6 py-5">
            <ProductListTable products={demoProducts} />
          </div>
        </article>

        <div className="grid gap-6">
          <article className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="space-y-2">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Publish readiness</p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">What still needs attention.</h2>
            </div>
            <div className="grid gap-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4">
                <p className="font-medium text-[rgb(var(--text-primary))]">{missingImageCount} products missing a cover image.</p>
                <p className="mt-2">Products should have an image before they go live.</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] p-4">
                <p className="font-medium text-[rgb(var(--text-primary))]">{overrideCount} products use a product-level MOQ override.</p>
                <p className="mt-2">All other products inherit the global default from settings.</p>
              </div>
            </div>
          </article>

          <article className="grid gap-4 rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
            <div className="space-y-2">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Source posture</p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">Manual and API products stay in one catalog.</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] px-4 py-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Manual rows</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{manualCount}</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] px-4 py-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">API-linked rows</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">{apiCount}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-[rgb(var(--text-secondary))]">Manual products are created locally. API-linked products keep source metadata for review.</p>
          </article>
        </div>
      </section>
    </section>
  );
}
