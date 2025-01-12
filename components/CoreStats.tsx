"use client";

import { createClient } from "@/utils/supabase/client";
import { AlertCircle, Clock, Globe2, HardDrive, Hash } from "lucide-react";
import { JSX, useEffect, useState } from "react";

interface StatItemProps {
  icon: JSX.ElementType;
  label: string;
  value: string | number;
  color: string;
}

interface CrawlStats {
  pagesCrawled: number;
  duration: string;
  errors: number;
  totalSize: string;
  avgTokens: number;
}

const CoreStats = () => {
  const [stats, setStats] = useState<CrawlStats | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCrawlStats(jobId: string) {
      const { data, error } = await supabase.rpc("get_crawl_stats", {
        job_id: jobId,
      });

      console.log(data, error);

      if (error) throw error;

      //   const duration = data.completed_at
      //     ? formatDuration(new Date(data.completed_at) - new Date(data.created_at))
      //     : "In Progress";

      return {
        pagesCrawled: parseInt(data.pagesCrawled || "0"),
        duration: data.duration,
        errors: parseInt(data.errors || "0"),
        totalSize: data.totalSize,
        avgTokens: data.avgTokens,
      };
    }
    fetchCrawlStats("80e579b7-1eb9-443e-b994-0af5dd1cc80e").then((data) => {
      console.log(data);
      setStats(data);
    });
  }, []);

  const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 group hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4">
        {/* Icon container */}
        <div
          className={`shrink-0 w-12 h-12 rounded-lg ${color} flex items-center justify-center
          transition-transform duration-200 group-hover:scale-105`}
        >
          <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>

        {/* Text content */}
        <div className="min-w-0">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatItem
        icon={Globe2}
        label="Pages Crawled"
        value={stats?.pagesCrawled.toLocaleString() ?? 0}
        color="bg-blue-500"
      />

      <StatItem icon={Clock} label="Duration" value={stats?.duration ?? ""} color="bg-indigo-500" />

      <StatItem
        icon={AlertCircle}
        label="Errors"
        value={stats?.errors.toLocaleString() ?? ""}
        color="bg-red-500"
      />

      <StatItem
        icon={HardDrive}
        label="Total Size"
        value={stats?.totalSize ?? 0}
        color="bg-emerald-500"
      />

      <StatItem
        icon={Hash}
        label="Avg. Tokens/Page"
        value={stats?.avgTokens.toLocaleString() ?? ""}
        color="bg-violet-500"
      />
    </div>
  );
};

export default CoreStats;
