import { ProductEditor } from "@/components/admin/product-editor";
import { ProductPublishRail } from "@/components/admin/product-publish-rail";
import { Badge } from "@/components/ui/badge";
import { saveAdminProductAction } from "@/app/(admin)/admin/products/actions";
import { findAdminProduct } from "@/lib/catalog/repository";
import { getCommerceSettings } from "@/lib/settings/repository";

type ProductEditorPageProps = {
  params: Promise<{
    productId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export default async function AdminProductEditorPage({ params, searchParams }: ProductEditorPageProps) {
  const { productId } = await params;
  const pageParams = (await (searchParams ?? Promise.resolve({}))) as { error?: string; updated?: string };
  const [product, settings] = await Promise.all([findAdminProduct(productId), getCommerceSettings()]);
  const isManual = product?.sourceType === "manual";
  const coverImageMissing = !product?.coverImageUrl;
  const formId = "admin-product-editor-form";

  return (
    <section className="space-y-6">
        {pageParams.updated === "1" ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--success),0.25)] bg-[rgba(var(--success),0.08)] px-4 py-3 text-sm text-[rgb(var(--text-primary))]">
            Product saved.
          </div>
        ) : null}
        {pageParams.error ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--danger),0.25)] bg-[rgba(var(--danger),0.08)] px-4 py-3 text-sm text-[rgb(var(--text-primary))]">
            {pageParams.error}
          </div>
        ) : null}
        <div className="space-y-3">
          <Badge>Shared product editor</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Product editor
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
              Update product details, prices, MOQ, and image before publishing.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <ProductEditor
            action={saveAdminProductAction}
            defaultValues={{
              basePriceCny: product?.sourcePriceCny ?? product?.priceCny ?? 0,
              coverImageUrl: product?.coverImageUrl ?? null,
              cnyToNgnRate: settings.cnyToNgnRate,
              defaultMoq: settings.defaultMoq,
              effectiveMoq: product?.effectiveMoq ?? settings.defaultMoq,
              moqOverride: product?.moqOverride ?? null,
              sellPriceCny: product?.priceCny ?? 0,
              shortDescription: product?.shortDescription ?? "",
              title: product?.title ?? "",
            }}
            formId={formId}
            mode={isManual ? "manual" : "api"}
            productId={productId}
          />
          <ProductPublishRail
            blockingIssues={coverImageMissing ? ["cover_image_required"] : []}
            effectiveMoq={product?.effectiveMoq ?? settings.defaultMoq}
            formId={formId}
            moqOverride={product?.moqOverride ?? null}
            priceCny={product?.priceCny ?? 0}
            priceNgn={product?.priceNgn ?? 0}
            status={product?.status ?? "draft"}
            title={product?.title ?? "Product"}
          />
        </div>
    </section>
  );
}
