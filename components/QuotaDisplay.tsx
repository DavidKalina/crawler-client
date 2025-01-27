import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Database, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuotaDisplayProps {
  monthlyQuota: number;
  firstMonthQuota?: number;
  pagesUsed: number;
  onUpgradeClick: () => void;
}

const QuotaDisplay = ({
  monthlyQuota,
  firstMonthQuota,
  pagesUsed,
  onUpgradeClick,
}: QuotaDisplayProps) => {
  const effectiveQuota = firstMonthQuota ?? monthlyQuota;
  const remaining = Math.max(0, effectiveQuota - pagesUsed);
  const usagePercentage = Math.min((pagesUsed / effectiveQuota) * 100, 100);
  const shouldShowUpgrade = usagePercentage >= 75;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-400";
    if (percentage >= 75) return "bg-orange-400";
    if (percentage >= 50) return "bg-blue-400";
    return "bg-emerald-400";
  };

  const getStatusMessage = (percentage: number) => {
    if (percentage >= 90) {
      return "Running low on pages! Upgrade now to ensure uninterrupted crawling.";
    }
    if (percentage >= 75) {
      return "Approaching quota limit. Consider upgrading for more capacity.";
    }
    return "";
  };

  return (
    <Card className="bg-zinc-900 border border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-blue-400" />
            <CardTitle className="text-md font-medium text-zinc-100">Pages Quota</CardTitle>
          </div>
          {firstMonthQuota && firstMonthQuota !== monthlyQuota && (
            <div className="flex items-center space-x-1.5 rounded-md bg-blue-400/10 px-2.5 py-1">
              <div className="h-1 w-1 rounded-full bg-blue-400"></div>
              <p className="text-xs text-blue-400">First month bonus active</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Battery className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Usage Status</span>
          </div>
          <span className="text-sm font-medium text-zinc-100 tabular-nums">
            {pagesUsed.toLocaleString()} pages
          </span>
        </div>

        <div className="space-y-2">
          <div
            className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={usagePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor(
                usagePercentage
              )}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500 tabular-nums">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500">Remaining</span>
            <p className="text-sm font-medium text-zinc-100 tabular-nums">
              {remaining.toLocaleString()} pages
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-xs text-zinc-500">Total Quota</span>
            <p className="text-sm font-medium text-zinc-100 tabular-nums">
              {effectiveQuota.toLocaleString()} pages
            </p>
          </div>
        </div>

        {shouldShowUpgrade && (
          <div className="pt-2 space-y-2">
            <Button
              onClick={onUpgradeClick}
              className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 
                       hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200
                       focus-visible:ring-offset-zinc-900 focus-visible:ring-blue-400/20
                       group"
            >
              <Zap className="h-4 w-4 mr-2" />
              <span>Upgrade Quota</span>
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <p className="text-xs text-zinc-500 text-center">{getStatusMessage(usagePercentage)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuotaDisplay;
