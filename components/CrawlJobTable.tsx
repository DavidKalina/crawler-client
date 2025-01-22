// components/CrawlJobsTable.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

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

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

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

const CrawlJobsTable = ({
  initialJobs,
  initialTotal,
}: {
  initialJobs: CrawlJob[];
  initialTotal: number;
}) => {
  const router = useRouter();
  const [jobs, setJobs] = useState<CrawlJob[]>(initialJobs);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: initialTotal,
    totalPages: Math.ceil(initialTotal / 10),
  });

  const supabase = createClient();

  const fetchJobs = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs?page=${page}&pageSize=${pagination.pageSize}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setJobs(data.data);
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel("web_crawl_jobs_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "web_crawl_jobs",
        },
        async (payload) => {
          // Refetch current page to ensure consistency
          await fetchJobs(pagination.page);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pagination.page]);

  const handlePageChange = (newPage: number) => {
    fetchJobs(newPage);
  };

  const handleRowClick = (jobId: string) => {
    router.push(`/dashboard/${jobId}`);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-xl border bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead className="w-[200px] bg-white">Start URL</TableHead>
              <TableHead className="bg-white">Status</TableHead>
              <TableHead className="bg-white">Max Depth</TableHead>
              <TableHead className="bg-white">Created At</TableHead>
              <TableHead className="bg-white">Last Updated</TableHead>
              <TableHead className="bg-white">Completed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job.id}
                onClick={() => handleRowClick(job.id)}
                className="cursor-pointer hover:bg-gray-50 bg-white"
              >
                <TableCell className="font-medium p-4">
                  <span className="truncate block max-w-[200px]">{job.start_url}</span>
                </TableCell>
                <TableCell className="p-4">
                  <Badge className={`${getStatusColor(job.status)} text-white`}>{job.status}</Badge>
                </TableCell>
                <TableCell className="p-4">{job.max_depth}</TableCell>
                <TableCell className="p-4">
                  {format(new Date(job.created_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="p-4">
                  {format(new Date(job.updated_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="p-4">
                  {job.completed_at ? format(new Date(job.completed_at), "MMM d, yyyy HH:mm") : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total} results
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrawlJobsTable;
