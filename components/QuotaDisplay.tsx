"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Package, ChevronRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuotaDisplayProps {
  availablePages: number;
  pagesUsed: number;
  lifetimePagesPurchased: number;
}

const QuotaDisplay = ({ availablePages, pagesUsed, lifetimePagesPurchased }: QuotaDisplayProps) => {
  // Show upgrade prompt if less than 25% of lifetime purchased pages are available
  const shouldShowUpgrade = availablePages < lifetimePagesPurchased * 0.25;

  const getStatusMessage = (availablePages: number) => {
    if (availablePages === 0) {
      return "You've used all your available pages. Purchase more to continue crawling.";
    }
    if (availablePages < 1000) {
      return "Running low on pages! Purchase more to ensure uninterrupted crawling.";
    }
    if (availablePages < 5000) {
      return "Consider purchasing more pages to maintain your crawling capacity.";
    }
    return "";
  };

  const usagePercentage = Math.max(
    0,
    Math.min(((lifetimePagesPurchased - availablePages) / lifetimePagesPurchased) * 100, 100)
  );

  const getProgressColor = (availablePages: number) => {
    if (availablePages === 0) return "bg-red-400";
    if (availablePages < 1000) return "bg-orange-400";
    if (availablePages < 5000) return "bg-blue-400";
    return "bg-emerald-400";
  };

  return (
    <Card className="bg-zinc-900 border border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-blue-400" />
            <CardTitle className="text-md font-medium text-zinc-100">Crawling Pages</CardTitle>
          </div>
          <div className="flex items-center space-x-1.5 rounded-md bg-blue-400/10 px-2.5 py-1">
            <Package className="h-3 w-3 text-blue-400" />
            <p className="text-xs text-blue-400">Pay as you go</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Usage History</span>
          </div>
          <span className="text-sm font-medium text-zinc-100 tabular-nums">
            {pagesUsed.toLocaleString()} pages crawled
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
                availablePages
              )}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500">Available Pages</span>
            <p className="text-sm font-medium text-zinc-100 tabular-nums">
              {availablePages.toLocaleString()} pages
            </p>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-xs text-zinc-500">Total Purchased</span>
            <p className="text-sm font-medium text-zinc-100 tabular-nums">
              {lifetimePagesPurchased.toLocaleString()} pages
            </p>
          </div>
        </div>

        {shouldShowUpgrade && (
          <div className="pt-2 space-y-2">
            <Link href={`/checkout/upgrade`}>
              <Button
                className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 
                       hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200
                       focus-visible:ring-offset-zinc-900 focus-visible:ring-blue-400/20
                       group"
              >
                <Package className="h-4 w-4 mr-2" />
                <span>Purchase More Pages</span>
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <p className="text-xs text-zinc-500 text-center">{getStatusMessage(availablePages)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuotaDisplay;
