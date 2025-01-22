import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Queue Status
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">{totalJobs} total jobs</div>
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="h-8 w-8"
                disabled={isLoading}
              >
                <Loader2 className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col h-96">
            <div className="space-y-4">
              <div className="space-y-2">
                <Progress value={progressValue} className="h-1" />
                <div className="grid grid-cols-4 gap-2 text-sm">
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

              <div className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} jobs
              </div>
            </div>

            {/* Scrollable jobs list */}
            <div className="mt-4 flex-1 overflow-y-auto min-h-0">
              <div className="space-y-2">
                {filteredJobs.length > 0 ? (
                  <div className="space-y-2">
                    {filteredJobs.map((job) => (
                      <JobItem key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No jobs found
                  </div>
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
