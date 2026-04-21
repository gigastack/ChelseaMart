import { ProductEditor } from "@/components/admin/product-editor";
import { ProductPublishRail } from "@/components/admin/product-publish-rail";
import { Badge } from "@/components/ui/badge";
import { findAdminProduct } from "@/lib/catalog/repository";
import { getCommerceSettings } from "@/lib/settings/repository";

type ProductEditorPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function AdminProductEditorPage({ params }: ProductEditorPageProps) {
  const { productId } = await params;
  const [product, settings] = await Promise.all([findAdminProduct(productId), getCommerceSettings()]);
  const isManual = product?.sourceType === "manual";
  const weightMissing = !product?.weightKg;

  return (
    <section className="space-y-6">
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
              cnyToNgnRate: settings.cnyToNgnRate,
              defaultMoq: settings.defaultMoq,
              effectiveMoq: product?.effectiveMoq ?? settings.defaultMoq,
              moqOverride: product?.moqOverride ?? null,
              sellPriceCny: product?.priceCny ?? Number((68000 / settings.cnyToNgnRate).toFixed(2)),
              shortDescription: `Draft editor for ${productId}`,
              sourcePriceCny: product?.sourcePriceCny ?? product?.priceCny ?? Number((68000 / settings.cnyToNgnRate).toFixed(2)),
              title: product?.title ?? "Product Image Sample",
              weightKg: product?.weightKg ?? null,
            }}
            mode={isManual ? "manual" : "api"}
          />
          <ProductPublishRail
            blockingIssues={weightMissing ? ["weight_required"] : []}
            effectiveMoq={product?.effectiveMoq ?? settings.defaultMoq}
            moqOverride={product?.moqOverride ?? null}
            priceCny={product?.priceCny ?? Number((68000 / settings.cnyToNgnRate).toFixed(2))}
            priceNgn={product?.priceNgn ?? 68000}
            status={product?.status ?? "draft"}
            title={product?.title ?? "Product Image Sample"}
          />
        </div>
    </section>
  );
}
