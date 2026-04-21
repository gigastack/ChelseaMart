import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type IntegrationStatusCardProps = {
  lastRecordedAt?: string | null;
  name: string;
  status: "configured" | "invalid" | "missing";
};

export function IntegrationStatusCard({ lastRecordedAt, name, status }: IntegrationStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Integration status</CardDescription>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge>{status}</Badge>
        <p className="text-sm text-[rgb(var(--text-secondary))]">
          {lastRecordedAt
            ? `Last recorded activity: ${new Date(lastRecordedAt).toLocaleString("en-NG")}`
            : "No recorded activity yet."}
        </p>
      </CardContent>
    </Card>
  );
}
