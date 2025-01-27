import { ActiveCrawlsStats } from "@/components/ActiveCrawlStats";
import { CompletedJobsStats } from "@/components/CompletedJobStats";
import { FailedJobsStats } from "@/components/FailedJobStats";
import { StatsCard } from "@/components/StatsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error;
  quotaUsage?: number;
  crawlJobId?: string;
}

const DashboardLayout = ({
  children,
  isLoading,
  error,
  quotaUsage = 0,
  crawlJobId,
}: DashboardLayoutProps) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
          <p className="text-sm text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="max-w-8xl mx-auto">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error.message || "Error loading dashboard"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-2xl font-medium text-zinc-100">
              {crawlJobId ? "Crawl Job Details" : "Dashboard"}
            </h1>
            <p className="text-sm text-zinc-400">
              {crawlJobId
                ? "Monitor detailed statistics for this crawl job"
                : "Monitor your web crawling operations and manage resources"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ActiveCrawlsStats />
            <CompletedJobsStats />
            <FailedJobsStats />
            <StatsCard
              title="Quota Usage"
              value={`${quotaUsage}%`}
              icon={Activity}
              description="Of monthly allocation used"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
