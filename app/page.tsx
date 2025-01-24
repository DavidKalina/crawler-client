import CrawlInitiator from "@/components/CrawlInitiator";
import CrawlJobsTable from "@/components/CrawlJobTable";
import QuotaDisplayWrapper from "@/components/QuotaDisplayWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/server";
import { Loader2 } from "lucide-react";

const DashboardLayout = ({ children, isLoading, error }: any) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-8xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error.message || "Error loading dashboard"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-8">
        <div className="max-w-8xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const CrawlJobsPage = async () => {
  const supabase = await createClient();

  const { count } = await supabase
    .from("web_crawl_jobs")
    .select("*", { count: "exact", head: true });

  const { data: initialJobs } = await supabase
    .from("web_crawl_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 9);

  return (
    <DashboardLayout>
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <CrawlInitiator />
      </div>
      <div className="col-span-1 md:col-span-2">
        <CrawlJobsTable initialJobs={initialJobs || []} initialTotal={count || 0} />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <QuotaDisplayWrapper />
      </div>
    </DashboardLayout>
  );
};

export default CrawlJobsPage;
