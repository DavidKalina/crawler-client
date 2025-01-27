import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Activity } from "lucide-react";

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

  // Function to determine progress color based on usage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-400";
    if (percentage >= 75) return "bg-orange-400";
    if (percentage >= 50) return "bg-blue-400";
    return "bg-emerald-400";
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-400" />
          <div>
            <CardTitle className="text-lg font-medium text-zinc-100">Usage Overview</CardTitle>
            <CardDescription className="text-zinc-400">
              Monitor your monthly web scraping quota
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Current Usage</span>
            </div>
            <span className="text-sm font-medium text-zinc-100">{quotaPercentage.toFixed(1)}%</span>
          </div>

          <div className="space-y-2">
            <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor(
                  quotaPercentage
                )}`}
                style={{ width: `${quotaPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{pagesUsed.toLocaleString()} used</span>
              <span>{monthlyQuota.toLocaleString()} total</span>
            </div>
          </div>
        </div>

        {lastQuotaReset && (
          <div className="flex items-center space-x-1.5 rounded-md bg-blue-400/10 px-2.5 py-1.5">
            <div className="h-1 w-1 rounded-full bg-blue-400"></div>
            <p className="text-xs text-blue-400">Quota resets on {formatDate(lastQuotaReset)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
