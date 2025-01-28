"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { StatsCard } from "./StatsCard";
import { CrawlStats } from "@/types/crawlStats";

export const ActiveCrawlsStats = () => {
  const [stats, setStats] = useState<CrawlStats>({ count: 0, loading: true });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count, error } = await supabase
          .from("web_crawl_jobs")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        if (error) throw error;

        setStats({ count: count || 0, loading: false });
      } catch (error) {
        setStats({ count: 0, loading: false, error: error as Error });
      }
    };

    fetchStats();

    // Set up real-time subscription
    const channel = supabase
      .channel("active-crawls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
          filter: "status=eq.running",
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
      variant="blue"
      title="Pending Crawls"
      value={stats.count}
      icon={Activity}
      description="Currently pending crawl jobs"
      loading={stats.loading}
      error={stats.error}
    />
  );
};
