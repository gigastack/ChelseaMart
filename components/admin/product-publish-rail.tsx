import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProductPublishRailProps = {
  blockingIssues: string[];
  effectiveMoq: number;
  formId: string;
  moqOverride: number | null;
  priceCny: number;
  priceNgn: number;
  status: "draft" | "live" | "removed" | "unavailable";
  title: string;
};

function formatIssue(issue: string) {
  return issue.replace(/_/g, " ");
}

function formatCny(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function ProductPublishRail({
  blockingIssues,
  effectiveMoq,
  formId,
  moqOverride,
  priceCny,
  priceNgn,
  status,
  title,
}: ProductPublishRailProps) {
  return (
    <Card className="sticky top-6 border-none bg-[linear-gradient(180deg,rgba(var(--surface-card),0.98)_0%,rgba(var(--surface-alt),0.94)_100%)]">
      <CardHeader>
        <CardDescription>Publish readiness</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge>{status}</Badge>
          <span className="text-sm text-[rgb(var(--text-secondary))]">{formatCny(priceCny)}</span>
          <span className="text-sm text-[rgb(var(--text-secondary))]">NGN {priceNgn.toLocaleString("en-NG")}</span>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] px-4 py-3 text-sm leading-6 text-[rgb(var(--text-secondary))]">
          Effective MOQ is <span className="font-semibold text-[rgb(var(--text-primary))]">{effectiveMoq}</span>.
          {moqOverride === null ? " This record currently inherits the global default." : " This record uses a product-level override."}
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
          <Button form={formId} name="intent" type="submit" value="live">
            Publish product
          </Button>
          <Button form={formId} name="intent" type="submit" value="draft" variant="secondary">
            Save draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
