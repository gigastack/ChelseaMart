import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CurrencyPairsFormProps = {
  action: (formData: FormData) => Promise<void>;
  cnyToNgnRate: number;
  defaultMoq: number;
  usdToNgnRate: number;
};

export function CurrencyPairsForm({ action, cnyToNgnRate, defaultMoq, usdToNgnRate }: CurrencyPairsFormProps) {
  return (
    <Card className="border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
      <CardHeader>
        <CardDescription>Commerce settings</CardDescription>
        <CardTitle>Exchange rates and default MOQ</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            CNY to NGN
            <Input defaultValue={String(cnyToNgnRate)} inputMode="decimal" name="cnyToNgnRate" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            USD to NGN
            <Input defaultValue={String(usdToNgnRate)} inputMode="decimal" name="usdToNgnRate" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
            Global default MOQ
            <Input defaultValue={String(defaultMoq)} inputMode="numeric" name="defaultMoq" />
          </label>
          <Button type="submit">Save commerce settings</Button>
        </form>
      </CardContent>
    </Card>
  );
}
