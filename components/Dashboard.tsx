import { LayoutDashboard } from "lucide-react";
import CoreStats from "./CoreStats";
import DownloadCrawledPages from "./DownloadCrawledPages";
import QueueContainer from "./QueueMonitorContainer";

const Dashboard = ({ crawlJobId }: { crawlJobId: string }) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 
                      pb-6 border-b border-zinc-800/50"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <LayoutDashboard className="h-5 w-5 text-blue-400" />
            </div>
            <h1 className="text-xl font-medium text-zinc-100">Web Crawler Dashboard</h1>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <DownloadCrawledPages crawlJobId={crawlJobId} />
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="bg-gradient-to-b from-zinc-900/50 to-zinc-900/30 
                        backdrop-blur-sm rounded-lg border border-zinc-800/50 p-6"
          >
            <CoreStats crawlJobId={crawlJobId} />
          </div>

          <div
            className="bg-gradient-to-b from-zinc-900/50 to-zinc-900/30 
                        backdrop-blur-sm rounded-lg border border-zinc-800/50 p-6"
          >
            <QueueContainer crawlJobId={crawlJobId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
