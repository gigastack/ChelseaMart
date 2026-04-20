import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type IntegrationStatusCardProps = {
  lastSuccessAt?: string;
  name: string;
  status: "configured" | "invalid" | "missing";
};

export function IntegrationStatusCard({ lastSuccessAt, name, status }: IntegrationStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Integration status</CardDescription>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge>{status}</Badge>
        <p className="text-sm text-[rgb(var(--text-secondary))]">
          {lastSuccessAt ? `Last success: ${new Date(lastSuccessAt).toLocaleString("en-NG")}` : "No successful events recorded yet."}
        </p>
      </CardContent>
    </Card>
  );
}
