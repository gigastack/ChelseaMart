import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingRulesForm() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Operating policy</CardDescription>
        <CardTitle>Payment flow</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
        <p>Catalog prices stay in CNY.</p>
        <p>Customers pay product totals in NGN at checkout.</p>
        <p>Shipping opens after warehouse measurement and proof upload.</p>
        <p>Shipping invoices stay in USD and are paid in NGN.</p>
      </CardContent>
    </Card>
  );
}
