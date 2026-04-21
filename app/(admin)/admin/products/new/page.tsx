import { ProductEditor } from "@/components/admin/product-editor";
import { ProductPublishRail } from "@/components/admin/product-publish-rail";
import { CreateProductSourcePicker } from "@/components/admin/create-product-source-picker";
import { Badge } from "@/components/ui/badge";
import { saveAdminProductAction } from "@/app/(admin)/admin/products/actions";
import { getCommerceSettings } from "@/lib/settings/repository";

type NewAdminProductPageProps = {
  searchParams: Promise<{
    error?: string;
    source?: string;
  }>;
};

export default async function NewAdminProductPage({ searchParams }: NewAdminProductPageProps) {
  const { error, source } = await searchParams;
  const settings = await getCommerceSettings();
  const formId = "admin-product-editor-form";

  if (source === "manual") {
    return (
      <section className="space-y-6">
          {error ? (
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--danger),0.25)] bg-[rgba(var(--danger),0.08)] px-4 py-3 text-sm text-[rgb(var(--text-primary))]">
              {error}
            </div>
          ) : null}
          <div className="space-y-3">
            <Badge>Manual upload</Badge>
            <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
              Create manual product
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
                Add the product details, upload a cover image, and save as draft or publish when ready.
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <ProductEditor
              action={saveAdminProductAction}
              defaultValues={{
                basePriceCny: 0,
                coverImageUrl: null,
                cnyToNgnRate: settings.cnyToNgnRate,
                defaultMoq: settings.defaultMoq,
                effectiveMoq: settings.defaultMoq,
                moqOverride: null,
                sellPriceCny: 0,
                shortDescription: "",
                title: "",
              }}
              formId={formId}
              mode="manual"
            />
            <ProductPublishRail
              blockingIssues={["cover_image_required"]}
              effectiveMoq={settings.defaultMoq}
              formId={formId}
              moqOverride={null}
              priceCny={0}
              priceNgn={0}
              status="draft"
              title="New product"
            />
          </div>
      </section>
    );
  }

  return (
    <section>
      <CreateProductSourcePicker />
    </section>
  );
}
