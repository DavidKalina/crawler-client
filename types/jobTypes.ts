// types/job.ts
export interface WebCrawlJob {
  id: string;
  start_url: string;
  max_depth: number;
  status:
    | "pending"
    | "running"
    | "paused"
    | "stopping"
    | "completed"
    | "failed"
    | "crawled"
    | "stopped";
  created_at: string;
  completed_at?: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  user_id: string;
}

export interface CrawlJobsData {
  jobs: WebCrawlJob[];
  total: number;
  error?: Error;
}
