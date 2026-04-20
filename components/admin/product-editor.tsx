import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProductEditorProps = {
  defaultValues: {
    cnyToNgnRate: number;
    defaultMoq: number;
    effectiveMoq: number;
    moqOverride: number | null;
    sellPriceCny: number;
    shortDescription: string;
    sourcePriceCny: number;
    title: string;
    weightKg: number | null;
  };
  mode: "api" | "manual";
};

function formatNgnPreview(value: number, rate: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value * rate);
}

export function ProductEditor({ defaultValues, mode }: ProductEditorProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardDescription>Basic information</CardDescription>
          <CardTitle>{mode === "api" ? "Review imported product" : "Create manual product"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Product title
            <Input defaultValue={defaultValues.title} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Product MOQ override
            <Input
              defaultValue={defaultValues.moqOverride === null ? "" : String(defaultValues.moqOverride)}
              inputMode="numeric"
              placeholder={`Uses global default ${defaultValues.defaultMoq}`}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))] md:col-span-2">
            Short description
            <textarea
              className="min-h-28 rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-3 py-2 text-sm text-[rgb(var(--text-primary))] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))] focus-visible:ring-offset-2"
              defaultValue={defaultValues.shortDescription}
            />
          </label>
          <div className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-alt))] px-4 py-3 text-sm leading-6 text-[rgb(var(--text-secondary))] md:col-span-2">
            Effective MOQ is <span className="font-semibold text-[rgb(var(--text-primary))]">{defaultValues.effectiveMoq}</span>.
            {defaultValues.moqOverride === null
              ? ` This product currently inherits the global default of ${defaultValues.defaultMoq}.`
              : " This product uses its own override instead of the global default."}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Pricing and logistics</CardDescription>
          <CardTitle>Set the CNY-native catalog values that affect checkout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Source price (CNY)
            <Input defaultValue={String(defaultValues.sourcePriceCny)} inputMode="decimal" readOnly />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Sell price (CNY)
            <Input defaultValue={String(defaultValues.sellPriceCny)} inputMode="decimal" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Weight (kg)
            <Input defaultValue={defaultValues.weightKg ? String(defaultValues.weightKg) : ""} inputMode="decimal" placeholder="Required before publish" />
          </label>
          <div className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-alt))] px-4 py-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
            Current NGN preview:{" "}
            <span className="font-semibold text-[rgb(var(--text-primary))]">
              {formatNgnPreview(defaultValues.sellPriceCny, defaultValues.cnyToNgnRate)}
            </span>{" "}
            at a CNY to NGN rate of {defaultValues.cnyToNgnRate.toLocaleString("en-NG")}.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
