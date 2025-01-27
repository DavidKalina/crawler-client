import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Job, JobItem } from "./QueueJobItem";
import { JobState } from "./QueueJobStatusBadge";
import { QueueStatsButton } from "./QueueStatsButton";

export interface QueueStats {
  waitingCount: number;
  activeCount: number;
  completedCount: number;
  failedCount: number;
}

interface QueueMonitorProps {
  queueStats: QueueStats;
  jobs: Job[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const QueueMonitor: React.FC<QueueMonitorProps> = ({
  queueStats,
  jobs,
  isLoading = false,
  error = null,
  onRefresh,
}) => {
  const [selectedState, setSelectedState] = useState<JobState | "all">("all");

  const totalJobs = Object.values(queueStats ?? {}).reduce((sum, count) => sum + count, 0);
  const progressValue = totalJobs > 0 ? (queueStats.completedCount / totalJobs) * 100 : 0;
  const filteredJobs =
    selectedState === "all" ? jobs : jobs.filter((job) => job.state === selectedState);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-emerald-400";
    if (percentage >= 60) return "bg-blue-400";
    if (percentage >= 30) return "bg-orange-400";
    return "bg-zinc-400";
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="border-b border-zinc-800/50 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-blue-400" />
            <CardTitle className="text-sm font-medium text-zinc-100">
              Queue Status
              {isLoading && <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin text-zinc-400" />}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-500">{totalJobs.toLocaleString()} total jobs</div>
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-7 w-7 rounded-full bg-transparent border border-zinc-800/50 text-zinc-500 
                         hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/5 
                         transition-all duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                <Loader2 className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {error ? (
          <Alert className="bg-red-500/5 border-red-500/10 text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col h-96">
            <div className="space-y-3">
              <div className="space-y-3">
                <div className="relative h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full transition-all duration-500 ${getProgressColor(
                      progressValue
                    )}`}
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(queueStats ?? {}).map(([state, count]) => (
                    <QueueStatsButton
                      key={state}
                      label={state.replace("Count", "")}
                      count={count}
                      isSelected={selectedState === state.replace("Count", "")}
                      onClick={() => setSelectedState(state.replace("Count", "") as JobState)}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs text-zinc-500">Showing {filteredJobs.length} jobs</div>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              <div className="space-y-1.5 pr-2">
                {filteredJobs.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredJobs.map((job) => (
                      <JobItem key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-zinc-500 text-xs">No jobs found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueueMonitor;
