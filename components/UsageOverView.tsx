import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UsageOverviewProps {
  pagesUsed: number;
  monthlyQuota: number;
  lastQuotaReset: string;
}

export function UsageOverview({ pagesUsed, monthlyQuota, lastQuotaReset }: UsageOverviewProps) {
  const quotaPercentage = (pagesUsed / monthlyQuota) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <CardDescription>Monitor your monthly web scraping quota</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                {pagesUsed} / {monthlyQuota} pages used
              </span>
              <span className="text-sm text-muted-foreground">{quotaPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={quotaPercentage} className="h-2" />
          </div>
          {lastQuotaReset && (
            <p className="text-sm text-muted-foreground">
              Quota resets on {formatDate(lastQuotaReset)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
