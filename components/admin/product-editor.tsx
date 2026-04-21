import { Input } from "@/components/ui/input";

type ProductEditorProps = {
  action: (formData: FormData) => Promise<void>;
  defaultValues: {
    basePriceCny: number;
    coverImageUrl: string | null;
    cnyToNgnRate: number;
    defaultMoq: number;
    effectiveMoq: number;
    moqOverride: number | null;
    sellPriceCny: number;
    shortDescription: string;
    title: string;
  };
  formId: string;
  mode: "api" | "manual";
  productId?: string;
};

function formatNgnPreview(value: number, rate: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value * rate);
}

export function ProductEditor({ action, defaultValues, formId, mode, productId }: ProductEditorProps) {
  return (
    <form action={action} className="grid gap-6" id={formId}>
      <input name="productId" type="hidden" value={productId ?? ""} />
      <input name="mode" type="hidden" value={mode} />
      <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Basic information</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
            {mode === "api" ? "Review imported product" : "Create manual product"}
          </h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Product title
            <Input defaultValue={defaultValues.title} name="title" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            MOQ override
            <Input
              defaultValue={defaultValues.moqOverride === null ? "" : String(defaultValues.moqOverride)}
              inputMode="numeric"
              name="moqOverride"
              placeholder={`Uses global default ${defaultValues.defaultMoq}`}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))] md:col-span-2">
            Short description
            <textarea
              className="min-h-28 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-3 text-sm text-[rgb(var(--text-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))]"
              defaultValue={defaultValues.shortDescription}
              name="shortDescription"
            />
          </label>
          <div className="grid gap-4 md:col-span-2 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.9fr)]">
            <div className="grid gap-2">
              <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
                Cover image
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="min-h-11 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 py-3 text-sm text-[rgb(var(--text-primary))]"
                  name="coverImageFile"
                  type="file"
                />
              </label>
              <input name="existingCoverImageUrl" type="hidden" value={defaultValues.coverImageUrl ?? ""} />
              <p className="text-sm text-[rgb(var(--text-secondary))]">
                {defaultValues.coverImageUrl ? "Upload a new file to replace the current image." : "Add a cover image before publishing."}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] p-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">Current image</p>
              <p className="mt-2 text-sm text-[rgb(var(--text-secondary))]">
                {defaultValues.coverImageUrl ? "Image added" : "No image yet"}
              </p>
            </div>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))] md:col-span-2">
            Effective MOQ is <span className="font-semibold text-[rgb(var(--text-primary))]">{defaultValues.effectiveMoq}</span>.
            {defaultValues.moqOverride === null
              ? ` This product currently inherits the global default of ${defaultValues.defaultMoq}.`
              : " This product uses its own override instead of the global default."}
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-card))] p-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--brand-600))]">Pricing</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))]">
            Set the CNY prices that affect checkout.
          </h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            {mode === "manual" ? "Cost price (CNY)" : "Source price (CNY)"}
            <Input defaultValue={String(defaultValues.basePriceCny)} inputMode="decimal" name="basePriceCny" readOnly={mode === "api"} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            {mode === "manual" ? "Selling price (CNY)" : "Sell price (CNY)"}
            <Input defaultValue={String(defaultValues.sellPriceCny)} inputMode="decimal" name="sellPriceCny" />
          </label>
          <div className="rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-alt))] px-4 py-4 text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Current NGN preview:{" "}
            <span className="font-semibold text-[rgb(var(--text-primary))]">
              {formatNgnPreview(defaultValues.sellPriceCny, defaultValues.cnyToNgnRate)}
            </span>{" "}
            at a CNY to NGN rate of {defaultValues.cnyToNgnRate.toLocaleString("en-NG")}.
          </div>
        </div>
      </section>
    </form>
  );
}
