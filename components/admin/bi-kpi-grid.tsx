import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BiKpiGridProps = {
  revenueNgn: number;
  totalOrders: number;
  unavailable: number;
};

export function BiKpiGrid({ revenueNgn, totalOrders, unavailable }: BiKpiGridProps) {
  const cards = [
    { label: "Revenue", value: `NGN ${revenueNgn.toLocaleString("en-NG")}` },
    { label: "Orders", value: String(totalOrders) },
    { label: "Unavailable products", value: String(unavailable) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle>{card.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
