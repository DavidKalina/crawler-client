import CrawlInitiator from "@/components/CrawlInitiator";
import CrawlJobsTable from "@/components/CrawlJobTable";
import { createClient } from "@/utils/supabase/server";

export default async function CrawlJobsPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("web_crawl_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching crawl jobs:", error);
    // You might want to handle this error differently
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Error loading crawl jobs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 max-w-7xl h-screen items-center justify-center mx-auto">
      <div className="col-span-1">
        <CrawlInitiator />
      </div>
      <div className="col-span-3">
        <CrawlJobsTable jobs={jobs || []} />
      </div>
    </div>
  );
}
