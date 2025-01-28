"use client";

import CrawlInitiator from "@/components/CrawlInitiator";
import CrawlJobsTable from "@/components/CrawlJobTable";
import DashboardLayout from "@/components/DashboardLayout";
import QuotaDisplayWrapper from "@/components/QuotaDisplayWrapper";
import { CrawlJobsData } from "@/types/jobTypes";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const CrawlJobsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CrawlJobsData>({ jobs: [], total: 0 });
  const [quotaUsage, setQuotaUsage] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total count
        const { count, error: countError } = await supabase
          .from("web_crawl_jobs")
          .select("*", { count: "exact", head: true });

        if (countError) throw countError;

        // Fetch initial jobs
        const { data: jobs, error: jobsError } = await supabase
          .from("web_crawl_jobs")
          .select("*")
          .order("created_at", { ascending: false })
          .range(0, 9);

        if (jobsError) throw jobsError;

        setData({
          jobs: jobs || [],
          total: count || 0,
        });

        // TODO: Implement actual quota calculation
        setQuotaUsage(45);
      } catch (error) {
        setData((prev) => ({ ...prev, error: error as Error }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription for job updates
    const channel = supabase
      .channel("dashboard-jobs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
        },
        () => {
          fetchData(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <DashboardLayout isLoading={isLoading} error={data.error} quotaUsage={quotaUsage}>
      <div className="lg:col-span-1 space-y-6">
        <CrawlInitiator />

        <QuotaDisplayWrapper />
      </div>
      <div className="lg:col-span-3">
        <CrawlJobsTable initialJobs={data.jobs} initialTotal={data.total} />
      </div>
    </DashboardLayout>
  );
};

export default CrawlJobsPage;
