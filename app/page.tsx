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

  const { data: jobs, error } = await supabase
    .from("web_crawl_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout error={error}>
      <div className="col-span-1">
        <CrawlInitiator />
      </div>
      <div className="col-span-3">
        <CrawlJobsTable initialJobs={jobs || []} />
      </div>
      <div className="col-span-1">
        <QuotaDisplayWrapper />
      </div>
    </DashboardLayout>
  );
};

export default CrawlJobsPage;
