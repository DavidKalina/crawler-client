import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type JobState = "waiting" | "active" | "completed" | "failed";

interface Job {
  id: string;
  state: JobState;
  data: {
    url: string;
    currentDepth: number;
    maxDepth: number;
    createdAt?: string;
    updatedAt?: string;
    priority?: number;
  };
}

interface QueueStats {
  waitingCount: number;
  activeCount: number;
  completedCount: number;
  failedCount: number;
}

interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

interface QueueMonitorProps {
  queueStats: QueueStats;
  jobs: Job[];
  pagination: PaginationInfo;
  isLoading?: boolean;
  error?: string | null;
  pageSize?: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onRefresh?: () => void;
}

const QueueMonitor: React.FC<QueueMonitorProps> = ({
  queueStats,
  jobs,
  pagination,
  isLoading = false,
  error = null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pageSize = 10,
  onNextPage,
  onPreviousPage,
  onRefresh,
}) => {
  const [selectedState, setSelectedState] = useState<JobState | "all">("all");
  const totalJobs =
    queueStats.waitingCount +
    queueStats.activeCount +
    queueStats.completedCount +
    queueStats.failedCount;

  const progressValue = totalJobs > 0 ? (queueStats.completedCount / totalJobs) * 100 : 0;

  const getStatusBadge = (status: JobState) => {
    const variants = {
      waiting: "bg-background text-foreground border-border",
      active: "bg-primary/10 text-primary border-primary/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
      <Badge variant="outline" className={`${variants[status]} rounded-full px-3`}>
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const filteredJobs =
    selectedState === "all" ? jobs : jobs.filter((job) => job.state === selectedState);

  const renderJobItem = (job: Job) => (
    <div
      key={job.id}
      className="flex items-center justify-between py-3 px-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-medium truncate max-w-[280px]">
            {job.data?.url || "Unknown URL"}
          </span>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>
              Depth {job.data?.currentDepth || 0}
              {job.data?.maxDepth && ` of ${job.data.maxDepth}`}
            </span>
            {job.data?.createdAt && (
              <span>Created: {new Date(job.data.createdAt).toLocaleString()}</span>
            )}
            {job.data?.priority && <span>Priority: {job.data.priority}</span>}
          </div>
        </div>
      </div>
      {getStatusBadge(job.state)}
    </div>
  );

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
          <>
            {/* Progress Overview */}
            <div className="space-y-2">
              <Progress value={progressValue} className="h-1" />
              <div className="grid grid-cols-4 gap-2 text-sm">
                <button
                  onClick={() => setSelectedState("waiting")}
                  className={`text-left p-2 rounded-lg transition-colors ${
                    selectedState === "waiting" ? "bg-muted" : ""
                  }`}
                >
                  <div className="text-xs text-muted-foreground">Waiting</div>
                  <div>{queueStats.waitingCount}</div>
                </button>
                <button
                  onClick={() => setSelectedState("active")}
                  className={`text-left p-2 rounded-lg transition-colors ${
                    selectedState === "active" ? "bg-muted" : ""
                  }`}
                >
                  <div className="text-xs text-muted-foreground">Active</div>
                  <div>{queueStats.activeCount}</div>
                </button>
                <button
                  onClick={() => setSelectedState("completed")}
                  className={`text-left p-2 rounded-lg transition-colors ${
                    selectedState === "completed" ? "bg-muted" : ""
                  }`}
                >
                  <div className="text-xs text-muted-foreground">Completed</div>
                  <div>{queueStats.completedCount}</div>
                </button>
                <button
                  onClick={() => setSelectedState("failed")}
                  className={`text-left p-2 rounded-lg transition-colors ${
                    selectedState === "failed" ? "bg-muted" : ""
                  }`}
                >
                  <div className="text-xs text-muted-foreground">Failed</div>
                  <div>{queueStats.failedCount}</div>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedState("all")}
                  className={selectedState === "all" ? "bg-muted" : ""}
                >
                  All Jobs
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {totalJobs} jobs
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-2">
              {filteredJobs.length > 0 ? (
                <div className="space-y-2">{filteredJobs.map(renderJobItem)}</div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">No jobs found</div>
              )}
            </div>

            {/* Pagination Controls */}
            {(pagination.hasPreviousPage || pagination.hasNextPage) && (
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousPage}
                  disabled={!pagination.hasPreviousPage || isLoading}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={!pagination.hasNextPage || isLoading}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QueueMonitor;
