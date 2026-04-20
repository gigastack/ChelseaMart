import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProductEditorProps = {
  defaultValues: {
    basePriceNgn: number;
    moq: number;
    shortDescription: string;
    title: string;
    weightKg: number | null;
  };
  mode: "api" | "manual";
};

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
            MOQ
            <Input defaultValue={String(defaultValues.moq)} inputMode="numeric" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))] md:col-span-2">
            Short description
            <textarea
              className="min-h-28 rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-3 py-2 text-sm text-[rgb(var(--text-primary))] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))] focus-visible:ring-offset-2"
              defaultValue={defaultValues.shortDescription}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Pricing and logistics</CardDescription>
          <CardTitle>Set the admin-controlled values that affect checkout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Sell price (NGN)
            <Input defaultValue={String(defaultValues.basePriceNgn)} inputMode="numeric" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Weight (kg)
            <Input defaultValue={defaultValues.weightKg ? String(defaultValues.weightKg) : ""} inputMode="decimal" placeholder="Required before publish" />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
