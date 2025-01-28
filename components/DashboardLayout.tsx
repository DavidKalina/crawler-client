import { ActiveCrawlsStats } from "@/components/ActiveCrawlStats";
import { CompletedJobsStats } from "@/components/CompletedJobStats";
import { FailedJobsStats } from "@/components/FailedJobStats";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;

  quotaUsage?: number;
  crawlJobId?: string;
}

const DashboardLayout = ({
  children,

  // quotaUsage = 0,
  crawlJobId,
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto space-y-6">
          {/* Header Section with stronger hierarchy */}
          <div className="border-b border-zinc-800 pb-4">
            <h1 className="text-3xl font-semibold text-zinc-100 mb-2">
              {crawlJobId ? "Crawl Job Details" : "Dashboard"}
            </h1>
            <p className="text-sm text-zinc-400">
              {crawlJobId
                ? "Monitor detailed statistics for this crawl job"
                : "Monitor your web crawling operations and manage resources"}
            </p>
          </div>

          {/* Stats Grid with divider */}
          <div className="pb-6 border-b border-zinc-800">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ActiveCrawlsStats />
              <CompletedJobsStats />
              <FailedJobsStats />
            </div>
          </div>

          {/* Main Content */}
          <div className="rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
