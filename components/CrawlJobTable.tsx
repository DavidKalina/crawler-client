/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DownloadCrawledPages from "./DownloadCrawledPages";
import StopCrawlButton from "./StopCrawlButton";

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

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "running", label: "Running" },
  { value: "paused", label: "Paused" },
  { value: "stopping", label: "Stopping" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "crawled", label: "Crawled" },
];

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

const downloadPages = async (jobId: string) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("crawled_pages")
      .select("*")
      .eq("crawl_job_id", jobId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    // Convert data to CSV
    const headers = [
      "id",
      "url",
      "title",
      "content_text",
      "depth",
      "created_at",
      "processing_status",
    ];
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]?.toString() || "";
            // Escape quotes and wrap in quotes if contains comma or newline
            return value.includes(",") || value.includes("\n") || value.includes('"')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `crawled-pages-${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error processing download:", error);
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
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: initialTotal,
    totalPages: Math.ceil(initialTotal / 10),
  });

  const supabase = createClient();

  const fetchJobs = async (page: number, status: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/jobs?page=${page}&pageSize=${pagination.pageSize}&status=${status}`
      );
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
        async () => {
          // Refetch current page to ensure consistency
          await fetchJobs(pagination.page, selectedStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pagination.page, selectedStatus]);

  const handlePageChange = (newPage: number) => {
    fetchJobs(newPage, selectedStatus);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    fetchJobs(1, newStatus); // Reset to first page when filter changes
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

      <div className="flex justify-between items-center mb-4">
        <div className="w-[200px]">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
              <TableHead className="bg-white">Actions</TableHead>
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
                <TableCell className="p-4">
                  <div className="flex items-center gap-2">
                    <DownloadCrawledPages crawlJobId={job.id} />
                    <StopCrawlButton
                      crawlJobId={job.id}
                      status={job.status}
                      onStop={() => {
                        // Optionally handle any local state updates
                        fetchJobs(pagination.page, selectedStatus);
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Showing {jobs.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} to{" "}
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
