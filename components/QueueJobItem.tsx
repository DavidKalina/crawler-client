import { JobState, StatusBadge } from "./QueueJobStatusBadge";

export interface Job {
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

interface JobItemProps {
  job: Job;
}

export const JobItem: React.FC<JobItemProps> = ({ job }) => (
  <div className="flex items-center justify-between py-3 px-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors">
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
    <StatusBadge status={job.state} />
  </div>
);
