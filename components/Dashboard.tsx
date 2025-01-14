import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import CoreStats from "./CoreStats";
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

        {/* Right Column - 3/4 width */}
        <div className="lg:col-span-3 space-y-6">
          <CoreStats crawlJobId={crawlJobId} />

          {/* Queue Monitor positioned below the results */}
          <QueueContainer crawlJobId={crawlJobId} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
