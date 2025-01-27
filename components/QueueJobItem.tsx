import { Clock, Layers, Link2, Star } from "lucide-react";
import { JobState } from "./QueueJobStatusBadge";

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
  <div
    className="group flex items-center justify-between py-2 px-3 bg-zinc-800/20 rounded-md border border-zinc-800/50 
                  hover:bg-zinc-800/30 hover:border-zinc-700/50 transition-all duration-200"
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="flex items-center gap-2 text-zinc-500">
        <Link2 className="h-3.5 w-3.5" />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-medium text-zinc-300 truncate max-w-[280px] group-hover:text-zinc-100">
          {job.data?.url || "Unknown URL"}
        </span>

        <div className="flex items-center gap-3 mt-0.5">
          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Layers className="h-3 w-3" />
            <span>
              {job.data?.currentDepth || 0}
              {job.data?.maxDepth && ` / ${job.data.maxDepth}`}
            </span>
          </div>

          {job.data?.createdAt && (
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{new Date(job.data.createdAt).toLocaleString()}</span>
            </div>
          )}

          {job.data?.priority && (
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Star className="h-3 w-3" />
              <span>{job.data.priority}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    <StatusBadge status={job.state} />
  </div>
);

// Matching StatusBadge component
export const StatusBadge: React.FC<{ status: JobState }> = ({ status }) => {
  const getStatusStyles = (status: JobState) => {
    switch (status) {
      case "waiting":
        return "bg-orange-500/5 border-orange-500/10 text-orange-400";
      case "active":
        return "bg-blue-500/5 border-blue-500/10 text-blue-400";
      case "completed":
        return "bg-emerald-500/5 border-emerald-500/10 text-emerald-400";
      case "failed":
        return "bg-red-500/5 border-red-500/10 text-red-400";
      default:
        return "bg-zinc-500/5 border-zinc-500/10 text-zinc-400";
    }
  };

  return (
    <div
      className={`px-2 py-1 rounded-full text-[11px] font-medium border ${getStatusStyles(status)}`}
    >
      {status}
    </div>
  );
};
