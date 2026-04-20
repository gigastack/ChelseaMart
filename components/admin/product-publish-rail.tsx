import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProductPublishRailProps = {
  blockingIssues: string[];
  priceNgn: number;
  status: "draft" | "live" | "removed" | "unavailable";
  title: string;
};

function formatIssue(issue: string) {
  return issue.replace(/_/g, " ");
}

export function ProductPublishRail({ blockingIssues, priceNgn, status, title }: ProductPublishRailProps) {
  const readyToPublish = blockingIssues.length === 0;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardDescription>Publish readiness</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge>{status}</Badge>
          <span className="text-sm text-[rgb(var(--text-secondary))]">NGN {priceNgn.toLocaleString("en-NG")}</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Blocking issues</p>
          {blockingIssues.length === 0 ? (
            <p className="text-sm text-[rgb(var(--success))]">Ready to publish once reviewed.</p>
          ) : (
            <ul className="space-y-1 text-sm text-[rgb(var(--text-secondary))]">
              {blockingIssues.map((issue) => (
                <li key={issue}>• {formatIssue(issue)}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-3">
          <Button disabled={!readyToPublish}>Publish product</Button>
          <Button variant="secondary">Save draft</Button>
        </div>
      </CardContent>
    </Card>
  );
}
