"use client";

import { getCrawlStats } from "@/app/actions/crawlJobs";
import { AlertCircle, Clock, Globe2, HardDrive, Hash } from "lucide-react";
import { JSX, useCallback, useEffect, useState } from "react";

interface StatItemProps {
  icon: JSX.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

interface CrawlStats {
  pagesCrawled: number;
  duration: string;
  errors: number;
  totalSize: string;
  avgTokens: number;
}

const POLLING_INTERVAL = 5000;

const CoreStats = ({ crawlJobId }: { crawlJobId: string }) => {
  const [stats, setStats] = useState<CrawlStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCrawlStats = useCallback(async () => {
    try {
      const response = await getCrawlStats(crawlJobId);

      if (!response.success) throw error;

      const newStats = {
        pagesCrawled: response.data.pagesCrawled || 0,
        duration: response.data.duration,
        errors: response.data.errors || 0,
        totalSize: response.data.totalSize,
        avgTokens: response.data.avgTokens,
      };

      setStats((current) => {
        if (!current) return newStats;
        const hasChanged = Object.keys(newStats).some(
          (key) => newStats[key as keyof CrawlStats] !== current[key as keyof CrawlStats]
        );
        return hasChanged ? newStats : current;
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching crawl stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    }
  }, [crawlJobId, error]);

  useEffect(() => {
    fetchCrawlStats();
    const pollInterval = setInterval(fetchCrawlStats, POLLING_INTERVAL);
    return () => clearInterval(pollInterval);
  }, [fetchCrawlStats]);

  const StatItem = ({ icon: Icon, label, value, color, bgColor }: StatItemProps) => (
    <div
      className="group relative bg-zinc-900/50 rounded-lg border border-zinc-800/50 p-4 
                  hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 p-2 rounded-md ${bgColor} ${color}
                      transition-transform duration-200 group-hover:scale-105`}
        >
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-zinc-500 font-medium">{label}</p>
          <p className="text-sm font-medium text-zinc-200 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400 text-sm">
        Failed to load stats: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <StatItem
        icon={Globe2}
        label="Pages Crawled"
        value={stats?.pagesCrawled.toLocaleString() ?? 0}
        color="text-blue-400"
        bgColor="bg-blue-400/10"
      />

      <StatItem
        icon={Clock}
        label="Duration"
        value={stats?.duration ?? ""}
        color="text-indigo-400"
        bgColor="bg-indigo-400/10"
      />

      <StatItem
        icon={AlertCircle}
        label="Errors"
        value={stats?.errors.toLocaleString() ?? ""}
        color="text-red-400"
        bgColor="bg-red-400/10"
      />

      <StatItem
        icon={HardDrive}
        label="Total Size"
        value={stats?.totalSize ?? 0}
        color="text-emerald-400"
        bgColor="bg-emerald-400/10"
      />

      <StatItem
        icon={Hash}
        label="Avg. Tokens/Page"
        value={stats?.avgTokens.toLocaleString() ?? ""}
        color="text-violet-400"
        bgColor="bg-violet-400/10"
      />
    </div>
  );
};

export default CoreStats;
