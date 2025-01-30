// page.tsx (Server Component)
import { ActiveCrawlsStats } from "@/components/ActiveCrawlStats";
import { CompletedJobsStats } from "@/components/CompletedJobStats";
import CrawlJobsTable from "@/components/CrawlJobTable";
import DashboardLayout from "@/components/DashboardLayout";
import { FailedJobsStats } from "@/components/FailedJobStats";
import QuotaDisplayWrapper from "@/components/QuotaDisplayWrapper";
import { createClient } from "@/utils/supabase/server";

export default async function CrawlJobsPage() {
  const supabase = await createClient();

  // Fetch initial data server-side
  const [{ count }, { data: jobs }] = await Promise.all([
    supabase.from("web_crawl_jobs").select("*", { count: "exact", head: true }),
    supabase
      .from("web_crawl_jobs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, 6),
  ]);

  return (
    <DashboardLayout>
      <div className="lg:col-span-1 flex flex-col justify-between">
        <QuotaDisplayWrapper />
        <ActiveCrawlsStats />
        <CompletedJobsStats />
        <FailedJobsStats />
      </div>
      <div className="lg:col-span-3">
        <CrawlJobsTable initialJobs={jobs ?? []} initialTotal={count ?? 0} />
      </div>
    </DashboardLayout>
  );
}
