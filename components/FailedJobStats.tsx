"use client";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { StatsCard } from "./StatsCard";
import { CrawlStats } from "@/types/crawlStats";

export const FailedJobsStats = () => {
  const [stats, setStats] = useState<CrawlStats>({ count: 0, loading: true });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get jobs that failed in the last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { count, error } = await supabase
          .from("web_crawl_jobs")
          .select("*", { count: "exact", head: true })
          .eq("status", "failed")
          .gte("updated_at", yesterday.toISOString());

        if (error) throw error;

        setStats({ count: count || 0, loading: false });
      } catch (error) {
        setStats({ count: 0, loading: false, error: error as Error });
      }
    };

    fetchStats();

    // Set up real-time subscription for failed jobs
    const channel = supabase
      .channel("failed-jobs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
          filter: "status=eq.failed",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <StatsCard
      title="Failed Jobs"
      value={stats.count}
      icon={AlertCircle}
      description="Errors in the last 24h"
      loading={stats.loading}
      error={stats.error}
    />
  );
};
