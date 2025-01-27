import { WebCrawlJob } from "@/types/jobTypes";
import { format } from "date-fns";
import React from "react";
import { PaginationState } from "./CrawlJobTable";
import DeleteCrawlJobButton from "./DeleteCrawlJob";
import DownloadCrawledPages from "./DownloadCrawledPages";
import { StatusIndicator } from "./StatusIndicator";
import StopCrawlButton from "./StopCrawlButton";
import { TableCell, TableRow } from "./ui/table";

interface CrawlJobTableRowProps {
  job: WebCrawlJob;
  handleRowClick: (jobId: string) => void;
  fetchJobs: (page: number, status: string) => Promise<void>;
  pagination: PaginationState;
  selectedStatus: string;
}

const CrawlJobTableRow: React.FC<CrawlJobTableRowProps> = ({
  handleRowClick,
  job,
  fetchJobs,
  pagination,
  selectedStatus,
}) => {
  return (
    <TableRow
      key={job.id}
      onClick={() => handleRowClick(job.id)}
      className="cursor-pointer transition-colors border-b border-zinc-800 hover:bg-zinc-800/50 bg-zinc-900 group"
    >
      <TableCell className="p-4">
        <span className="text-zinc-100 font-medium truncate block max-w-[200px] group-hover:text-white">
          {job.start_url}
        </span>
      </TableCell>
      <TableCell className="p-4">
        <StatusIndicator status={job.status} />
      </TableCell>
      <TableCell className="p-4 text-zinc-100 group-hover:text-zinc-300">{job.max_depth}</TableCell>
      <TableCell className="p-4 text-zinc-100 group-hover:text-zinc-300">
        {format(new Date(job.created_at), "MMM d, yyyy HH:mm")}
      </TableCell>
      <TableCell className="p-4 text-zinc-100 group-hover:text-zinc-300">
        {format(new Date(job.updated_at), "MMM d, yyyy HH:mm")}
      </TableCell>
      <TableCell className="p-4 text-zinc-100 group-hover:text-zinc-300">
        {job.completed_at ? format(new Date(job.completed_at), "MMM d, yyyy HH:mm") : "-"}
      </TableCell>
      <TableCell className="p-4">
        <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
          <DownloadCrawledPages crawlJobId={job.id} />
          <StopCrawlButton
            crawlJobId={job.id}
            status={job.status}
            onStop={() => {
              fetchJobs(pagination.page, selectedStatus);
            }}
          />
          <DeleteCrawlJobButton
            crawlJobId={job.id}
            status={job.status}
            onDelete={() => {
              fetchJobs(pagination.page, selectedStatus);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CrawlJobTableRow;
