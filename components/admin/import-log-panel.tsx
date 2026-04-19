import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ImportLogPanelProps = {
  lines: string[];
};

export function ImportLogPanel({ lines }: ImportLogPanelProps) {
  return (
    <Card className="bg-[rgb(var(--text-primary))] text-[rgb(var(--surface-card))]">
      <CardHeader>
        <CardDescription className="text-[rgba(255,255,255,0.75)]">Import activity log</CardDescription>
        <CardTitle className="text-[rgb(var(--surface-card))]">Job stream</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-auto rounded-[var(--radius-md)] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-4 font-mono text-xs leading-6">
          {lines.map((line, index) => (
            <div key={`${line}-${index}`}>{line}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
