/* eslint-disable @typescript-eslint/no-explicit-any */
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
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error.message || "Error loading dashboard"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-8xl mx-auto space-y-6">
          <div className="grid grid-cols-5 gap-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Updated page component using the dashboard layout
const CrawlJobsPage = async () => {
  const supabase = await createClient();

  // Get initial data for first page
  const { count } = await supabase
    .from("web_crawl_jobs")
    .select("*", { count: "exact", head: true });

  const { data: initialJobs } = await supabase
    .from("web_crawl_jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 9); // First 10 items

  return (
    <DashboardLayout>
      <div className="col-span-1">
        <CrawlInitiator />
      </div>
      <div className="col-span-3">
        <CrawlJobsTable initialJobs={initialJobs || []} initialTotal={count || 0} />
      </div>
      <div className="col-span-1">
        <QuotaDisplayWrapper />
      </div>
    </DashboardLayout>
  );
};

export default CrawlJobsPage;
