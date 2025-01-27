import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Activity, Package } from "lucide-react";

interface UsageOverviewProps {
  pagesUsed: number;
  availablePages: number;
  lifetimePagesPurchased: number;
}

export function UsageOverview({
  pagesUsed,
  availablePages,
  lifetimePagesPurchased,
}: UsageOverviewProps) {
  const usedFromPurchased = lifetimePagesPurchased - availablePages;
  const usagePercentage = (usedFromPurchased / lifetimePagesPurchased) * 100;

  // Function to determine progress color based on available pages
  const getProgressColor = (available: number) => {
    const availablePercentage = (available / lifetimePagesPurchased) * 100;
    if (availablePercentage <= 10) return "bg-red-400";
    if (availablePercentage <= 25) return "bg-orange-400";
    if (availablePercentage <= 50) return "bg-blue-400";
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
              Track your available crawling pages
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Pages Used</span>
            </div>
            <span className="text-sm font-medium text-zinc-100">
              {usagePercentage.toFixed(1)}% consumed
            </span>
          </div>

          <div className="space-y-2">
            <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor(
                  availablePages
                )}`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{availablePages.toLocaleString()} available</span>
              <span>{lifetimePagesPurchased.toLocaleString()} purchased</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <Package className="h-3 w-3 text-zinc-400" />
              <span className="text-xs text-zinc-500">Available Pages</span>
            </div>
            <p className="text-sm font-medium text-zinc-100 tabular-nums">
              {availablePages.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <Activity className="h-3 w-3 text-zinc-400" />
              <span className="text-xs text-zinc-500">Total Used</span>
            </div>
            <p className="text-sm font-medium text-zinc-100 tabular-nums">
              {pagesUsed.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 rounded-md bg-blue-400/10 px-2.5 py-1.5">
          <div className="h-1 w-1 rounded-full bg-blue-400"></div>
          <p className="text-xs text-blue-400">Pages never expire • Purchase more at any time</p>
        </div>
      </CardContent>
    </Card>
  );
}
