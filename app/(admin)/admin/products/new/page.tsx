import { ProductEditor } from "@/components/admin/product-editor";
import { ProductPublishRail } from "@/components/admin/product-publish-rail";
import { CreateProductSourcePicker } from "@/components/admin/create-product-source-picker";
import { Badge } from "@/components/ui/badge";
import { getCommerceSettings } from "@/lib/settings/repository";

type NewAdminProductPageProps = {
  searchParams: Promise<{
    source?: string;
  }>;
};

export default async function NewAdminProductPage({ searchParams }: NewAdminProductPageProps) {
  const { source } = await searchParams;
  const settings = await getCommerceSettings();
  const manualSellPriceCny = Number((68000 / settings.cnyToNgnRate).toFixed(2));

  if (source === "manual") {
    return (
      <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-3">
            <Badge>Manual upload</Badge>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
                Create manual product
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[rgb(var(--text-secondary))]">
                ProductImage.jpg is the canonical manual-upload example for QA, checkout, and BI validation.
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <ProductEditor
              defaultValues={{
                cnyToNgnRate: settings.cnyToNgnRate,
                defaultMoq: settings.defaultMoq,
                effectiveMoq: settings.defaultMoq,
                moqOverride: null,
                sellPriceCny: manualSellPriceCny,
                shortDescription: "Manual-upload flagship product using ProductImage.jpg as the canonical QA asset.",
                sourcePriceCny: manualSellPriceCny,
                title: "Product Image Sample",
                weightKg: 1.8,
              }}
              mode="manual"
            />
            <ProductPublishRail
              blockingIssues={[]}
              effectiveMoq={settings.defaultMoq}
              moqOverride={null}
              priceCny={manualSellPriceCny}
              priceNgn={68000}
              status="draft"
              title="Product Image Sample"
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-alt))] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <CreateProductSourcePicker />
      </div>
    </main>
  );
}
