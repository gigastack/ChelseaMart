import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingRulesForm() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Operating policy</CardDescription>
        <CardTitle>Two-phase settlement rules</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
        <p>1. Catalog browse stays CNY-native, with NGN as a customer display toggle only.</p>
        <p>2. Product payment converts CNY to NGN at checkout and settles immediately through Paystack.</p>
        <p>3. Logistics remains uncollected until warehouse measurement, proof upload, and USD invoice creation.</p>
        <p>4. Shipping payment converts that USD invoice to NGN for customer settlement without rewriting history.</p>
      </CardContent>
    </Card>
  );
}
