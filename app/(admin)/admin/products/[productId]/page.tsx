import { ProductEditor } from "@/components/admin/product-editor";
import { ProductPublishRail } from "@/components/admin/product-publish-rail";
import { Badge } from "@/components/ui/badge";
import { findAdminProduct } from "@/lib/catalog/repository";

type ProductEditorPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function AdminProductEditorPage({ params }: ProductEditorPageProps) {
  const { productId } = await params;
  const product = await findAdminProduct(productId);
  const isManual = product?.sourceType === "manual";
  const weightMissing = !product?.weightKg;

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-3">
          <Badge>Shared product editor</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Product editor
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Manual and API-linked products converge here so the admin can set final price, MOQ, weight, and publish
              readiness before anything reaches the storefront.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <ProductEditor
            defaultValues={{
              basePriceNgn: product?.priceNgn ?? 68000,
              moq: 1,
              shortDescription: `Draft editor for ${productId}`,
              title: product?.title ?? "Product Image Sample",
              weightKg: product?.weightKg ?? null,
            }}
            mode={isManual ? "manual" : "api"}
          />
          <ProductPublishRail
            blockingIssues={weightMissing ? ["weight_required"] : []}
            priceNgn={product?.priceNgn ?? 68000}
            status={product?.status ?? "draft"}
            title={product?.title ?? "Product Image Sample"}
          />
        </div>
      </div>
    </main>
  );
}
