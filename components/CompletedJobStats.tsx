"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { StatsCard } from "./StatsCard";
import { CrawlStats } from "@/types/crawlStats";

export const CompletedJobsStats = () => {
  const [stats, setStats] = useState<CrawlStats>({ count: 0, loading: true });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get jobs completed in the last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { count, error } = await supabase
          .from("web_crawl_jobs")
          .select("*", { count: "exact", head: true })
          .eq("status", "crawled")
          .gte("completed_at", yesterday.toISOString());

        if (error) throw error;

        setStats({ count: count || 0, loading: false });
      } catch (error) {
        setStats({ count: 0, loading: false, error: error as Error });
      }
    };

    fetchStats();

    // Set up real-time subscription for completed jobs
    const channel = supabase
      .channel("completed-jobs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
          filter: "status=eq.crawled",
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
      variant="green"
      title="Completed Today"
      value={stats.count}
      icon={Check}
      description="Successfully finished in last 24h"
      loading={stats.loading}
      error={stats.error}
    />
  );
};
