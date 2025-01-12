"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type CrawlJob = {
  id: string;
  start_url: string;
  max_depth: number;
  status: "pending" | "running" | "paused" | "stopping" | "completed" | "failed" | "crawled";
  created_at: string;
  completed_at: string | null;
  updated_at: string;
  metadata: Record<string, any>;
};

const getStatusColor = (status: CrawlJob["status"]) => {
  switch (status) {
    case "running":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "paused":
      return "bg-yellow-500";
    case "stopping":
      return "bg-orange-500";
    case "crawled":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const CrawlJobsTable = ({ jobs }: { jobs: CrawlJob[] }) => {
  const router = useRouter();

  const handleRowClick = (jobId: string) => {
    router.push(`/dashboard/${jobId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Start URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Max Depth</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Completed At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow
              key={job.id}
              onClick={() => handleRowClick(job.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell className="font-medium">
                <span className="truncate block max-w-[200px]">{job.start_url}</span>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(job.status)} text-white`}>{job.status}</Badge>
              </TableCell>
              <TableCell>{job.max_depth}</TableCell>
              <TableCell>{format(new Date(job.created_at), "MMM d, yyyy HH:mm")}</TableCell>
              <TableCell>{format(new Date(job.updated_at), "MMM d, yyyy HH:mm")}</TableCell>
              <TableCell>
                {job.completed_at ? format(new Date(job.completed_at), "MMM d, yyyy HH:mm") : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CrawlJobsTable;
