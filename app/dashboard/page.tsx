import { ActiveCrawlsStats } from "@/components/ActiveCrawlStats";
import { CompletedJobsStats } from "@/components/CompletedJobStats";
import CrawlJobsTable from "@/components/CrawlJobTable";
import DashboardLayout from "@/components/DashboardLayout";
import { FailedJobsStats } from "@/components/FailedJobStats";
import QuotaDisplayWrapper from "@/components/QuotaDisplayWrapper";
import { createClient } from "@/utils/supabase/server";

export default async function CrawlJobsPage() {
  const supabase = await createClient();

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
      {/* Left Column */}
      <div className="lg:col-span-1 space-y-4">
        {/* Stats Group */}
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h2 className="text-sm font-medium text-zinc-200 mb-4">System Status</h2>
            <div className="space-y-4">
              <QuotaDisplayWrapper />
              <ActiveCrawlsStats />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h2 className="text-sm font-medium text-zinc-200 mb-4">Job Statistics</h2>
            <div className="space-y-4">
              <CompletedJobsStats />
              <FailedJobsStats />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Table */}
      <div className="lg:col-span-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50">
          <CrawlJobsTable initialJobs={jobs ?? []} initialTotal={count ?? 0} />
        </div>
      </div>
    </DashboardLayout>
  );
}
