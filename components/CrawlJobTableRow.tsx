"use client";

import { WebCrawlJob } from "@/types/jobTypes";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { PaginationState } from "./CrawlJobTable";
import DeleteCrawlJobButton from "./DeleteCrawlJob";
import DownloadCrawledPages from "./DownloadCrawledPages";
import { StatusIndicator } from "./StatusIndicator";
import { TableCell, TableRow } from "./ui/table";
import { createClient } from "@/utils/supabase/client";
import StopCrawlButton from "./StopCrawlButton";

interface CrawlJobTableRowProps {
  initialJob: WebCrawlJob;
  handleRowClick: (jobId: string) => void;
  onJobDeleted: (jobId: string) => void;
  pagination: PaginationState;
}

const CrawlJobTableRow: React.FC<CrawlJobTableRowProps> = ({
  handleRowClick,
  initialJob,
  onJobDeleted,
}) => {
  const [job, setJob] = useState<WebCrawlJob>(initialJob);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`job-${job.id}`)
      .on<{
        id: string;
        start_url: string;
        max_depth: number;
        status: string;
        created_at: string;
        updated_at: string;
        completed_at: string | null;
        user_id: string;
      }>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
          filter: `id=eq.${job.id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            onJobDeleted(job.id);
          } else if (payload.eventType === "UPDATE") {
            const updatedJob: WebCrawlJob = {
              id: payload.new.id,
              start_url: payload.new.start_url,
              max_depth: payload.new.max_depth,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              status: payload.new.status as any,
              created_at: payload.new.created_at,
              updated_at: payload.new.updated_at,
              completed_at: payload.new.completed_at ?? undefined,
              user_id: payload.new.user_id,
              metadata: {},
            };
            setJob(updatedJob);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [job.id, onJobDeleted, supabase]);

  return (
    <TableRow
      key={job.id}
      onClick={() => handleRowClick(job.id)}
      className="cursor-pointer transition-colors border-b border-zinc-800 hover:bg-zinc-800/50 bg-zinc-900 group"
    >
      <TableCell className="p-4">
        <span className="text-zinc-100 text-sm font-medium truncate block max-w-[200px] group-hover:text-white">
          {job.start_url}
        </span>
      </TableCell>
      <TableCell className="p-4">
        <StatusIndicator status={job.status} />
      </TableCell>
      <TableCell className="p-4 text-zinc-100 text-sm group-hover:text-zinc-300">
        {job.max_depth}
      </TableCell>
      <TableCell className="p-4 text-zinc-100 text-sm group-hover:text-zinc-300">
        {format(new Date(job.created_at), "MMM d, yyyy HH:mm")}
      </TableCell>
      <TableCell className="p-4 text-zinc-100 text-sm group-hover:text-zinc-300">
        {format(new Date(job.updated_at), "MMM d, yyyy HH:mm")}
      </TableCell>
      <TableCell className="p-4 text-zinc-100 text-sm group-hover:text-zinc-300">
        {job.completed_at ? format(new Date(job.completed_at), "MMM d, yyyy HH:mm") : "-"}
      </TableCell>
      <TableCell className="p-4">
        <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
          <DownloadCrawledPages crawlJobId={job.id} />
          <StopCrawlButton crawlJobId={job.id} status={job.status} />
          <DeleteCrawlJobButton crawlJobId={job.id} status={job.status} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(CrawlJobTableRow);
