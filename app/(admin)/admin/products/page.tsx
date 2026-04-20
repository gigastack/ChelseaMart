import { ProductListTable, type AdminProductRow } from "@/components/admin/product-list-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge>Catalog control</Badge>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                Products
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
                Review draft imports, keep removed products off-stage, and monitor unavailable-source items before
                they affect the storefront.
              </p>
            </div>
          </div>
          <Link className={cn(buttonVariants())} href="/admin/products/new">
            Create product
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {productTabs.map((tab) => (
            <Card key={tab.label}>
              <CardHeader>
                <CardDescription>{tab.label}</CardDescription>
                <CardTitle>{tab.count}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardDescription>Products list</CardDescription>
            <CardTitle>Live, draft, removed, and unavailable products share one local catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductListTable products={demoProducts} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
