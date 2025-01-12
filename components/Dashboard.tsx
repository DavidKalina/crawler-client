import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ActiveCrawlCard from "./ActiveCrawlCard";
import CoreStats from "./CoreStats";
import CrawlInitiator from "./CrawlInitiator";
import QueueContainer from "./QueueMonitorContainer";

const Dashboard = ({ crawlJobId }: { crawlJobId: string }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Web Crawler Dashboard</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
              Clear Queue
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <CrawlInitiator />
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Active Crawls</h2>
                <ActiveCrawlCard />
              </div>
            </div>
          </div>

          {/* Right Column - 3/4 width */}
          <div className="lg:col-span-3 space-y-6">
            <CoreStats crawlJobId={crawlJobId} />

            {/* Queue Monitor positioned below the results */}
            <QueueContainer crawlJobId={crawlJobId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
