import { ConsigneeForm } from "@/components/storefront/consignee-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsigneeRecord } from "@/lib/orders/repository";

type ConsigneesPageProps = {
  consignees: ConsigneeRecord[];
};

export function ConsigneesPage({ consignees }: ConsigneesPageProps) {
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <Badge>Consignees</Badge>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]">Nigeria hub recipients</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <div className="grid gap-4">
          {consignees.map((consignee) => (
            <Card key={consignee.id}>
              <CardHeader>
                <CardDescription>{consignee.isDefault ? "Default consignee" : "Saved consignee"}</CardDescription>
                <CardTitle>{consignee.fullName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                <p>{consignee.cityOrState}</p>
                <p>{consignee.phone}</p>
                <p>{consignee.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ConsigneeForm />
      </div>
    </main>
  );
}
