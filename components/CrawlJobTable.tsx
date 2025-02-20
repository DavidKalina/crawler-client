"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { WebCrawlJob } from "@/types/jobTypes";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CrawlJobTableRow from "./CrawlJobTableRow";

// TODO ADD SUBSCRIPTION TO LISTEN TO NEW CRAWL JOBS (ONLY ON PAGE 1!)

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const CrawlJobsTable = ({
  initialJobs,
  initialTotal,
}: {
  initialJobs: WebCrawlJob[];
  initialTotal: number;
}) => {
  const router = useRouter();
  const [jobs, setJobs] = useState<WebCrawlJob[]>(initialJobs);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: initialTotal,
    totalPages: Math.ceil(initialTotal / 10),
  });

  const { toast } = useToast();

  const supabase = createClient();

  const fetchJobs = useCallback(
    async (page: number, status: string) => {
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
    },
    [pagination.pageSize]
  );

  // Add useEffect for new job insertions
  useEffect(() => {
    const channel = supabase
      .channel("new_jobs")
      .on<WebCrawlJob>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "web_crawl_jobs",
        },
        async () => {
          // If we're on page 1, fetch the latest jobs
          if (pagination.page === 1) {
            await fetchJobs(1, "all");
          } else {
            // If we're not on page 1, show a toast notification
            toast({
              title: "New Job Created",
              description: "Switch to the first page to see new jobs",
              variant: "success",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJobs, pagination.page, supabase, toast]);

  // Use a ref to track if we're currently paginating
  const isPaginating = useRef(false);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      isPaginating.current = true;
      await fetchJobs(newPage, "all");
      isPaginating.current = false;
    },
    [fetchJobs]
  );

  const handleRowClick = useCallback(
    (jobId: string) => {
      router.push(`/crawl-jobs/${jobId}`);
    },
    [router]
  );

  const handleJobDeleted = useCallback(
    async (jobId: string) => {
      setJobs((prev) => {
        const newJobs = prev.filter((job) => job.id !== jobId);

        // If we've removed the last item on the current page and we're not on the first page,
        // fetch the previous page
        if (newJobs.length === 0 && pagination.page > 1) {
          handlePageChange(pagination.page - 1);
          return prev; // Return prev since we're going to get new data anyway
        }

        // If we have fewer than pageSize items after deletion and we're not on the last page,
        // fetch the current page again to get more items
        if (newJobs.length < pagination.pageSize && pagination.page < pagination.totalPages) {
          fetchJobs(pagination.page, "all");
          return prev; // Return prev since we're going to get new data anyway
        }

        return newJobs;
      });

      // Update total count and total pages
      setPagination((prev) => {
        const newTotal = prev.total - 1;
        return {
          ...prev,
          total: newTotal,
          totalPages: Math.ceil(newTotal / prev.pageSize),
        };
      });
    },
    [handlePageChange, pagination.page, pagination.pageSize, pagination.totalPages, fetchJobs]
  );

  return (
    <div className="space-y-12">
      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 bg-zinc-900/90 hover:bg-zinc-900/90">
              <TableHead className="p-4 2xl:p-6 text-zinc-100 font-medium w-[200px] bg-zinc-900/90">
                Start URL
              </TableHead>
              <TableHead className="p-4 2xl:p-6 text-zinc-100 font-medium bg-zinc-900/90">
                Status
              </TableHead>
              <TableHead className="p-4 2xl:p-6 text-zinc-100 font-medium bg-zinc-900/90">
                Max Depth
              </TableHead>
              <TableHead className="p-4 2xl:p-6 text-zinc-100 font-medium bg-zinc-900/90">
                Created At
              </TableHead>
              <TableHead className="p-4 2xl:p-6 text-zinc-100 font-medium bg-zinc-900/90">
                Last Updated
              </TableHead>
              <TableHead className="p-4 2xl:p-6 text-zinc-100 font-medium bg-zinc-900/90">
                Completed At
              </TableHead>
              <TableHead className="p-4 2xl:p-6 text-zinc-100 font-medium bg-zinc-900/90">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <CrawlJobTableRow
                key={job.id}
                initialJob={job}
                handleRowClick={handleRowClick}
                onJobDeleted={handleJobDeleted}
                pagination={pagination}
              />
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-zinc-100 border-zinc-800">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-t border-zinc-800">
          <div className="text-zinc-100 text-sm 2xl:text-md">
            Showing {jobs.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total} results
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="bg-transparent text-sm 2xl:text-md border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
              className="bg-transparent text-sm 2xl:text-md border-green-800 text-green-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent"
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
